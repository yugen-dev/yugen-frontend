import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { updateUserBalance, updateUserStakedBalance } from "state/actions";
import { sousStake, SousStakeGaslessWithPermit } from "utils/callHelpers";
import { useProfile, useToast } from "state/hooks";
import { useSousChef, useSousChefGasless } from "./useContract";

export const useStakeWithPermitMultireward = (sousId, signatureData: any) => {
  const dispatch = useDispatch();
  const { account, library } = useWeb3React("web3");
  const sousChefContract = useSousChef(sousId);
  const sousChefContractGasless = useSousChefGasless(sousId);
  const { toastInfo, toastError, toastSuccess } = useToast();
  const { metaTranscation } = useProfile();

  const handleStakeWithPermit = useCallback(
    async (amount: string, decimals: number) => {
      try {
        toastInfo("Processing...", `You requested to Deposited `);
        if (metaTranscation && signatureData !== null) {
          await SousStakeGaslessWithPermit(
            sousChefContractGasless,
            amount,
            decimals,
            account,
            sousId,
            signatureData.deadline,
            signatureData.v,
            signatureData.r,
            signatureData.s,

            library
          );
          toastSuccess("Success", ` Depositeded successfully`);
          dispatch(updateUserStakedBalance(sousId, account));
          dispatch(updateUserBalance(sousId, account));
        } else {
          await sousStake(sousChefContract, amount, decimals, account);
          toastSuccess("Success", ` Depositeded successfully`);
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
      sousChefContract,
      sousChefContractGasless,
      metaTranscation,
      sousId,
      library,
      signatureData,
      toastInfo,
      toastSuccess,
      toastError,
    ]
  );

  return { onStakeWithPermit: handleStakeWithPermit };
};

export default useStakeWithPermitMultireward;
