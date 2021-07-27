import poolsConfig from "config/constants/pools";
import sousChefABI from "config/abi/sousChef.json";
import wbnbABI from "config/abi/weth.json";
import { QuoteToken } from "config/constants/types";
import erc20 from "config/abi/erc20.json";
import multicall from "utils/multicall";
import { getAddress, getWbnbAddress } from "utils/addressHelpers";
import BigNumber from "bignumber.js";

export const fetchPoolsBlockLimits = async () => {
  const poolsWithEnd = poolsConfig;

  const callsFarmInfo = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: "farmInfo",
    };
  });

  const starts = await multicall(sousChefABI, callsFarmInfo);
  const ends = await multicall(sousChefABI, callsFarmInfo);

  return poolsWithEnd.map((cakePoolConfig, index) => {
    const startBlock = starts[index].startBlock._hex;
    const endBlock = ends[index].endBlock._hex;
    const poolHarvestIntervall = starts[index].harvestInterval._hex;
    const poolwithdrawalFeeBP = starts[index].withdrawalFeeBP;

    return {
      sousId: cakePoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: new BigNumber(endBlock).toJSON(),
      poolHarvestInterval: new BigNumber(poolHarvestIntervall).toJSON(),
      poolwithdrawalFeeBP: new BigNumber(poolwithdrawalFeeBP).toJSON(),
    };
  });
};

export const fetchPoolsHarvestInterval = async () => {
  const poolsWithEnd = poolsConfig;

  const callsFarmInfo = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: "farmInfo",
    };
  });

  const starts = await multicall(sousChefABI, callsFarmInfo);

  return poolsWithEnd.map((cakePoolConfig, index) => {
    const poolHarvestIntervall = starts[index].harvestInterval._hex;
    return {
      sousId: cakePoolConfig.sousId,
      poolHarvestInterval: new BigNumber(poolHarvestIntervall).toJSON(),
    };
  });
};

export const fetchPoolsTotalStatking = async () => {
  const nonBnbPools = poolsConfig.filter(
    (p) => p.stakingTokenName !== QuoteToken.BNB
  );
  const bnbPool = poolsConfig.filter(
    (p) => p.stakingTokenName === QuoteToken.BNB
  );

  const callsNonBnbPools = nonBnbPools.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: "totalInputTokensStaked",
    };
  });

  const callsBnbPools = bnbPool.map((poolConfig) => {
    return {
      address: getWbnbAddress(),
      name: "balanceOf",
      params: [getAddress(poolConfig.contractAddress)],
    };
  });

  const nonBnbPoolsTotalStaked = await multicall(sousChefABI, callsNonBnbPools);
  const bnbPoolsTotalStaked = await multicall(wbnbABI, callsBnbPools);

  return [
    ...nonBnbPools.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(nonBnbPoolsTotalStaked[index]).toJSON(),
    })),
    ...bnbPool.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: new BigNumber(bnbPoolsTotalStaked[index]).toJSON(),
    })),
  ];
};

export const fetchPoolsLpData = async () => {
  const nonBnbPools = poolsConfig.filter(
    (p) => p.stakingTokenName !== QuoteToken.BNB
  );

  const data = await Promise.all(
    nonBnbPools.map(async (farmConfig) => {
      const lpAdress = farmConfig.stakingTokenAddress;
      const calls = [
        // Balance of token in the LP contract
        {
          address: farmConfig.tokenAdressInLp,
          name: "balanceOf",
          params: [lpAdress],
        },
        // Balance of quote token on LP contract
        {
          address: farmConfig.tokenAdressInLp,
          name: "balanceOf",
          params: [lpAdress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: lpAdress,
          name: "balanceOf",
          params: [getAddress(farmConfig.contractAddress)],
        },
        // Total supply of LP tokens
        {
          address: lpAdress,
          name: "totalSupply",
        },
        // Token decimals
        {
          address: farmConfig.tokenAdressInLp,
          name: "decimals",
        },
        // Quote token decimals
        {
          address: farmConfig.tokenAdressInLp,
          name: "decimals",
        },
      ];

      const [
        tokenBalanceLP,
        quoteTokenBlanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals,
      ] = await multicall(erc20, calls);
      // console.log({
      //   tokenBalanceLP: tokenBalanceLP.toString(),
      //   quoteTokenBlanceLP: quoteTokenBlanceLP.toString(),
      //   lpTokenBalanceMC: lpTokenBalanceMC.toString(),
      //   lpTotalSupply: lpTotalSupply.toString(),
      //   tokenDecimals: tokenDecimals.toString(),
      //   quoteTokenDecimals: quoteTokenDecimals.toString(),
      // });
      // Ratio in % a LP tokens that are in staking, vs the total number in circulation
      const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(
        new BigNumber(lpTotalSupply)
      );

      // Total value in staking in quote token value
      const lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
        .div(new BigNumber(10).pow(18))
        .times(new BigNumber(2))
        .times(lpTokenRatio);

      // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
      const tokenAmount = new BigNumber(tokenBalanceLP)
        .div(new BigNumber(10).pow(tokenDecimals))
        .times(lpTokenRatio);
      const quoteTokenAmount = new BigNumber(quoteTokenBlanceLP)
        .div(new BigNumber(10).pow(quoteTokenDecimals))
        .times(lpTokenRatio);

      return {
        ...farmConfig,
        tokenAmount: tokenAmount.toJSON(),
        quoteTokenAmount: quoteTokenAmount.toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: quoteTokenAmount.div(tokenAmount).toJSON(),
      };
    })
  );

  return data;
};
