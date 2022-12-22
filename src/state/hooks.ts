/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import { kebabCase } from "lodash";
import { useWeb3React } from "@web3-react/core";
import {
  getCakeContract,
  getHybridStakingContract,
} from "utils/contractHelpers";
import contracts from "config/constants/contracts";
import { Toast, toastTypes } from "yugen-uikit";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Team } from "config/constants/types";
import { getWeb3NoAccount } from "utils/web3";
import useRefresh from "hooks/useRefresh";
import CoinGecko from "coingecko-api";
import { YUGEN_INFO_CUSTOM_API } from "config";
import {
  fetchFarmsPublicDataAsync,
  fetchVaultsPublicDataAsync,
  push as pushToast,
  remove as removeToast,
  clear as clearToast,
  setBlock,
} from "./actions";
import {
  State,
  Farm,
  Pool,
  Block,
  ProfileState,
  TeamsState,
  AchievementState,
  PriceState,
  Vault,
} from "./types";

import { fetchProfile } from "./profile";
import { fetchTeam, fetchTeams } from "./teams";
import { fetchAchievements } from "./achievements";
import { fetchPrices } from "./prices";

const ZERO = new BigNumber(0);

let chainID = "137";
if (window && window.ethereum) {
  chainID = window.ethereum.networkVersion;
} else if (localStorage && localStorage.getItem("chainId")) {
  chainID = localStorage.getItem("chainId");
}
export const useFetchPublicData = () => {
  const dispatch = useDispatch();
  const { slowRefresh } = useRefresh();
  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync());
    dispatch(fetchVaultsPublicDataAsync());
  }, [dispatch, slowRefresh]);

  useEffect(() => {
    const web3 = getWeb3NoAccount();
    const interval = setInterval(async () => {
      const blockNumber = await web3.eth.getBlockNumber();
      dispatch(setBlock(blockNumber));
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);
};

// Farms

export const useFarms = (): Farm[] => {
  const farms = useSelector((state: State) => state.farms.data);
  return farms;
};

export const useVaults = (): Vault[] => {
  const vaults = useSelector((state: State) => state.vaults.data);
  return vaults;
};

export const useVaultFromPid = (pid): Vault => {
  const vault = useSelector((state: State) =>
    state.vaults.data.find((v) => v.pid === pid)
  );
  return vault;
};

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) =>
    state.farms.data.find((f) => f.pid === pid)
  );
  return farm;
};

export const useFarmFromSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) =>
    state.farms.data.find((f) => f.lpSymbol === lpSymbol)
  );
  return farm;
};

export const useVaultUser = (pid) => {
  const vault = useVaultFromPid(pid);

  return {
    allowance: vault.userData
      ? new BigNumber(vault.userData.allowance)
      : new BigNumber(0),
    tokenBalance: vault.userData
      ? new BigNumber(vault.userData.lpTokenBalance)
      : new BigNumber(0),
    stakedBalance: vault.userData
      ? new BigNumber(vault.userData.stakedBalance)
      : new BigNumber(0),
  };
};

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid);

  return {
    allowance: farm.userData
      ? new BigNumber(farm.userData.allowance)
      : new BigNumber(0),
    tokenBalance: farm.userData
      ? new BigNumber(farm.userData.tokenBalance)
      : new BigNumber(0),
    stakedBalance: farm.userData
      ? new BigNumber(farm.userData.stakedBalance)
      : new BigNumber(0),
    earnings: farm.userData
      ? new BigNumber(farm.userData.earnings)
      : new BigNumber(0),
    canHarvest: farm.userData ? farm.userData.canHarvest : false,
    harvestInterval: farm.userData
      ? new BigNumber(farm.userData.harvestInterval)
      : new BigNumber(0),
    SingleSidedAllowances: farm.userData
      ? new BigNumber(farm.userData.SingleSidedAllowances)
      : new BigNumber(0),
    SingleSidedTokenBalance: farm.userData
      ? new BigNumber(farm.userData.SingleSidedTokenBalance)
      : new BigNumber(0),
    SingleSidedToTokenBalance: farm.userData
      ? new BigNumber(farm.userData.SingleSidedToTokenBalance)
      : new BigNumber(0),
    SingleSidedToTokenAllowances: farm.userData
      ? new BigNumber(farm.userData.SingleSidedToTokenAllowances)
      : new BigNumber(0),
  };
};

// Pools

export const usePoolFromPid = (sousId): Pool => {
  const pool = useSelector((state: State) =>
    state.pools.data.find((p) => p.sousId === sousId)
  );

  return pool;
};

// Prices

