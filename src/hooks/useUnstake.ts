import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import {
  fetchFarmUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
  updateUserPendingReward,
} from "state/actions";
import {
  unstake,
  sousUnstake,
  sousEmegencyUnstake,
  GaslessUnStake,
} from "utils/callHelpers";
import {
  useMasterchef,
  useSousChef,
  useMasterchefGasless,
} from "./useContract";

const useUnstake = (pid: number) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const masterChefContract = useMasterchef();
  const masterChefGaslessContract = useMasterchefGasless();
  let isMetaTransactionEnabled = false;
  const metaTransactionCheck = window.localStorage.getItem("metatransaction");

  if (typeof metaTransactionCheck === null) {
    isMetaTransactionEnabled = false;
  } else if (metaTransactionCheck === "true") {
    isMetaTransactionEnabled = true;
  } else {
    isMetaTransactionEnabled = false;
  }
  const handleUnstake = useCallback(
    async (amount: string) => {
      if (isMetaTransactionEnabled) {
        const txHash = await GaslessUnStake(
          masterChefGaslessContract,
          pid,
          amount,
          account
        );
        dispatch(fetchFarmUserDataAsync(account));
        console.info(txHash);
      } else {
        const txHash = await unstake(masterChefContract, pid, amount, account);
        dispatch(fetchFarmUserDataAsync(account));
        console.info(txHash);
        dispatch(fetchFarmUserDataAsync(account));
        console.info(txHash);
      }
    },
    [
      account,
      dispatch,
      masterChefContract,
      masterChefGaslessContract,
      pid,
      isMetaTransactionEnabled,
    ]
  );

  return { onUnstake: handleUnstake };
};

const SYRUPIDS = [5, 6, 3, 1, 22, 23];

export const useSousUnstake = (sousId) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const masterChefContract = useMasterchef();
  const sousChefContract = useSousChef(sousId);
  const isOldSyrup = SYRUPIDS.includes(sousId);

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === 0) {
        const txHash = await unstake(masterChefContract, 0, amount, account);
        console.info(txHash);
      } else if (isOldSyrup) {
        const txHash = await sousEmegencyUnstake(
          sousChefContract,
          amount,
          account
        );
        console.info(txHash);
      } else {
        const txHash = await sousUnstake(
          sousChefContract,
          amount,
          decimals,
          account
        );
        console.info(txHash);
      }
      dispatch(updateUserStakedBalance(sousId, account));
      dispatch(updateUserBalance(sousId, account));
      dispatch(updateUserPendingReward(sousId, account));
    },
    [
      account,
      dispatch,
      isOldSyrup,
      masterChefContract,
      sousChefContract,
      sousId,
    ]
  );

  return { onUnstake: handleUnstake };
};

export default useUnstake;
