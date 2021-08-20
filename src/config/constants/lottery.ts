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
      lotteryAddress: Addresses.usdcLottery[80001],
      tokenName: "USDC",
      tokenAddress: Addresses.usdc[80001],
      tokenDecimals: 6,
      tokenLogo: USDClogo,
      rewardToken: "USDC",
    },
    loserLottery: {
      lotteryAddress: Addresses.lusdLottery[80001],
      tokenName: "LUSD",
      tokenAddress: Addresses.lusd[80001],
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
      lotteryAddress: Addresses.arthLottery[80001],
      tokenName: "ARTH",
      tokenAddress: Addresses.arth[80001],
      tokenDecimals: 18,
      tokenLogo: ARTHXlogo,
      rewardToken: "ARTH",
    },
    loserLottery: {
      lotteryAddress: Addresses.larthLottery[80001],
      tokenName: "LARTH",
      tokenAddress: Addresses.larth[80001],
      tokenDecimals: 18,
      tokenLogo: LARTHXlogo,
      metamaskImg:
        "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10309.png",
      rewardToken: "MAHA",
    },
  },
  {
    lotteryId: 3,
    winnerLottery: {
      lotteryAddress: Addresses.cntLottery[80001],
      tokenName: "CNT",
      tokenAddress: Addresses.cnt[80001],
      tokenDecimals: 18,
      tokenLogo: ARTHXlogo,
      rewardToken: "CNT",
    },
    loserLottery: {
      lotteryAddress: Addresses.lcntLottery[80001],
      tokenName: "LCNT",
      tokenAddress: Addresses.lcnt[80001],
      tokenDecimals: 18,
      tokenLogo: LARTHXlogo,
      metamaskImg:
        "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10309.png",
      rewardToken: "USDC",
    },
  },
];
export default LotteryInfo;
