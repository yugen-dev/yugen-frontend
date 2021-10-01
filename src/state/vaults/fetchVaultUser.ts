import BigNumber from "bignumber.js";
import erc20ABI from "config/abi/erc20.json";
import vaultABI from "config/abi/vault.json";
import multicall from "utils/multicall";
import vaultsConfig from "config/constants/vaults";
import { getAddress } from "utils/addressHelpers";

export const fetchVaultUserAllowances = async (account: string) => {
  const calls = vaultsConfig.map((vault) => {
    const lpAddress = getAddress(vault.lpTokenAddress);
    const vaultAddress = getAddress(vault.vaultAddress);
    return {
      address: lpAddress,
      name: "allowance",
      params: [account, vaultAddress],
    };
  });

  const rawLpAllowances = await multicall(erc20ABI, calls);
  const parsedLpAllowances = rawLpAllowances.map((lpAllowance) => {
    return new BigNumber(lpAllowance).toJSON();
  });
  return parsedLpAllowances;
};

export const fetchVaultLpBalances = async (account: string) => {
  const calls = vaultsConfig.map((vault) => {
    const lpAddress = getAddress(vault.lpTokenAddress);
    return {
      address: lpAddress,
      name: "balanceOf",
      params: [account],
    };
  });

  const rawLpBalances = await multicall(erc20ABI, calls);
  const parsedLpBalances = rawLpBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON();
  });
  return parsedLpBalances;
};

export const fetchVaultFirstLpTokenBalance = async (account: string) => {
  const calls = vaultsConfig.map((vault) => {
    const lpTokenPart1Address = getAddress(vault.lpTokenPart1Address);
    return {
      address: lpTokenPart1Address,
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

export const fetchVaultSecondLpTokenBalance = async (account: string) => {
  const calls = vaultsConfig.map((vault) => {
    const lpTokenPart2Address = getAddress(vault.lpTokenPart2Address);
    return {
      address: lpTokenPart2Address,
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

export const fetchVaultUserStakedBalances = async (account: string) => {
  const calls = vaultsConfig.map((vault) => {
    const vaultAddress = getAddress(vault.vaultAddress);
    return {
      address: vaultAddress,
      name: "stakedWantTokens",
      params: [vault.pid, account],
    };
  });

  const rawStakedBalances = await multicall(vaultABI, calls);
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON();
  });
  return parsedStakedBalances;
};
