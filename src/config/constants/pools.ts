import { PoolConfig, QuoteToken, PoolCategory } from "./types";

const pools: PoolConfig[] = [
  {
    sousId: 0,
    tokenName: "MAHA-CNT",
    tokenAdressInLp: "0xeDd6cA8A4202d4a36611e2fff109648c4863ae19",
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
    isFinished: false,
    tokenDecimals: 18,
    metamaskImg:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/maha-cnt.png",
  },
  // 0xC20eaCe3c439915eEeB869722e1c9FC583C857E4
  // reward token 0xc8bcb58caEf1bE972C0B638B1dD8B0748Fdc8A44
  // input token 0xD1e6354fb05bF72A8909266203dAb80947dcEccF
  {
    sousId: 1,
    tokenName: "CNT",
    tokenAdressInLp: "0xc8bcb58caEf1bE972C0B638B1dD8B0748Fdc8A44",
    tokenAddress: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF", // maha
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
    projectLink: "https://cryption.network/",
    multiReward: ["PEAR"],
    stakingTokenCoinGeckoid: "CNT",
    rewardTokenCoinGeckoid: "pear",
    coinGeckoIds: [
      "0xc8bcb58caEf1bE972C0B638B1dD8B0748Fdc8A44", // pearl
      // "0xeDd6cA8A4202d4a36611e2fff109648c4863ae19", // maha
    ],
    multiRewardTokenPerBlock: ["0.0046491228"],
    harvest: true,
    tokenPerBlock: "0.0046491228",
    sortOrder: 999,
    isFinished: false,
    tokenDecimals: 18,
    metamaskImg:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10232.png",
  },
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
