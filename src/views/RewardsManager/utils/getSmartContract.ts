import { AbiItem } from "web3-utils";
import RewardManagerABI from "config/abi/RewardManager.json";
import { RewardManagerAddress } from "config/index";
import Web3 from "web3";

declare global {
  interface Window {
    web3: any;
    ethereum: any;
  }
}

const getSmartContract = async () => {
  const web3 = new Web3(window.ethereum);

  const smartContract = new web3.eth.Contract(
    RewardManagerABI as unknown as AbiItem,
    web3.utils.toChecksumAddress(RewardManagerAddress)
  );
  return smartContract;
};

export default getSmartContract;
