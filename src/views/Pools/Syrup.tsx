import React, { useState, useEffect } from "react";
import { Route, useRouteMatch } from "react-router-dom";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { Heading } from "@pancakeswap-libs/uikit";
import { getBalanceNumber } from "utils/formatBalance";
import useI18n from "hooks/useI18n";
import FlexLayout from "components/layout/Flex";
import Page from "components/layout/Page";
import { getCakeContract, getCoffeeTableContract } from "utils/contractHelpers";

import StakeCNT from "./components/StakeCNT";
import UnstakeXCNT from "./components/UnstakeXCNT";
import Divider from "./components/Divider";

const Farm: React.FC = () => {
  const { path } = useRouteMatch();
  const TranslateString = useI18n();
  const cake = getCakeContract();
  const [totalSupply, setTotalSupply] = useState<BigNumber>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchTotalSupply() {
      const xCNTContract = getCoffeeTableContract();
      const supply = await xCNTContract.methods.totalSupply().call();
      setTotalSupply(new BigNumber(supply));
    }
    if (cake) {
      fetchTotalSupply();
    }
  }, [cake, setTotalSupply]);

  return (
    <Page>
      <Hero>
        <div>
          <Heading as="h1" size="xxl" mb="16px">
            {TranslateString(738, "Syrup Pool")}
          </Heading>
          <ul>
            <li>{TranslateString(580, "Stake CNT to earn more CNT.")}</li>
            <li>
              {TranslateString(
                486,
                "ℹ️️ You will earn a portion of the swaps fees based on the amount of xCNT held relative the weight of the staking."
              )}
            </li>
            <li>{TranslateString(406, "xCNT can be minted by staking CNT")}</li>
            <li>
              {TranslateString(
                406,
                "To redeem CNT staked plus swap fees convert xCNT back to CNT."
              )}
            </li>
            <li>
              {totalSupply
                ? `There are currently ${getBalanceNumber(
                    totalSupply
                  )} xCNT in existence.`
                : ""}
            </li>
          </ul>
        </div>
        <img
          src="../../../public/images/syrup.png"
          alt="SYRUP POOL icon"
          width={410}
          height={191}
        />
      </Hero>
      <Divider />
      <FlexLayout>
        <Route exact path={`${path}`}>
          <>
            {/* {
              orderBy(openPools, ["sortOrder"]).map((pool) => (
                  <PoolCard key={pool.sousId} pool={pool} />
                ))
            } */}
            <StakeCNT />
            <UnstakeXCNT />
          </>
        </Route>
      </FlexLayout>
    </Page>
  );
};

const Hero = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  display: grid;
  grid-gap: 32px;
  grid-template-columns: 1fr;
  margin-left: auto;
  margin-right: auto;
  max-width: 250px;
  padding: 48px 0;
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
    grid-template-columns: 1fr 1fr;
    margin: 0;
    max-width: none;
  }
`;

export default Farm;
