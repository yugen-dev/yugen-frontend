import { MaxUint256 } from "@ethersproject/constants";
import { TransactionResponse } from "@ethersproject/providers";
import {
  Trade,
  TokenAmount,
  CurrencyAmount,
  ETHER,
} from "@cryption-network/polydex-sdk";
import { splitSignature } from "@ethersproject/bytes";
import { useProfile } from "state/hooks";
import { useCallback, useMemo } from "react";
import { ROUTER_ADDRESS, META_TXN_SUPPORTED_TOKENS } from "../constants";
import { useTokenAllowance } from "../data/Allowances";
import { Field } from "../state/swap/actions";
import {
  useTransactionAdder,
  useHasPendingApproval,
} from "../state/transactions/hooks";
import { getBiconomyWeb3 } from "../utils/biconomyweb3";
import { computeSlippageAdjustedAmounts } from "../utils/prices";
import { calculateGasMargin } from "../utils";
import { useTokenContract } from "./useContract";
import { useActiveWeb3React } from "./index";

const getWeb3 = getBiconomyWeb3();
export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { chainId, library, account } = useActiveWeb3React();
  const { metaTranscation } = useProfile();
  const token =
    amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined;
  const currentAllowance = useTokenAllowance(
    token,
    account ?? undefined,
    spender
  );
  const pendingApproval = useHasPendingApproval(token?.address, spender);

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN;
    if (amountToApprove.currency === ETHER) return ApprovalState.APPROVED;
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN;

    // amountToApprove will be defined if currentAllowance is
    // eslint-disable-next-line no-nested-ternary
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [amountToApprove, currentAllowance, pendingApproval, spender]);

  const tokenContract = useTokenContract(token?.address);
  const addTransaction = useTransactionAdder();

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error("approve was called unnecessarily");
      return;
    }
    if (!token) {
      console.error("no token");
      return;
    }

    if (!tokenContract) {
      console.error("tokenContract is null");
      return;
    }

    if (!amountToApprove) {
      console.error("missing amount to approve");
      return;
    }

    if (!spender) {
      console.error("no spender");
      return;
    }
    const estimatedGas = await tokenContract.estimateGas
      .approve(spender, MaxUint256)
      .catch(() => {
        // general fallback for tokens who restrict approval amounts
        useExact = true;
        return tokenContract.estimateGas.approve(
          spender,
          amountToApprove.raw.toString()
        );
      });

    if (
      META_TXN_SUPPORTED_TOKENS[token.address.toLowerCase()] &&
      metaTranscation
    ) {
      const metaToken = META_TXN_SUPPORTED_TOKENS[token.address.toLowerCase()];

      const biconomyContract = new getWeb3.eth.Contract(
        metaToken.abi,
        token.address
      );
      const nonceMethod =
        biconomyContract.methods.getNonce || biconomyContract.methods.nonces;
      const biconomyNonce = await nonceMethod(account).call();
      const res = biconomyContract.methods
        .approve(spender, MaxUint256.toString())
        .encodeABI();
      const message: any = {
        nonce: "",
        from: "",
        functionSignature: "",
      };

      const name = await biconomyContract.methods.name().call();

      message.nonce = parseInt(biconomyNonce);
      message.from = account;
      message.functionSignature = res;

      const dataToSign = JSON.stringify({
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "verifyingContract", type: "address" },
            { name: "salt", type: "bytes32" },
          ],
          MetaTransaction: [
            { name: "nonce", type: "uint256" },
            { name: "from", type: "address" },
            { name: "functionSignature", type: "bytes" },
          ],
        },
        domain: {
          name,
          version: "1",
          verifyingContract: token.address,
          // @ts-ignore
          salt: `0x${chainId.toString(16).padStart(64, "0")}`,
        },
        primaryType: "MetaTransaction",
        message,
      });

      // @ts-ignore

      const sig = await library.send("eth_signTypedData_v4", [
        account,
        dataToSign,
      ]);

      const signature = await splitSignature(sig);

      const { v, r, s } = signature;
      try {
        const response: TransactionResponse = await biconomyContract.methods
          .executeMetaTransaction(account, res, r, s, v)
          .send({
            from: account,
          });
        const cloneObj: any = response;

        response.hash = cloneObj.transactionHash;
        addTransaction(response, {
          summary: `Approve ${amountToApprove.currency.symbol}`,
          approval: { tokenAddress: token.address, spender },
        });
        // eslint-disable-next-line consistent-return
        return cloneObj.transactionHash;
      } catch (e) {
        console.error(e);
      }
    }

    let useExact = false;

    // eslint-disable-next-line consistent-return
    tokenContract
      .approve(
        spender,
        useExact ? amountToApprove.raw.toString() : MaxUint256,
        {
          gasLimit: calculateGasMargin(estimatedGas),
          gasPrice: 10000000000,
        }
      )
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: `Approve ${amountToApprove.currency.symbol}`,
          approval: { tokenAddress: token.address, spender },
        });
      })
      .catch((error: Error) => {
        console.error("Failed to approve token", error);
        throw error;
      });
  }, [
    approvalState,
    token,
    tokenContract,
    amountToApprove,
    spender,
    addTransaction,
    chainId,
    library,
    account,
    metaTranscation,
  ]);

  return [approvalState, approve];
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(
  trade?: Trade,
  allowedSlippage = 0
) {
  const amountToApprove = useMemo(
    () =>
      trade
        ? computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT]
        : undefined,
    [trade, allowedSlippage]
  );
  return useApproveCallback(amountToApprove, ROUTER_ADDRESS);
}
