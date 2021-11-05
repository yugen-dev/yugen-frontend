import BigNumber from "bignumber.js";
import erc20 from "config/abi/erc20.json";
import multicall from "utils/multicall";
import { getAddress } from "utils/addressHelpers";
import vaultsConfig from "config/constants/vaults";
import { VaultConfig } from "config/constants/types";
import { fetchPrice } from "state/hooks";

const fetchVaults = async () => {
  const data = await Promise.all(
    vaultsConfig.map(async (vaultConfig: VaultConfig) => {
      const lpAddress = getAddress(vaultConfig.lpTokenAddress);
      const lpFarmAddress = getAddress(vaultConfig.lpTokenFarmAddress);

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
        {
          address: lpAddress,
          name: "balanceOf",
          params: [lpFarmAddress],
        },
      ];

      const [
        balanceOfNonQuoteToken,
        balanceOfQuoteToken,
        lpTotalSupply,
        nonQuoteTokenDecimals,
        quoteTokenDecimals,
        lpTokenBalanceMC,
      ] = await multicall(erc20, calls);

      const lpTokenBalanceInMC = lpTokenBalanceMC;

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

      // fetch price of underlying token from coin gecko here... & calculate APR
      let priceOfRewardToken = new BigNumber(1);
      if (vaultConfig.rewardTokenCoinGecko === "YGN")
        priceOfRewardToken = new BigNumber(1.2);
      else
        priceOfRewardToken = await fetchPrice(vaultConfig.rewardTokenCoinGecko);

      let priceOfQuoteToken = new BigNumber(1);
      priceOfQuoteToken = await fetchPrice(vaultConfig.quoteTokenCoinGecko);

      let priceOfNonQuoteToken = new BigNumber(1);
      priceOfNonQuoteToken = await fetchPrice(
        vaultConfig.nonQuoteTokenCoinGecko
      );

      return {
        ...vaultConfig,
        nonQuoteTokenAmount: nonQuotetokenAmount.toJSON(),
        quoteTokenAmount: quoteTokenAmount.toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        nonQuoteVsQuote: quoteTokenAmount.div(nonQuotetokenAmount).toJSON(),
        priceOfRewardToken: priceOfRewardToken.toJSON(),
        priceOfQuoteToken: priceOfQuoteToken.toJSON(),
        priceOfNonQuoteToken: priceOfNonQuoteToken.toJSON(),
        totalLPTokensStakedInFarms: lpTokenBalanceInMCInBN.toJSON(),
      };
    })
  );
  return data;
};

export default fetchVaults;
