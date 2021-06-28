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
  const { account } = useWeb3React("web3");
  const masterChefContract = useMasterchef();
  const masterChefGaslessContract = useMasterchefGasless();
  const { metaTranscation } = useProfile();
  const handleUnstake = useCallback(
    async (amount: string) => {
      if (metaTranscation) {
        await GaslessUnStake(masterChefGaslessContract, pid, amount, account);
        dispatch(fetchFarmUserDataAsync(account));
      } else {
        await unstake(masterChefContract, pid, amount, account);
        dispatch(fetchFarmUserDataAsync(account));
        dispatch(fetchFarmUserDataAsync(account));
      }
    },
    [
      account,
      dispatch,
      masterChefContract,
      masterChefGaslessContract,
      pid,
      metaTranscation,
    ]
  );

  return { onUnstake: handleUnstake };
};

const SYRUPIDS = [];

export const useSousUnstake = (sousId) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React("web3");

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
          sousId
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
    ]
  );

  return { onUnstake: handleUnstake };
};

export default useUnstake;
