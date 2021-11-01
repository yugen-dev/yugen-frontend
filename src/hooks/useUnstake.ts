/* eslint-disable dot-notation */
import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { fetchFarmUserDataAsync } from "state/actions";
import { unstake, vaultunstake, GaslessUnStake } from "utils/callHelpers";
import { useProfile, useToast } from "state/hooks";
import { fetchVaultUserDataAsync } from "state/vaults";
import {
  useMasterchef,
  useMasterchefGasless,
  useVaultchef,
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

export const useVaultUnstake = (pid: number, vaultContractAddress: string) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React("web3");
  const vaultContract = useVaultchef(vaultContractAddress);
  const { metaTranscation } = useProfile();
  const { toastInfo, toastError, toastSuccess } = useToast();

  const handleUnstake = useCallback(
    async (amount: string) => {
      try {
        let resp;
        toastInfo("Processing...", `You requested to withdraw `);
        if (metaTranscation) {
          resp = await vaultunstake(vaultContract, pid, amount, account);
          // @ts-ignore
          if (typeof resp !== "undefined" && resp.code === 4001) {
            toastError("Cancelled", "Signautures rejected");
          } else {
            toastSuccess("Success", "Withdraw successfull");
          }

          dispatch(fetchVaultUserDataAsync(account));
        } else {
          await vaultunstake(vaultContract, pid, amount, account);
          toastSuccess("Success", "Withdraw successfull");
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
          toastError("Error...", "Failed to withdraw");
        }
      }
    },
    [
      toastInfo,
      metaTranscation,
      vaultContract,
      pid,
      account,
      dispatch,
      toastError,
      toastSuccess,
    ]
  );

  return { onUnstake: handleUnstake };
};

export default useUnstake;
