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
  getYgnStakerAddress,
  getCakeAddress,
  getLotteryAddress,
  getLotteryTicketAddress,
  getFarmAddress,
  getPointCenterIfoAddress,
  getClaimRefundAddress,
  getHybridStakingAddress,
  getSingleSidedLiquidityAddress,
  getRewardsManagerAddress,
  getuniversalOneSidedFarmAddress,
  getL2IntermediatorAddress,
  getFygnBurnerAddress,
  getFygnAddress,
  getFarmWrapperAddress,
  getCxEthWethFarmWrapperAddress,
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
import vaultAbi from "config/abi/vault.json";
import ygnStaker from "config/abi/ygnStaker.json";
import sousChef from "config/abi/sousChef.json";
import sousChefBnb from "config/abi/sousChefBnb.json";
import claimRefundAbi from "config/abi/claimRefund.json";
import lotteryAbi from "config/abi/lottery.json";
import rewardsManagerAbi from "config/abi/rewardsmanager.json";
import universalOnesidedFarmAbi from "config/abi/universalOnesidedFarm.json";
import l2IntermediatorAbi from "config/abi/l2Intermediator.json";
import fygnAbi from "config/abi/fygn_abi.json";
import fygnBurnerAbi from "config/abi/fygn_burner.json";
import farmWrapperAbi from "config/abi/farmWrapper.json";
import cxEthWethFarmWrapperAbi from "config/abi/cxEthWethFarmWrapper.json";

export const getContract = (abi: any, address: string, web3?: Web3) => {
  const _web3 = web3 ?? web3NoAccount;
  return new _web3.eth.Contract(abi as unknown as AbiItem, address);
};

export const getERC20Contract = (address: string, web3?: Web3) => {
  return getContract(erc20Abi, address, web3);
};
export const getVaultContract = (address: string, web3?: Web3) => {
  return getContract(vaultAbi, address, web3);
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
export const getYgnStakerContract = (web3?: Web3) => {
  return getContract(ygnStaker, getYgnStakerAddress(), web3);
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
export const getFarmWrapper = (web3?: Web3) => {
  return getContract(farmWrapperAbi, getFarmWrapperAddress(), web3);
};
export const getCxEthWethFarmWrapper = (web3?: Web3) => {
  return getContract(
    cxEthWethFarmWrapperAbi,
    getCxEthWethFarmWrapperAddress(),
    web3
  );
};
export const getClaimRefundContract = (web3?: Web3) => {
  return getContract(claimRefundAbi, getClaimRefundAddress(), web3);
};
export const getRewardsManagerContract = (web3?: Web3) => {
  return getContract(rewardsManagerAbi, getRewardsManagerAddress(), web3);
};
export const getUnivesalOneSidedContract = (web3?: Web3) => {
  return getContract(
    universalOnesidedFarmAbi,
    getuniversalOneSidedFarmAddress(),
    web3
  );
};
export const getL2IntermediatorContract = (web3?: Web3) => {
  return getContract(l2IntermediatorAbi, getL2IntermediatorAddress(), web3);
};
export const getFygnContract = (web3?: Web3) => {
  return getContract(fygnAbi, getFygnAddress(), web3);
};
export const getFygnBurnerContract = (web3?: Web3) => {
  return getContract(fygnBurnerAbi, getFygnBurnerAddress(), web3);
};
