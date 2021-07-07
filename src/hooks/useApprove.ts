import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "web3-eth-contract";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { fetchFarmUserDataAsync, updateUserAllowance } from "state/actions";
import { approve } from "utils/callHelpers";
import { useProfile } from "state/hooks";
import { splitSignature } from "@ethersproject/bytes";
import { getAddress, getFarmAddress } from "utils/addressHelpers";
import { getBiconomyWeb3 } from "utils/biconomyweb3";
import {
  useMasterchef,
  useCake,
  useCNTStaker,
  useLottery,
  useSousChef,
} from "./useContract";
import { useUserDeadline } from "../state/user/hooks";
import { META_TXN_SUPPORTED_TOKENS } from "../constants/index";

// Approve a Farm
export const useApprove = (lpContract: Contract) => {
  const dispatch = useDispatch();
  const { account, chainId, library } = useWeb3React("web3");
  const masterChefContract = useMasterchef();
  const { metaTranscation } = useProfile();
  const [deadline] = useUserDeadline();

  const handleApprove = useCallback(async () => {
    if (metaTranscation) {
      try {
        // @ts-ignore
        const noncee = await lpContract.methods.nonces(account).call();
        const nonce = await ethers.utils.parseUnits(noncee.toString(), "0");

        const deadlineForSignature: number =
          Math.ceil(Date.now() / 1000) + deadline;

        const EIP712Domain = [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" },
        ];
        const domain = {
          name: "Polydex LP Token",
          version: "1",
          chainId,
          // @ts-ignore
          verifyingContract: lpContract.options.address.toString(),
        };

        const Permit = [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ];

        const message = {
          owner: account,
          spender: getFarmAddress(),
          value: ethers.constants.MaxUint256.toString(),
          nonce: nonce._hex,
          deadline: deadlineForSignature,
        };
        const data = JSON.stringify({
          types: {
            EIP712Domain,
            Permit,
          },
          domain,
          primaryType: "Permit",
          message,
        });

        const sig = await library.send("eth_signTypedData_v4", [account, data]);

        const signature = await splitSignature(sig.result);
        const { r, s, v } = signature;
        return { v, r, s, deadlineForSignature };
      } catch (e) {
        console.error(e);
        return false;
      }
    } else {
      try {
        const tx = await approve(lpContract, masterChefContract, account);
        dispatch(fetchFarmUserDataAsync(account));
        return tx;
      } catch (e) {
        return false;
      }
    }
  }, [
    account,
    dispatch,
    lpContract,
    masterChefContract,
    metaTranscation,
    deadline,
    chainId,
    library,
  ]);

  return { onApprove: handleApprove };
};

// /* // Approve a Pool
export const useSousApprove = (lpContract: Contract, sousId) => {
  const dispatch = useDispatch();
  const { account, chainId, library } = useWeb3React("web3");
  const sousChefContract = useSousChef(sousId);
  const { metaTranscation } = useProfile();

  const handleApprove = useCallback(async () => {
    try {
      if (
        META_TXN_SUPPORTED_TOKENS[lpContract.options.address.toLowerCase()] &&
        metaTranscation
      ) {
        const metaToken =
          META_TXN_SUPPORTED_TOKENS[lpContract.options.address.toLowerCase()];
        const biconomyweb3 = getBiconomyWeb3();
        const biconomyContract = new biconomyweb3.eth.Contract(
          metaToken.abi,
          lpContract.options.address
        );
        const nonceMethod =
          biconomyContract.methods.getNonce || biconomyContract.methods.nonces;
        const biconomyNonce = await nonceMethod(account).call();
        const res = biconomyContract.methods
          .approve(
            sousChefContract.options.address,
            ethers.constants.MaxUint256.toString()
          )
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
            verifyingContract: lpContract.options.address,
            // @ts-ignore
            salt: `0x${chainId.toString(16).padStart(64, "0")}`,
          },
          primaryType: "MetaTransaction",
          message,
        });

        const sig = await library.send("eth_signTypedData_v4", [
          account,
          dataToSign,
        ]);

        const signature = await splitSignature(sig.result);
        const { v, r, s } = signature;

        return biconomyContract.methods
          .executeMetaTransaction(account, res, r, s, v)
          .send({
            from: account,
          })
          .then((response: any) => {
            dispatch(updateUserAllowance(sousId, account));
            return response.hash;
          })
          .catch((error: Error) => {
            console.error("Failed to approve token", error);
            throw error;
          });
      }
      const tx = await approve(lpContract, sousChefContract, account);
      dispatch(updateUserAllowance(sousId, account));
      return tx;
    } catch (e) {
      return false;
    }
  }, [
    account,
    dispatch,
    lpContract,
    sousChefContract,
    sousId,
    metaTranscation,
    chainId,
    library,
  ]);

  return { onApprove: handleApprove };
};

export const useApproveStaking = () => {
  const { account } = useWeb3React("web3");
  const cakeContract = useCake();
  const cntStakerContract = useCNTStaker();

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(cakeContract, cntStakerContract, account);
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, cakeContract, cntStakerContract]);

  return { onApprove: handleApprove };
};

// Approve the lottery
export const useLotteryApprove = () => {
  const { account } = useWeb3React("web3");
  const cakeContract = useCake();
  const lotteryContract = useLottery();

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(cakeContract, lotteryContract, account);
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, cakeContract, lotteryContract]);

  return { onApprove: handleApprove };
};

// Approve an IFO
export const useIfoApprove = (
  tokenContract: Contract,
  spenderAddress: string
) => {
  const { account } = useWeb3React("web3");
  const onApprove = useCallback(async () => {
    const tx = await tokenContract.methods
      .approve(spenderAddress, ethers.constants.MaxUint256)
      .send({ from: account });
    return tx;
  }, [account, spenderAddress, tokenContract]);

  return onApprove;
};
