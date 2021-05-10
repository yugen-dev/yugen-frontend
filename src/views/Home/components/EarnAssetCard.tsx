import React from "react";
import styled from "styled-components";
import orderBy from "lodash/orderBy";
import {
  Heading,
  Card,
  CardBody,
  Flex,
  ArrowForwardIcon,
} from "cryption-uikit";
import { NavLink } from "react-router-dom";
import pools from "config/constants/pools";
import { Pool } from "state/types";

const StyledFarmStakingCard = styled(Card)`
  background: linear-gradient(180deg, #2082e9 0%, #9900ff 100%);
  padding: 40px;
  max-height: 225px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
`;
const CardMidContent = styled.div`
  color: #e0e0e0;
  font-size: 30px;
  font-weight: 800;
  line-height: 44px;
`;

const CNHeading = styled.div`
  margin: 10px 0;
  color: #cfcccc;
  font-size: "18px";
  font-weight: 600;
`;
const EarnAssetCard = () => {
  const activeNonCakePools = pools.filter(
    (pool) => !pool.isFinished && !pool.tokenName.includes("CAKE")
  );
  const latestPools: Pool[] = orderBy(
    activeNonCakePools,
    ["sortOrder", "pid"],
    ["desc", "desc"]
  ).slice(0, 3);
  // Always include CAKE
  const assets = ["CAKE", ...latestPools.map((pool) => pool.tokenName)].join(
    ", "
  );

  return (
    <StyledFarmStakingCard>
      <CNCardBody>
        <CNHeading>Earn</CNHeading>
        <CardMidContent>{assets}</CardMidContent>
        <Flex justifyContent="space-between">
          <CNHeading>in Pools</CNHeading>
          {/* <NavLink exact activeClassName="active" to="/syrup" id="pool-cta" >
            <ArrowForwardIcon mt={30} color="primary" />
          </NavLink> */}
        </Flex>
      </CNCardBody>
    </StyledFarmStakingCard>
  );
};

const CNCardBody = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

export default EarnAssetCard;
