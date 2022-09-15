/* eslint-disable dot-notation */
import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { fetchFarmUserDataAsync } from "state/actions";
import { stake, vaultstake, proxystake, vaultproxystake } from "utils/callHelpers";
import { useProfile, useToast } from "state/hooks";
import { fetchVaultUserDataAsync } from "state/vaults";
import {
  useCxEthWethFarmWrapper,
  useFarmWrapper,
  useMasterchef,
  useVaultchef,
  useProxy
} from "./useContract";

export const useStake = (pid: number, decimals) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React("web3");
  const masterChefContract = useMasterchef();
  const { toastInfo, toastError, toastSuccess } = useToast();

  const handleStake = useCallback(
    async (amount: string) => {
      try {
        toastInfo("Processing...", `You requested to Deposited `);
        await proxystake(masterChefContract, pid, amount, account);
        toastSuccess("Success", ` Deposited successfully`);
        dispatch(fetchFarmUserDataAsync(account));
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
          toastError("Error...", `Failed to Deposit`);
        }
      }
    },
    [
      toastInfo,
      masterChefContract,
      pid,
      account,

      toastSuccess,
      dispatch,
      toastError,
    ]
  );

  return { onStake: handleStake };
};

export const useStakeSingleSided = (pid: number, decimals) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React("web3");
  const farmWrapperContract = useFarmWrapper();
  const cxEthWethFarmWrapperContract = useCxEthWethFarmWrapper();
  let wrapperContract = farmWrapperContract;
  if (pid === 15) {
    wrapperContract = cxEthWethFarmWrapperContract;
  }
  const { toastInfo, toastError, toastSuccess } = useToast();

  const handleStakeSingleSided = useCallback(
    async (amount: string) => {
      try {
        toastInfo("Processing...", `You requested to Deposited `);
        await stake(wrapperContract, pid, amount, account, decimals);
        toastSuccess("Success", ` Deposited successfully`);
        dispatch(fetchFarmUserDataAsync(account));
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
          toastError("Error...", `Failed to Deposit`);
        }
      }
    },
    [
      toastInfo,
      wrapperContract,
      pid,
      account,
      decimals,
      toastSuccess,
      dispatch,
      toastError,
    ]
  );

  return { onStakeSingleSided: handleStakeSingleSided };
};

export const useProxyStake = (pid: number) => { // change
  const dispatch = useDispatch();
  const { account } = useWeb3React("web3");
  const proxyContract = useProxy(); // change
  const { toastInfo, toastError, toastSuccess } = useToast();
  const { metaTranscation } = useProfile();

  const handleStake = useCallback(
    async (amount: string) => {
      let resp;
      try {
        toastInfo("Processing...", `You requested to Deposited `);
        if (metaTranscation) {
          resp = await proxystake(proxyContract, pid, amount, account); // change

          // @ts-ignore
          if (typeof resp !== "undefined" && resp.code === 4001) {
            toastError("Cancelled", "Signautures rejected");
          } else {
            toastSuccess("Success", "Deposited successfully");
          }

          dispatch(fetchVaultUserDataAsync(account));
        } else {

          await proxystake(proxyContract, pid, amount, account); // change
          toastSuccess("Success", "Deposited successfully");
          dispatch(fetchVaultUserDataAsync(account));
        }
      } catch (error) {
        if (
          error["message"] ===
          "MetaMask Tx Signature: User denied transaction signature." ||
          error["message"] ===
          "MetaMask Message Signature: User denied message signature." ||
          error["code"] === 4001
        ) {
          toastError("Cancelled", "Signautures rejected");
        } else {
          toastError("Error...", "Failed to Deposit");
        }
      }
    },
    [
      account,
      dispatch,
      proxyContract,
      pid,
      metaTranscation,
      toastInfo,
      toastSuccess,
      toastError,
    ]
  );

  return { onStake: handleStake };
};

export const useVaultStake = ( vaultContractAddress: string) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React("web3");
  const vaultContract = useVaultchef(vaultContractAddress);
  const { toastInfo, toastError, toastSuccess } = useToast();
  const { metaTranscation } = useProfile();

  const handleStake = useCallback(
    async (amount: string) => {
      let resp;
      try {
        toastInfo("Processing...", `You requested to Deposited `);
        if (metaTranscation) {
          resp = await vaultproxystake(vaultContract, amount, account);
          // console.log(pid);

          // @ts-ignore
          if (typeof resp !== "undefined" && resp.code === 4001) {
            toastError("Cancelled", "Signautures rejected");
          } else {
            toastSuccess("Success", "Deposited successfully");
          }

          dispatch(fetchVaultUserDataAsync(account));
        } else {
          await vaultproxystake(vaultContract, amount, account);
          toastSuccess("Success", "Deposited successfully");
          dispatch(fetchVaultUserDataAsync(account));
        }
      } catch (error) {
        if (
          error["message"] ===
          "MetaMask Tx Signature: User denied transaction signature." ||
          error["message"] ===
          "MetaMask Message Signature: User denied message signature." ||
          error["code"] === 4001
        ) {
          toastError("Cancelled", "Signautures rejected");
        } else {
          toastError("Error...", "Failed to Deposit");
        }
      }
    },
    [
      account,
      dispatch,
      vaultContract,

      metaTranscation,
      toastInfo,
      toastSuccess,
      toastError,
    ]
  );

  return { onStake: handleStake };
};

export default useVaultStake;
