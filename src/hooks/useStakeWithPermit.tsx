import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { fetchFarmUserDataAsync } from "state/actions";
import { stake, GaslessStakeWithPermit } from "utils/callHelpers";
import { useProfile, useToast } from "state/hooks";
import { useMasterchef, useMasterchefGasless } from "./useContract";

export const useStakeWithPermit = (
  pid: number,
  signatureData: any,
  setSignauteNull: any
) => {
  const dispatch = useDispatch();
  const { account, library } = useWeb3React("web3");
  const masterChefContract = useMasterchef();
  const masterChefGaslessContract = useMasterchefGasless();
  const { toastInfo, toastError, toastSuccess } = useToast();
  const { metaTranscation } = useProfile();

  const handleStakeWithPermit = useCallback(
    async (amount: string) => {
      let resp;
      try {
        toastInfo("Processing...", `You requested to Deposited `);
        if (metaTranscation && signatureData !== null) {
          resp = await GaslessStakeWithPermit(
            masterChefGaslessContract,
            pid,
            amount,
            account,
            signatureData.deadline,
            signatureData.v,
            signatureData.r,
            signatureData.s,
            library
          );
          setSignauteNull();
          // @ts-ignore
          if (typeof resp !== "undefined" && resp.code === 4001) {
            toastError("canceled", ` signautures rejected`);
          } else {
            toastSuccess("Success", ` Deposited successfully`);
          }
          dispatch(fetchFarmUserDataAsync(account));
        } else {
          await stake(masterChefContract, pid, amount, account);
          toastSuccess("Success", ` Deposited successfully`);
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
      signatureData,
      library,
      toastInfo,
      toastSuccess,
      toastError,
      setSignauteNull,
    ]
  );

  return { onStakeWithPermit: handleStakeWithPermit };
};

export default useStakeWithPermit;
