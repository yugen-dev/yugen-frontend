import { AbiItem } from "web3-utils";
import erc20 from "config/abi/erc20.json";
import Web3 from "web3";

declare global {
  interface Window {
    web3: any;
    ethereum: any;
  }
}

const getLotterySmartContract = async (tokenAddr: string) => {
  const web3 = new Web3(window.ethereum);

  const smartContract = new web3.eth.Contract(
    erc20 as unknown as AbiItem,
   web3.utils.toChecksumAddress(tokenAddr)
  );
  return smartContract;
};

export default getLotterySmartContract;
