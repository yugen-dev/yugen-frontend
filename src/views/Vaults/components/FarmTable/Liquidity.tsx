import React from "react";
import styled from "styled-components";

export interface LiquidityProps {
  liquidity: number;
  realLiquidityInVaults?: number;
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
  margin-top: 10px;
  svg {
    margin-left: 14px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    svg {
      margin-left: 0;
    }
  }
`;

const Liquidity: React.FunctionComponent<LiquidityProps> = ({
  realLiquidityInVaults,
}) => {
  const displayLiquidity = realLiquidityInVaults
    ? `$${Number(realLiquidityInVaults).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })}`
    : "-";

  return (
    <Container>
      <LiquidityWrapper>
        <CNText>{displayLiquidity}</CNText>
      </LiquidityWrapper>
    </Container>
  );
};

const CNText = styled.div`
  margin-right: 5px;
  font-size: 20px;
  font-weight: 600;
  color: #86878f;
  padding: none;
`;

export default Liquidity;
