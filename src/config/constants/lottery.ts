import Addresses from "config/constants/contracts";
import USDClogo from "images/USDClogo.png";
import LUSDlogo from "images/LUSDlogo.png";
import ARTHXlogo from "images/ARTHXlogo.png";
import LARTHXlogo from "images/LARTHXlogo.png";
import { LotteryInfoProps } from "./types";

const LotteryInfo: LotteryInfoProps[] = [
  {
    lotteryId: 1,
    winnerLottery: {
      lotteryAddress: Addresses.winnerLottery[137],
      tokenName: "USDC",
      tokenAddress: Addresses.lotteryUSDC[137],
      tokenDecimals: 6,
      tokenLogo: USDClogo,
      rewardToken: "USDC",
    },
    loserLottery: {
      lotteryAddress: Addresses.loserLottery[137],
      tokenName: "LUSD",
      tokenAddress: Addresses.lotteryLUSD[137],
      tokenDecimals: 18,
      tokenLogo: LUSDlogo,
      metamaskImg:
        "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10300.png",
      rewardToken: "CNT",
    },
  },
  {
    lotteryId: 2,
    winnerLottery: {
      lotteryAddress: Addresses.winnerLottery2[137],
      tokenName: "ARTH",
      tokenAddress: Addresses.lotteryARTH[137],
      tokenDecimals: 18,
      tokenLogo: ARTHXlogo,
      rewardToken: "ARTH",
    },
    loserLottery: {
      lotteryAddress: Addresses.loserLottery2[137],
      tokenName: "LARTH",
      tokenAddress: Addresses.lotteryLARTH[137],
      tokenDecimals: 18,
      tokenLogo: LARTHXlogo,
      metamaskImg:
        "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10309.png",
      rewardToken: "MAHA",
    },
  },
];
export default LotteryInfo;
