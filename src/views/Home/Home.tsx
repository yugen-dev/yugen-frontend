import React, { useRef, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { PoolCategory, QuoteToken } from "config/constants/types";
import { ParentSize } from "@visx/responsive";
import Grid from "@material-ui/core/Grid";
// import orderBy from "lodash/orderBy";
import { useQuery } from "@apollo/client";
import Container from "@material-ui/core/Container";
import useI18n from "hooks/useI18n";
import useWeb3 from "hooks/useWeb3";
// import getCntPrice from "utils/getCntPrice";
import useInterval from "hooks/useInterval";
import { dayDatasQuery, burnQuery } from "apollo/queries";
import {
  CNT_CIRCULATING_SUPPLY_LINK,
  BLOCKS_PER_YEAR,
  CAKE_PER_BLOCK,
  CAKE_POOL_PID,
  CNT_TOTAL_SUPPLY_LINK,
} from "config";
import { getDayData } from "apollo/exchange";
import {
  useFarms,
  useGetApiPrices,
  usePoolss,
  usePriceBnbBusd,
  usePriceBtcBusd,
  usePriceCakeBusd,
  usePriceEthBusd,
} from "state/hooks";

import FarmStakingCard from "views/Home/components/FarmStakingCard";
import LotteryCard from "views/Home/components/LotteryCard";
// import CakeStats from "views/Home/components/CakeStats";
import StatsCard from "views/Home/components/StatsCard";
import Areachart from "components/Areachart";
import TotalValueLockedCard from "views/Home/components/TotalValueLockedCard";
import EarnAssetCard from "views/Home/components/EarnAssetCard";
import calculateFunc from "utils/getAllFarmsAPY";
import calculatePoolsFunc from "utils/getPoolsAPY";
// import WinCard from "views/Home/components/WinCard";

const Hero = styled.div`
  align-items: left;
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
  text-align: center;
`;

const Card = styled.div`
  border-radius: 0.625rem !important;
  padding: 30px 15px;
  background-color: #1e202a;
`;

const Home: React.FC = () => {
  const maxFarmsAPYRef = useRef(Number.MIN_VALUE);
  const maxPoolsAPYRef = useRef(Number.MIN_VALUE);
  const [maxFarmsAPY, setMaxFarmsAPY] = useState("0");
  const [maxPoolsAPY, setMaxPoolsAPY] = useState("0");
  const [ciculatingSupply, setciculatingSupply] = useState(0);
  // const [valueOfCNTinUSD, setCNTVal] = useState(0);
  const [totalSupplyVal, setTotalSupply] = useState(0);
  // useEffect(() => {
  //   const getPrice = async () => {
  //     const apiResp = await getCntPrice();
  //     // setCNTVal(apiResp);
  //   };
  //   getPrice();
  // }, []);
  const getCirculatingSupply = async () => {
    try {
      const res = await fetch(CNT_CIRCULATING_SUPPLY_LINK);
      const data = await res.json();
      setciculatingSupply(parseFloat(data.toFixed(3)));
    } catch {
      // eslint-disable-next-line no-console
      console.error("Failed to get Circulating supply");
    }
  };
  const getTotalSupply = async () => {
    try {
      const res = await fetch(CNT_TOTAL_SUPPLY_LINK);
      const data = await res.json();
      setTotalSupply(parseFloat(data.toFixed(3)));
    } catch {
      // eslint-disable-next-line no-console
      console.error("Failed to get Circulating supply");
    }
  };
  useEffect(() => {
    getCirculatingSupply();
    getTotalSupply();
  }, []);

  const cakePriceUsd = usePriceCakeBusd();
  const farmsLP = useFarms();
  const poolsMultirewardFarms = usePoolss();
  const ethPriceUsd = usePriceEthBusd();
  const btcPriceUsd = usePriceBtcBusd();
  const prices = useGetApiPrices();
  let totalBurned = 0;
  let liquidity = [];
  let totalFees = "";
  let devFees = "";
  let stakerFees = "";
  let lpFees = "";
  let burnerFees = "";
  const bnbPrice = usePriceBnbBusd();
  const web3 = useWeb3();
  // let cntStakingRatio = 0.0;
  const TranslateString = useI18n();

  const getHighestPoolsAPY = async () => {
    await calculatePoolsAPY();
    return maxPoolsAPYRef.current.toLocaleString("en-US").slice(0, -1);
  };

  const getHighestFarmsAPY = async () => {
    const activeFarms = farmsLP.filter((farm) => farm.multiplier !== "0X");
    calculateAPY(activeFarms);
    await calculateMultirewardsAPY();
    return maxFarmsAPYRef.current.toLocaleString("en-US").slice(0, -1);
  };

  const calculateMultirewardsAPY = async () => {
    const activeMultirewardFarms = poolsMultirewardFarms.filter(
      (farm) =>
        farm.poolCategory === PoolCategory.CORE && farm.isFinished !== true
    );
    if (prices) {
      const multirewardsAPR = await Promise.all(
        activeMultirewardFarms.map(async (pool) => {
          const apy = await calculateFunc(pool, prices);
          return apy;
        })
      );

      const Test = multirewardsAPR;
      const maxAPRInCoreAndMultirewards = Math.max(...Test);
      if (maxFarmsAPYRef.current < maxAPRInCoreAndMultirewards)
        maxFarmsAPYRef.current = maxAPRInCoreAndMultirewards;
      return maxAPRInCoreAndMultirewards;
    }
    return 0;
  };

  const calculatePoolsAPY = async () => {
    const activePools = poolsMultirewardFarms.filter(
      (pool) =>
        pool.poolCategory === PoolCategory.COMMUNITY && pool.isFinished !== true
    );
    if (prices) {
      const poolsAPR = await Promise.all(
        activePools.map(async (pool) => {
          const apy = await calculatePoolsFunc(pool, prices, cakePriceUsd);
          return apy;
        })
      );

      const Test = poolsAPR;
      const maxAPRInPools = Math.max(...Test);
      if (maxPoolsAPYRef.current < maxAPRInPools)
        maxPoolsAPYRef.current = maxAPRInPools;
      return maxAPRInPools;
    }
    return 0;
  };

  const calculateAPY = useCallback(
    (farmsToDisplay) => {
      const cakePriceVsBNB = new BigNumber(
        farmsLP.find((farm) => farm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote ||
          0
      );

      farmsToDisplay.map((farm) => {
        if (
          !farm.tokenAmount ||
          !farm.lpTotalInQuoteToken ||
          !farm.lpTotalInQuoteToken
        ) {
          return farm;
        }
        const cakeRewardPerBlock = CAKE_PER_BLOCK.times(farm.poolWeight);
        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR);

        let apy = cakePriceVsBNB
          .times(cakeRewardPerYear)
          .div(farm.lpTotalInQuoteToken);
        if (
          farm.quoteTokenSymbol === QuoteToken.BUSD ||
          farm.quoteTokenSymbol === QuoteToken.UST
        ) {
          apy = cakePriceVsBNB
            .times(cakeRewardPerYear)
            .div(new BigNumber(farm.tokenAmount).plus(farm.quoteTokenAmount))
            .times(bnbPrice);
        } else if (farm.quoteTokenSymbol === QuoteToken.ETH) {
          apy = cakePriceUsd
            .div(ethPriceUsd)
            .times(cakeRewardPerYear)
            .div(farm.lpTotalInQuoteToken);
        } else if (farm.quoteTokenSymbol === QuoteToken.BTC) {
          const usdcBTCAmt = new BigNumber(farm.tokenAmount).div(btcPriceUsd);
          const totalTokensInLp = new BigNumber(farm.quoteTokenAmount).plus(
            usdcBTCAmt
          );
          apy = cakePriceUsd
            .div(btcPriceUsd)
            .times(cakeRewardPerYear)
            .div(totalTokensInLp);
        } else if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
          apy = cakeRewardPerYear.div(farm.lpTotalInQuoteToken);
        } else if (farm.dual) {
          const cakeApy =
            farm &&
            cakePriceVsBNB
              .times(cakeRewardPerBlock)
              .times(BLOCKS_PER_YEAR)
              .div(farm.lpTotalInQuoteToken);
          const dualApy =
            farm.tokenPriceVsQuote &&
            new BigNumber(farm.tokenPriceVsQuote)
              .times(farm.dual.rewardPerBlock)
              .times(BLOCKS_PER_YEAR)
              .div(farm.lpTotalInQuoteToken);

          apy = cakeApy && dualApy && cakeApy.plus(dualApy);
        }
        if (maxFarmsAPYRef.current < apy.toNumber())
          maxFarmsAPYRef.current = apy.toNumber();

        return apy;
      });
    },
    [bnbPrice, farmsLP, cakePriceUsd, ethPriceUsd, btcPriceUsd]
  );

  const dayDatas = useQuery(dayDatasQuery, {
    context: {
      clientName: "exchange",
    },
  });
  // const getCNTStakerInfo = useQuery(cntStakerQuery, {
  //   context: {
  //     clientName: "cntstaker",
  //   },
  // });
  const burnData = useQuery(burnQuery, {
    context: {
      clientName: "burn",
    },
  });
  // if (
  //   getCNTStakerInfo &&
  //   getCNTStakerInfo.data &&
  //   getCNTStakerInfo.data.cntstaker &&
  //   dayDatas &&
  //   dayDatas.data &&
  //   dayDatas.data.dayDatas &&
  //   cakePriceUsd
  // ) {
  //   cntStakingRatio =
  //     (((parseFloat(dayDatas.data.dayDatas[1].volumeUSD) * 0.0005 * 0.35) /
  //       parseFloat(getCNTStakerInfo.data.cntstaker.totalSupply)) *
  //       365) /
  //     (parseFloat(getCNTStakerInfo.data.cntstaker.ratio) *
  //       parseFloat(valueOfCNTinUSD.toString()));
  // }
  if (
    burnData &&
    burnData.data &&
    burnData.data.cntBurns &&
    burnData.data.cntBurns.length > 0
  ) {
    totalBurned = parseFloat(
      web3.utils.fromWei(burnData.data.cntBurns[0].amount, "ether")
    );
  }
  if (dayDatas && dayDatas.data && dayDatas.data.dayDatas) {
    [liquidity] = dayDatas.data.dayDatas
      .filter((d) => d.liquidityUSD !== "0")
      .reduce(
        (previousValue, currentValue) => {
          previousValue[0].unshift({
            date: currentValue.date,
            value: parseFloat(currentValue.liquidityUSD),
          });
          previousValue[1].unshift({
            date: currentValue.date,
            value: parseFloat(currentValue.volumeUSD),
          });
          return previousValue;
        },
        [[], []]
      );
    totalFees = (
      parseFloat(dayDatas.data.dayDatas[0].volumeUSD) * 0.003
    ).toFixed(4);
    lpFees = (parseFloat(totalFees) * (5 / 6)).toFixed(4);
    stakerFees = ((parseFloat(totalFees) / 6) * 0.35).toFixed(4);
    burnerFees = ((parseFloat(totalFees) / 6) * 0.55).toFixed(4);
    devFees = ((parseFloat(totalFees) / 6) * 0.1).toFixed(4);
  }
  useInterval(() => Promise.all([getDayData]), 60000);

  const farmsGetterFunc = async () => {
    const maxValue = await getHighestFarmsAPY();
    setMaxFarmsAPY(() => maxValue);
  };
  const poolsGetterFunc = async () => {
    const maxValue = await getHighestPoolsAPY();
    setMaxPoolsAPY(() => maxValue);
  };

  useEffect(() => {
    farmsGetterFunc();
    poolsGetterFunc();
  });

  return (
    <Container
      maxWidth="lg"
      style={{ marginTop: "50px", marginBottom: "80px" }}
    >
      <Grid container spacing={5} justify="center">
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Hero>
              <CNHeading>{TranslateString(576, "PolyDEX")}</CNHeading>
            </Hero>
            <FarmStakingCard />
          </div>
        </Grid>
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <LotteryCard />
        </Grid>
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <StatsCard
            totalSuply={Number(totalSupplyVal.toFixed(2))}
            burnedSupply={Number(totalBurned.toFixed(2))}
            circulatingSupply={Number(ciculatingSupply.toFixed(2))}
            totalFees={Number(totalFees).toFixed(2)}
            devFees={Number(devFees).toFixed(2)}
            stakerFees={Number(stakerFees).toFixed(2)}
            lpFees={Number(lpFees).toFixed(2)}
            burnerFees={Number(burnerFees).toFixed(2)}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={6} xl={6} style={{ alignSelf: "center" }}>
          <Card style={{ height: 373 }}>
            {liquidity && liquidity.length > 0 && (
              <ParentSize>
                {({ width, height }) => (
                  <Areachart
                    title="Liquidity"
                    width={width}
                    height={height}
                    data={liquidity}
                    margin={{ top: 125, right: 0, bottom: 0, left: 0 }}
                    tooltipDisabled
                    overlayEnabled
                  />
                )}
              </ParentSize>
            )}
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6} xl={6}>
              <TotalValueLockedCard />
            </Grid>
            <Grid item xs={12} md={6} lg={6} xl={6}>
              <EarnAssetCard
                topTitle="Earn up to"
                description={`${maxFarmsAPY}%`}
                descriptionColor="#29bb89"
                bottomTitle="APR in farms"
                redirectLink="/farms"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6} xl={6}>
              <EarnAssetCard
                topTitle="Earn"
                bottomTitle="in Farms "
                description="CNT, MAHA"
                redirectLink="/multirewards"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6} xl={6}>
              <EarnAssetCard
                topTitle="Earn"
                bottomTitle="APR in pools"
                description={`${maxPoolsAPY}%`}
                descriptionColor="#29bb89"
                redirectLink="/pools"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

const CNHeading = styled.div`
  font-size: 50px;
  font-weight: bold;
  text-align: center;
  color: white;
  margin-bottom: 20px;
`;

export default Home;
