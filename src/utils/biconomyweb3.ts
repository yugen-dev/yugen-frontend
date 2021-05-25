import Web3 from "web3";
import { Biconomy } from "@biconomy/mexa";

const biconomy = new Biconomy((window as WindowChain).ethereum, {
  apiKey: "b8dPfq5r9.4828e19b-d67b-454b-823d-da8c44e83da4",
});
const biconomyWeb3 = new Web3(biconomy);

const getBiconomyWeb3 = () => {
  return biconomyWeb3;
};

export { getBiconomyWeb3 };
export default getBiconomyWeb3;
