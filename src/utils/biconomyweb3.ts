import Web3 from "web3";
import { Biconomy } from "@biconomy/mexa";

const biconomy = new Biconomy((window as WindowChain).ethereum, {
  apiKey: "jTZ4rld-C.223a91ce-4426-4344-93d0-81a4a3f596fa",
});
const biconomyWeb3 = new Web3(biconomy);

const getBiconomyWeb3 = () => {
  return biconomyWeb3;
};

export { getBiconomyWeb3 };
export default getBiconomyWeb3;
