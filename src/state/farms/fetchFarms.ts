import BigNumber from "bignumber.js";
import erc20 from "config/abi/erc20.json";
import farmABI from "config/abi/farm.json";
import multicall from "utils/multicall";
import { getAddress, getFarmAddress } from "utils/addressHelpers";
import farmsConfig from "config/constants/farms";
import axios from "axios";

const fetchFarms = async () => {
  const wmaticPrice = await axios.get(
    `https://api.coingecko.com/api/v3/coins/wmatic`
  );
  const wethPrice = await axios.get(
    `https://api.coingecko.com/api/v3/coins/weth`
  );
  const data = await Promise.all(
    farmsConfig.map(async (farmConfig) => {
      const lpAdress = getAddress(farmConfig.lpAddresses);
      const calls = [
        // Balance of non quote token in the LP contract
        {
          address: getAddress(farmConfig.tokenAddresses),
          name: "balanceOf",
          params: [lpAdress],
        },
        // Balance of quote token on LP contract
        {
          address: getAddress(farmConfig.quoteTokenAdresses),
          name: "balanceOf",
          params: [lpAdress],
        },
        // Total supply of LP tokens
        {
          address: lpAdress,
          name: "totalSupply",
        },
        // Token decimals
        {
          address: getAddress(farmConfig.tokenAddresses),
          name: "decimals",
        },
        // Quote token decimals
        {
          address: getAddress(farmConfig.quoteTokenAdresses),
          name: "decimals",
        },
        {
          address: getAddress(farmConfig.singleSidedToken),
          name: "decimals",
        },
        {
          address: getAddress(farmConfig.singleSidedToToken),
          name: "decimals",
        },
        {
          address: getAddress(farmConfig.lpAddresses),
          name: "decimals",
        },
      ];

      const [
        balanceOfNonQuoteTokenInLp,
        balanceOfQuoteTokenInLp,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals,
        singleSidedTokenDecimal,
        singleSidedToTokenDecimal,
        lpDecimals,
      ] = await multicall(erc20, calls);

      const [info, totalAllocPoint, lpTokenBalanceMC] = await multicall(
        farmABI,
        [
          {
            address: getFarmAddress(),
            name: "poolInfo",
            params: [farmConfig.pid],
          },
          {
            address: getFarmAddress(),
            name: "totalAllocPoint",
          },
          // Balance of LP tokens in the master chef contract
          {
            address: getFarmAddress(),
            name: "getLpTokenAmount",
            params: [farmConfig.pid],
          },
        ]
      );

      let priceOfQuoteToken = new BigNumber(0);
      if (farmConfig.quoteTokenCoinGeckoId === "wmatic")
        priceOfQuoteToken = new BigNumber(
          wmaticPrice.data.market_data.current_price.usd.toString()
        );
      else if (
        farmConfig.quoteTokenCoinGeckoId === "ethereum" ||
        farmConfig.quoteTokenCoinGeckoId === "weth"
      )
        priceOfQuoteToken = new BigNumber(
          wethPrice.data.market_data.current_price.usd.toString()
        );
      else if (
        farmConfig.quoteTokenCoinGeckoId === "usd-coin" ||
        farmConfig.quoteTokenCoinGeckoId === "dai" ||
        farmConfig.quoteTokenCoinGeckoId === "tether"
      )
        priceOfQuoteToken = new BigNumber(1);
      else {
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${farmConfig.quoteTokenCoinGeckoId}`
        );
        priceOfQuoteToken = new BigNumber(
          res.data.market_data.current_price.usd.toString()
        );
      }

      const allocPoint = new BigNumber(info.allocPoint._hex);
      const poolHarvestInterval = new BigNumber(info.harvestInterval._hex);

      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint));

      const lpDecimalsLocal = new BigNumber(lpDecimals);

      const singleSidedTokenDecimalLocal = new BigNumber(
        singleSidedTokenDecimal
      );
      const singleSidedToTokenDecimalLocal = new BigNumber(
        singleSidedToTokenDecimal
      );
      const lpInMasterChef = new BigNumber(lpTokenBalanceMC);

      // Ratio in % a LP tokens that are in staking, vs the total number in circulation
      const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(
        new BigNumber(lpTotalSupply)
      );

      // Total value in staking in quote token value
      const lpTotalInQuoteToken = new BigNumber(balanceOfQuoteTokenInLp)
        .div(new BigNumber(10).pow(quoteTokenDecimals))
        .times(new BigNumber(2))
        .times(lpTokenRatio);

      // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
      const nonQuoteTokenAmount = new BigNumber(balanceOfNonQuoteTokenInLp)
        .div(new BigNumber(10).pow(tokenDecimals))
        .times(lpTokenRatio);
      const quoteTokenAmount = new BigNumber(balanceOfQuoteTokenInLp)
        .div(new BigNumber(10).pow(quoteTokenDecimals))
        .times(lpTokenRatio);

      return {
        ...farmConfig,
        tokenAmount: nonQuoteTokenAmount.toJSON(),
        quoteTokenAmount: quoteTokenAmount.toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: quoteTokenAmount.div(nonQuoteTokenAmount).toJSON(),
        quoteTokenCoinGeckoPrice: priceOfQuoteToken.toJSON(),
        poolWeight: poolWeight.toJSON(),
        multiplier: `${allocPoint
          .div(totalAllocPoint)
          .multipliedBy(100)
          .toFixed(2)
          .toString()}X`,
        poolHarvestInterval: poolHarvestInterval.toString(),
        lpTotalSupplyInMasterchef: lpInMasterChef.toJSON(),
        singleSidedTokenDecimal: singleSidedTokenDecimalLocal.toJSON(),
        singleSidedToTokenDecimal: singleSidedToTokenDecimalLocal.toJSON(),
        lpDecimals: lpDecimalsLocal.toJSON(),
      };
    })
  );
  return data;
};

export default fetchFarms;