export const usePriceBnbBusd = (): BigNumber => {
  if (chainID === "80001" || chainID === "5") {
    return new BigNumber(10);
  }
  const pid = getBnbBusdPoolId(); // USD-MATIC LP, BUSD-BNB LP
  const farm = useFarmFromPid(pid);

  return farm?.tokenPriceVsQuote
    ? new BigNumber(1).div(farm?.tokenPriceVsQuote)
    : ZERO;
  // return new BigNumber(10);
};

// add for mainnet and fetch poolId from constants
export const getBnbBusdPoolId = (): number => {
  const poolIDs = {
    1: "",
    97: "",
    56: "",
    80001: "2",
    5: "",
    137: "",
  };
  return Number(poolIDs[`${chainID}`]);
};

// add for mainnet and fetch poolId from constants
export const getCakeBnbPoolId = (): number => {
  const poolIDs = {
    1: "",
    97: "",
    56: "",
    80001: "3",
    5: "",
    137: "",
  };
  return Number(poolIDs[`${chainID}`]);
};

export const useFetch = (url: string) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(() => true);
    axios
      .get(url)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(() => false);
      });
  }, [url]);

  return { data, loading, error };
};

export const usePriceCakeBusd = (): BigNumber => {
  const { data, loading, error } = useFetch(YUGEN_INFO_CUSTOM_API);

  return data?.ygnPrice && !loading && !error
    ? new BigNumber(data?.ygnPrice)
    : ZERO;
};

export const usePriceFygnUsd = (): BigNumber => {
  const { data, loading, error } = useFetch(YUGEN_INFO_CUSTOM_API);

  return data?.fygnPrice && !loading && !error
    ? new BigNumber(data?.fygnPrice)
    : ZERO;
};

export const usePriceEthBusd = (): BigNumber => {
  if (chainID === "80001" || chainID === "5") {
    return new BigNumber(10);
  }
  const pid = 8; // ETH-MATIC LP ,ETH-BNB LP
  const farm = useFarmFromPid(pid);
  return farm?.tokenPriceVsQuote
    ? new BigNumber(1).div(farm?.tokenPriceVsQuote)
    : ZERO;
  // return new BigNumber(10);
};

// pending
export const usePriceBtcBusd = (): BigNumber => {
  if (chainID === "80001" || chainID === "5") {
    return new BigNumber(10);
  }
  const pid = 5; // ETH-MATIC LP ,ETH-BNB LP
  // const bnbPriceUSD = usePriceBnbBusd();
  const farm = useFarmFromPid(pid);

  return farm?.tokenPriceVsQuote
    ? new BigNumber(1).div(farm?.tokenPriceVsQuote)
    : ZERO;
  // return new BigNumber(10);
};

// Toasts
export const useToast = () => {
  const dispatch = useDispatch();
  const helpers = useMemo(() => {
    const push = (toast: Toast) => dispatch(pushToast(toast));

    return {
      toastError: (title: string, description?: string) => {
        return push({
          id: kebabCase(title),
          type: toastTypes.DANGER,
          title,
          description,
        });
      },
      toastInfo: (title: string, description?: string) => {
        return push({
          id: kebabCase(title),
          type: toastTypes.INFO,
          title,
          description,
        });
      },
      toastSuccess: (title: string, description?: string) => {
        return push({
          id: kebabCase(title),
          type: toastTypes.SUCCESS,
          title,
          description,
        });
      },
      toastWarning: (title: string, description?: string) => {
        return push({
          id: kebabCase(title),
          type: toastTypes.WARNING,
          title,
          description,
        });
      },
      push,
      remove: (id: string) => dispatch(removeToast(id)),
      clear: () => dispatch(clearToast()),
    };
  }, [dispatch]);

  return helpers;
};

// Profile

export const useFetchProfile = () => {
  const { account } = useWeb3React("web3");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProfile(account));
  }, [account, dispatch]);
};

export const useProfile = () => {
  const {
    isInitialized,
    isLoading,
    data,
    hasRegistered,
    metaTranscation,
  }: ProfileState = useSelector((state: State) => state.profile);
  return {
    profile: data,
    metaTranscation,
    hasProfile: isInitialized && hasRegistered,
    isInitialized,
    isLoading,
  };
};

// Teams

export const useTeam = (id: number) => {
  const team: Team = useSelector((state: State) => state.teams.data[id]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTeam(id));
  }, [id, dispatch]);

  return team;
};

