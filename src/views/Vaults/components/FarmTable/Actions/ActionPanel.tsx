import React from "react";
import styled from "styled-components";
import useI18n from "hooks/useI18n";
import { LinkExternal, Text } from "cryption-uikit";
import { VaultWithStakedValue } from "views/Farms/components/FarmCard/FarmCard";
import { BigNumber } from "bignumber.js";
import StakedAction from "./StakedAction";
import Apr, { AprProps } from "../Apr";
import Liquidity, { LiquidityProps } from "../Liquidity";
import { ApyProps } from "../Apy";
import { WalletProps } from "../Wallet";

export interface ActionPanelProps {
  apr: AprProps;
  liquidity: LiquidityProps;
  details: VaultWithStakedValue;
  apy: ApyProps;
  wallet: WalletProps;
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
  apy,
  liquidity,
  wallet,
}) => {
  const vault = details;
  const priceOf1LP = new BigNumber(liquidity.liquidity)
    .dividedBy(vault.totalLPTokensStakedInFarms)
    .toFixed(2);

  let totalBalanceValue = new BigNumber(0);
  if (priceOf1LP && !new BigNumber(priceOf1LP).isNaN()) {
    totalBalanceValue = new BigNumber(wallet.value).multipliedBy(priceOf1LP);
  }

  const TranslateString = useI18n();
  const lpLabel =
    vault.lpTokenName && vault.lpTokenName.toUpperCase().replace("PANCAKE", "");
  const liquidityUrlPathParts = "";
  const bsc = "";
  const splitLP = vault.lpTokenName.split("-");

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
        <StyledText>
          Deposited: {vault?.userData?.stakedBalance} {vault?.lpTokenName} LP
        </StyledText>
        <StyledText>
          {splitLP[0]} balance: {vault?.userData?.firstLpTokenBalance}{" "}
          {splitLP[0]} ($10000)
        </StyledText>
        <StyledText>
          {splitLP[1]} balance: {vault?.userData?.secondLpTokenBalance}{" "}
          {splitLP[1]} ($5000)
        </StyledText>
        <StyledText>Total balance: ${totalBalanceValue.toString()}</StyledText>
        <StyledText>
          In Wallet: {wallet?.value} {vault?.lpTokenName} LP
        </StyledText>
        <StyledText>Daily ROI: {apr?.value}%</StyledText>
        <StyledText>APY ROI: {apy?.value}%</StyledText>
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
