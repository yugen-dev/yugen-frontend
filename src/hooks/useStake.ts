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
import { useProfile, useToast } from "state/hooks";
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
  const { toastInfo, toastError, toastSuccess } = useToast();
  const { metaTranscation } = useProfile();

  const handleStake = useCallback(
    async (amount: string) => {
      try {
        toastInfo("Processing...", `You requested to Deposited `);
        if (metaTranscation) {
          await GaslessStake(
            masterChefGaslessContract,
            pid,
            amount,
            account,
            library
          );
          toastSuccess("Success", ` Deposited successfully`);
          dispatch(fetchFarmUserDataAsync(account));
        } else {
          await stake(masterChefContract, pid, amount, account);
          toastSuccess("Success", ` Deposited successfully`);
          dispatch(fetchFarmUserDataAsync(account));
        }
      } catch (e) {
        if (
          e.message ===
          "MetaMask Tx Signature: User denied transaction signature."
        ) {
          // toastInfo("canceled...", `cancelled signature `);
          toastError("canceled", ` signautures rejected`);
        } else {
          toastError("Error...", `Failed to Deposit`);
        }
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
      toastInfo,
      toastSuccess,
      toastError,
    ]
  );

  return { onStake: handleStake };
};

export const useSousStake = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch();
  const { account, library } = useWeb3React("web3");
  const sousChefContract = useSousChef(sousId);
  const sousChefContractGasless = useSousChefGasless(sousId);
  const { toastInfo, toastError, toastSuccess } = useToast();
  const { metaTranscation } = useProfile();
  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      try {
        toastInfo("Processing...", `You requested to Deposited `);
        if (isUsingBnb) {
          await sousStakeBnb(sousChefContract, amount, account);
          toastSuccess("Success", ` Deposited successfully`);
          dispatch(updateUserStakedBalance(sousId, account));
          dispatch(updateUserBalance(sousId, account));
        } else if (metaTranscation) {
          await sousStakeGasless(
            sousChefContractGasless,
            amount,
            decimals,
            account,
            sousId,
            library
          );
          toastSuccess("Success", ` Deposited successfully`);
          dispatch(updateUserStakedBalance(sousId, account));
          dispatch(updateUserBalance(sousId, account));
        } else {
          await sousStake(sousChefContract, amount, decimals, account);
          toastSuccess("Success", ` Deposited successfully`);
          dispatch(updateUserStakedBalance(sousId, account));
          dispatch(updateUserBalance(sousId, account));
        }
      } catch (e) {
        if (
          e.message ===
          "MetaMask Tx Signature: User denied transaction signature."
        ) {
          // toastInfo("canceled...", `cancelled signature `);
          toastError("canceled", ` signautures rejected`);
        } else {
          toastError("Error...", `Failed to Deposit`);
        }
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
      toastInfo,
      toastSuccess,
      toastError,
    ]
  );

  return { onStake: handleStake };
};

export default useStake;
