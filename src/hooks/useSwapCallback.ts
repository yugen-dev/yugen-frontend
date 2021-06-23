/* eslint-disable camelcase */
import { BigNumber } from "@ethersproject/bignumber";
import { Contract } from "@ethersproject/contracts";
import {
  JSBI,
  Percent,
  Router,
  SwapParameters,
  Trade,
  TradeType,
} from "@pancakeswap-libs/sdk";
import { useProfile } from "state/hooks";
import { Biconomy } from "@biconomy/mexa";
import Web3 from "web3";
import { useMemo } from "react";
import { AbiItem } from "web3-utils";
import { splitSignature } from "@ethersproject/bytes";
import { abi } from "../constants/abis/gaslessrouter.json";
import {
  BIPS_BASE,
  DEFAULT_DEADLINE_FROM_NOW,
  INITIAL_ALLOWED_SLIPPAGE,
  ROUTER_ADDRESS,
  biconomyAPIKey,
  META_TXN_DISABLED,
} from "../constants";
import { useTransactionAdder } from "../state/transactions/hooks";
import {
  calculateGasMargin,
  getRouterContract,
  isAddress,
  shortenAddress,
} from "../utils";
import isZero from "../utils/isZero";
import { useActiveWeb3React } from "./index";
import useENS from "./useENS";

// swap, add Liquidity

const contractAddress = ROUTER_ADDRESS;
const maticProvider = process.env.REACT_APP_NETWORK_URL;

// @ts-ignore
const biconomy = new Biconomy(new Web3.providers.HttpProvider(maticProvider), {
  apiKey: biconomyAPIKey,
  debug: true,
});

const getWeb3 = new Web3(biconomy);

enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  contract: Contract;
  parameters: SwapParameters;
}

interface SuccessfulCall {
  call: SwapCall;
  gasEstimate: BigNumber;
}

interface FailedCall {
  call: SwapCall;
  error: Error;
}

type EstimatedSwapCall = SuccessfulCall | FailedCall;

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param deadline the deadline for the trade
 * @param recipientAddressOrName
 */
