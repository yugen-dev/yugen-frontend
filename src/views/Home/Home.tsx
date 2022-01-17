import React, { useRef, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { QuoteToken } from "config/constants/types";
// import orderBy from "lodash/orderBy";
import Container from "@material-ui/core/Container";
// import getCntPrice from "utils/getCntPrice";
import useInterval from "hooks/useInterval";
import {
  BLOCKS_PER_YEAR,
  CAKE_PER_BLOCK,
  CAKE_POOL_PID,
  YUGEN_INFO_CUSTOM_API,
} from "config";
import { getDayData } from "apollo/exchange";
import { Lock } from "react-feather";
import {
  useFarms,
  useFarmsTotalValue,
  useVaultsTotalValue,
  usePriceBnbBusd,
  usePriceBtcBusd,
  usePriceCakeBusd,
  usePriceEthBusd,
  // useVaultsApr,
  useFetch,
} from "state/hooks";

import { Heading } from "cryption-uikit";
import Grid from "@material-ui/core/Grid";
import CardValue from "./components/CardValue";
import EarnAssetCard from "./components/EarnAssetCard";
import YgnStatsCard from "./components/YgnStatsCard";
import FygnStatsCard from "./components/FygnStatsCard";
import XygnStatsCard from "./components/XygnStatsCard";
import LotteryCard from "./components/LotteryCard";
import PieChart from "./components/PieChart";

const Home: React.FC = () => {
  const {
    data: ApiData,
    loading: ApiLoading,
    error: ApiError,
  } = useFetch(YUGEN_INFO_CUSTOM_API);
  const farmsTVL = useFarmsTotalValue();
  const vaultsTVL = useVaultsTotalValue();
  // const maxVaultsAPY = useVaultsApr();
  const totalTVL = BigNumber.sum(farmsTVL, vaultsTVL).toFixed(2);

  const maxFarmsAPYRef = useRef(Number.MIN_VALUE);
  const [maxFarmsAPY, setMaxFarmsAPY] = useState("0");

  const cakePriceUsd = usePriceCakeBusd();
  const farmsLP = useFarms();
  const ethPriceUsd = usePriceEthBusd();
  const btcPriceUsd = usePriceBtcBusd();
  const bnbPrice = usePriceBnbBusd();

  const getHighestFarmsAPY = async () => {
    const activeFarms = farmsLP.filter((farm) => farm.multiplier !== "0X");
    calculateFarmsAPR(activeFarms);
    return maxFarmsAPYRef.current.toLocaleString("en-US").slice(0, -1);
  };

  const calculateFarmsAPR = useCallback(
    (farmsToDisplay) => {
      const cakePriceVsBNB = new BigNumber(
        farmsLP.find((farm) => farm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote ||
          0
      );

      farmsToDisplay.map((farm) => {
        if (!farm.tokenAmount || !farm.lpTotalInQuoteToken) {
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

  useInterval(() => Promise.all([getDayData]), 60000);

  const farmsGetterFunc = async () => {
    const maxValue = await getHighestFarmsAPY();
    setMaxFarmsAPY(() => maxValue);
  };

  useEffect(() => {
    farmsGetterFunc();
  });

  return (
    <Container
      maxWidth="lg"
      style={{
        marginTop: "50px",
        marginBottom: "80px",
      }}
    >
      <HomeOverlay>
        <Lock size="64px" />
        <span style={{ margin: "0px 0px 0px 10px" }}> Coming Soon..... </span>
      </HomeOverlay>

      <HomeContainer>
        <Grid container spacing={5} justify="center">
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <Hero>
              <Heading size="xxl">Yugen</Heading>
            </Hero>
            <LotteryCard />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            lg={6}
            xl={6}
            style={{ display: "flex", alignItems: "flex-end" }}
          >
            <PieChart
              pieData={ApiData}
              pieLoading={ApiLoading}
              pieError={ApiError}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={4} xl={4}>
            <YgnStatsCard
              data={ApiData}
              loading={ApiLoading}
              error={ApiError}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={4} xl={4}>
            <FygnStatsCard
              data={ApiData}
              loading={ApiLoading}
              error={ApiError}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={4} xl={4}>
            <XygnStatsCard
              data={ApiData}
              loading={ApiLoading}
              error={ApiError}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={6} xl={6}>
            <Card2>
              <Heading
                size="lg"
                textAlign="center"
                style={{ width: "100%" }}
                color="#887263"
              >
                Total Value Locked
              </Heading>
              <Heading
                style={{ width: "100%" }}
                textAlign="center"
                color="#887263"
              >
                :
              </Heading>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CardValue
                  value={Number(totalTVL)}
                  lineHeight="1.5"
                  prefix="$"
                  fontSize="38px"
                  decimals={0}
                />
              </div>

              {/* <SubTVLContainer>
              <FarmsTVL>
                <Text>Farms</Text>
                <CardValue
                  value={farmsTVL?.toNumber()}
                  lineHeight="1.5"
                  prefix="$"
                  fontSize="30px"
                  decimals={0}
                />
              </FarmsTVL>
              <VaultsTVL>
                <Text>Vaults</Text>
                <CardValue
                  value={vaultsTVL?.toNumber()}
                  lineHeight="1.5"
                  prefix="$"
                  fontSize="30px"
                  decimals={0}
                />
              </VaultsTVL>
            </SubTVLContainer> */}
            </Card2>
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={6} xl={6}>
                <EarnAssetCard
                  topTitle="Earn up to"
                  description={`${maxFarmsAPY}%`}
                  descriptionColor="#449c2c"
                  bottomTitle="APR in farms"
                  redirectLink="/farms"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6} xl={6}>
                <EarnAssetCard
                  topTitle="Bonds"
                  bottomTitle="APR in bonds"
                  description="Coming soon..."
                  descriptionColor="#449c2c"
                  redirectLink="/bonds"
                />
              </Grid>
              {/* <Grid item xs={12} md={6} lg={6} xl={6}>
              <EarnAssetCard
                topTitle="Earn up to"
                bottomTitle="APR in vaults"
                description={`${new BigNumber(maxVaultsAPY).toFixed(2)}%`}
                descriptionColor="#449c2c"
                redirectLink="/vaults"
              />
            </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </HomeContainer>
    </Container>
  );
};

const HomeOverlay = styled.div`
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  position: absolute;
  font-size: 74px;
  text-align: center;
  z-index: 99;
  /* background: #d4c8ae; */
  padding: 5px 0px;
  color: #424945;
  width: 100%;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  &:hover {
    cursor: not-allowed;
  }
`;

const HomeContainer = styled.div`
  min-height: 100%;
  opacity: 0.4;
  z-index: 1;
  position: relative;

  &:hover {
    cursor: not-allowed;
  }
`;

const Hero = styled.div`
  align-items: left;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

// const SubTVLContainer = styled.div`
//   min-width: 100%;
//   display: flex;

//   @media (max-width: 550px) {
//     flex-wrap: wrap;
//   }
// `;

// const FarmsTVL = styled.div`
//   margin-top: 20px;
//   width: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   flex-direction: column;
// `;
// const VaultsTVL = styled.div`
//   margin-top: 20px;
//   width: 100%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   flex-direction: column;
// `;

const Card2 = styled.div`
  background: #ffffff;
  width: 100%;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  border-radius: 1rem;
  padding: 30px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Home;
