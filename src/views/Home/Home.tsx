import React, { useRef, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import { QuoteToken } from "config/constants/types";
// import orderBy from "lodash/orderBy";
import { useQuery } from "@apollo/client";
import Container from "@material-ui/core/Container";
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
  useFarmsTotalValue,
  useVaultsTotalValue,
  usePriceBnbBusd,
  usePriceBtcBusd,
  usePriceCakeBusd,
  usePriceEthBusd,
  useVaultsApr,
} from "state/hooks";

import { Heading, Text } from "cryption-uikit";
import FarmedStakingCard from "views/Home/components/FarmStakingCard";
import Grid from "@material-ui/core/Grid";
import CardValue from "./components/CardValue";
import EarnAssetCard from "./components/EarnAssetCard";
import StatsCard from "./components/StatsCard";
import LotteryCard from "./components/LotteryCard";
import PieChart from "./components/PieChart";

const Home: React.FC = () => {
  const farmsTVL = useFarmsTotalValue();
  const vaultsTVL = useVaultsTotalValue();
  const maxVaultsAPY = useVaultsApr();
  const totalTVL = BigNumber.sum(farmsTVL, vaultsTVL).toFixed(2);

  const maxFarmsAPYRef = useRef(Number.MIN_VALUE);
  const [maxFarmsAPY, setMaxFarmsAPY] = useState("0");
  const [ciculatingSupply, setciculatingSupply] = useState(0);
  // const [valueOfCNTinUSD, setCNTVal] = useState(0);
  const [totalSupplyVal, setTotalSupply] = useState(0);
  // useEffect(() => {
  //   const getPrice = async () => {
  //     const apiResp = await getCntPrice();
  //     setCNTVal(apiResp);
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
  const ethPriceUsd = usePriceEthBusd();
  const btcPriceUsd = usePriceBtcBusd();
  let totalBurned = 0;
  let liquidity = [];
  let totalFees = "";
  let devFees = "";
  let stakerFees = "";
  let lpFees = "";
  let burnerFees = "";
  const bnbPrice = usePriceBnbBusd();
  const web3 = useWeb3();

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

  const dayDatas = useQuery(dayDatasQuery, {
    context: {
      clientName: "exchange",
    },
  });
  const burnData = useQuery(burnQuery, {
    context: {
      clientName: "burn",
    },
  });

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
          <FarmedStakingCard />
        </Grid>
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <Card2>
            <Heading size="lg" textAlign="center">
              Total Value Locked
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

            <SubTVLContainer>
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
            </SubTVLContainer>
          </Card2>
        </Grid>
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6} xl={6}>
              <EarnAssetCard
                topTitle="Earn up to"
                description={`${maxFarmsAPY}%`}
                descriptionColor="#29bb89"
                bottomTitle="APR in farms"
                redirectLink="/farms"
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6} xl={6}>
              <EarnAssetCard
                topTitle="Earn up to"
                bottomTitle="APR in vaults"
                description={`${new BigNumber(maxVaultsAPY).toFixed(2)}%`}
                descriptionColor="#29bb89"
                redirectLink="/vaults"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={8} lg={8} xl={8}>
          <StatsCard />
        </Grid>
        <Grid item xs={12} md={4} lg={4} xl={4}>
          <PieChart />
        </Grid>
      </Grid>
    </Container>
  );
};

const Hero = styled.div`
  align-items: left;
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const SubTVLContainer = styled.div`
  min-width: 100%;
  display: flex;

  @media (max-width: 550px) {
    flex-wrap: wrap;
  }
`;

const FarmsTVL = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const VaultsTVL = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Card2 = styled.div`
  background: #ffffff;
  width: 100%;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  border-radius: 1rem;
  padding: 35px 35px;
`;

export default Home;
