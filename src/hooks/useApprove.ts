import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "web3-eth-contract";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import { updateUserAllowance, fetchFarmUserDataAsync } from "state/actions";
import { approve, GaslessStakeWithPermit } from "utils/callHelpers";
import { useProfile } from "state/hooks";
import { splitSignature } from "@ethersproject/bytes";
import {
  getCoffeeTableAddress,
  getMasterChefAddress,
  getSouschefContract,
} from "utils/addressHelpers";
import {
  useMasterchef,
  useCake,
  useCoffeeTable,
  useLottery,
  useMasterchefGasless,
  usePairContract,
} from "./useContract";
import { useUserDeadline } from "../state/user/hooks";

// Approve a Farm
export const useApprove = (lpContract: Contract) => {
  const dispatch = useDispatch();
  const { account, chainId, library } = useWeb3React("web3");
  const masterChefContract = useMasterchef();
  const useMasterchefGaslesscontract = useMasterchefGasless();
  const { metaTranscation } = useProfile();
  const [deadline] = useUserDeadline();

  const handleApprove = useCallback(async () => {
    if (metaTranscation) {
      try {
        // try to gather a signature for permission
        // @ts-ignore
        // window.alert(lpContract.options.address);
        const noncee = await lpContract.methods.nonces(account).call();
        const nonce = await ethers.utils.parseUnits(noncee.toString(), "0");
        console.log(nonce);
        // window.alert(chainId);
        // window.alert(lpContract.options.address);
        // window.alert(getMasterChefAddress());
        const deadlineForSignature: number =
          Math.ceil(Date.now() / 1000) + deadline;
        // window.alert(deadline);
        // window.alert(deadlineForSignature);
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
        console.log(nonce._hex);
        const message = {
          owner: account,
          spender: getMasterChefAddress(),
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
        console.log(sig);
        const signature = await splitSignature(sig.result);
        console.log(signature);
        const { r, s, v } = signature;
        console.log({ v, r, s });

        return { v, r, s, deadlineForSignature };
      } catch (e) {
        console.log(e);
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

/* // Approve a Pool
export const useSousApprove = (lpContract: Contract, sousId) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React('web3');
  const sousChefContract = useSousChef(sousId);

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, sousChefContract, account);
      dispatch(updateUserAllowance(sousId, account));
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, dispatch, lpContract, sousChefContract, sousId]);

  return { onApprove: handleApprove };
}; */

export const useApproveStaking = () => {
  const { account } = useWeb3React("web3");
  const cakeContract = useCake();
  const coffeeTableContract = useCoffeeTable();

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(cakeContract, coffeeTableContract, account);
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, cakeContract, coffeeTableContract]);

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
