import {useCallback} from 'react'

import { useWeb3React } from "@web3-react/core";

import {enter} from "utils/callHelpers";

import { useCoffeeTable } from "./useContract";

const useEnter = () => {
  const { account } = useWeb3React();
  const coffeeTable = useCoffeeTable();

  const handle = useCallback(
    async (amount: string) => {
      const txHash = await enter(
        coffeeTable,
        amount,
        account,
      )
      console.log(txHash)
    },
    [account, coffeeTable],
  )

  return {onEnter: handle}
}

export default useEnter
