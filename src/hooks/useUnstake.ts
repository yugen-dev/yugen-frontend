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
  hybridStakingStake,
  hybridStakingUnstake,
} from "utils/callHelpers";
import { useProfile, useToast } from "state/hooks";
import {
  useMasterchef,
  useSousChef,
  useMasterchefGasless,
  useSousChefGasless,
  useHybridStaking,
} from "./useContract";

const useUnstake = (pid: number) => {
  const dispatch = useDispatch();
  const { account, library } = useWeb3React("web3");
  const masterChefContract = useMasterchef();
  const masterChefGaslessContract = useMasterchefGasless();
  const { metaTranscation } = useProfile();
  const { toastInfo, toastError, toastSuccess } = useToast();

  const handleUnstake = useCallback(
    async (amount: string) => {
      try {
        let resp;
        toastInfo("Processing...", `You requested to withdraw `);
        if (metaTranscation) {
          resp = await GaslessUnStake(
            masterChefGaslessContract,
            pid,
            amount,
            account,
            library
          );
          // @ts-ignore
          if (typeof resp !== "undefined" && resp.code === 4001) {
            toastError("canceled", ` signautures rejected`);
          } else {
            toastSuccess("Success", ` withdraw successfull`);
          }

          dispatch(fetchFarmUserDataAsync(account));
        } else {
          await unstake(masterChefContract, pid, amount, account);
          toastSuccess("Success", ` withdraw successfull`);
          dispatch(fetchFarmUserDataAsync(account));
        }
      } catch (e) {
        if (
          e.message ===
            "MetaMask Tx Signature: User denied transaction signature." ||
          e.message ===
            "MetaMask Message Signature: User denied message signature." ||
          e.code === 4001
        ) {
          // toastInfo("canceled...", `cancelled signature `);
          toastError("canceled", ` signautures rejected`);
        } else {
          toastError("Error...", `Failed to withdraw`);
        }
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
      toastInfo,
      toastSuccess,
      toastError,
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
  const hybridStakingContract = useHybridStaking();
  const { metaTranscation } = useProfile();
  const { toastInfo, toastError, toastSuccess } = useToast();
  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      let resp;
      try {
        toastInfo("Processing...", `You requested to withdraw `);
        if (isOldSyrup) {
          await sousEmegencyUnstake(sousChefContract, amount, account);
        } else if (sousId === 0) {
          await hybridStakingUnstake(hybridStakingContract, amount, account);
        } else if (metaTranscation) {
          resp = await sousUnstakeGasless(
            sousChefContractsGasless,
            amount,
            decimals,
            account,
            sousId,
            library
          );
          // @ts-ignore
          if (typeof resp !== "undefined" && resp.code === 4001) {
            toastError("canceled", ` signautures rejected`);
          } else {
            toastSuccess("Success", ` withdraw successfull`);
          }
          dispatch(updateUserStakedBalance(sousId, account));
          dispatch(updateUserBalance(sousId, account));
          dispatch(updateUserPendingReward(sousId, account));
        } else {
          await sousUnstake(sousChefContract, amount, decimals, account);
          toastSuccess("Success", ` withdraw successfull`);
          dispatch(updateUserStakedBalance(sousId, account));
          dispatch(updateUserBalance(sousId, account));
          dispatch(updateUserPendingReward(sousId, account));
        }
      } catch (e) {
        if (
          e.message ===
            "MetaMask Tx Signature: User denied transaction signature." ||
          e.message ===
            "MetaMask Message Signature: User denied message signature." ||
          e.code === 4001
        ) {
          // toastInfo("canceled...", `cancelled signature `);
          toastError("canceled", ` signautures rejected`);
        } else {
          toastError("Error...", `Failed to withdraw`);
        }
      }
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
      toastInfo,
      toastSuccess,
      toastError,
      hybridStakingContract,
    ]
  );

  return { onUnstake: handleUnstake };
};

export default useUnstake;
