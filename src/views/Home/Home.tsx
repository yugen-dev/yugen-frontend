import React, { useRef, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import Container from "@material-ui/core/Container";
import useInterval from "hooks/useInterval";
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, YUGEN_INFO_CUSTOM_API } from "config";
import { getDayData } from "apollo/exchange";
import {
  useFarms,
  useFarmsTotalValue,
  useVaultsTotalValue,
  // useVaultsApr,
  useFetch,
  usePriceFygnUsd,
} from "state/hooks";

import { Heading } from "yugen-uikit";
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
  const cakePrice = usePriceFygnUsd();
  const farmsLP = useFarms();

  const getHighestFarmsAPY = async () => {
    const activeFarms = farmsLP.filter((farm) => farm.multiplier !== "0X");
    calculateFarmsAPR(activeFarms);
    return maxFarmsAPYRef.current.toLocaleString("en-US").slice(0, -1);
  };

  const calculateFarmsAPR = useCallback(
    (farmsToDisplay) => {
      farmsToDisplay.map((farm) => {
        if (!farm.tokenAmount || !farm.lpTotalInQuoteToken) {
          return farm;
        }

        let totalValue = new BigNumber(1);

        if (
          farm.isPool &&
          farm?.lpTotalSupplyInMasterchef &&
          farm?.lpDecimals &&
          farm?.quoteTokenCoinGeckoPrice
        ) {
          totalValue = new BigNumber(farm?.lpTotalSupplyInMasterchef)
            .dividedBy(new BigNumber(10).pow(farm?.lpDecimals))
            .multipliedBy(farm?.quoteTokenCoinGeckoPrice);
        } else if (farm?.quoteTokenCoinGeckoPrice) {
          totalValue = new BigNumber(farm?.quoteTokenCoinGeckoPrice).times(
            farm?.lpTotalInQuoteToken
          );
        }

        let apy = new BigNumber(1);
        if (cakePrice) {
          apy = cakePrice
            .multipliedBy(BLOCKS_PER_YEAR)
            .multipliedBy(CAKE_PER_BLOCK)
            .multipliedBy(farm?.multiplier?.replace(/[^\d.-]/g, ""))
            .dividedBy(totalValue);
        }

        if (maxFarmsAPYRef.current < apy.toNumber())
          maxFarmsAPYRef.current = apy.toNumber();

        return apy;
      });
    },
    [cakePrice]
  );

  useInterval(() => Promise.all([getDayData]), 60000);

  const farmsGetterFunc = async () => {
    const maxValue = await getHighestFarmsAPY();
    setMaxFarmsAPY(() => maxValue);
  };

  useEffect(() => {
    farmsGetterFunc().catch((e) =>
      console.error("Error while fetching farms: ", e)
    );
  });

  return (
    <Container
      maxWidth="lg"
      style={{
        marginTop: "50px",
        marginBottom: "80px",
      }}
    >
      <HomeContainer>
        <Grid container spacing={5} justifyContent="center">
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
                  decimals={2}
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

const HomeContainer = styled.div``;

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  border-radius: 1rem;
  padding: 30px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Home;
