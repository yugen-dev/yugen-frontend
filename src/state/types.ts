import { Toast } from "cryption-uikit";
import BigNumber from "bignumber.js";
import {
  CampaignType,
  FarmConfig,
  Nft,
  PoolConfig,
  Team,
  VaultConfig,
} from "config/constants/types";

export type TranslatableText =
  | string
  | {
      id: number;
      fallback: string;
      data?: {
        [key: string]: string | number;
      };
    };

export interface Vault extends VaultConfig {
  nonQuoteTokenAmount?: BigNumber;
  quoteTokenAmount?: BigNumber;
  lpTotalInQuoteToken?: BigNumber;
  nonQuoteVsQuote?: BigNumber;
  priceOfQuoteToken?: BigNumber;
  priceOfNonQuoteToken?: BigNumber;
  priceOfRewardToken?: BigNumber;
  poolWeight?: BigNumber;
  multiplier?: string;
  totalLPTokensStakedInFarms?: BigNumber;
  userData?: {
    index: number;
    allowance: BigNumber;
    lpTokenBalance: BigNumber;
    firstLpTokenBalance: BigNumber;
    secondLpTokenBalance: BigNumber;
    stakedBalance: BigNumber;
  };
}
export interface Farm extends FarmConfig {
  tokenAmount?: BigNumber;
  quoteTokenAmount?: BigNumber;
  lpTotalInQuoteToken?: BigNumber;
  tokenPriceVsQuote?: BigNumber;
  poolWeight?: BigNumber;
  lpTotalSupplyInMasterchef?: BigNumber;
  singleSidedTokenDecimal?: BigNumber;
  singleSidedToTokenDecimal?: BigNumber;
  userData?: {
    allowance: BigNumber;
    tokenBalance: BigNumber;
    stakedBalance: BigNumber;
    earnings: BigNumber;
    canHarvest: boolean;
    harvestInterval: BigNumber;
    SingleSidedAllowances: BigNumber;
    SingleSidedToTokenAllowances: BigNumber;
    SingleSidedTokenBalance: BigNumber;
    SingleSidedToTokenBalance: BigNumber;
  };
}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber;
  poolHarvestInterval?: number;
  poolwithdrawalFeeBP?: number;
  pooldepositFeeBP?: number;
  startBlock?: number;
  endBlock?: number;
  tokenAmount?: BigNumber;
  quoteTokenAmount?: BigNumber;
  lpTotalInQuoteToken?: BigNumber;
  tokenPriceVsQuote?: BigNumber;
  quoteTokenSecondAmount?: BigNumber;
  quoteTokeFirstAmount?: BigNumber;
  userData?: {
    allowance: BigNumber;
    stakingTokenBalance: BigNumber;
    stakedBalance: BigNumber;
    pendingReward: BigNumber;
    canHarvest: boolean;
    harvestInterval: BigNumber;
  };
}

export interface Profile {
  userId: number;
  points: number;
  teamId: number;
  nftAddress: string;
  tokenId: number;
  isActive: boolean;
  username: string;
  nft?: Nft;
  team: Team;
  hasRegistered: boolean;
}

// Slices states

export interface ToastsState {
  data: Toast[];
}

export interface FarmsState {
  data: Farm[];
}

export interface VaultsState {
  data: Vault[];
}

export interface PoolsState {
  data: Pool[];
}

export interface ProfileState {
  isInitialized: boolean;
  metaTranscation?: boolean;
  isLoading: boolean;
  hasRegistered: boolean;
  data: Profile;
}

export type TeamResponse = {
  0: string;
  1: string;
  2: string;
  3: string;
  4: boolean;
};

export type TeamsById = {
  [key: string]: Team;
};

export interface TeamsState {
  isInitialized: boolean;
  isLoading: boolean;
  data: TeamsById;
}

export interface Achievement {
  id: string;
  type: CampaignType;
  address: string;
  title: TranslatableText;
  description?: TranslatableText;
  badge: string;
  points: number;
}

export interface AchievementState {
  data: Achievement[];
}

// API Price State
export interface PriceList {
  [key: string]: number;
}

export interface PriceApiResponse {
  /* eslint-disable camelcase */
  update_at: string;
  prices: PriceList;
}

export interface PriceState {
  isLoading: boolean;
  lastUpdated: string;
  data: PriceList;
}

// Block

export interface Block {
  blockNumber: number;
}

// Global state

export interface State {
  vaults: VaultsState;
  farms: FarmsState;
  toasts: ToastsState;
  prices: PriceState;
  pools: PoolsState;
  profile: ProfileState;
  teams: TeamsState;
  achievements: AchievementState;
  block: Block;
}
