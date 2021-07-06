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
  sousUnstakeGasless,
} from "utils/callHelpers";
import { useProfile } from "state/hooks";
import {
  useMasterchef,
  useSousChef,
  useMasterchefGasless,
  useSousChefGasless,
} from "./useContract";

const useUnstake = (pid: number) => {
  const dispatch = useDispatch();
  const { account, library } = useWeb3React("web3");
  const masterChefContract = useMasterchef();
  const masterChefGaslessContract = useMasterchefGasless();
  const { metaTranscation } = useProfile();
  const handleUnstake = useCallback(
    async (amount: string) => {
      if (metaTranscation) {
        const txHash = await GaslessUnStake(
          masterChefGaslessContract,
          pid,
          amount,
          account,
          library
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
      metaTranscation,
      library,
    ]
  );

  return { onUnstake: handleUnstake };
};

const SYRUPIDS = [];

export const useSousUnstake = (sousId) => {
  const dispatch = useDispatch();
  const { account, library } = useWeb3React("web3");

  const sousChefContract = useSousChef(sousId);
  const sousChefContractsGasless = useSousChefGasless(sousId);
  const isOldSyrup = SYRUPIDS.includes(sousId);
  const { metaTranscation } = useProfile();
  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      if (isOldSyrup) {
        await sousEmegencyUnstake(sousChefContract, amount, account);
      } else if (metaTranscation) {
        await sousUnstakeGasless(
          sousChefContractsGasless,
          amount,
          decimals,
          account,
          sousId,
          library
        );
      } else {
        await sousUnstake(sousChefContract, amount, decimals, account);
      }
      dispatch(updateUserStakedBalance(sousId, account));
      dispatch(updateUserBalance(sousId, account));
      dispatch(updateUserPendingReward(sousId, account));
    },
    [
      account,
      dispatch,
      isOldSyrup,
      sousChefContract,
      sousChefContractsGasless,
      metaTranscation,
      sousId,
      library,
    ]
  );

  return { onUnstake: handleUnstake };
};

export default useUnstake;
