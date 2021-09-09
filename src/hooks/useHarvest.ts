/* eslint-disable dot-notation */
import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { useProfile, useToast } from "state/hooks";
import {
  fetchFarmUserDataAsync,
  updateUserBalance,
  updateUserPendingReward,
} from "state/actions";
import {
  soushHarvest,
  soushHarvestBnb,
  harvest,
  GaslessHarvest,
  soushHarvestGasless,
  hybridStakingHarvest,
} from "utils/callHelpers";
import {
  useMasterchef,
  useSousChef,
  useSousChefGasless,
  useMasterchefGasless,
  useHybridStaking,
} from "./useContract";

export const useHarvest = (farmPid: number) => {
  const dispatch = useDispatch();
  const { account, library } = useWeb3React("web3");
  const masterChefContract = useMasterchef();
  const masterChefGaslessContract = useMasterchefGasless();
  const { metaTranscation } = useProfile();
  const { toastInfo, toastError, toastSuccess } = useToast();

  const handleHarvest = useCallback(async () => {
    let txHash;
    try {
      toastInfo("Processing...", `You requested to Harvest `);
      if (metaTranscation) {
        txHash = await GaslessHarvest(
          masterChefGaslessContract,
          farmPid,
          account,
          library
        );
        if (typeof txHash !== "undefined" && txHash.code === 4001) {
          toastError("canceled", ` signautures rejected`);
        } else {
          toastSuccess("Success", ` Harvested successfully`);
        }
        dispatch(fetchFarmUserDataAsync(account));
      } else {
        txHash = await harvest(masterChefContract, farmPid, account);
        toastSuccess("Success", ` Harvested successfully`);
        dispatch(fetchFarmUserDataAsync(account));
      }
    } catch (error) {
      if (
        (error &&
          error["message"] ===
            "MetaMask Tx Signature: User denied transaction signature.") ||
        error["message"] ===
          "MetaMask Message Signature: User denied message signature." ||
        error["code"] === 4001
      ) {
        // toastInfo("canceled...", `cancelled signature `);
        toastError("canceled", ` signautures rejected`);
      } else {
        toastError("Error...", `Failed to Harvest`);
      }
    }
    return txHash;
  }, [
    account,
    dispatch,
    farmPid,
    masterChefContract,
    masterChefGaslessContract,
    metaTranscation,
    library,
    toastInfo,
    toastSuccess,
    toastError,
  ]);

  return { onReward: handleHarvest };
};

export const useAllHarvest = (farmPids: number[]) => {
  const { account } = useWeb3React("web3");
  const masterChefContract = useMasterchef();

  const handleHarvest = useCallback(async () => {
    const harvestPromises = farmPids.reduce((accum, pid) => {
      return [...accum, harvest(masterChefContract, pid, account)];
    }, []);

    return Promise.all(harvestPromises);
  }, [account, farmPids, masterChefContract]);

  return { onReward: handleHarvest };
};

export const useSousHarvest = (sousId, isUsingBnb = false) => {
  const dispatch = useDispatch();
  const { account, library } = useWeb3React("web3");
  const sousChefContract = useSousChef(sousId);
  const sousChefContractGasless = useSousChefGasless(sousId);
  const { toastInfo, toastError, toastSuccess } = useToast();
  const { metaTranscation } = useProfile();
  const hybridStakingContract = useHybridStaking();

  const handleHarvest = useCallback(async () => {
    let resp;
    try {
      toastInfo("Processing...", `You requested to Harvest `);
      if (isUsingBnb) {
        await soushHarvestBnb(sousChefContract, account);
        toastSuccess("Success", ` Harvested successfully`);
        dispatch(updateUserPendingReward(sousId, account));
        dispatch(updateUserBalance(sousId, account));
      } else if (sousId === 0) {
        await hybridStakingHarvest(hybridStakingContract, account);
      } else if (metaTranscation) {
        resp = await soushHarvestGasless(
          sousChefContractGasless,
          account,
          sousId,
          library
        );
        if (typeof resp !== "undefined" && resp.code === 4001) {
          toastError("canceled", ` signautures rejected`);
        } else {
          toastSuccess("Success", ` Harvested successfully`);
        }
        toastSuccess("Success", ` Harvested successfully`);
        dispatch(updateUserPendingReward(sousId, account));
        dispatch(updateUserBalance(sousId, account));
      } else {
        await soushHarvest(sousChefContract, account);
        toastSuccess("Success", ` Harvested successfully`);
        dispatch(updateUserPendingReward(sousId, account));
        dispatch(updateUserBalance(sousId, account));
      }
    } catch (error) {
      if (
        error["message"] ===
          "MetaMask Tx Signature: User denied transaction signature." ||
        error["message"] ===
          "MetaMask Message Signature: User denied message signature." ||
        error["code"] === 4001
      ) {
        // toastInfo("canceled...", `cancelled signature `);
        toastError("canceled", ` signautures rejected`);
      } else {
        toastError("Error...", `Failed to Harvest`);
      }
    }
  }, [
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
    hybridStakingContract,
  ]);

  return { onReward: handleHarvest };
};
