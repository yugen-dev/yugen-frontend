import { useEffect, useState } from "react";
// import { Web3Provider } from '@ethersproject/providers'
import BigNumber from "bignumber.js";
import { useWeb3React } from "@web3-react/core";
import { getBep20Contract, getCakeContract } from "utils/contractHelpers";
import useWeb3 from "./useWeb3";
import useRefresh from "./useRefresh";

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0));
  const { account } = useWeb3React();
  const web3 = useWeb3();
  // console.log(useWeb3React('web3'));
  // const web3ReactContext = getWeb3ReactContext("web3");
  // console.log(useWeb3React('NETWORK'));
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const contract = getBep20Contract(tokenAddress, web3);
        const res = await contract.methods.balanceOf(account).call();
        console.log({ res });
        setBalance(new BigNumber(res));
      } catch (error) {
        console.log({ error });
      }
    };

    if (account) {
      fetchBalance();
    }
  }, [account, tokenAddress, web3, fastRefresh]);

  return balance;
};

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh();
  const [totalSupply, setTotalSupply] = useState<BigNumber>();

  useEffect(() => {
    async function fetchTotalSupply() {
      const cakeContract = getCakeContract();
      const supply = await cakeContract.methods.totalSupply().call();
      setTotalSupply(new BigNumber(supply));
    }

    fetchTotalSupply();
  }, [slowRefresh]);

  return totalSupply;
};

export const useBurnedBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0));
  const { slowRefresh } = useRefresh();
  const web3 = useWeb3();

  useEffect(() => {
    const fetchBalance = async () => {
      const contract = getBep20Contract(tokenAddress, web3);
      const res = await contract.methods
        .balanceOf("0x000000000000000000000000000000000000dEaD")
        .call();
      setBalance(new BigNumber(res));
    };

    fetchBalance();
  }, [web3, tokenAddress, slowRefresh]);

  return balance;
};

export default useTokenBalance;