export const useTeams = () => {
  const { isInitialized, isLoading, data }: TeamsState = useSelector(
    (state: State) => state.teams
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  return { teams: data, isInitialized, isLoading };
};

// Achievements

export const useFetchAchievements = () => {
  const { account } = useWeb3React("web3");
  const dispatch = useDispatch();

  useEffect(() => {
    if (account) {
      dispatch(fetchAchievements(account));
    }
  }, [account, dispatch]);
};

export const useAchievements = () => {
  const achievements: AchievementState["data"] = useSelector(
    (state: State) => state.achievements.data
  );
  return achievements;
};

// Prices
export const useFetchPriceList = () => {
  const { slowRefresh } = useRefresh();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPrices());
  }, [dispatch, slowRefresh]);
};

export const fetchPrice = async (crypto: string) => {
  const CoinGeckoClient = new CoinGecko();
  const result = await CoinGeckoClient.coins.fetch(
    crypto.toLocaleLowerCase(),
    {}
  );
  const res = new BigNumber(result.data?.market_data?.current_price?.usd);
  return res;
};

export const useGetApiPrices = () => {
  const prices: PriceState["data"] = useSelector(
    (state: State) => state.prices.data
  );
  return prices;
};

export const GetApiPrice = (token: string) => {
  const prices = useGetApiPrices();

  if (!prices) {
    return null;
  }

  return prices[token.toLowerCase()];
};

export const useYgnStakerTvl = (): BigNumber => {
  const [ygnStakerTvlPrice, setYgnStakerTvlPrice] = useState(
    new BigNumber(2000)
  );

  useEffect(() => {
    const fetchPriceXygn = async () => {
      const contract = getCakeContract();
      const res = await contract.methods
        .balanceOf(contracts.ygnStaker[chainID || "137"])
        .call();
      setYgnStakerTvlPrice(
        new BigNumber(res).dividedBy(new BigNumber(10).pow(18))
      );
    };

    fetchPriceXygn();
  }, []);

  return ygnStakerTvlPrice;
};

export const useHybridstakingTvl = (): BigNumber => {
  const [HybridstakingTvlPrice, setHybridstakingTvlPrice] = useState(
    new BigNumber(2000)
  );

  useEffect(() => {
    const fetchPriceHybridYgn = async () => {
      try {
        const contract = getHybridStakingContract();
        const res = await contract.methods.totalCNTStaked().call();
        setHybridstakingTvlPrice(
          new BigNumber(res).dividedBy(new BigNumber(10).pow(18))
        );
      } catch (error) {
        console.error("error in useHybridstakingTvl", error);
      }
    };

    fetchPriceHybridYgn();
  }, []);

  return HybridstakingTvlPrice;
};

// Block
export const useBlock = (): Block => {
  return useSelector((state: State) => state.block);
};

export const useFarmsTotalValue = (): BigNumber => {
  const farms = useFarms();

  const totalStakerBalance = useYgnStakerTvl();
  // TODO: change ygn price from fixed to dynamic
  const ygnPrice = new BigNumber(0);

  let value = new BigNumber(0);
  for (let i = 0; i < farms.length; i++) {
    const farm = farms[i];
    if (farm.lpTotalInQuoteToken) {
      let val = new BigNumber(0);
      if (
        farm.isPool &&
        farm?.lpTotalSupplyInMasterchef &&
        farm?.lpDecimals &&
        farm?.quoteTokenCoinGeckoPrice
      ) {
        val = new BigNumber(farm?.lpTotalSupplyInMasterchef)
          .dividedBy(new BigNumber(10).pow(farm?.lpDecimals))
          .multipliedBy(farm?.quoteTokenCoinGeckoPrice);
      } else if (farm?.quoteTokenCoinGeckoPrice) {
        val = new BigNumber(farm?.quoteTokenCoinGeckoPrice).times(
          farm?.lpTotalInQuoteToken
        );
      } else {
        val = farm.lpTotalInQuoteToken;
      }

      value = value.plus(val);
    }
  }

  value = value.plus(totalStakerBalance.multipliedBy(ygnPrice));

  return value;
};

export const useVaultsTotalValue = (): BigNumber => {
  const vaults = useVaults();

  let maxLiq = new BigNumber(0);
  vaults.map((vault) => {
    if (!vault.nonQuoteTokenAmount || !vault.lpTotalInQuoteToken) {
      return new BigNumber(1);
    }

    let liquidity = new BigNumber(vault.lpTotalInQuoteToken);
    liquidity = new BigNumber(vault?.priceOfQuoteToken).times(
      vault.lpTotalInQuoteTokenOfVaults
    );

    if (liquidity?.isGreaterThan(maxLiq)) maxLiq = liquidity;
    return maxLiq;
  });

  const value = maxLiq;

  return value;
};
