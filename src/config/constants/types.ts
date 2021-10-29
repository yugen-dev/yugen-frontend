import { ChainId } from "@cryption-network/polydex-sdk";
import { TranslatableText } from "state/types";

export type IfoStatus = "idle" | "coming_soon" | "live" | "finished";

export interface Ifo {
  id: string;
  isActive: boolean;
  address: string;
  name: string;
  subTitle?: string;
  description?: string;
  launchDate: string;
  launchTime: string;
  saleAmount: string;
  raiseAmount: string;
  cakeToBurn: string;
  projectSiteUrl: string;
  currency: string;
  currencyAddress: string;
  tokenDecimals: number;
  tokenSymbol: string;
  releaseBlockNumber: number;
  campaignId?: string;
}

export enum QuoteToken {
  "BNB" = "BNB",
  "CAKE" = "CAKE",
  "SYRUP" = "SYRUP",
  "BUSD" = "BUSD",
  "TWT" = "TWT",
  "UST" = "UST",
  "ETH" = "ETH",
  "COMP" = "COMP",
  "SUSHI" = "SUSHI",
  "TPT" = "TPT",
  "CNT" = "CNT",
  "MUSD" = "MUSD",
  "MATIC" = "MATIC",
  "PR" = "PR",
  "TEST1" = "TEST1",
  "LP" = "LP",
  "BTC" = "BTC",
  "MAHA" = "MAHA",
  "PEAR" = "PEAR",
  "WMATIC" = "WMATIC",
  "USDC" = "USDC",
  "DAI" = "DAI",
  "USDT" = "USDT",
  "LUSD" = "LUSD",
  "LUSDT" = "LUSDT",
  "LARTH" = "LARTH",
  "WFTM" = "WFTM",
  "FTM" = "FTM",
  "BOO" = "BOO",
}

export enum PoolCategory {
  "COMMUNITY" = "Community",
  "CORE" = "Core",
  "BINANCE" = "Binance", // Pools using native BNB behave differently than pools using a token
}

export interface Address {
  97?: string;
  56: string;
  5?: string;
  80001: string;
  137: string;
  1?: string;
  250?: string;
  4002?: string;
}

export interface FarmConfig {
  pid: number;
  lpSymbol: string;
  lpAddresses: Address;
  tokenSymbol: string;
  tokenAddresses: Address;
  quoteTokenSymbol: QuoteToken;
  quoteTokenAdresses: Address;
  multiplier?: string;
  poolHarvestInterval?: number;
  isCommunity?: boolean;
  singleSidedToken?: Address;
  singleSidedToToken?: Address;
  singleSidedTokenName: string;
  singleSidedToTokenName: string;
  dual?: {
    rewardPerBlock: number;
    earnLabel: string;
    endBlock: number;
  };
}

export interface PoolConfig {
  sousId: number;
  image?: string;
  TopImage?: string;
  tokenName: string;
  tokenAdressInLp: string;
  tokenAddressSecondInLp?: string;
  tokenAddress: string;
  stakingTokenName: QuoteToken;
  quoteTokenSymbol: QuoteToken;
  stakingLimit?: number;
  stakingTokenAddress?: string;
  stakingTokenDecimals?: number;
  contractAddress: Address;
  poolCategory: PoolCategory;
  projectLink: string;
  tokenPerBlock: string;
  sortOrder?: number;
  multiReward?: string[];
  coinGeckoIds?: string[];
  stakingTokenCoinGeckoid?: string;
  rewardTokenCoinGeckoid?: string;
  multiRewardTokenPerBlock?: string[];
  harvest?: boolean;
  isFinished?: boolean;
  tokenDecimals: number;
  metamaskImg?: string;
}

export interface VaultConfig {
  pid: number;
  rewardTokenCoinGecko?: string;
  quoteTokenCoinGecko?: string;
  blocksPerYearOfRewardToken: number;
  rewardTokenPerBlock: number;
  rewardMultiplier: string;
  lpTokenName: string;
  coinGeckoLpTokenName?: string;
  lpTokenAddress: Address;
  lpTokenPart1Address: Address;
  lpTokenPart2Address: Address;
  vaultAddress: Address;
  strategyAddress: Address;
  quoteTokenSymbol: string;
  quoteTokenAddress: Address;
  nonQuoteTokenSymbol: string;
  nonQuoteTokenAddress: Address;
}

export type Images = {
  lg: string;
  md: string;
  sm: string;
  ipfs?: string;
};

export type NftImages = {
  blur?: string;
} & Images;

export type NftVideo = {
  webm: string;
  mp4: string;
};

export type Nft = {
  name: string;
  description: string;
  images: NftImages;
  sortOrder: number;
  bunnyId: number;
  video?: NftVideo;
};

export type TeamImages = {
  alt: string;
} & Images;

export type Team = {
  id: number;
  name: string;
  description: string;
  isJoinable?: boolean;
  users: number;
  points: number;
  images: TeamImages;
  background: string;
  textColor: string;
};

export type CampaignType = "ifo";

export type Campaign = {
  id: string;
  type: CampaignType;
  title?: TranslatableText;
  description?: TranslatableText;
  badge?: string;
};

export interface MigrateConfig {
  label: string;
  value: string;
  migratorAddress: {
    readonly [chainId in ChainId]?: string;
  };
}

export interface LotteryInfoProps {
  lotteryId: number;
  winnerLottery: {
    lotteryAddress: string;
    tokenName: string;
    tokenAddress: string;
    tokenDecimals: number;
    tokenLogo: any;
    metamaskImg?: string;
    rewardToken: string;
  };
  loserLottery: {
    lotteryAddress: string;
    tokenName: string;
    tokenAddress: string;
    tokenLogo: any;
    tokenDecimals: number;
    metamaskImg?: string;
    rewardToken: string;
    rewardTokenDecimals: number;
  };
}
