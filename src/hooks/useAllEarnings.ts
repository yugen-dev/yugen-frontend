import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import multicall from "utils/multicall";
import { getHybridStakingContract } from "utils/contractHelpers";
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
      const poolsWithEnd = poolsConfig.filter((p) => p.sousId !== 0);
      // eslint-disable-next-line array-callback-return
      poolsWithEnd.map((pool) => {
        if (pool.multiReward.indexOf("CNT") > -1) {
          poolCalls.push({
            address: getAddress(pool.contractAddress),
            name: "pendingReward",
            params: [account, pool.multiReward.indexOf("CNT")],
          });
        }
      });

      const res = await multicall(farmABI, calls);
      const resPools = await multicall(sousChefABI, poolCalls);
      const contract = getHybridStakingContract();
      const pendingRewardHybridStaking = await contract.methods
        .pendingCNT("0", account)
        .call();

      const response = res.concat(resPools).concat(pendingRewardHybridStaking);
      setBalance(response);
    };

    if (account) {
      fetchAllBalances();
    }
  }, [account, fastRefresh]);

  return balances;
};

export default useAllEarnings;
