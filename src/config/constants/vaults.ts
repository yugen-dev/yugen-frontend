import contracts from "./contracts";
import { QuoteToken, VaultConfig } from "./types";

const vaultsEthereumMainnet: VaultConfig[] = [];
const vaultsEthereumTestnet: VaultConfig[] = [];

const vaultsMaticMainnet: VaultConfig[] = [

  {
    pid: 1,
    tag: "Penrose",
    lpTokenName: "DYST-WMATIC-Volatile",
    coinGeckoLpTokenName: "DYST-WMATIC",
    rewardTokenCoinGecko: "dystopia",
    quoteTokenCoinGecko: "WMATIC",
    nonQuoteTokenCoinGecko: "dystopia",
    // blocksPerYearOfRewardToken: 31536000,
    // rewardTokenPerBlockPerPool: 0.0632,


    lpTokenAddress: {

      97: "0x2c5ba816da67ce34029fc4a9cc7545d207abf945",
      56: "0x2c5ba816da67ce34029fc4a9cc7545d207abf945",
      80001: "0x2c5ba816da67ce34029fc4a9cc7545d207abf945",
      137: "0x2c5ba816da67ce34029fc4a9cc7545d207abf945",
      31337: "0x1e08A5B6A1694bC1A65395db6f4c506498DAA349",
      1: "0x2c5ba816da67ce34029fc4a9cc7545d207abf945",
      250: "0x2c5ba816da67ce34029fc4a9cc7545d207abf945",
      4002: "0x2c5ba816da67ce34029fc4a9cc7545d207abf945",
    },

    // lpTokenFarmAddress: {
    //   97: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    //   56: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    //   80001: "0xA824f2DE0d8b8C1c6D91B613FD56A0c205028e34",
    //   137: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    //   31337: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    //   1: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    //   250: "0x2b2929E785374c651a81A63878Ab22742656DcDd",
    //   4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    // },

    lpTokenPart1Address: {

      97: "0x9008D70A5282a936552593f410AbcBcE2F891A97",
      56: "0x9008D70A5282a936552593f410AbcBcE2F891A97",
      80001: "0x9008D70A5282a936552593f410AbcBcE2F891A97",
      137: "0x9008D70A5282a936552593f410AbcBcE2F891A97",
      31337: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      1: "0x9008D70A5282a936552593f410AbcBcE2F891A97",
      250: "0x9008D70A5282a936552593f410AbcBcE2F891A97",
      4002: "0x9008D70A5282a936552593f410AbcBcE2F891A97",

    },
    lpTokenPart2Address: {

      97: "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb",
      56: "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb",
      80001: "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb",
      137: "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb",
      31337: "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb",
      1: "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb",
      250: "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb",
      4002: "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb",

    },
    vaultAddress: {
      97: "0x858CC26a30B06f86a5CE5cdCBd735B3c255b0b14",
      56: "0x858CC26a30B06f86a5CE5cdCBd735B3c255b0b14",
      80001: "0x858CC26a30B06f86a5CE5cdCBd735B3c255b0b14",
      137: "0x858CC26a30B06f86a5CE5cdCBd735B3c255b0b14",
      31337: "0x33bF377A2FFA05e5d7eDF2121E6202EF2966731E",
      1: "0x858CC26a30B06f86a5CE5cdCBd735B3c255b0b14",
      250: "0x858CC26a30B06f86a5CE5cdCBd735B3c255b0b14",
      4002: "0x858CC26a30B06f86a5CE5cdCBd735B3c255b0b14",

    },
    strategyAddress: {


      97: "0xbA040D73aDE0B2f8ad9c8A674971A66A2022DbFF",
      56: "0xbA040D73aDE0B2f8ad9c8A674971A66A2022DbFF",
      80001: "0xbA040D73aDE0B2f8ad9c8A674971A66A2022DbFF",
      137: "0xbA040D73aDE0B2f8ad9c8A674971A66A2022DbFF",
      31337: "0x36A7f9ca3EBD83E00c1bca3A1db378bcF039Bf85",
      1: "0xbA040D73aDE0B2f8ad9c8A674971A66A2022DbFF",
      250: "0xbA040D73aDE0B2f8ad9c8A674971A66A2022DbFF",
      4002: "0xbA040D73aDE0B2f8ad9c8A674971A66A2022DbFF",

    },
    quoteTokenSymbol: QuoteToken.WMATIC,
    quoteTokenAddress: contracts.wbnb,
    nonQuoteTokenSymbol: QuoteToken.DYST,
    nonQuoteTokenAddress: contracts.dyst,
    addLiquidityLink:
      `https://www.dystopia.exchange/liquidity/0x1e08A5B6A1694bC1A65395db6f4c506498DAA349`,
    blockExplorerLink:
      "https://polygonscan.com/address/0x1e08A5B6A1694bC1A65395db6f4c506498DAA349",
  },


  {
    pid: 2,
    tag: "Penrose",
    lpTokenName: "PEN-WMATIC-Volatile",
    coinGeckoLpTokenName: "PEN-WMATIC",
    rewardTokenCoinGecko: "penrose-finance",
    quoteTokenCoinGecko: "WMATIC",
    nonQuoteTokenCoinGecko: "penrose-finance",
    // blocksPerYearOfRewardToken: 31536000,
    // rewardTokenPerBlockPerPool: 0.0632,


    lpTokenAddress: {

      97: "0x2c5ba816da67ce34029fc4a9cc7545d207abf945",
      56: "0x2c5ba816da67ce34029fc4a9cc7545d207abf945",
      80001: "0x2c5ba816da67ce34029fc4a9cc7545d207abf945",
      137: "0x2c5ba816da67ce34029fc4a9cc7545d207abf945",
      31337: "0x2c5Ba816Da67cE34029fC4A9Cc7545d207ABF945",
      1: "0x2c5ba816da67ce34029fc4a9cc7545d207abf945",
      250: "0x2c5ba816da67ce34029fc4a9cc7545d207abf945",
      4002: "0x2c5ba816da67ce34029fc4a9cc7545d207abf945",
    },



    lpTokenPart1Address: {

      97: "0x9008D70A5282a936552593f410AbcBcE2F891A97",
      56: "0x9008D70A5282a936552593f410AbcBcE2F891A97",
      80001: "0x9008D70A5282a936552593f410AbcBcE2F891A97",
      137: "0x9008D70A5282a936552593f410AbcBcE2F891A97",
      31337: "0x9008D70A5282a936552593f410AbcBcE2F891A97",
      1: "0x9008D70A5282a936552593f410AbcBcE2F891A97",
      250: "0x9008D70A5282a936552593f410AbcBcE2F891A97",
      4002: "0x9008D70A5282a936552593f410AbcBcE2F891A97",

    },
    lpTokenPart2Address: {

      97: "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb",
      56: "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb",
      80001: "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb",
      137: "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb",
      31337: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      1: "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb",
      250: "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb",
      4002: "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb",

    },
    vaultAddress: {
      97: "0x858CC26a30B06f86a5CE5cdCBd735B3c255b0b14",
      56: "0x858CC26a30B06f86a5CE5cdCBd735B3c255b0b14",
      80001: "0x858CC26a30B06f86a5CE5cdCBd735B3c255b0b14",
      137: "0x858CC26a30B06f86a5CE5cdCBd735B3c255b0b14",
      31337: "0xe4f2222d155699B7d23E69c1D1264C947A59eda8",
      1: "0x858CC26a30B06f86a5CE5cdCBd735B3c255b0b14",
      250: "0x858CC26a30B06f86a5CE5cdCBd735B3c255b0b14",
      4002: "0x858CC26a30B06f86a5CE5cdCBd735B3c255b0b14",

    },
    strategyAddress: {


      97: "0xbA040D73aDE0B2f8ad9c8A674971A66A2022DbFF",
      56: "0xbA040D73aDE0B2f8ad9c8A674971A66A2022DbFF",
      80001: "0xbA040D73aDE0B2f8ad9c8A674971A66A2022DbFF",
      137: "0xbA040D73aDE0B2f8ad9c8A674971A66A2022DbFF",
      31337: "0x247005eFa6fe1E8Fa828c24b82044f74D7b2D49e",
      1: "0xbA040D73aDE0B2f8ad9c8A674971A66A2022DbFF",
      250: "0xbA040D73aDE0B2f8ad9c8A674971A66A2022DbFF",
      4002: "0xbA040D73aDE0B2f8ad9c8A674971A66A2022DbFF",

    },
    quoteTokenSymbol: QuoteToken.WMATIC,
    quoteTokenAddress: contracts.wbnb,
    nonQuoteTokenSymbol: QuoteToken.PEN,
    nonQuoteTokenAddress: contracts.pen,
    addLiquidityLink:
      "https://quickswap.exchange/add/0x86652c1301843b4e06fbfbbdaa6849266fb2b5e7/0xac0ec8a0a5062feecb496ac1ef7d2177f06f88b0",
    blockExplorerLink:
      "https://mumbai.polygonscan.com/address/0xeF4E6c3119A7a7260C1d3fA90939B32De02e363A",
  },


];
const vaultsMaticTestnet: VaultConfig[] = [
  {
    pid: 6,
    tag: "SpookySwap",
    lpTokenName: "YGN-WMATIC",
    coinGeckoLpTokenName: "YGN-WMATIC",
    rewardTokenCoinGecko: "YGN",
    quoteTokenCoinGecko: "WMATIC",
    nonQuoteTokenCoinGecko: "YGN",
    // blocksPerYearOfRewardToken: 31536000,
    // rewardTokenPerBlockPerPool: 0.0632,



    lpTokenAddress: {
      97: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      56: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      80001: "0xeF4E6c3119A7a7260C1d3fA90939B32De02e363A",
      137: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      31337: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      1: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      250: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },

    lpTokenPart1Address: {
      97: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      56: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      80001: "0x86652c1301843b4e06fbfbbdaa6849266fb2b5e7",
      137: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      31337: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      1: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      250: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },
    lpTokenPart2Address: {
      97: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      56: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      80001: "0xac0ec8a0a5062feecb496ac1ef7d2177f06f88b0",
      137: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      31337: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      1: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      250: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },
    vaultAddress: {
      97: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      56: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      80001: "0x6E7a487CC89c36d146F03E6d1b08DC26b6C0649A",
      137: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      31337: "0xC5022dFa593101343B7b63E090958EB123552a1F",
      1: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      250: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },
    strategyAddress: {
      97: "0x83C0b42CAa58735447EcE72c3DD584EbD19405B2",
      56: "0x83C0b42CAa58735447EcE72c3DD584EbD19405B2",
      80001: "0xa26E07C7842159a316FB9348A59eCFBC0c011494",
      137: "0x83C0b42CAa58735447EcE72c3DD584EbD19405B2",
      31337: "0x1EC66e52D13c18809F023948f1ae053025D2c969",
      1: "0x83C0b42CAa58735447EcE72c3DD584EbD19405B2",
      250: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },
    quoteTokenSymbol: QuoteToken.WMATIC,
    quoteTokenAddress: contracts.wbnb,
    nonQuoteTokenSymbol: QuoteToken.CAKE,
    nonQuoteTokenAddress: contracts.cake,
    addLiquidityLink:
      "https://quickswap.exchange/add/0x86652c1301843b4e06fbfbbdaa6849266fb2b5e7/0xac0ec8a0a5062feecb496ac1ef7d2177f06f88b0",
    blockExplorerLink:
      "https://mumbai.polygonscan.com/address/0xeF4E6c3119A7a7260C1d3fA90939B32De02e363A",
  },
];