function useSwapCallArguments(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  deadline: number = DEFAULT_DEADLINE_FROM_NOW, // in seconds from now
  recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
  const { account, chainId, library } = useActiveWeb3React();

  const { address: recipientAddress } = useENS(recipientAddressOrName);
  const recipient =
    recipientAddressOrName === null ? account : recipientAddress;

  return useMemo(() => {
    if (!trade || !recipient || !library || !account || !chainId) return [];

    const contract: Contract | null = getRouterContract(
      chainId,
      library,
      account
    );
    if (!contract) {
      return [];
    }

    const swapMethods = [];

    swapMethods.push(
      // @ts-ignore
      Router.swapCallParameters(trade, {
        feeOnTransfer: false,
        allowedSlippage: new Percent(
          JSBI.BigInt(Math.floor(allowedSlippage)),
          BIPS_BASE
        ),
        recipient,
        ttl: deadline,
      })
    );

    if (trade.tradeType === TradeType.EXACT_INPUT && META_TXN_DISABLED) {
      swapMethods.push(
        // @ts-ignore
        Router.swapCallParameters(trade, {
          feeOnTransfer: true,
          allowedSlippage: new Percent(
            JSBI.BigInt(Math.floor(allowedSlippage)),
            BIPS_BASE
          ),
          recipient,
          ttl: deadline,
        })
      );
    }

    return swapMethods.map((parameters) => ({ parameters, contract }));
  }, [account, allowedSlippage, chainId, deadline, library, recipient, trade]);
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  deadline: number = DEFAULT_DEADLINE_FROM_NOW, // in seconds from now
  recipientAddressOrName: string | null // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
): {
  state: SwapCallbackState;
  callback: null | (() => Promise<string>);
  error: string | null;
} {
  const { account, chainId, library } = useActiveWeb3React();
  const { metaTranscation } = useProfile();
  const swapCalls = useSwapCallArguments(
    trade,
    allowedSlippage,
    deadline,
    recipientAddressOrName
  );

  const addTransaction = useTransactionAdder();
  // @ts-ignore
  // const { metaTranscation } = useProfile();
  const { address: recipientAddress } = useENS(recipientAddressOrName);
  const recipient =
    recipientAddressOrName === null ? account : recipientAddress;

  return useMemo(() => {
    if (!trade || !library || !account || !chainId) {
      return {
        state: SwapCallbackState.INVALID,
        callback: null,
        error: "Missing dependencies",
      };
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return {
          state: SwapCallbackState.INVALID,
          callback: null,
          error: "Invalid recipient",
        };
      }
      return { state: SwapCallbackState.LOADING, callback: null, error: null };
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        const estimatedCalls: EstimatedSwapCall[] = await Promise.all(
          swapCalls.map((call) => {
            const {
              parameters: { methodName, args, value },
              contract,
            } = call;
            const options = !value || isZero(value) ? {} : { value };

            return contract.estimateGas[methodName](...args, options)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate,
                };
              })
              .catch((gasError) => {
                return contract.callStatic[methodName](...args, options)
                  .then((result) => {
                    return {
                      call,
                      error: new Error(
                        "Unexpected issue with estimating the gas. Please try again."
                      ),
                    };
                  })
                  .catch((callError) => {
                    console.error("Call threw error", call, callError);
                    let errorMessage: string;
                    switch (callError.reason) {
                      case "UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT":
                      case "UniswapV2Router: EXCESSIVE_INPUT_AMOUNT":
                        errorMessage =
                          "This transaction will not succeed either due to price movement or fee on transfer. Try increasing your slippage tolerance.";
                        break;
                      default:
                        errorMessage = `The transaction cannot succeed due to error: ${callError.reason}. This is probably an issue with one of the tokens you are swapping.`;
                    }
                    return { call, error: new Error(errorMessage) };
                  });
              });
          })
        );

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        const successfulEstimation = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            "gasEstimate" in el &&
            (ix === list.length - 1 || "gasEstimate" in list[ix + 1])
        );

        if (!successfulEstimation) {
          const errorCalls = estimatedCalls.filter(
            (call): call is FailedCall => "error" in call
          );
          if (errorCalls.length > 0)
            throw errorCalls[errorCalls.length - 1].error;
          throw new Error(
            "Unexpected error. Please contact support: none of the calls threw an error"
          );
        }

        const {
          call: {
            contract,
            parameters: { methodName, args, value },
          },
          gasEstimate,
        } = successfulEstimation;

        if (
          methodName === "swapExactETHForTokens" ||
          methodName === "swapETHForExactTokens" ||
          !metaTranscation
        ) {
          return contract[methodName](...args, {
            gasLimit: calculateGasMargin(gasEstimate),
            ...(value && !isZero(value)
              ? { value, from: account }
              : { from: account }),
          })
            .then((response: any) => {
              const inputSymbol = trade.inputAmount.currency.symbol;
              const outputSymbol = trade.outputAmount.currency.symbol;
              const inputAmount = trade.inputAmount.toSignificant(3);
              const outputAmount = trade.outputAmount.toSignificant(3);

              const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`;
              const withRecipient =
                recipient === account
                  ? base
                  : `${base} to ${
                      recipientAddressOrName &&
                      isAddress(recipientAddressOrName)
                        ? shortenAddress(recipientAddressOrName)
                        : recipientAddressOrName
                    }`;

              addTransaction(response, {
                summary: withRecipient,
              });

              return response.hash;
            })
            .catch((error: any) => {
              // if the user rejected the tx, pass this along
              if (error?.code === 4001) {
                throw new Error("Transaction rejected.");
              } else {
                // otherwise, the error was unexpected and we need to convey that
                console.error(`Swap failed`, error, methodName, args, value);
                throw new Error(`Swap failed: ${error.message}`);
              }
            });
          // ts-ignore
        }

        const bicomony_contract = new getWeb3.eth.Contract(
          abi as unknown as AbiItem,
          contractAddress
        );

        const biconomy_nonce = await bicomony_contract.methods
          .getNonce(account)
          .call();

        const gasLimit = calculateGasMargin(gasEstimate);

        const res = bicomony_contract.methods[methodName](...args).encodeABI();

        const message: any = {
          nonce: "",
          from: "",
          functionSignature: "",
        };
        message.nonce = parseInt(biconomy_nonce);
        message.from = account;
        message.functionSignature = res;

        const dataToSign = JSON.stringify({
          types: {
            EIP712Domain: [
              { name: "name", type: "string" },
              { name: "version", type: "string" },
              { name: "verifyingContract", type: "address" },
              { name: "chainId", type: "uint256" },
            ],
            MetaTransaction: [
              { name: "nonce", type: "uint256" },
              { name: "from", type: "address" },
              { name: "functionSignature", type: "bytes" },
            ],
          },
          domain: {
            name: "UniswapV2Router02",
            version: "1",
            verifyingContract: contractAddress,
            chainId,
          },
          primaryType: "MetaTransaction",
          message,
        });
        const sig = await library.send("eth_signTypedData_v4", [
          account,
          dataToSign,
        ]);
        const signature = await splitSignature(sig);
        const { v, r, s } = signature;

        return bicomony_contract.methods
          .executeMetaTransaction(account, res, r, s, v)
          .send({
            from: account,
          })
          .then((response: any) => {
            const inputSymbol = trade.inputAmount.currency.symbol;
            const outputSymbol = trade.outputAmount.currency.symbol;
            const inputAmount = trade.inputAmount.toSignificant(3);
            const outputAmount = trade.outputAmount.toSignificant(3);

            const base = `Swap ${inputAmount} ${inputSymbol} for ${outputAmount} ${outputSymbol}`;
            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${
                    recipientAddressOrName && isAddress(recipientAddressOrName)
                      ? shortenAddress(recipientAddressOrName)
                      : recipientAddressOrName
                  }`;

            const withVersion = withRecipient;

            if (!response.hash) response.hash = response.transactionHash;
            addTransaction(response, {
              summary: withVersion,
            });

            return response.hash;
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error("Transaction rejected.");
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args, value);
              throw new Error(`Swap failed: ${error.message}`);
            }
          });
      },
      error: null,
    };
  }, [
    trade,
    library,
    account,
    chainId,
    recipient,
    recipientAddressOrName,
    swapCalls,
    addTransaction,
    metaTranscation,
  ]);
}

export default useSwapCallback;
