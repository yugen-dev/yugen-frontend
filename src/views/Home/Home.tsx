import React from "react";
import styled from "styled-components";
import { ParentSize } from "@visx/responsive";
import Grid from "@material-ui/core/Grid";
import { useQuery } from "@apollo/client";
import Container from "@material-ui/core/Container";
import useI18n from "hooks/useI18n";
import useInterval from "hooks/useInterval";
import { dayDatasQuery } from "apollo/queries";
import { getDayData } from "apollo/exchange";
import { getApollo } from "apollo/index";
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

  const TranslateString = useI18n();
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
    <Container maxWidth="lg" style={{ marginTop: '50px' }}>
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
              <EarnAssetCard />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6} xl={6}>
              <EarnAssetCard />
            </Grid>
            <Grid item xs={12} md={6} lg={6} xl={6}>
              <EarnAssetCard />
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
