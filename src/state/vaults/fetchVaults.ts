import BigNumber from "bignumber.js";
import erc20 from "config/abi/erc20.json";
import farmABI from "config/abi/farm.json";
import vaultStratergyABI from "config/abi/vaultStratergy.json";
import multicall from "utils/multicall";
import { getAddress, getFarmAddress } from "utils/addressHelpers";
import vaultsConfig from "config/constants/vaults";
import { VaultConfig } from "config/constants/types";

const fetchVaults = async () => {
  const data = await Promise.all(
    vaultsConfig.map(async (vaultConfig: VaultConfig) => {
      const lpAddress = getAddress(vaultConfig.lpTokenAddress);
      const stratergyAddress = getAddress(vaultConfig.strategyAddress);

      const calls = [
        // Balance of non-quote token in the LP contract
        {
          address: getAddress(vaultConfig.nonQuoteTokenAddress),
          name: "balanceOf",
          params: [lpAddress],
        },
        // Balance of quote token on LP contract
        {
          address: getAddress(vaultConfig.quoteTokenAddress),
          name: "balanceOf",
          params: [lpAddress],
        },
        // Total supply of LP tokens
        {
          address: lpAddress,
          name: "totalSupply",
        },
        // non-quote token decimals
        {
          address: getAddress(vaultConfig.nonQuoteTokenAddress),
          name: "decimals",
        },
        // quote token decimals
        {
          address: getAddress(vaultConfig.quoteTokenAddress),
          name: "decimals",
        },
      ];

      const [
        balanceOfNonQuoteToken,
        balanceOfQuoteToken,
        lpTotalSupply,
        nonQuoteTokenDecimals,
        quoteTokenDecimals,
      ] = await multicall(erc20, calls);

      const [info, totalAllocPoint] = await multicall(farmABI, [
        {
          address: getFarmAddress(),
          name: "poolInfo",
          params: [vaultConfig.farmpid],
        },
        {
          address: getFarmAddress(),
          name: "totalAllocPoint",
        },
      ]);

      const [lpTokenBalanceInMC] = await multicall(vaultStratergyABI, [
        // Balance of LP tokens in the master chef contract
        {
          address: stratergyAddress,
          name: "wantLockedTotal",
        },
      ]);

      const allocPoint = new BigNumber(info.allocPoint._hex);
      // const poolHarvestInterval = new BigNumber(info.harvestInterval._hex);

      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint));

      // Ratio in % a LP tokens that are in staking, vs the total number in circulation
      const lpTokenRatio = new BigNumber(lpTokenBalanceInMC).div(
        new BigNumber(lpTotalSupply)
      );

      // Total value in staking in quote token value
      const lpTotalInQuoteToken = new BigNumber(balanceOfQuoteToken)
        .div(new BigNumber(10).pow(18))
        .times(new BigNumber(2))
        .times(lpTokenRatio);

      const lpTokenBalanceInMCInBN = new BigNumber(
        lpTokenBalanceInMC
      ).dividedBy(new BigNumber(10).pow(18));

      // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
      const nonQuotetokenAmount = new BigNumber(balanceOfNonQuoteToken)
        .div(new BigNumber(10).pow(nonQuoteTokenDecimals))
        .times(lpTokenRatio);

      const quoteTokenAmount = new BigNumber(balanceOfQuoteToken)
        .div(new BigNumber(10).pow(quoteTokenDecimals))
        .times(lpTokenRatio);

      return {
        ...vaultConfig,
        nonQuoteTokenAmount: nonQuotetokenAmount.toJSON(),
        quoteTokenAmount: quoteTokenAmount.toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        nonQuoteVsQuote: quoteTokenAmount.div(nonQuotetokenAmount).toJSON(),
        poolWeight: poolWeight.toJSON(),
        multiplier: `${allocPoint
          .div(totalAllocPoint)
          .multipliedBy(100)
          .toFixed(2)
          .toString()}X`,
        // poolHarvestInterval: poolHarvestInterval.toString(),
        totalLPTokensStakedInFarms: lpTokenBalanceInMCInBN.toJSON(),
      };
    })
  );
  return data;
};

export default fetchVaults;
