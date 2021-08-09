import { useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { fetchFarmUserDataAsync } from "state/actions";
import { provideSingleSidedLiquidity } from "utils/callHelpers";
import { useToast } from "state/hooks";
import BigNumber from "bignumber.js";
import { useSingleSidedLiquidity } from "./useContract";

export const useProvideSingleSidedLiquidity = (
  pid: number,
  token: string,
  toToken: string,
  pairAddress: string,
  slippage: string,
  decimal: BigNumber
) => {
  const dispatch = useDispatch();
  const { account } = useWeb3React("web3");
  const singleSidedContract = useSingleSidedLiquidity();
  const { toastInfo, toastError, toastSuccess } = useToast();

  const handeProvideSingleSidedLiquidity = useCallback(
    async (amount: string) => {
      try {
        toastInfo("Processing...", `You requested to Deposited `);

        await provideSingleSidedLiquidity(
          singleSidedContract,
          token,
          amount,
          toToken,
          pairAddress,
          slippage,
          pid,
          account,
          decimal
        );
        toastSuccess("Success", ` Deposited successfully`);
        dispatch(fetchFarmUserDataAsync(account));
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
      singleSidedContract,
      dispatch,
      pid,
      token,
      toToken,
      pairAddress,
      slippage,
      decimal,
      toastInfo,
      toastSuccess,
      toastError,
    ]
  );

  return { onProvideSingleSidedLiquidity: handeProvideSingleSidedLiquidity };
};

export default useProvideSingleSidedLiquidity;
