import Web3 from "web3";
import { Biconomy } from "@biconomy/mexa";

let biconomyWeb3 = new Web3();
if (window && window.ethereum) {
  const biconomy = new Biconomy((window as WindowChain).ethereum, {
    apiKey: "CZAhsPdyc.0c58fe26-3fd0-43e3-ac7b-f1198b71840c",
  });
  biconomyWeb3 = new Web3(biconomy);
}

const getBiconomyWeb3 = () => {
  return biconomyWeb3;
};

export { getBiconomyWeb3 };
export default getBiconomyWeb3;
