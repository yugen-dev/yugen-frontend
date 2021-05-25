import { useCallback } from "react";

import { useWeb3React } from "@web3-react/core";

import { enter } from "utils/callHelpers";

import { useCoffeeTable } from "./useContract";

const useEnter = () => {
  const { account } = useWeb3React('web3');
  console.log('check this', useWeb3React('web3'), useWeb3React('web3'))
  const coffeeTable = useCoffeeTable();

  const handle = useCallback(
    async (amount: string) => {
      console.log({ coffeeTable }, { amount }, { account });
      const txHash = await enter(coffeeTable, amount, account);
      console.log(txHash);
    },
    [account, coffeeTable]
  );

  return { onEnter: handle };
};

export default useEnter;
