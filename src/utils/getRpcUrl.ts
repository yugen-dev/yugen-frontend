// import { ChainId } from "@cryption-network/polydex-sdk";
import random from "lodash/random";

// Array of available nodes to connect to
export const nodes = {
  "80001": [process.env.REACT_APP_TESTNET_NETWORK_URL],
  "5": [process.env.REACT_APP_TESTNET_NETWORK_URL],
  "137": [process.env.REACT_APP_MAINNET_NETWORK_URL],
  "1": [process.env.REACT_APP_MAINNET_NETWORK_URL],
  "250": [process.env.REACT_APP_FANTOM_MAINNET_NETWORK_URL],
  "4002": [process.env.REACT_APP_FANTOM_TESTNET_NETWORK_URL],
  "31337": [process.env.REACT_APP_LocalHost_NETWORK_URL]
};

const getNodeUrl = () => {
  let chainId = "137";
  if (window && window.ethereum) {
    chainId = window.ethereum.networkVersion;
  } else if (localStorage && localStorage.getItem("chainId")) {
    chainId = localStorage.getItem("chainId");
  }
  if (nodes[chainId] === null || nodes[chainId] === undefined) {
    chainId = process.env.REACT_APP_CHAIN_ID;
  }
  const nodesData = nodes[chainId];
  const randomIndex = random(0, nodesData.length - 1);
  return nodesData[randomIndex];
};

export default getNodeUrl;
