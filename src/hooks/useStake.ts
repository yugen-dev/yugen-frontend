import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import {
  fetchFarmUserDataAsync,
  updateUserStakedBalance,
  updateUserBalance,
} from "state/actions";
import {
  stake,
  sousStake,
  sousStakeBnb,
  GaslessStake,
  sousStakeGasless,
} from "utils/callHelpers";
import { useProfile } from "state/hooks";
import {
  useMasterchef,
  useSousChef,
  useMasterchefGasless,
  useSousChefGasless,
} from "./useContract";

export const useStake = (pid: number) => {
  const dispatch = useDispatch();
  const { account, library } = useWeb3React("web3");
  const masterChefContract = useMasterchef();
  const masterChefGaslessContract = useMasterchefGasless();

  const { metaTranscation } = useProfile();
  const handleStake = useCallback(
    async (amount: string) => {
      if (metaTranscation) {
        await GaslessStake(
          masterChefGaslessContract,
          pid,
          amount,
          account,
          library
        );
        dispatch(fetchFarmUserDataAsync(account));
      } else {
        await stake(masterChefContract, pid, amount, account);
        dispatch(fetchFarmUserDataAsync(account));
      }
    },
    [
      account,
      dispatch,
      masterChefGaslessContract,
      masterChefContract,
      pid,
      metaTranscation,
      library,
    ]
  );

  return { onStake: handleStake };
};

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch();
  const { account, library } = useWeb3React("web3");
  const sousChefContract = useSousChef(sousId);
  const sousChefContractGasless = useSousChefGasless(sousId);
  const { metaTranscation } = useProfile();
  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account);
      } else if (metaTranscation) {
        await sousStakeGasless(
          sousChefContractGasless,
          amount,
          decimals,
          account,
          sousId,
          library
        );
        dispatch(updateUserStakedBalance(sousId, account));
        dispatch(updateUserBalance(sousId, account));
      } else {
        await sousStake(sousChefContract, amount, decimals, account);
        dispatch(updateUserStakedBalance(sousId, account));
        dispatch(updateUserBalance(sousId, account));
      }
    },
    [
      account,
      dispatch,
      isUsingBnb,
      sousChefContract,
      sousChefContractGasless,
      metaTranscation,
      sousId,
      library,
    ]
  );

  return { onStake: handleStake };
};

export default useStake;
