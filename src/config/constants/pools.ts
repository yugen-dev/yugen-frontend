import { PoolConfig, QuoteToken, PoolCategory } from "./types";

const pools: PoolConfig[] = [
  {
    sousId: 0,
    tokenName: "CNT",
    tokenAdressInLp: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF",
    tokenAddressSecondInLp: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF",
    tokenAddress: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
    stakingTokenName: QuoteToken.CNT,
    quoteTokenSymbol: QuoteToken.CNT,
    stakingTokenAddress: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // lp
    contractAddress: {
      97: "",
      56: "",
      80001: "0x718Fa9fA91f4bFF9B57f660D46B53ed39d300731",
      137: "0xDC5A8F4D53E6fFb1F5E356f64577702AF9348d7d", // staking pool cnt
    },
    poolCategory: PoolCategory.COMMUNITY,
    projectLink: "https://cryption.network/",
    multiReward: ["CNT"],
    stakingTokenCoinGeckoid: "CNT",
    rewardTokenCoinGeckoid: "CNT",
    coinGeckoIds: [
      "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
      // "0xeDd6cA8A4202d4a36611e2fff109648c4863ae19", // cnt
    ],
    TopImage:
      "https://cryption-network.s3.us-east-2.amazonaws.com/Globe+Gradient.png",
    multiRewardTokenPerBlock: ["0.05"],
    harvest: true,
    tokenPerBlock: "0.05",
    sortOrder: 999,
    isFinished: false,
    tokenDecimals: 18,
    metamaskImg:
      "https://cryption-network.s3.us-east-2.amazonaws.com/Globe+Gradient.png",
  },
  {
    sousId: 1,
    tokenName: "MAHA-CNT",
    tokenAdressInLp: "0xeDd6cA8A4202d4a36611e2fff109648c4863ae19",
    tokenAddressSecondInLp: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
    tokenAddress: "0x577aa7cAcBAd94cC0cC12a17209570a1D06bda3A", // maha
    stakingTokenName: QuoteToken.LP,
    quoteTokenSymbol: QuoteToken.MAHA,
    stakingTokenAddress: "0x577aa7cAcBAd94cC0cC12a17209570a1D06bda3A", // lp
    contractAddress: {
      97: "",
      56: "",
      80001: "0x718Fa9fA91f4bFF9B57f660D46B53ed39d300731",
      137: "0x0Bc444600eFA4349073Ac97e08e28231CD04bFb5", // staking pool cnt-maha
    },
    poolCategory: PoolCategory.CORE,
    projectLink: "https://cryption.network/",
    multiReward: ["CNT", "MAHA"],
    stakingTokenCoinGeckoid: "MahaDAO",
    rewardTokenCoinGeckoid: "",
    coinGeckoIds: [
      "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
      "0xeDd6cA8A4202d4a36611e2fff109648c4863ae19", // maha
    ],
    multiRewardTokenPerBlock: ["0.235000000000", "0.003289473684"],
    harvest: true,
    tokenPerBlock: "1",
    sortOrder: 999,
    isFinished: true,
    tokenDecimals: 18,
    TopImage:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/maha-cnt.png",
    metamaskImg:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/maha-cnt.png",
  },
  // 0xC20eaCe3c439915eEeB869722e1c9FC583C857E4
  // reward token 0xc8bcb58caEf1bE972C0B638B1dD8B0748Fdc8A44
  // input token 0xD1e6354fb05bF72A8909266203dAb80947dcEccF
  {
    sousId: 2,
    tokenName: "CNT",
    tokenAdressInLp: "0xc8bcb58caEf1bE972C0B638B1dD8B0748Fdc8A44",
    tokenAddress: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // maha
    tokenAddressSecondInLp: "0xE52509181FEb30EB4979E29EC70D50FD5C44D590", // arth
    stakingTokenName: QuoteToken.CNT,
    quoteTokenSymbol: QuoteToken.CNT,
    stakingTokenAddress: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // lp
    contractAddress: {
      97: "",
      56: "",
      80001: "0x718Fa9fA91f4bFF9B57f660D46B53ed39d300731",
      137: "0xC20eaCe3c439915eEeB869722e1c9FC583C857E4", // staking pool cnt-maha
    },
    poolCategory: PoolCategory.COMMUNITY,
    projectLink: "https://app.pearzap.com/",
    multiReward: ["PEAR"],
    stakingTokenCoinGeckoid: "CNT",
    rewardTokenCoinGeckoid: "pear",
    coinGeckoIds: [
      "0xc8bcb58caEf1bE972C0B638B1dD8B0748Fdc8A44", // pearl
      // "0xeDd6cA8A4202d4a36611e2fff109648c4863ae19", // maha
    ],
    TopImage:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10232.png",
    multiRewardTokenPerBlock: ["0.0046491228"],
    harvest: true,
    tokenPerBlock: "0.0046491228",
    sortOrder: 999,
    isFinished: false,
    tokenDecimals: 18,
    metamaskImg:
      "https://assets.coingecko.com/coins/images/17173/small/pear200.png?1626793002",
  },
  {
    sousId: 3,
    tokenName: "CNT-ARTH",
    tokenAdressInLp: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
    tokenAddressSecondInLp: "0xE52509181FEb30EB4979E29EC70D50FD5C44D590", // arth
    tokenAddress: "0x9fDe8873DEe5f221023BFEb7b42d503EBCDdcDbD", //  lp
    stakingTokenName: QuoteToken.LP,
    quoteTokenSymbol: QuoteToken.MAHA,
    stakingTokenAddress: "0x9fDe8873DEe5f221023BFEb7b42d503EBCDdcDbD", // lp
    contractAddress: {
      97: "",
      56: "",
      80001: "0x718Fa9fA91f4bFF9B57f660D46B53ed39d300731",
      137: "0xE9836901A02574D2203A42c73EF29Da328cd93b5", // staking pool arth-cnt
    },
    poolCategory: PoolCategory.CORE,
    projectLink: "https://cryption.network/",
    multiReward: ["CNT", "MAHA"],
    stakingTokenCoinGeckoid: "MahaDAO",
    rewardTokenCoinGeckoid: "",
    coinGeckoIds: [
      "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
      "0xeDd6cA8A4202d4a36611e2fff109648c4863ae19", // maha
    ],
    multiRewardTokenPerBlock: ["0.15", "0.005"],
    harvest: true,
    tokenPerBlock: "1",
    sortOrder: 999,
    isFinished: false,
    tokenDecimals: 18,
    TopImage:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/maha-cnt.png",
    metamaskImg:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/maha-cnt.png",
  },
  {
    sousId: 4,
    tokenName: "MAHA-ARTH",
    tokenAdressInLp: "0xeDd6cA8A4202d4a36611e2fff109648c4863ae19", // maha,
    tokenAddressSecondInLp: "0xE52509181FEb30EB4979E29EC70D50FD5C44D590", // arth
    tokenAddress: "0x881a4c22a1aC1544b40C2AF1d12e4bBC49593a30", //  lp
    stakingTokenName: QuoteToken.LP,
    quoteTokenSymbol: QuoteToken.MAHA,
    stakingTokenAddress: "0x881a4c22a1aC1544b40C2AF1d12e4bBC49593a30", // lp
    contractAddress: {
      97: "",
      56: "",
      80001: "0x718Fa9fA91f4bFF9B57f660D46B53ed39d300731",
      137: "0x85f1Ab8E6e83C39F65256c8F89d55f6e8AF22f3f", // staking pool arth-maha
    },
    poolCategory: PoolCategory.CORE,
    projectLink: "https://cryption.network/",
    multiReward: ["CNT", "MAHA"],
    stakingTokenCoinGeckoid: "MahaDAO",
    rewardTokenCoinGeckoid: "",
    coinGeckoIds: [
      "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
      "0xeDd6cA8A4202d4a36611e2fff109648c4863ae19", // maha
    ],
    multiRewardTokenPerBlock: ["0.03", "0.005"],
    harvest: true,
    tokenPerBlock: "1",
    sortOrder: 999,
    isFinished: false,
    tokenDecimals: 18,
    TopImage:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/maha-cnt.png",
    metamaskImg:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/maha-cnt.png",
  },
  {
    sousId: 5,
    tokenName: "ARTH-USDC",
    tokenAdressInLp: "0xE52509181FEb30EB4979E29EC70D50FD5C44D590", // arth
    tokenAddressSecondInLp: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", // arth
    tokenAddress: "0x998D543F618194A519156672E77756F8F6415A0d", //  lp
    stakingTokenName: QuoteToken.LP,
    quoteTokenSymbol: QuoteToken.MAHA,
    stakingTokenAddress: "0x998D543F618194A519156672E77756F8F6415A0d", // lp
    contractAddress: {
      97: "",
      56: "",
      80001: "0x718Fa9fA91f4bFF9B57f660D46B53ed39d300731",
      137: "0x80C4DC3e48ceB1406993De4Dc11e73fb6709BCEa", // staking pool arth-maha
    },
    poolCategory: PoolCategory.CORE,
    projectLink: "https://cryption.network/",
    multiReward: ["CNT", "MAHA"],
    stakingTokenCoinGeckoid: "MahaDAO",
    rewardTokenCoinGeckoid: "",
    coinGeckoIds: [
      "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
      "0xeDd6cA8A4202d4a36611e2fff109648c4863ae19", // maha
    ],
    multiRewardTokenPerBlock: ["0.03", "0.005"],
    harvest: true,
    tokenPerBlock: "1",
    sortOrder: 999,
    isFinished: false,
    tokenDecimals: 18,
    TopImage:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/maha-cnt.png",
    metamaskImg:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/maha-cnt.png",
  },
  {
    sousId: 6,
    tokenName: "ARTHX-ARTH",
    tokenAdressInLp: "0xE52509181FEb30EB4979E29EC70D50FD5C44D590", // arth
    tokenAddressSecondInLp: "0xD354D56DaE3588F1145dd664bc5094437b889d6F", // arthx
    tokenAddress: "0xf7902421cA73098e79d16a230727Ab7B3104cB0e", //  lp
    stakingTokenName: QuoteToken.LP,
    quoteTokenSymbol: QuoteToken.MAHA,
    stakingTokenAddress: "0xf7902421cA73098e79d16a230727Ab7B3104cB0e", // lp
    contractAddress: {
      97: "",
      56: "",
      80001: "0x718Fa9fA91f4bFF9B57f660D46B53ed39d300731",
      137: "0xFf64138D4bf53dd5D5ba2ac166Ab064D7a073a86", // staking pool arth-maha
    },
    poolCategory: PoolCategory.CORE,
    projectLink: "https://cryption.network/",
    multiReward: ["CNT", "MAHA"],
    stakingTokenCoinGeckoid: "MahaDAO",
    rewardTokenCoinGeckoid: "",
    coinGeckoIds: [
      "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
      "0xeDd6cA8A4202d4a36611e2fff109648c4863ae19", // maha
    ],
    multiRewardTokenPerBlock: ["0.0018105009", "0.0018105009"],
    harvest: true,
    tokenPerBlock: "1",
    sortOrder: 999,
    isFinished: false,
    tokenDecimals: 18,
    TopImage:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/maha-cnt.png",
    metamaskImg:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/maha-cnt.png",
  },
  {
    sousId: 7,
    tokenName: "EASY-CNT",
    tokenAdressInLp: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
    tokenAddressSecondInLp: "0x34C1b299A74588D6Abdc1b85A53345A48428a521", // easy
    tokenAddress: "0x9063F906b3463C8441A1A65b9B25eA081BabD196", //  lp
    stakingTokenName: QuoteToken.LP,
    quoteTokenSymbol: QuoteToken.CNT,
    stakingTokenAddress: "0x9063F906b3463C8441A1A65b9B25eA081BabD196", // lp
    contractAddress: {
      97: "",
      56: "",
      80001: "0x718Fa9fA91f4bFF9B57f660D46B53ed39d300731",
      137: "0xF1676C1576d0a6dE986395a3a2A1176C519424Ba", // staking pool arth-maha
    },
    poolCategory: PoolCategory.CORE,
    projectLink: "https://cryption.network/",
    multiReward: ["EASY", "CNT"],
    stakingTokenCoinGeckoid: "easyfi",
    rewardTokenCoinGeckoid: "easyfi",
    coinGeckoIds: [
      "0x34C1b299A74588D6Abdc1b85A53345A48428a521", // easy
      "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
    ],
    multiRewardTokenPerBlock: ["0.0005151515152", "0.04040404042"],
    harvest: true,
    tokenPerBlock: "1",
    sortOrder: 999,
    isFinished: false,
    tokenDecimals: 18,
    TopImage:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/maha-cnt.png",
    metamaskImg:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/maha-cnt.png",
  },
  {
    sousId: 8,
    tokenName: "WMATIC",
    tokenAdressInLp: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF",
    tokenAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // maha
    tokenAddressSecondInLp: "0xE52509181FEb30EB4979E29EC70D50FD5C44D590", // arth
    stakingTokenName: QuoteToken.WMATIC,
    quoteTokenSymbol: QuoteToken.WMATIC,
    stakingTokenAddress: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // lp
    contractAddress: {
      97: "",
      56: "",
      80001: "0x718Fa9fA91f4bFF9B57f660D46B53ed39d300731",
      137: "0x07503539fBFdccb17923f40B89f9d7dD7cD7bcDa", // staking pool wmatic
    },
    poolCategory: PoolCategory.COMMUNITY,
    projectLink: "https://cryption.network/",
    multiReward: ["CNT"],
    stakingTokenCoinGeckoid: "CNT",
    rewardTokenCoinGeckoid: "CNT",
    coinGeckoIds: [
      "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
    ],
    TopImage:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10322.png",
    multiRewardTokenPerBlock: ["0.2"],
    harvest: true,
    tokenPerBlock: "0.2",
    sortOrder: 999,
    isFinished: false,
    tokenDecimals: 18,
    metamaskImg:
      "https://assets.coingecko.com/coins/images/17173/small/pear200.png?1626793002",
  },
  {
    sousId: 9,
    tokenName: "ETH",
    tokenAdressInLp: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF",
    tokenAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // maha
    tokenAddressSecondInLp: "0xE52509181FEb30EB4979E29EC70D50FD5C44D590", // arth
    stakingTokenName: QuoteToken.ETH,
    quoteTokenSymbol: QuoteToken.ETH,
    stakingTokenAddress: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // lp
    contractAddress: {
      97: "",
      56: "",
      80001: "0x718Fa9fA91f4bFF9B57f660D46B53ed39d300731",
      137: "0x811445edf24380AdB3C39Ac3CffFdeAf146a0F9D", // staking pool ETH
    },
    poolCategory: PoolCategory.COMMUNITY,
    projectLink: "https://cryption.network/",
    multiReward: ["CNT"],
    stakingTokenCoinGeckoid: "CNT",
    rewardTokenCoinGeckoid: "CNT",
    coinGeckoIds: [
      "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
    ],
    TopImage:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10321.png",
    multiRewardTokenPerBlock: ["0.2"],
    harvest: true,
    tokenPerBlock: "0.2",
    sortOrder: 999,
    isFinished: false,
    tokenDecimals: 18,
    metamaskImg:
      "https://assets.coingecko.com/coins/images/17173/small/pear200.png?1626793002",
  },
  {
    sousId: 10,
    tokenName: "wBTC",
    tokenAdressInLp: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF",
    tokenAddress: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", // maha
    tokenAddressSecondInLp: "0xE52509181FEb30EB4979E29EC70D50FD5C44D590", // arth
    stakingTokenName: QuoteToken.BTC,
    quoteTokenSymbol: QuoteToken.BTC,
    stakingTokenAddress: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", // lp
    contractAddress: {
      97: "",
      56: "",
      80001: "0x718Fa9fA91f4bFF9B57f660D46B53ed39d300731",
      137: "0xd401a89b0262144CADDB0605b5f55d139ACA8e91", // staking pool ETH
    },
    poolCategory: PoolCategory.COMMUNITY,
    projectLink: "https://cryption.network/",
    multiReward: ["CNT"],
    stakingTokenCoinGeckoid: "CNT",
    rewardTokenCoinGeckoid: "CNT",
    coinGeckoIds: [
      "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
    ],
    TopImage:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10325.png",
    multiRewardTokenPerBlock: ["0.2"],
    harvest: true,
    tokenPerBlock: "0.2",
    sortOrder: 999,
    isFinished: false,
    tokenDecimals: 8,
    metamaskImg:
      "https://assets.coingecko.com/coins/images/17173/small/pear200.png?1626793002",
  },
  {
    sousId: 11,
    tokenName: "USDC",
    tokenAdressInLp: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF",
    tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // usdc
    tokenAddressSecondInLp: "0xE52509181FEb30EB4979E29EC70D50FD5C44D590", // arth
    stakingTokenName: QuoteToken.USDC,
    quoteTokenSymbol: QuoteToken.USDC,
    stakingTokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // lp
    contractAddress: {
      97: "",
      56: "",
      80001: "0x718Fa9fA91f4bFF9B57f660D46B53ed39d300731",
      137: "0x0C6932606Cc507e3551B339e20f893b9036e6cad", // staking pool usdc
    },
    poolCategory: PoolCategory.COMMUNITY,
    projectLink: "https://cryption.network/",
    multiReward: ["CNT"],
    stakingTokenCoinGeckoid: "CNT",
    rewardTokenCoinGeckoid: "CNT",
    coinGeckoIds: [
      "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
    ],
    TopImage:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10323.png",
    multiRewardTokenPerBlock: ["0.12"],
    harvest: true,
    tokenPerBlock: "0.12",
    sortOrder: 999,
    isFinished: false,
    tokenDecimals: 6,
    metamaskImg:
      "https://assets.coingecko.com/coins/images/17173/small/pear200.png?1626793002",
  },
  {
    sousId: 12,
    tokenName: "DAI",
    tokenAdressInLp: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF",
    tokenAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", // usdc
    tokenAddressSecondInLp: "0xE52509181FEb30EB4979E29EC70D50FD5C44D590", // arth
    stakingTokenName: QuoteToken.DAI,
    quoteTokenSymbol: QuoteToken.DAI,
    stakingTokenAddress: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", // lp
    contractAddress: {
      97: "",
      56: "",
      80001: "0x718Fa9fA91f4bFF9B57f660D46B53ed39d300731",
      137: "0x4Be55222Bc5AE1e80Ec96f5AF7ac04bE957d6402", // staking pool usdc
    },
    poolCategory: PoolCategory.COMMUNITY,
    projectLink: "https://cryption.network/",
    multiReward: ["CNT"],
    stakingTokenCoinGeckoid: "CNT",
    rewardTokenCoinGeckoid: "CNT",
    coinGeckoIds: [
      "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
    ],
    TopImage:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10326.png",
    multiRewardTokenPerBlock: ["0.12"],
    harvest: true,
    tokenPerBlock: "0.12",
    sortOrder: 999,
    isFinished: false,
    tokenDecimals: 18,
    metamaskImg:
      "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=006",
  },
  {
    sousId: 13,
    tokenName: "USDT",
    tokenAdressInLp: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF",
    tokenAddress: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f", // usdc
    tokenAddressSecondInLp: "0xE52509181FEb30EB4979E29EC70D50FD5C44D590", // arth
    stakingTokenName: QuoteToken.USDT,
    quoteTokenSymbol: QuoteToken.USDT,
    stakingTokenAddress: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f", // lp
    contractAddress: {
      97: "",
      56: "",
      80001: "0x718Fa9fA91f4bFF9B57f660D46B53ed39d300731",
      137: "0xE7fa8486a2f881e15cEF350EbFFB70d829C44AA9", // staking pool usdc
    },
    poolCategory: PoolCategory.COMMUNITY,
    projectLink: "https://cryption.network/",
    multiReward: ["CNT"],
    stakingTokenCoinGeckoid: "CNT",
    rewardTokenCoinGeckoid: "CNT",
    coinGeckoIds: [
      "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
    ],
    TopImage:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10328.png",
    multiRewardTokenPerBlock: ["0.12"],
    harvest: true,
    tokenPerBlock: "0.12",
    sortOrder: 999,
    isFinished: false,
    tokenDecimals: 6,
    metamaskImg:
      "https://seeklogo.com/images/T/tether-usdt-logo-FA55C7F397-seeklogo.com.png",
  },
  // {
  //   sousId: 14,
  //   tokenName: "LUSDT",
  //   tokenAdressInLp: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF",
  //   tokenAddress: "0xb032512A23Ef041bEc2e48e9b3f07286408B2B26", // usdc
  //   tokenAddressSecondInLp: "0xE52509181FEb30EB4979E29EC70D50FD5C44D590", // arth
  //   stakingTokenName: QuoteToken.LUSDT,
  //   quoteTokenSymbol: QuoteToken.LUSDT,
  //   stakingTokenAddress: "0xb032512A23Ef041bEc2e48e9b3f07286408B2B26", // lp
  //   contractAddress: {
  //     97: "",
  //     56: "",
  //     80001: "0x718Fa9fA91f4bFF9B57f660D46B53ed39d300731",
  //     137: "0xF1c315e8A83Ef8484ad36e9943160Fd604C52E73", // staking pool usdc
  //   },
  //   poolCategory: PoolCategory.COMMUNITY,
  //   projectLink: "https://cryption.network/",
  //   multiReward: ["CNT"],
  //   stakingTokenCoinGeckoid: "CNT",
  //   rewardTokenCoinGeckoid: "CNT",
  //   coinGeckoIds: [
  //     "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
  //   ],
  //   TopImage:
  //     "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10319.png",
  //   multiRewardTokenPerBlock: ["0.02"],
  //   harvest: true,
  //   tokenPerBlock: "0.02",
  //   sortOrder: 999,
  //   isFinished: false,
  //   tokenDecimals: 18,
  //   metamaskImg:
  //     "https://assets.coingecko.com/coins/images/17173/small/pear200.png?1626793002",
  // },
  // {
  //   sousId: 15,
  //   tokenName: "LARTH",
  //   tokenAdressInLp: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF",
  //   tokenAddress: "0x20a2D84ec22F47B07d6A20209D84Bb7544ac5E95", // usdc
  //   tokenAddressSecondInLp: "0xE52509181FEb30EB4979E29EC70D50FD5C44D590", // arth
  //   stakingTokenName: QuoteToken.LARTH,
  //   quoteTokenSymbol: QuoteToken.LARTH,
  //   stakingTokenAddress: "0x20a2D84ec22F47B07d6A20209D84Bb7544ac5E95", // lp
  //   contractAddress: {
  //     97: "",
  //     56: "",
  //     80001: "0x718Fa9fA91f4bFF9B57f660D46B53ed39d300731",
  //     137: "0x513C1b008A3136e9c510eAa374637c95E98126B1", // staking pool usdc
  //   },
  //   poolCategory: PoolCategory.COMMUNITY,
  //   projectLink: "https://cryption.network/",
  //   multiReward: ["CNT"],
  //   stakingTokenCoinGeckoid: "CNT",
  //   rewardTokenCoinGeckoid: "CNT",
  //   coinGeckoIds: [
  //     "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // cnt
  //   ],
  //   TopImage:
  //     "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10324.png",
  //   multiRewardTokenPerBlock: ["0.02"],
  //   harvest: true,
  //   tokenPerBlock: "0.02",
  //   sortOrder: 999,
  //   isFinished: false,
  //   tokenDecimals: 18,
  //   metamaskImg:
  //     "https://assets.coingecko.com/coins/images/17173/small/pear200.png?1626793002",
  // },

  // {
  //   sousId: 0,
  //   tokenName: "CNT",
  //   tokenAdressInLp: "0x766F03e47674608cCcF7414f6c4DDF3d963Ae394",
  //   tokenAddress: "0x766F03e47674608cCcF7414f6c4DDF3d963Ae394",
  //   stakingTokenName: QuoteToken.CNT,
  //   quoteTokenSymbol: QuoteToken.CNT,
  //   stakingTokenAddress: "0x766F03e47674608cCcF7414f6c4DDF3d963Ae394",
  //   contractAddress: {
  //     97: "",
  //     56: "",
  //     80001: "0x01b21aFC1415F1Df68d034351699B5c639CF160A",
  //     137: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // wrong
  //   },
  //   poolCategory: PoolCategory.COMMUNITY,
  //   projectLink: "https://cryption.network/",
  //   multiReward: ["CNT", "MAHA", "ARTH"],
  //   metamaskImg:
  //     "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/cnt.png",
  //   stakingTokenCoinGeckoid: "cryption-network",
  //   coinGeckoIds: [
  //     "0x766F03e47674608cCcF7414f6c4DDF3d963Ae394",
  //     "0xa22DDedE7118de4589FCC580D829ede5354821DA",
  //     "0x62683362864B6aF24C520166f4a9F675D7dad1d9",
  //   ],
  //   multiRewardTokenPerBlock: ["0.1", "0.2", "0.3"],
  //   harvest: true,
  //   tokenPerBlock: "1",
  //   sortOrder: 0,
  //   isFinished: false,
  //   tokenDecimals: 18,
  // },
  // {
  //   sousId: 1,
  //   tokenName: "MAHA-CNT",
  //   tokenAdressInLp: "0x766F03e47674608cCcF7414f6c4DDF3d963Ae394",
  //   tokenAddress: "0xE6e0f6Ae6419D45109Af6c4630EF468F407eD28f", // maha
  //   stakingTokenName: QuoteToken.LP,
  //   quoteTokenSymbol: QuoteToken.CNT,
  //   stakingTokenAddress: "0xE6e0f6Ae6419D45109Af6c4630EF468F407eD28f", // lp
  //   contractAddress: {
  //     97: "",
  //     56: "",
  //     80001: "0x718Fa9fA91f4bFF9B57f660D46B53ed39d300731",
  //     137: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // wrong
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   projectLink: "https://cryption.network/",
  //   multiReward: ["ARTH", "MAHA", "CNT"],
  //   stakingTokenCoinGeckoid: "MahaDAO",
  //   coinGeckoIds: [
  //     "0x62683362864B6aF24C520166f4a9F675D7dad1d9",
  //     "0xa22DDedE7118de4589FCC580D829ede5354821DA",
  //     "0x766F03e47674608cCcF7414f6c4DDF3d963Ae394",
  //   ],
  //   multiRewardTokenPerBlock: ["0.01", "0.02", "0.03"],
  //   harvest: true,
  //   tokenPerBlock: "1",
  //   sortOrder: 999,
  //   isFinished: false,
  //   tokenDecimals: 18,
  //   metamaskImg:
  //     "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/maha-cnt.png",
  // },
  // {
  //   sousId: 2,
  //   tokenName: "CNT",
  //   tokenAdressInLp: "0x766F03e47674608cCcF7414f6c4DDF3d963Ae394",
  //   tokenAddress: "0x766F03e47674608cCcF7414f6c4DDF3d963Ae394",
  //   stakingTokenName: QuoteToken.CNT,
  //   quoteTokenSymbol: QuoteToken.CNT,
  //   stakingTokenAddress: "0x766F03e47674608cCcF7414f6c4DDF3d963Ae394",
  //   contractAddress: {
  //     97: "",
  //     56: "",
  //     80001: "0x8766d04916c783E57785cE198D06446A5272b979",
  //     137: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // wrong
  //   },
  //   poolCategory: PoolCategory.COMMUNITY,
  //   projectLink: "https://cryption.network/",
  //   multiReward: ["ARTH", "MAHA"],
  //   metamaskImg:
  //     "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/cnt.png",
  //   stakingTokenCoinGeckoid: "cryption-network",
  //   coinGeckoIds: [
  //     "0x62683362864B6aF24C520166f4a9F675D7dad1d9",
  //     "0xa22DDedE7118de4589FCC580D829ede5354821DA",
  //   ],
  //   multiRewardTokenPerBlock: ["0.1", "0.2"],
  //   harvest: true,
  //   tokenPerBlock: "1",
  //   sortOrder: 0,
  //   isFinished: false,
  //   tokenDecimals: 18,
  // },
];

export default pools;
