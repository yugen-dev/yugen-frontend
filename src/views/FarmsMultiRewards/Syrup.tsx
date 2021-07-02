/* eslint-disable react/no-danger */
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Route, useRouteMatch } from "react-router-dom";
import BigNumber from "bignumber.js";
import orderBy from "lodash/orderBy";
import Container from "@material-ui/core/Container";
import partition from "lodash/partition";
import { QuoteToken, PoolCategory } from "config/constants/types";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import { useWeb3React } from "@web3-react/core";
import { getBalanceNumber } from "utils/formatBalance";
import { usePools, useBlock, usePriceCakeBusd } from "state/hooks";
import useI18n from "hooks/useI18n";
import { CNTinUSDLink } from "config";
import { getCakeContract, getCNTStakerContract } from "utils/contractHelpers";
import PoolTabButtons from "./components/PoolTabButtons";
// import FlexLayout from "components/layout/Flex";
// import pools from "config/constants/pools";
import PoolCard from "./components/PoolCard";
import StakeCNT from "./components/StakeCNT";
import UnstakeXCNT from "./components/UnstakeXCNT";

const NUMBER_OF_POOLS_VISIBLE = 12;
const Farm: React.FC = () => {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [valueOfCNTinUSD, setCntPrice] = useState(0);
  const cntPrice = usePriceCakeBusd();
  const { path } = useRouteMatch();
  const TranslateString = useI18n();
  const cake = getCakeContract();
  const { account } = useWeb3React("web3");
  const pools = usePools(account);
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(
    NUMBER_OF_POOLS_VISIBLE
  );
  const [observerIsSet, setObserverIsSet] = useState(false);
  const [stakedOnly, setStakedOnly] = useState(false);
  const currentBlock = useBlock();
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const [finishedPools, openPools] = useMemo(
    () =>
      partition(
        pools,
        (pool) =>
          pool.isFinished ||
          parseInt(currentBlock.toString(), 10) > pool.endBlock
      ),
    [currentBlock, pools]
  );

  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter(
        (pool) =>
          pool.userData &&
          new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      ),
    [finishedPools]
  );
  const stakedOnlyOpenPools = useMemo(
    () =>
      openPools.filter(
        (pool) =>
          pool.userData &&
          new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      ),
    [openPools]
  );
  // const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0;
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const response = await fetch(CNTinUSDLink);
        const res = await response.json();
        setCntPrice(res);
      } catch (error) {
        console.error("Unable to fetch price data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchTotalSupply() {
      const xCNTContract = getCNTStakerContract();
      const supply = await xCNTContract.methods.totalSupply().call();
      setTotalSupply(new BigNumber(supply));
    }
    if (cake) {
      fetchTotalSupply();
    }
    const showMorePools = (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setNumberOfPoolsVisible(
          (poolsCurrentlyVisible) =>
            poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE
        );
      }
    };

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: "0px",
        threshold: 1,
      });
      loadMoreObserver.observe(loadMoreRef.current);
      setObserverIsSet(true);
    }
  }, [cake, observerIsSet, setTotalSupply]);

  return (
    <div>
      <Container maxWidth="lg">
        <CNHeading>Mutli-Rewards Farms</CNHeading>
      </Container>
      <Container maxWidth="lg">
        <PoolTabButtons
          stackedOnly={stakedOnly}
          setStackedOnly={setStakedOnly}
        />
        <Route exact path={`${path}`}>
          <Grid container spacing={3} style={{ margin: "30px 0px" }}>
            {stakedOnly
              ? orderBy(stakedOnlyOpenPools, ["sortOrder"])
                  .slice(0, numberOfPoolsVisible)
                  .map(
                    (pool) =>
                      pool.poolCategory === PoolCategory.CORE && (
                        <Grid item xs={12} md={6} lg={4} xl={4}>
                          <PoolCard
                            key={pool.sousId}
                            pool={pool}
                            valueOfCNTinUSD={cntPrice}
                          />{" "}
                        </Grid>
                      )
                  )
              : orderBy(openPools, ["sortOrder"])
                  .slice(0, numberOfPoolsVisible)
                  .map(
                    (pool) =>
                      pool.poolCategory === PoolCategory.CORE && (
                        <Grid item xs={12} md={6} lg={4} xl={4}>
                          <PoolCard
                            key={pool.sousId}
                            pool={pool}
                            valueOfCNTinUSD={cntPrice}
                          />{" "}
                        </Grid>
                      )
                  )}
          </Grid>
          {/* <StakeCNT /> */}
          {/* <UnstakeXCNT /> */}
        </Route>
        <Route path={`${path}/history`}>
          {stakedOnly
            ? orderBy(stakedOnlyFinishedPools, ["sortOrder"])
                .slice(0, numberOfPoolsVisible)
                .map((pool) => (
                  <PoolCard
                    key={pool.sousId}
                    pool={pool}
                    valueOfCNTinUSD={cntPrice}
                  />
                ))
            : orderBy(finishedPools, ["sortOrder"])
                .slice(0, numberOfPoolsVisible)
                .map((pool) => (
                  <PoolCard
                    key={pool.sousId}
                    pool={pool}
                    valueOfCNTinUSD={cntPrice}
                  />
                ))}
        </Route>
        <div ref={loadMoreRef} />
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<lottie-player src="https://assets3.lottiefiles.com/packages/lf20_r71cen62.json"  background="transparent"  speed="1" style="height: 350px;" loop  autoplay></lottie-player>',
          }}
        />
      </Container>
    </div>
  );
};

const Hero = styled.div`
  align-items: center;
  background: #383357;
  padding: 30px 0px;
  color: ${({ theme }) => theme.colors.primary};
  margin: 20px;
  border-radius: 10px;
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
    font-size: 16px;
    li {
      margin-bottom: 4px;
    }
  }
  img {
    height: auto;
    max-width: 100%;
  }
  @media (min-width: 576px) {
    max-width: none;
  }
`;
const CNHeading = styled.div`
  font-size: 45px;
  font-weight: bold;
  text-align: center;
  color: white;
  margin-bottom: 20px;
`;
export default Farm;
