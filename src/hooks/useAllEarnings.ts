import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import multicall from "utils/multicall";
import { getFarmAddress } from "utils/addressHelpers";
import farmABI from "config/abi/farm.json";
import { farmsConfig } from "config/constants";
import useRefresh from "./useRefresh";

const useAllEarnings = () => {
  const [balances, setBalance] = useState([]);
  const { account } = useWeb3React("web3");
  const { fastRefresh } = useRefresh();

  useEffect(() => {
    const fetchAllBalances = async () => {
      const calls = farmsConfig.map((farm) => ({
        address: getFarmAddress(),
        name: "pendingCNT",
        params: [farm.pid, account],
      }));

      const res = await multicall(farmABI, calls);

      setBalance(res);
    };

    if (account) {
      fetchAllBalances();
    }
  }, [account, fastRefresh]);

  return balances;
};

export default useAllEarnings;
