import React from "react";
import styled from "styled-components";
import ApyButton from "views/Farms/components/FarmCard/ApyButton";
import { Address, QuoteToken } from "config/constants/types";
import BigNumber from "bignumber.js";
import { BASE_ADD_LIQUIDITY_URL } from "config";
import getLiquidityUrlPathParts from "utils/getLiquidityUrlPathParts";
import useI18n from "hooks/useI18n";

export interface AprProps {
  value: string;
  multiplier: string;
  lpLabel: string;
  quoteTokenAdresses: Address;
  quoteTokenSymbol: QuoteToken;
  tokenAddresses: Address;
  cakePrice: BigNumber;
  originalValue: BigNumber;
  hideButton?: boolean;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 10px;
  button {
    width: 20px;
    height: 20px;

    svg {
      path {
        fill: #2082e9;
      }
    }
  }
`;

const AprWrapper = styled.div`
  min-width: 60px;
  text-align: left;
  font-size: 20px;
  font-weight: 600;
  color: #86878f;
`;

const Apr: React.FC<AprProps> = ({
  value,
  lpLabel,
  quoteTokenAdresses,
  quoteTokenSymbol,
  tokenAddresses,
  cakePrice,
  originalValue,
  hideButton = false,
}) => {
  const TranslateString = useI18n();
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAdresses,
    quoteTokenSymbol,
    tokenAddresses,
  });
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`;
  return (
    <Container>
      {originalValue ? (
        <>
          <AprWrapper>{value}%</AprWrapper>
          {!hideButton && (
            <ApyButton
              lpLabel={lpLabel}
              cakePrice={cakePrice}
              apy={originalValue}
              addLiquidityUrl={addLiquidityUrl}
            />
          )}
        </>
      ) : (
        <AprWrapper>{TranslateString(656, "Loading...")}</AprWrapper>
      )}
    </Container>
  );
};

export default Apr;
