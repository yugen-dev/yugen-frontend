import poolsConfig from "config/constants/pools";
import sousChefABI from "config/abi/sousChef.json";
import sousChefABIDeposit from "config/abi/sousChefDepost.json";
import wbnbABI from "config/abi/weth.json";
import { QuoteToken } from "config/constants/types";
import erc20 from "config/abi/erc20.json";
import multicall from "utils/multicall";
import { getAddress, getWbnbAddress } from "utils/addressHelpers";
import BigNumber from "bignumber.js";
import { getHybridStakingContract } from "utils/contractHelpers";

export const fetchPoolsBlockLimits = async () => {
  const poolsWithEnd = poolsConfig.filter((p) => p.sousId !== 0);

  const poolsWithEndDepositFee = poolsConfig.filter(
    (p) => p.sousId !== 0 && p.sousId >= 8
  );

  // eslint-disable-next-line array-callback-return
  const callsFarmInfo = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: "farmInfo",
    };
  });

  const starts = await multicall(sousChefABI, callsFarmInfo);
  const ends = await multicall(sousChefABI, callsFarmInfo);

  const callsFarmWithDepsoitInfo = poolsWithEndDepositFee.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: "farmInfo",
    };
  });

  const startWithDepostiFee = await multicall(
    sousChefABIDeposit,
    callsFarmWithDepsoitInfo
  );
  // const endsWithDepostiFee = await multicall(sousChefABIDeposit, callsFarmWithDepsoitInfo);

  const contract = getHybridStakingContract();

  const interactionInterval = await contract.methods
    .interactionInterval()
    .call();
  const withdrawalCNTfee = await contract.methods.withdrawalFee().call();

  return poolsConfig.map((cakePoolConfig, index) => {
    if (cakePoolConfig.sousId === 0) {
      return {
        sousId: cakePoolConfig.sousId,
        startBlock: new BigNumber("0").toJSON(),
        endBlock: new BigNumber("0").toJSON(),
        poolHarvestInterval: new BigNumber(interactionInterval).toJSON(),
        poolwithdrawalFeeBP: new BigNumber(withdrawalCNTfee).toJSON(),
      };
      // eslint-disable-next-line no-else-return
    }

    const startBlock = starts[index - 1].startBlock._hex;
    const endBlock = ends[index - 1].endBlock._hex;
    const poolHarvestIntervall = starts[index - 1].harvestInterval._hex;
    const poolwithdrawalFeeBP = starts[index - 1].withdrawalFeeBP;
    let depositFee = 0;

    if (cakePoolConfig.sousId >= 8) {
      depositFee = startWithDepostiFee[index - 1 - 7].depositFeeBP;
    }

    return {
      sousId: cakePoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: new BigNumber(endBlock).toJSON(),
      poolHarvestInterval: new BigNumber(poolHarvestIntervall).toJSON(),
      poolwithdrawalFeeBP: new BigNumber(poolwithdrawalFeeBP).toJSON(),
      pooldepositFeeBP: new BigNumber(depositFee).toJSON(),
    };
  });
};

export const fetchPoolsTotalStatking = async () => {
  const poolsWithEnd = poolsConfig.filter((p) => p.sousId !== 0);

  const nonBnbPools = poolsWithEnd.filter(
    (p) => p.stakingTokenName !== QuoteToken.BNB
  );
  const bnbPool = poolsWithEnd.filter(
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

  const contract = getHybridStakingContract();
  const totalCNTStaked = await contract.methods.totalCNTStaked().call();

  return [
    {
      sousId: 0,
      totalStaked: new BigNumber(totalCNTStaked).toJSON(),
    },
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
        {
          address: farmConfig.tokenAddressSecondInLp,
          name: "balanceOf",
          params: [lpAdress],
        },
        {
          address: farmConfig.tokenAddressSecondInLp,
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
        secondTokenInLpBalance,
        secondTokenInLpDecimal,
      ] = await multicall(erc20, calls);
      // console.log({
      //   tokenBalanceLP: tokenBalanceLP.toString(),
      //   quoteTokenBlanceLP: quoteTokenBlanceLP.toString(),
      //   lpTokenBalanceMC: lpTokenBalanceMC.toString(),
      //   lpTotalSupply: lpTotalSupply.toString(),
      //   tokenDecimals: tokenDecimals.toString(),
      //   quoteTokenDecimals: quoteTokenDecimals.toString(),
      //   secondTokenInLpBalance : secondTokenInLpBalance.toString(),
      //   secondTokenInLpDecimal:secondTokenInLpDecimal.toString()
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
      const quoteTokenSecondAmount = new BigNumber(secondTokenInLpBalance)
        .div(new BigNumber(10).pow(secondTokenInLpDecimal))
        .times(lpTokenRatio);
      const quoteTokeFirstAmount = new BigNumber(quoteTokenBlanceLP)
        .div(new BigNumber(10).pow(quoteTokenDecimals))
        .times(lpTokenRatio);
      return {
        ...farmConfig,
        tokenAmount: tokenAmount.toJSON(),
        quoteTokenAmount: quoteTokenAmount.toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        quoteTokenSecondAmount: quoteTokenSecondAmount.toJSON(),
        quoteTokeFirstAmount: quoteTokeFirstAmount.toJSON(),
        tokenPriceVsQuote: quoteTokenAmount.div(tokenAmount).toJSON(),
      };
    })
  );

  return data;
};
