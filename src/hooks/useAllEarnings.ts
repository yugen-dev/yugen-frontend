import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import multicall from "utils/multicall";
import { getFarmAddress, getAddress } from "utils/addressHelpers";
import farmABI from "config/abi/farm.json";
import sousChefABI from "config/abi/sousChef.json";
import { farmsConfig, poolsConfig } from "config/constants";
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
      const poolCalls = [];
      // eslint-disable-next-line array-callback-return
      poolsConfig.map(function (pool) {
        if (pool.multiReward.indexOf("CNT") > -1) {
          console.log(pool.multiReward.indexOf("CNT"));
          console.log("hello");
          poolCalls.push({
            address: getAddress(pool.contractAddress),
            name: "pendingReward",
            params: [account, pool.multiReward.indexOf("CNT")],
          });
        }
      });

      const res = await multicall(farmABI, calls);
      console.log(calls);
      console.log(poolCalls);
      const resPools = await multicall(sousChefABI, poolCalls);
      const response = res.concat(resPools);
      setBalance(response);
    };

    if (account) {
      fetchAllBalances();
    }
  }, [account, fastRefresh]);

  return balances;
};

export default useAllEarnings;
