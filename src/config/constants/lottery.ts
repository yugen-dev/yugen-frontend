import Addresses from "config/constants/contracts";
import USDClogo from "images/USDClogo.png";
import LUSDlogo from "images/LUSDlogo.png";
import ARTHXlogo from "images/ARTHXlogo.png";
import LARTHXlogo from "images/LARTHXlogo.png";
import CNTlogo from "images/CNTlogo.png";
import LCNTlogo from "images/LCNTlogo.png";
import { LotteryInfoProps } from "./types";

const chainID = process.env.REACT_APP_CHAIN_ID;
const LotteryInfo: LotteryInfoProps[] = [
  {
    lotteryId: 1,
    winnerLottery: {
      lotteryAddress: Addresses.usdcLottery[chainID],
      tokenName: "USDC",
      tokenAddress: Addresses.usdc[chainID],
      tokenDecimals: 6,
      tokenLogo: USDClogo,
      rewardToken: "USDC",
    },
    loserLottery: {
      lotteryAddress: Addresses.lusdLottery[chainID],
      tokenName: "LUSD",
      tokenAddress: Addresses.lusd[chainID],
      tokenDecimals: 18,
      tokenLogo: LUSDlogo,
      metamaskImg:
        "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10300.png",
      rewardToken: "CNT",
      rewardTokenDecimals: 18,
    },
  },
  {
    lotteryId: 2,
    winnerLottery: {
      lotteryAddress: Addresses.arthLottery[chainID],
      tokenName: "ARTH",
      tokenAddress: Addresses.arth[chainID],
      tokenDecimals: 18,
      tokenLogo: ARTHXlogo,
      rewardToken: "ARTH",
    },
    loserLottery: {
      lotteryAddress: Addresses.larthLottery[chainID],
      tokenName: "LARTH",
      tokenAddress: Addresses.larth[chainID],
      tokenDecimals: 18,
      tokenLogo: LARTHXlogo,
      metamaskImg:
        "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10309.png",
      rewardToken: "MAHA",
      rewardTokenDecimals: 18,
    },
  },
  {
    lotteryId: 3,
    winnerLottery: {
      lotteryAddress: Addresses.cntLottery[chainID],
      tokenName: "CNT",
      tokenAddress: Addresses.cnt[chainID],
      tokenDecimals: 18,
      tokenLogo: CNTlogo,
      rewardToken: "CNT",
    },
    loserLottery: {
      lotteryAddress: Addresses.lcntLottery[chainID],
      tokenName: "LCNT",
      tokenAddress: Addresses.lcnt[chainID],
      tokenDecimals: 18,
      tokenLogo: LCNTlogo,
      metamaskImg:
        "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10310_2.png",
      rewardToken: "USDC",
      rewardTokenDecimals: 6,
    },
  },
];
export default LotteryInfo;
