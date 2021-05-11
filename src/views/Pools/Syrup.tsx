/* eslint-disable react/no-danger */
import React, { useState, useEffect } from "react";
import { Route, useRouteMatch } from "react-router-dom";
import BigNumber from "bignumber.js";
import Container from "@material-ui/core/Container";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import { useWeb3React } from "@web3-react/core";
import { Heading } from "@pancakeswap-libs/uikit";
import { getBalanceNumber } from "utils/formatBalance";
import useI18n from "hooks/useI18n";
import FlexLayout from "components/layout/Flex";
import { getCakeContract, getCoffeeTableContract } from "utils/contractHelpers";
import pools from "config/constants/pools";
import PoolCard from "./components/PoolCard";
import StakeCNT from "./components/StakeCNT";
import UnstakeXCNT from "./components/UnstakeXCNT";

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
    <div>
      <Hero>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6} xl={6}>
              <HeadingTex>
                {TranslateString(738, "Syrup Pool")}
              </HeadingTex>
              <ul style={{ color: "#86878f" }}>
                <DescriptionTextLi>{TranslateString(580, "Stake CNT to earn more CNT.")}</DescriptionTextLi>
                <DescriptionTextLi>
                  {TranslateString(
                    486,
                    "ℹ️️ You will earn a portion of the swaps fees based on the amount of xCNT held relative the weight of the staking."
                  )}
                </DescriptionTextLi>
                <DescriptionTextLi>{TranslateString(406, "xCNT can be minted by staking CNT")}</DescriptionTextLi>
                <DescriptionTextLi>
                  {TranslateString(
                    406,
                    "To redeem CNT staked plus swap fees convert xCNT back to CNT."
                  )}
                </DescriptionTextLi>
                <DescriptionTextLi>
                  {totalSupply
                    ? `There are currently ${getBalanceNumber(
                      totalSupply
                    )} xCNT in existence.`
                    : ""}
                </DescriptionTextLi>
              </ul>
            </Grid>
            <Grid item xs={12} md={6} lg={6} xl={6}>
              {/* <img
                src="../../../public/images/syrup.png"
                alt="SYRUP POOL icon"
                width={410}
                height={191}
              /> */}
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    '<lottie-player src="https://assets7.lottiefiles.com/packages/lf20_0cvczw8l.json"  background="transparent"  speed="1" style="height: 200px;" loop  autoplay></lottie-player>',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Hero>
      <Container maxWidth="lg">
        <Route exact path={`${path}`}>
          <Grid container spacing={3} style={{margin: '30px 0px'}}>
            {
              pools.map((pool) => (
                <Grid item xs={12} md={6} lg={4} xl={4}>
                  <PoolCard key={pool.sousId} pool={pool} />
                </Grid>
              ))
            }
          </Grid>
          {/* <StakeCNT /> */}
          {/* <UnstakeXCNT /> */}
        </Route>
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
const HeadingTex = styled.div`
  font-size: 23px;
  font-weight: bold;
  text-align: left;
  color: white;
  margin-bottom: 20px;
`;

const DescriptionTextLi = styled.li`
  font-size: 17px;
  font-weight: normal;
  text-align: left;
  margin-bottom: 10px !important;
  color: #9d9fa8;
`;
export default Farm;
