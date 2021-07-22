import Web3 from "web3";
import { Biconomy } from "@biconomy/mexa";

let biconomyWeb3 = new Web3();
if (window.ethereum) {
  const biconomy = new Biconomy((window as WindowChain).ethereum, {
    apiKey: "qjT0UE5V-.2095f0aa-ecc7-414b-a191-7e6b3b3cae10",
  });
  biconomyWeb3 = new Web3(biconomy);
}

const getBiconomyWeb3 = () => {
  return biconomyWeb3;
};

export { getBiconomyWeb3 };
export default getBiconomyWeb3;
