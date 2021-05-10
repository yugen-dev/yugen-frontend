import {useCallback} from 'react'

import { useWeb3React } from "@web3-react/core";

import {leave} from "utils/callHelpers";

import { useCake,useCoffeeTable } from "./useContract";

const useLeave = () => {
  const { account } = useWeb3React();
  const cake = useCake();
  const coffeeTable = useCoffeeTable();

  const handle = useCallback(
    async (amount: string) => {
      const txHash = await leave(
        coffeeTable,
        amount,
        account,
      )
      console.log(txHash)
    },
    [account, coffeeTable],
  )

  return {onLeave: handle}
}

export default useLeave

