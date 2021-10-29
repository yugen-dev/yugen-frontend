import { PoolConfig, QuoteToken, PoolCategory } from "./types";

const poolsMainnet: PoolConfig[] = [];
const poolsTestNet: PoolConfig[] = [];
const pools = {
  "80001": poolsTestNet,
  "1": poolsMainnet,
  "137": poolsMainnet,
  "5": poolsTestNet,
};
let chainId =
  window && window.ethereum
    ? window.ethereum.networkVersion
    : process.env.REACT_APP_CHAIN_ID;
if (localStorage && localStorage.getItem("chainId")) {
  chainId = localStorage.getItem("chainId");
}

export default pools[chainId || "137"]
  ? pools[chainId || "137"]
  : pools[process.env.REACT_APP_CHAIN_ID];
