import contracts from "./contracts";
import { FarmConfig, QuoteToken } from "./types";

const farms: FarmConfig[] = [
  {
    pid: 1,
    lpSymbol: "TEST",
    lpAddresses: {
      97: "0xe70b7523f4bffa1f2e88d2ba709afd026030f412",
      56: "0xA527a61703D82139F8a06Bc30097cC9CAA2df5A6",
      80001: "0xBa09adF5b53BC2109CA5B7F31D4f919C9dda1c68",
      137: "0x71ccF81b24d500705d54cc8b6d420B1131a9E5E5",
    },
    tokenSymbol: "CNT",
    tokenAddresses: {
      97: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
      56: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
      80001: "0xD8319F6AaeA4AC050dd808fCffF2124ad1BcF5e0",
      137: "0xD1e6354fb05bF72A8909266203dAb80947dcEccF",
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
    singleSidedToken: {
      97: "",
      56: "",
      80001: "0x86652c1301843B4E06fBfbBDaA6849266fb2b5e7",
      137: "",
    },
    singleSidedTokenName: "MATIC",
    singleSidedToToken: {
      97: "",
      56: "",
      80001: "0x766F03e47674608cCcF7414f6c4DDF3d963Ae394",
      137: "",
    },
    singleSidedToTokenName: "CNT",
  },
];

export default farms;
