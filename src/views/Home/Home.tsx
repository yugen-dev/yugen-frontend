import React, { useRef, useCallback } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { QuoteToken } from "config/constants/types";
import { ParentSize } from "@visx/responsive";
import Grid from "@material-ui/core/Grid";
import orderBy from "lodash/orderBy";
import { useQuery } from "@apollo/client";
import Container from "@material-ui/core/Container";
import useI18n from "hooks/useI18n";
import useInterval from "hooks/useInterval";
import { dayDatasQuery } from "apollo/queries";
import { getDayData } from "apollo/exchange";
import { getApollo } from "apollo/index";
import pools from "config/constants/pools";
import { Pool } from "state/types";
import { useFarms, usePriceBnbBusd } from "state/hooks";
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from "config";
import FarmStakingCard from "views/Home/components/FarmStakingCard";
import LotteryCard from "views/Home/components/LotteryCard";
// import CakeStats from "views/Home/components/CakeStats";
import StatsCard from "views/Home/components/StatsCard";
import Areachart from 'components/Areachart';
import TotalValueLockedCard from "views/Home/components/TotalValueLockedCard";
import EarnAssetCard from "views/Home/components/EarnAssetCard";
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
    background-color: #1E202A;
`;

const Home: React.FC = () => {

  const farmsLP = useFarms();
  const bnbPrice = usePriceBnbBusd();
  const maxAPY = useRef(Number.MIN_VALUE);
  const TranslateString = useI18n();
  const activeNonCakePools = pools.filter(
    (pool) => !pool.isFinished
  );
  const latestPools: Pool[] = orderBy(
    activeNonCakePools,
    ["sortOrder", "pid"],
    ["desc", "desc"]
  ).slice(0, 3);
  // Always include CAKE
  const assets = [...latestPools.map((pool) => pool.tokenName)].join(
    ", "
  );
  const getHighestAPY = () => {
    const activeFarms = farmsLP.filter(
      (farm) => farm.multiplier !== "0X"
    );
    calculateAPY(activeFarms);
    return (maxAPY.current * 100).toLocaleString("en-US").slice(0, -1);
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
        if (farm.quoteTokenSymbol === QuoteToken.BUSD) {
          apy = cakePriceVsBNB
            .times(cakeRewardPerYear)
            .div(farm.lpTotalInQuoteToken)
            .times(bnbPrice);
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
        if (maxAPY.current < apy.toNumber()) maxAPY.current = apy.toNumber();

        return apy;
      });
    },
    [bnbPrice, farmsLP]
  );
  const dayDatas = useQuery(dayDatasQuery);
  useInterval(
    () =>
      Promise.all([
        getDayData,
      ]),
    60000
  );
  let liquidity = [];
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
  }
  return (
    <Container maxWidth="lg" style={{ marginTop: '50px', marginBottom: '80px' }}>
      <Grid container spacing={5} justify="center">
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <Hero>
              <CNHeading>{TranslateString(576, "PolyDex")}</CNHeading>
              <CNText>
                {TranslateString(
                  578,
                  "The #1 AMM and yield farm on Matic BlockChain."
                )}
              </CNText>
            </Hero>
            <FarmStakingCard />
          </div>
        </Grid>
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <LotteryCard />
        </Grid>
        {
          // Stats Card
        }
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <StatsCard
            totalSuply={126125600}
            circulatingSupply={15776336}
          />
        </Grid>
        {
          // Grapht Card
        }
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <Card style={{ height: 345 }}>
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
                description={getHighestAPY() ? `${getHighestAPY()}%}` : "0%"}
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
                bottomTitle="in Pools"
                description={assets}
                redirectLink="/pools"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6} xl={6}>
              <EarnAssetCard
                topTitle="Earn"
                description="8.63%"
                bottomTitle="on staking CNT"
                redirectLink="/cntbar"
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

const CNText = styled.div`
  font-size: 20px;
  font-weight: normal;
  text-align: center;
  color: #9d9fa8;
`;

export default Home;
