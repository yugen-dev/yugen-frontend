import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import { useEffect, useState } from "react";
import useRefresh from "./useRefresh";
import useWeb3 from "./useWeb3";

const useEthBalance = () => {
  const [balance, setBalance] = useState(new BigNumber(0));
  const { account } = useWeb3React("web3");
  const web3 = useWeb3();

  const { fastRefresh } = useRefresh();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const ethBalance = await web3.eth.getBalance(account);
        // const BalanceInEth = new BigNumber(ethBalance).div(
        //   new BigNumber(10).pow(18)
        // );

        setBalance(new BigNumber(ethBalance));
      } catch (error) {
        console.error({ error });
      }
    };

    if (account) {
      fetchBalance();
    }
  }, [account, web3, fastRefresh]);

  return balance;
};
export default useEthBalance;
