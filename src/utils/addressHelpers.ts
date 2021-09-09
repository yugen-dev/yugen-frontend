import addresses from "config/constants/contracts";
import { Address } from "config/constants/types";
import { poolsConfig } from "config/constants";

export const getAddress = (address: Address): string => {
  const chainId =
    window && window.ethereum
      ? window.ethereum.networkVersion
      : process.env.REACT_APP_CHAIN_ID;
  return address[chainId];
};

export const getSouschefContract = (id: number) => {
  const config = poolsConfig.find((pool) => pool.sousId === id);

  return getAddress(config.contractAddress);
};

export const getHybridStakingAddress = () => {
  return getAddress(addresses.hybridstaking);
};

export const getSingleSidedLiquidityAddress = () => {
  return getAddress(addresses.signleSidedLiquidity);
};

export const getCakeAddress = () => {
  return getAddress(addresses.cake);
};
export const getFarmAddress = () => {
  return getAddress(addresses.farm);
};
export const getCNTStakerAddress = () => {
  return getAddress(addresses.cntStaker);
};
export const getMulticallAddress = () => {
  return getAddress(addresses.mulltiCall);
};
export const getWbnbAddress = () => {
  return getAddress(addresses.wbnb);
};
export const getLotteryAddress = () => {
  return getAddress(addresses.lottery);
};
export const getLotteryTicketAddress = () => {
  return getAddress(addresses.lotteryNFT);
};
export const getPancakeProfileAddress = () => {
  return getAddress(addresses.pancakeProfile);
};
export const getPancakeRabbitsAddress = () => {
  return getAddress(addresses.pancakeRabbits);
};
export const getBunnyFactoryAddress = () => {
  return getAddress(addresses.bunnyFactory);
};
export const getClaimRefundAddress = () => {
  return getAddress(addresses.claimRefund);
};
export const getPointCenterIfoAddress = () => {
  return getAddress(addresses.pointCenterIfo);
};
export const getBunnySpecialAddress = () => {
  return getAddress(addresses.bunnySpecial);
};
export const getPolydexMigratorAddress = () => {
  return getAddress(addresses.polyDexMigrator);
};
export const getRewardsManagerAddress = () => {
  return getAddress(addresses.rewardsManager);
};
export const getuniversalOneSidedFarmAddress = () => {
  return getAddress(addresses.univerSaloneSidedFarm);
};
export const getL2IntermediatorAddress = () => {
  return getAddress(addresses.l2Intermediator);
};
