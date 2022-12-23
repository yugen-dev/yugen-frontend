/* eslint-disable dot-notation */
import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { fetchFarmUserDataAsync } from "state/actions";
import { unstake, vaultunstake, vaultproxyunstake } from "utils/callHelpers";
import { useProfile, useToast } from "state/hooks";
import { fetchVaultUserDataAsync } from "state/vaults";
import { useMasterchef, useVaultchef } from "./useContract";

const useUnstake = (pid: number, decimals) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React("web3");
  const masterChefContract = useMasterchef();
  const { toastInfo, toastError, toastSuccess } = useToast();

  const handleUnstake = useCallback(
    async (amount: string) => {
      try {
        toastInfo("Processing...", `You requested to withdraw `);
        await unstake(masterChefContract, pid, amount, account, decimals);
        toastSuccess("Success", ` withdraw successfull`);
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
          toastError("Error...", `Failed to withdraw`);
        }
      }
    },
    [
      toastInfo,
      pid,
      account,
      dispatch,
      toastError,
      toastSuccess,
      masterChefContract,
      decimals,
    ]
  );

  return { onUnstake: handleUnstake };
};

export const useVaultUnstake = (vaultContractAddress: string) => {
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
          resp = await vaultproxyunstake(vaultContract, amount, account);
          // @ts-ignore
          if (typeof resp !== "undefined" && resp.code === 4001) {
            toastError("Cancelled", "Signautures rejected");
          } else {
            toastSuccess("Success", "Withdraw successfull");
          }

          dispatch(fetchVaultUserDataAsync(account));
        } else {
          await vaultproxyunstake(vaultContract, amount, account);
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

      account,
      dispatch,
      toastError,
      toastSuccess,
    ]
  );

  return { onUnstake: handleUnstake };
};

export default useUnstake;
