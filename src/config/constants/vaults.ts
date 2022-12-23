import contracts from "./contracts";
import { QuoteToken, VaultConfig } from "./types";

const vaultsEthereumMainnet: VaultConfig[] = [];
const vaultsEthereumTestnet: VaultConfig[] = [];

const vaultsMaticMainnet: VaultConfig[] = [
  {
    pid: 1,
    tag: "Penrose",
    lpTokenName: "WMATIC-STMATIC-STABLE",
    coinGeckoLpTokenName: "WMATIC-STMATIC",
    rewardTokenCoinGecko: "dystopia",
    quoteTokenCoinGecko: "WMATIC",
    nonQuoteTokenCoinGecko: "STMATIC",
    // blocksPerYearOfRewardToken: 31536000,
    // rewardTokenPerBlockPerPool: 0.0632,

    lpTokenAddress: {
      97: "0x1237feA0b26F68191d50900BfFD85E142697C423",
      56: "0x1237feA0b26F68191d50900BfFD85E142697C423",
      80001: "0x1237feA0b26F68191d50900BfFD85E142697C423",
      137: "0x1237feA0b26F68191d50900BfFD85E142697C423",
      31337: "0x1237feA0b26F68191d50900BfFD85E142697C423",
      1: "0x1237feA0b26F68191d50900BfFD85E142697C423",
      250: "0x1237feA0b26F68191d50900BfFD85E142697C423",
      4002: "0x1237feA0b26F68191d50900BfFD85E142697C423",
    },

    lpTokenPart1Address: {
      97: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      56: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      80001: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      137: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      31337: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      1: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      250: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      4002: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    },
    lpTokenPart2Address: {
      97: "0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4",
      56: "0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4",
      80001: "0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4",
      137: "0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4",
      31337: "0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4",
      1: "0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4",
      250: "0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4",
      4002: "0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4",
    },
    vaultAddress: {
      97: "0xe4Cd411940083b1c95406E11e518918A4D92F1EF",
      56: "0xe4Cd411940083b1c95406E11e518918A4D92F1EF",
      80001: "0xe4Cd411940083b1c95406E11e518918A4D92F1EF",
      137: "0xe4Cd411940083b1c95406E11e518918A4D92F1EF",
      31337: "0xe4Cd411940083b1c95406E11e518918A4D92F1EF",
      1: "0xe4Cd411940083b1c95406E11e518918A4D92F1EF",
      250: "0xe4Cd411940083b1c95406E11e518918A4D92F1EF",
      4002: "0xe4Cd411940083b1c95406E11e518918A4D92F1EF",
    },
    strategyAddress: {
      97: "0x83de1c86ac72de937fbe7c99f040513d0dff28d9",
      56: "0x83de1c86ac72de937fbe7c99f040513d0dff28d9",
      80001: "0x83de1c86ac72de937fbe7c99f040513d0dff28d9",
      137: "0x83de1c86ac72de937fbe7c99f040513d0dff28d9",
      31337: "0x83de1c86ac72de937fbe7c99f040513d0dff28d9",
      1: "0x83de1c86ac72de937fbe7c99f040513d0dff28d9",
      250: "0x83de1c86ac72de937fbe7c99f040513d0dff28d9",
      4002: "0x83de1c86ac72de937fbe7c99f040513d0dff28d9",
    },
    quoteTokenSymbol: QuoteToken.WMATIC,
    quoteTokenAddress: contracts.wmatic,
    nonQuoteTokenSymbol: QuoteToken.STMATIC,
    nonQuoteTokenAddress: contracts.stmatic,
    addLiquidityLink: `https://www.dystopia.exchange/liquidity/0x1237fea0b26f68191d50900bffd85e142697c423`,
    blockExplorerLink:
      "https://polygonscan.com/address/0x1237fea0b26f68191d50900bffd85e142697c423",
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
  "31337": vaultsMaticMainnet,
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
