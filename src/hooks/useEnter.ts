import { useCallback } from "react";

import { useWeb3React } from "@web3-react/core";
import { useProfile } from "state/hooks";
import { enter, enterGasless } from "utils/callHelpers";

// import { useProfile } from "state/hooks";
// const { metaTranscation } = useProfile();

import { useCoffeeTable, useCoffeeTableGasless } from "./useContract";

const useEnter = () => {
  const { account } = useWeb3React("web3");
  const coffeeTable = useCoffeeTable();
  const coffeeTableGasless = useCoffeeTableGasless();
  const { metaTranscation } = useProfile();

  const handle = useCallback(
    async (amount: string) => {
      if (metaTranscation) {
        const txHash = await enterGasless(coffeeTableGasless, amount, account);
      } else {
        const txHash = await enter(coffeeTable, amount, account);
      }
    },
    [account, coffeeTable, coffeeTableGasless, metaTranscation]
  );

  return { onEnter: handle };
};

export default useEnter;
