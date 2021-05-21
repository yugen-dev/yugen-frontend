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
} from "utils/callHelpers";
import { useProfile } from "state/hooks";
import {
  useMasterchef,
  useSousChef,
  useMasterchefGasless,
} from "./useContract";

const useStake = (pid: number) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React('web3');
  const masterChefContract = useMasterchef();
  const masterChefGaslessContract = useMasterchefGasless();

  const { metaTranscation } = useProfile();
  const handleStake = useCallback(
    async (amount: string) => {
      if (metaTranscation) {
        const txHash = await GaslessStake(
          masterChefGaslessContract,
          pid,
          amount,
          account
        );
        console.log(txHash);
        dispatch(fetchFarmUserDataAsync(account));
      } else {
        const txHash = await stake(masterChefContract, pid, amount, account);
        dispatch(fetchFarmUserDataAsync(account));
        console.info(txHash);
      }
    },
    [
      account,
      dispatch,
      masterChefGaslessContract,
      masterChefContract,
      pid,
      metaTranscation,
    ]
  );

  return { onStake: handleStake };
};

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React('web3');
  const masterChefContract = useMasterchef();
  const sousChefContract = useSousChef(sousId);

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === 0) {
        await stake(masterChefContract, 0, amount, account);
      } else if (isUsingBnb) {
        await sousStakeBnb(sousChefContract, amount, account);
      } else {
        await sousStake(sousChefContract, amount, decimals, account);
      }
      dispatch(updateUserStakedBalance(sousId, account));
      dispatch(updateUserBalance(sousId, account));
    },
    [
      account,
      dispatch,
      isUsingBnb,
      masterChefContract,
      sousChefContract,
      sousId,
    ]
  );

  return { onStake: handleStake };
};

export default useStake;
