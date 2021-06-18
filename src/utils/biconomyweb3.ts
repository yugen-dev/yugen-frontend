import Web3 from "web3";
import { Biconomy } from "@biconomy/mexa";

const biconomy = new Biconomy((window as WindowChain).ethereum, {
  apiKey: "5IJrOQxzG.cbc81ad9-974a-45d5-b3f3-bbc7c9fd2c6c",
});
const biconomyWeb3 = new Web3(biconomy);

const getBiconomyWeb3 = () => {
  return biconomyWeb3;
};

export { getBiconomyWeb3 };
export default getBiconomyWeb3;
