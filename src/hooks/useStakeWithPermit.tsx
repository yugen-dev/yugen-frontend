import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { fetchFarmUserDataAsync } from "state/actions";
import { stake, GaslessStakeWithPermit } from "utils/callHelpers";
import { useProfile } from "state/hooks";
import { useMasterchef, useMasterchefGasless } from "./useContract";

export const useStakeWithPermit = (pid: number, signatureData: any) => {
  const dispatch = useDispatch();
  const { account, library } = useWeb3React("web3");
  const masterChefContract = useMasterchef();
  const masterChefGaslessContract = useMasterchefGasless();
  const { metaTranscation } = useProfile();
  const handleStakeWithPermit = useCallback(
    async (amount: string) => {
      if (metaTranscation && signatureData !== null) {
        await GaslessStakeWithPermit(
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
        dispatch(fetchFarmUserDataAsync(account));
      } else {
        const txHash = await stake(masterChefContract, pid, amount, account);
        dispatch(fetchFarmUserDataAsync(account));
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
    ]
  );

  return { onStakeWithPermit: handleStakeWithPermit };
};

export default useStakeWithPermit;
