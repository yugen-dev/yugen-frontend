import random from "lodash/random";

// Array of available nodes to connect to
export const nodes = {
  "80001": ["https://rpc-mumbai.maticvigil.com/"],
  "137": [process.env.REACT_APP_NETWORK_URL],
  "1": [process.env.REACT_APP_NETWORK_URL],
};

const getNodeUrl = () => {
  const nodesData = window.ethereum.networkVersion ? nodes[window.ethereum.networkVersion] : nodes['137']
  const randomIndex = random(0, nodesData.length - 1);
  return nodesData[randomIndex];
};

export default getNodeUrl;
