import contracts from "./contracts";
import { FarmConfig, QuoteToken } from "./types";

const farmsEthereumMainnet: FarmConfig[] = [];
const farmsEthereumTestnet: FarmConfig[] = [];
const farmsMaticMainnet: FarmConfig[] = [
  {
    pid: 0,
    tag: "Powered by QuickSwap",
    lpSymbol: "QUICK-wMATIC",
    lpAddresses: {
      97: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      56: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      80001: "0x978d374800eb7861283ffa0326bb4c853045b919", // QUICK-wMATIC
      5: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      137: "0x019ba0325f1988213D448b3472fA1cf8D07618d7",
      1: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      250: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },
    tokenSymbol: "QUICK-wMATIC",
    volatility: "failure",
    tokenAddresses: {
      97: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      56: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      80001: "0x9293C7381b9cEA6B27Ce9069f26746e7D43bC29d", // QUICK
      5: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      137: "0xf28164a485b0b2c90639e47b0f377b4a438a16b1",
      1: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      250: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },
    quoteTokenSymbol: QuoteToken.WMATIC,
    quoteTokenAdresses: contracts.wbnb,
    singleSidedToken: {
      97: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      56: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      80001: "0x9c3c9283d3e44854697cd22d3faa240cfb032889", // wMATIC
      5: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      137: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
      1: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      250: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },
    singleSidedTokenName: "WMATIC",
    singleSidedToToken: {
      97: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      56: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      80001: "0x9293C7381b9cEA6B27Ce9069f26746e7D43bC29d", // QUICK
      5: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      137: "0xf28164a485b0b2c90639e47b0f377b4a438a16b1",
      1: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      250: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },
    singleSidedToTokenName: "QUICK",
  },
];
const farmsMaticTestnet: FarmConfig[] = [
  {
    pid: 0,
    tag: "Powered by SpookySwap",
    lpSymbol: "SUPER-wMATIC",
    lpAddresses: {
      97: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      56: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      80001: "0x978d374800eb7861283ffa0326bb4c853045b919", // SUPER-wMATIC
      5: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      137: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      1: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      250: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },
    tokenSymbol: "SUPER",
    volatility: "failure",
    tokenAddresses: {
      97: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      56: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      80001: "0x9293C7381b9cEA6B27Ce9069f26746e7D43bC29d", // SUPER
      5: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      137: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      1: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      250: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },
    quoteTokenSymbol: QuoteToken.WMATIC,
    quoteTokenAdresses: contracts.wbnb,
    singleSidedToken: {
      97: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      56: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      80001: "0x9c3c9283d3e44854697cd22d3faa240cfb032889", // wMATIC
      5: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      137: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      1: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      250: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },
    singleSidedTokenName: "WMATIC",
    singleSidedToToken: {
      97: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      56: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      80001: "0x9293C7381b9cEA6B27Ce9069f26746e7D43bC29d", // SUPER
      5: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      137: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      1: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      250: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
      4002: "0x401e9E359d6De9B313c85Cde095D61b42B96EBEd",
    },
    singleSidedToTokenName: "SUPER",
  },
];
const farmsFantomMainnet: FarmConfig[] = [];
const farmsFantomTestnet: FarmConfig[] = [];

const farms = {
  "80001": farmsMaticTestnet,
  "1": farmsEthereumMainnet,
  "137": farmsMaticMainnet,
  "5": farmsEthereumTestnet,
  "4002": farmsFantomTestnet,
  "250": farmsFantomMainnet,
};
let chainId =
  window && window.ethereum
    ? window.ethereum.networkVersion
    : process.env.REACT_APP_CHAIN_ID;
if (localStorage && localStorage.getItem("chainId")) {
  chainId = localStorage.getItem("chainId");
}

export default farms[chainId || "80001"]
  ? farms[chainId || "80001"]
  : farms[process.env.REACT_APP_CHAIN_ID];
