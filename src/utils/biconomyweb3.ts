import Web3 from "web3";
import { Biconomy } from "@biconomy/mexa";

let biconomyWeb3 = new Web3();
if (window.ethereum) {
  const biconomy = new Biconomy((window as WindowChain).ethereum, {
    apiKey: "X4jIgYcmm.8610535d-d3b0-4627-95a9-8a52d56ce004",
  });
  biconomyWeb3 = new Web3(biconomy);
}

const getBiconomyWeb3 = () => {
  return biconomyWeb3;
};

export { getBiconomyWeb3 };
export default getBiconomyWeb3;
