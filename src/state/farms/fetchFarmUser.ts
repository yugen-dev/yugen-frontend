import BigNumber from "bignumber.js";
import erc20ABI from "config/abi/erc20.json";
import farmABI from "config/abi/farm.json";
import multicall from "utils/multicall";
import farmsConfig from "config/constants/farms";
import { getAddress, getFarmAddress } from "utils/addressHelpers";

export const fetchFarmUserAllowances = async (account: string) => {
  const masterChefAdress = getFarmAddress();

  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses);
    return {
      address: lpContractAddress,
      name: "allowance",
      params: [account, masterChefAdress],
    };
  });

  const rawLpAllowances = await multicall(erc20ABI, calls);
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON();
  });
  return parsedLpAllowances;
};

export const fetchFarmUserTokenBalances = async (account: string) => {
  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = getAddress(farm.lpAddresses);
    return {
      address: lpContractAddress,
      name: "balanceOf",
      params: [account],
    };
  });

  const rawTokenBalances = await multicall(erc20ABI, calls);
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON();
  });
  return parsedTokenBalances;
};

export const fetchFarmUserStakedBalances = async (account: string) => {
  const masterChefAdress = getFarmAddress();

  const calls = farmsConfig.map((farm) => {
    return {
      address: masterChefAdress,
      name: "userInfo",
      params: [farm.pid, account],
    };
  });

  const rawStakedBalances = await multicall(farmABI, calls);
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON();
  });
  return parsedStakedBalances;
};

export const fetchFarmUserEarnings = async (account: string) => {
  const masterChefAdress = getFarmAddress();

  const calls = farmsConfig.map((farm) => {
    return {
      address: masterChefAdress,
      name: "pendingCNT",
      params: [farm.pid, account],
    };
  });

  const rawEarnings = await multicall(farmABI, calls);
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON();
  });
  return parsedEarnings;
};

export const fetchFarmUserCanHarvestPendingReward = async (account: string) => {
  const masterChefAdress = getFarmAddress();

  const calls = farmsConfig.map((farm) => {
    return {
      address: masterChefAdress,
      name: "canHarvest",
      params: [farm.pid, account],
    };
  });

  const rawCanHarvest = await multicall(farmABI, calls);
  const parsedRawCanHarvest = rawCanHarvest.map((canHarvestReward) => {
    return canHarvestReward[0];
  });
  return parsedRawCanHarvest;
};

export const fetchFarmUserHarvestInterval = async (account: string) => {
  const masterChefAdress = getFarmAddress();

  const calls = farmsConfig.map((farm) => {
    return {
      address: masterChefAdress,
      name: "getHarvestUntil",
      params: [farm.pid, account],
    };
  });

  const rawHarvestInterval = await multicall(farmABI, calls);
  const parsedRawHarvestInterval = rawHarvestInterval.map(
    (HarvestIntervalReward) => {
      return new BigNumber(HarvestIntervalReward[0]._hex).toJSON();
    }
  );
  return parsedRawHarvestInterval;
};
