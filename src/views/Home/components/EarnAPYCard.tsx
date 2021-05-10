import React, { useCallback, useRef } from "react";
import styled from "styled-components";
import {
  Heading,
  Card,
  CardBody,
  Flex,
  ArrowForwardIcon,
  Skeleton,
} from "cryption-uikit";
import { NavLink } from "react-router-dom";
import useI18n from "hooks/useI18n";
import BigNumber from "bignumber.js";
import { QuoteToken } from "config/constants/types";
import { useFarms, usePriceBnbBusd } from "state/hooks";
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from "config";

const StyledFarmStakingCard = styled(Card)`
  max-height: 225px;
  padding: 40px;
  background: #1E202A;
  box-shadow: 1px 2px 4px 3px rgba(0, 0, 0, 0.16);
  margin-left: auto;
  margin-right: auto;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
`;
const CardMidContent = styled.div`
font-size: 30px;
font-weight: bold;
color: #57CA81;
text-transform: capitalize;
`;

const EarnAPYCard = () => {
  const TranslateString = useI18n();
  const farmsLP = useFarms();
  const bnbPrice = usePriceBnbBusd();

  const maxAPY = useRef(Number.MIN_VALUE);

  const getHighestAPY = () => {
    const activeFarms = farmsLP.filter(
      (farm) => farm.pid !== 0 && farm.multiplier !== "0X"
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

  return (
    <StyledFarmStakingCard>
      <CNCardBody>
        <CNHeading >
          Earn up to
        </CNHeading>
        <CardMidContent>
          {getHighestAPY() ? (
            `${getHighestAPY()}% ${TranslateString(736, "APR")}`
          ) : (
            <Skeleton animation="pulse" variant="rect" height="44px" />
          )}
        </CardMidContent>
        <Flex justifyContent="space-between">
          <CNHeading>
            in Farms
          </CNHeading>
          {/* <NavLink exact activeClassName="active" to="/farms" id="farm-apy-cta">
            <ArrowForwardIcon mt={30} color="primary" />
          </NavLink> */}
        </Flex>
      </CNCardBody>
    </StyledFarmStakingCard>
  );
};

const CNHeading = styled.div`
color: #CFCCCC;
font-size: 18px;
font-weight: 600;
text-transform: capitalize;
`;

const CNCardBody = styled.div`
display: flex;
justify-content: space-between;
flex-direction: column;
height: 100%;
`;

export default EarnAPYCard;
