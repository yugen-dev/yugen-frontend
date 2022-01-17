/* eslint-disable dot-notation */
import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { fetchFarmUserDataAsync } from "state/actions";
import { stake } from "utils/callHelpers";
import { useToast } from "state/hooks";
import { useMasterchef } from "./useContract";

export const useStakeWithPermit = (
  pid: number,
  signatureData: any,
  setSignauteNull: any,
  decimals
) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React("web3");
  const masterChefContract = useMasterchef();
  const { toastInfo, toastError, toastSuccess } = useToast();

  const handleStakeWithPermit = useCallback(
    async (amount: string) => {
      try {
        toastInfo("Processing...", `You requested to Deposited `);
        await stake(masterChefContract, pid, amount, account, decimals);
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
      pid,
      account,
      dispatch,
      toastError,
      toastSuccess,
      masterChefContract,
      decimals,
    ]
  );

  return { onStakeWithPermit: handleStakeWithPermit };
};

export default useStakeWithPermit;
