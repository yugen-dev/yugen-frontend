/* eslint-disable react/no-danger */
import React, { useState, useEffect, useMemo, useRef } from "react";
import { Route, useRouteMatch } from "react-router-dom";
import BigNumber from "bignumber.js";
import orderBy from "lodash/orderBy";
import Container from "@material-ui/core/Container";
import partition from "lodash/partition";
import { PoolCategory } from "config/constants/types";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import { useWeb3React } from "@web3-react/core";
import {
  usePools,
  useBlock,
  usePriceCakeBusd,
  usePriceEthBusd,
  usePriceBnbBusd,
  usePriceBtcBusd,
} from "state/hooks";
import { getCakeContract } from "utils/contractHelpers";
import cntMascot from "images/Cryption Network Mascot Farming.png";
import PoolTabButtons from "./components/PoolTabButtons";
// import FlexLayout from "components/layout/Flex";
// import pools from "config/constants/pools";
import PoolCard from "./components/PoolCard";
import MrCNTaah from "../../images/MrCNTaah.png";

const NUMBER_OF_POOLS_VISIBLE = 12;
const Farm: React.FC = () => {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const cntPrice = usePriceCakeBusd();
  const bnbPrice = usePriceBnbBusd();
  const ethPrice = usePriceEthBusd();
  const btcPrice = usePriceBtcBusd();
  const { path } = useRouteMatch();
  const cake = getCakeContract();
  const { account } = useWeb3React("web3");
  const pools = usePools(account);
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(
    NUMBER_OF_POOLS_VISIBLE
  );
  const [observerIsSet, setObserverIsSet] = useState(false);
  const [stakedOnly, setStakedOnly] = useState(false);
  const currentBlock = useBlock();
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
  }, []);

  useEffect(() => {
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
  }, [cake, observerIsSet]);

  return (
    <div>
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <CNHeading>Multi-Rewards Farms</CNHeading>
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={cntMascot} alt="Cryption Netwrok" width="250px" />
            </div>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="lg">
        <PoolTabButtons
          stackedOnly={stakedOnly}
          setStackedOnly={setStakedOnly}
        />
        <Route exact path={`${path}`}>
          <Grid
            container
            spacing={3}
            style={{ margin: "30px 0px" }}
            justify="center"
          >
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
                            bnbPrice={bnbPrice}
                            ethPrice={ethPrice}
                            btcPrice={btcPrice}
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
                            bnbPrice={bnbPrice}
                            ethPrice={ethPrice}
                            btcPrice={btcPrice}
                          />{" "}
                        </Grid>
                      )
                  )}
          </Grid>
          {((stakedOnly && stakedOnlyOpenPools.length === 0) ||
            (!stakedOnly && openPools.length === 0)) && (
            <div
              style={{
                width: "100%",
                display: "grid",
                justifyContent: "center",
              }}
            >
              <img src={MrCNTaah} alt="Cannot find" width="250px" />
            </div>
          )}
        </Route>
        <Route path={`${path}/history`}>
          <Grid
            container
            spacing={3}
            style={{ margin: "30px 0px" }}
            justify="center"
          >
            {stakedOnly
              ? orderBy(stakedOnlyFinishedPools, ["sortOrder"])
                  .slice(0, numberOfPoolsVisible)
                  .map((pool) => (
                    <Grid item xs={12} md={6} lg={4} xl={4}>
                      <PoolCard
                        key={pool.sousId}
                        pool={pool}
                        valueOfCNTinUSD={cntPrice}
                        bnbPrice={bnbPrice}
                        ethPrice={ethPrice}
                        btcPrice={btcPrice}
                      />
                    </Grid>
                  ))
              : orderBy(finishedPools, ["sortOrder"])
                  .slice(0, numberOfPoolsVisible)
                  .map((pool) => (
                    <Grid item xs={12} md={6} lg={4} xl={4}>
                      <PoolCard
                        key={pool.sousId}
                        pool={pool}
                        valueOfCNTinUSD={cntPrice}
                        bnbPrice={bnbPrice}
                        ethPrice={ethPrice}
                        btcPrice={btcPrice}
                      />
                    </Grid>
                  ))}
          </Grid>
          {((stakedOnly && stakedOnlyFinishedPools.length === 0) ||
            (!stakedOnly && finishedPools.length === 0)) && (
            <div
              style={{
                width: "100%",
                display: "grid",
                justifyContent: "center",
              }}
            >
              <img src={MrCNTaah} alt="Cannot find" width="250px" />
            </div>
          )}
        </Route>
        <div ref={loadMoreRef} />
      </Container>
    </div>
  );
};

const CNHeading = styled.div`
  font-size: 45px;
  font-weight: bold;
  text-align: center;
  color: white;
  margin-bottom: 20px;
`;
export default Farm;
