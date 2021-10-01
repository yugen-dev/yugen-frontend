import React from "react";
import styled from "styled-components";
import useI18n from "hooks/useI18n";
import { LinkExternal, Text } from "cryption-uikit";
import { VaultWithStakedValue } from "views/Farms/components/FarmCard/FarmCard";
import StakedAction from "./StakedAction";
import Apr, { AprProps } from "../Apr";
import Liquidity, { LiquidityProps } from "../Liquidity";

export interface ActionPanelProps {
  apr: AprProps;
  liquidity: LiquidityProps;
  details: VaultWithStakedValue;
}

const Container = styled.div`
  background: #ffffff;
  display: flex;
  width: 100%;
  flex-direction: column-reverse;
  padding: 24px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 32px;
  }
`;

const StyledLinkExternal = styled(LinkExternal)`
  font-weight: 400;
  color: #424945;
`;

const StyledText = styled(Text)`
  font-weight: 400;
  color: #424945;
`;

const StakeContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  align-items: center;
  display: flex;
  justify-content: space-between;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
  }
`;

const InfoContainer = styled.div`
  min-width: 200px;
`;

const ValueContainer = styled.div`
  display: block;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: none;
  }
`;

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 4px 0px;
`;

const ActionPanel: React.FunctionComponent<ActionPanelProps> = ({
  details,
  apr,
  liquidity,
}) => {
  const vault = details;

  const TranslateString = useI18n();
  const lpLabel =
    vault.lpTokenName && vault.lpTokenName.toUpperCase().replace("PANCAKE", "");
  const liquidityUrlPathParts = "";
  const bsc = "";

  return (
    <Container>
      <InfoContainer>
        <StakeContainer>
          <StyledLinkExternal
            href={`https://app.polydex.org/add/ETH/${liquidityUrlPathParts}`}
          >
            {TranslateString(999, `Get  ${lpLabel}`, { name: lpLabel })}
          </StyledLinkExternal>
        </StakeContainer>
        <StyledLinkExternal href={bsc}>
          {TranslateString(999, "PolygonScan")}
        </StyledLinkExternal>
        <StyledText>Deposited: 5 BTC-ETH LP</StyledText>
        <StyledText>BTC balance: 1 BTC ($ 10000)</StyledText>
        <StyledText>ETH balance: 2 BTC ($ 5000)</StyledText>
        <StyledText>Total balance: $ 15000</StyledText>
        <StyledText>In Wallet: 10 BTC-ETH LP</StyledText>
        <StyledText>Daily ROI: 0.34%</StyledText>
        <StyledText>APY ROI: 34%</StyledText>
      </InfoContainer>
      <ValueContainer>
        <ValueWrapper>
          <Text>APR</Text>
          <Apr {...apr} />
        </ValueWrapper>
        <ValueWrapper>
          <Text>Liquidity</Text>
          <Liquidity {...liquidity} />
        </ValueWrapper>
      </ValueContainer>
      <ActionContainer>
        <StakedAction {...vault} />
      </ActionContainer>
    </Container>
  );
};

export default ActionPanel;
