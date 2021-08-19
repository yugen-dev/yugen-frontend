import Web3 from "web3";
import { AbiItem } from "web3-utils";
import web3NoAccount from "utils/web3";
import { poolsConfig } from "config/constants";
import { PoolCategory } from "config/constants/types";

// Addresses
import {
  getAddress,
  getPancakeProfileAddress,
  getPancakeRabbitsAddress,
  getBunnyFactoryAddress,
  getBunnySpecialAddress,
  getCNTStakerAddress,
  getCakeAddress,
  getLotteryAddress,
  getLotteryTicketAddress,
  getFarmAddress,
  getPointCenterIfoAddress,
  getClaimRefundAddress,
  getHybridStakingAddress,
  getSingleSidedLiquidityAddress,
  getWinnerLotteryAddress,
  getLoserLotteryAddress,
} from "utils/addressHelpers";

// ABI
import profileABI from "config/abi/pancakeProfile.json";
import pancakeRabbitsAbi from "config/abi/pancakeRabbits.json";
import bunnyFactoryAbi from "config/abi/bunnyFactory.json";
import bunnySpecialAbi from "config/abi/bunnySpecial.json";
import erc20Abi from "config/abi/erc20.json";
import cakeAbi from "config/abi/cake.json";
import hybridStakingAbi from "config/abi/hybridstaking.json";
import singleSidedLiquidityAbi from "config/abi/singleSidedLiquidity.json";
import ifoAbi from "config/abi/ifo.json";
import pointCenterIfo from "config/abi/pointCenterIfo.json";
import lotteryTicketAbi from "config/abi/lotteryNft.json";
import farmABI from "config/abi/farm.json";
import cntStaker from "config/abi/cntStaker.json";
import sousChef from "config/abi/sousChef.json";
import sousChefBnb from "config/abi/sousChefBnb.json";
import claimRefundAbi from "config/abi/claimRefund.json";
import lotteryAbi from "config/abi/lottery.json";
// import prToken from "config/abi/claimRefund.json";

export const getContract = (abi: any, address: string, web3?: Web3) => {
  const _web3 = web3 ?? web3NoAccount;
  return new _web3.eth.Contract(abi as unknown as AbiItem, address);
};

export const getERC20Contract = (address: string, web3?: Web3) => {
  return getContract(erc20Abi, address, web3);
};
export const getIfoContract = (address: string, web3?: Web3) => {
  return getContract(ifoAbi, address, web3);
};
export const getSouschefContract = (id: number, web3?: Web3) => {
  const config = poolsConfig.find((pool) => pool.sousId === id);
  const abi =
    config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef;
  return getContract(abi, getAddress(config.contractAddress), web3);
};
export const getCNTStakerContract = (web3?: Web3) => {
  return getContract(cntStaker, getCNTStakerAddress(), web3);
};
export const getPointCenterIfoContract = (web3?: Web3) => {
  return getContract(pointCenterIfo, getPointCenterIfoAddress(), web3);
};
export const getCakeContract = (web3?: Web3) => {
  return getContract(cakeAbi, getCakeAddress(), web3);
};

export const getHybridStakingContract = (web3?: Web3) => {
  return getContract(hybridStakingAbi, getHybridStakingAddress(), web3);
};

export const getSingleSidedLiquidityContract = (web3?: Web3) => {
  return getContract(
    singleSidedLiquidityAbi,
    getSingleSidedLiquidityAddress(),
    web3
  );
};

export const getProfileContract = (web3?: Web3) => {
  return getContract(profileABI, getPancakeProfileAddress(), web3);
};
export const getPancakeRabbitContract = (web3?: Web3) => {
  return getContract(pancakeRabbitsAbi, getPancakeRabbitsAddress(), web3);
};
export const getBunnyFactoryContract = (web3?: Web3) => {
  return getContract(bunnyFactoryAbi, getBunnyFactoryAddress(), web3);
};
export const getBunnySpecialContract = (web3?: Web3) => {
  return getContract(bunnySpecialAbi, getBunnySpecialAddress(), web3);
};
export const getLotteryContract = (web3?: Web3) => {
  return getContract(lotteryAbi, getLotteryAddress(), web3);
};
export const getLotteryTicketContract = (web3?: Web3) => {
  return getContract(lotteryTicketAbi, getLotteryTicketAddress(), web3);
};
export const getMasterchefContract = (web3?: Web3) => {
  return getContract(farmABI, getFarmAddress(), web3);
};
export const getClaimRefundContract = (web3?: Web3) => {
  return getContract(claimRefundAbi, getClaimRefundAddress(), web3);
};
export const getWinnerLotteryContract = (web3?: Web3) => {
  return getContract(lotteryAbi, getWinnerLotteryAddress(), web3);
};
export const getLoserLotteryContract = (web3?: Web3) => {
  return getContract(lotteryAbi, getLoserLotteryAddress(), web3);
};
