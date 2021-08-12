import { AbiItem } from "web3-utils";
import LotteryABI from "config/abi/LotteryABI.json";
import { WinnerLotteryAddress, LoserLotteryAddress } from "config/index";
import Web3 from "web3";

declare global {
  interface Window {
    web3: any;
    ethereum: any;
  }
}

const getLotterySmartContract = async (typeOfLottery: "winner" | "loser") => {
  const web3 = new Web3(window.ethereum);

  let contractAddr = web3.utils.toChecksumAddress(WinnerLotteryAddress);

  if (typeOfLottery === "loser") {
    contractAddr = web3.utils.toChecksumAddress(LoserLotteryAddress);
  }

  const smartContract = new web3.eth.Contract(
    LotteryABI as unknown as AbiItem,
    contractAddr
  );
  return smartContract;
};

export default getLotterySmartContract;
