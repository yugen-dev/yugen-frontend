import { useEffect, useState } from "react";
// import { Web3Provider } from '@ethersproject/providers'
import BigNumber from "bignumber.js";
import { useWeb3React } from "@web3-react/core";
import { getERC20Contract, getCakeContract } from "utils/contractHelpers";
import useWeb3 from "./useWeb3";
import useRefresh from "./useRefresh";

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(new BigNumber(0));
  const { account } = useWeb3React("web3");
  const web3 = useWeb3();

  const { fastRefresh } = useRefresh();

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const contract = getERC20Contract(tokenAddress, web3);
        const res = await contract.methods.balanceOf(account).call();
        setBalance(new BigNumber(res));
      } catch (error) {
        console.error({ error });
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
      const contract = getERC20Contract(tokenAddress, web3);
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
