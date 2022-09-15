import addresses from "config/constants/contracts";
import { Address } from "config/constants/types";
import { poolsConfig } from "config/constants";

export const getAddress = (address: Address): string => {
  let chainId =
    window && window.ethereum
      ? window.ethereum.networkVersion
      : process.env.REACT_APP_CHAIN_ID;
  if (localStorage && localStorage.getItem("chainId")) {
    chainId = localStorage.getItem("chainId");
  }
  return address[chainId || "137"];
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

export const getCxEthWethSingleSidedLiquidityAddress = () => {
  return getAddress(addresses.cxEthWethSingleSidedLiquidity);
};

export const getCakeAddress = () => {
  return getAddress(addresses.cake);
};
export const getFarmAddress = () => {
  return getAddress(addresses.farm);
};
export const getFarmWrapperAddress = () => {
  return getAddress(addresses.farmWrapper);
};
export const getCxEthWethFarmWrapperAddress = () => {
  return getAddress(addresses.cxEthWethFarmWrapper);
};
export const getYgnStakerAddress = () => {
  return getAddress(addresses.ygnStaker);
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
export const getYugenMigratorAddress = () => {
  return getAddress(addresses.yugenMigrator);
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
export const getFygnAddress = () => {
  return getAddress(addresses.fygn);
};
export const getFygnBurnerAddress = () => {
  return getAddress(addresses.fygnBurner);
};

export const getProxyAddress = () => {
  return getAddress(addresses.proxy)
};