const vaultsFantomMainnet: VaultConfig[] = [
  {
    pid: 0,
    tag: "SpookySwap",
    lpTokenName: "FTM-BOO",
    coinGeckoLpTokenName: "fantom-spookyswap",
    rewardTokenCoinGecko: "spookyswap",
    quoteTokenCoinGecko: "fantom",
    nonQuoteTokenCoinGecko: "spookyswap",
    // blocksPerYearOfRewardToken: 31536000,
    // rewardTokenPerBlockPerPool: 0.0632, // per pool

    lpTokenAddress: {
      97: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      56: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      80001: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      137: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      1: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      250: "0xEc7178F4C41f346b2721907F5cF7628E388A7a58",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },

    lpTokenPart1Address: {
      97: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      56: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      80001: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      137: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      1: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      250: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },
    lpTokenPart2Address: {
      97: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      56: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      80001: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      137: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      1: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      250: "0x841fad6eae12c286d1fd18d1d525dffa75c7effe",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },
    vaultAddress: {
      97: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      56: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      80001: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      137: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      1: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      250: "0x429876c4a6f89FB470E92456B8313879DF98B63c",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },
    strategyAddress: {
      97: "0x83C0b42CAa58735447EcE72c3DD584EbD19405B2",
      56: "0x83C0b42CAa58735447EcE72c3DD584EbD19405B2",
      80001: "0x83C0b42CAa58735447EcE72c3DD584EbD19405B2",
      137: "0x83C0b42CAa58735447EcE72c3DD584EbD19405B2",
      1: "0x83C0b42CAa58735447EcE72c3DD584EbD19405B2",
      250: "0x6Fc377F3a73b243D8Cbae5a723AF1261B268Ae2E",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },
    quoteTokenSymbol: QuoteToken.FTM,
    nonQuoteTokenSymbol: QuoteToken.BOO,
    quoteTokenAddress: {
      97: "0x83C0b42CAa58735447EcE72c3DD584EbD19405B2",
      56: "0x83C0b42CAa58735447EcE72c3DD584EbD19405B2",
      80001: "0xBC659F08bf439ff856bCF4119fE6B2617C3706eD",
      137: "0x83C0b42CAa58735447EcE72c3DD584EbD19405B2",
      1: "0x83C0b42CAa58735447EcE72c3DD584EbD19405B2",
      250: "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },
    nonQuoteTokenAddress: {
      97: "0x83C0b42CAa58735447EcE72c3DD584EbD19405B2",
      56: "0x83C0b42CAa58735447EcE72c3DD584EbD19405B2",
      80001: "0xBC659F08bf439ff856bCF4119fE6B2617C3706eD",
      137: "0x83C0b42CAa58735447EcE72c3DD584EbD19405B2",
      1: "0x83C0b42CAa58735447EcE72c3DD584EbD19405B2",
      250: "0x841fad6eae12c286d1fd18d1d525dffa75c7effe",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },
    addLiquidityLink:
      "https://spookyswap.finance/add/FTM/0x841fad6eae12c286d1fd18d1d525dffa75c7effe",
    blockExplorerLink:
      "https://ftmscan.com/address/0xEc7178F4C41f346b2721907F5cF7628E388A7a58",
  },
];
const vaultsFantomTestnet: VaultConfig[] = [];

const vaults = {
  "80001": vaultsMaticTestnet,
  "1": vaultsEthereumMainnet,
  "137": vaultsMaticMainnet,
  "5": vaultsEthereumTestnet,
  "4002": vaultsFantomTestnet,
  "250": vaultsFantomMainnet,
  "31337": vaultsMaticMainnet
};

let chainId = process.env.REACT_APP_CHAIN_ID;
if (localStorage && localStorage.getItem("chainId")) {
  chainId = localStorage.getItem("chainId");
}
if (window && window.ethereum && window.ethereum.networkVersion) {
  chainId = window.ethereum.networkVersion;
}
export default vaults[chainId || "137"]
  ? vaults[chainId || "137"]
  : vaults[process.env.REACT_APP_CHAIN_ID];
