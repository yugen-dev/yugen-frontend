import React from "react";
import styled from "styled-components";
import { HelpIcon, Text } from "cryption-uikit";
import useI18n from "hooks/useI18n";

import Tooltip from "../Tooltip/Tooltip";

export interface LiquidityProps {
  liquidity: number;
}

const LiquidityWrapper = styled.div`
  font-weight: 600;
  text-align: right;

  ${({ theme }) => theme.mediaQueries.sm} {
    text-align: left;
  }
`;

const Container = styled.div`
  display: flex;

  svg {
    margin-left: 14px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    svg {
      margin-left: 0;
    }
  }
`;

const Liquidity: React.FunctionComponent<LiquidityProps> = ({ liquidity }) => {
  console.log("liquidity", liquidity);
  const displayLiquidity = liquidity
    ? `$${Number(liquidity).toLocaleString(undefined, {
        maximumFractionDigits: 0,
      })}`
    : "-";
  const TranslateString = useI18n();

  return (
    <Container>
      <LiquidityWrapper>
        <CNText>{displayLiquidity}</CNText>
      </LiquidityWrapper>
      <Tooltip
        content={TranslateString(
          999,
          "The total value of the funds in this farm’s liquidity pool"
        )}
      >
        <HelpIcon color="textSubtle" style={{marginTop: '10px'}}/>
      </Tooltip>
    </Container>
  );
};

const CNText = styled.div`
  margin-top: 10px;
  margin-right: 5px;
  font-size: 20px;
  font-weight: 600;
  color: #86878F;
  padding: none;
`;

export default Liquidity;
