import React from "react";
import styled from "styled-components";
import useI18n from "hooks/useI18n";
import { LinkExternal, Text } from "cryption-uikit";
import { VaultWithStakedValue } from "views/Farms/components/FarmCard/FarmCard";
import { BigNumber } from "bignumber.js";
import { getBalanceNumber } from "utils/formatBalance";
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
  flex-direction: column;
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

const StakeContainer = styled.div`
  color: ${({ theme }) => theme.colors.text};
  align-items: center;
  display: flex;
  justify-content: space-evenly;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: space-between;
  }
  margin-top: 10px;
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
  width: 100%;
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

const StyledText = styled(Text)`
  margin: 10px;
`;

const StyledTextLabelItem = styled.div`
  text-align: center;
  color: #887263;
  font-weight: 400;
`;

const StyledTextValueItem = styled.div`
  text-align: center;
  color: #424945;
  font-weight: 400;
`;

const MainInfoContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
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

  return (
    <Container>
      <ValueContainer>
        <ValueWrapper>
          <Text>APY</Text>
          <Apr {...apy} />
        </ValueWrapper>
        <ValueWrapper>
          <Text>Liquidity</Text>
          <Liquidity {...liquidity} />
        </ValueWrapper>
      </ValueContainer>
      <ActionContainer>
        <StakedAction {...vault} />
      </ActionContainer>
      <InfoContainer>
        <MainInfoContainer>
          <StyledText>
            <StyledTextLabelItem>Deposited</StyledTextLabelItem>
            <StyledTextValueItem>
              {getBalanceNumber(
                new BigNumber(vault?.userData?.stakedBalance)
              ).toFixed(2)}{" "}
              {vault?.lpTokenName} LP
            </StyledTextValueItem>
          </StyledText>

          <StyledText>
            <StyledTextLabelItem>
              {" "}
              {vault.quoteTokenSymbol} balance{" "}
            </StyledTextLabelItem>
            <StyledTextValueItem>
              {getBalanceNumber(
                new BigNumber(vault?.userData?.stakedBalance)
                  .multipliedBy(vault.quoteTokenAmount)
                  .dividedBy(vault.totalLPTokensStakedInFarms)
              ).toFixed(2)}{" "}
              {vault.quoteTokenSymbol} ($
              {getBalanceNumber(
                new BigNumber(vault?.userData?.stakedBalance)
                  .multipliedBy(vault.quoteTokenAmount)
                  .dividedBy(vault.totalLPTokensStakedInFarms)
                  .multipliedBy(vault.priceOfQuoteToken)
              ).toFixed(2)}
              )
            </StyledTextValueItem>
          </StyledText>

          <StyledText>
            <StyledTextLabelItem>
              {" "}
              {vault.nonQuoteTokenSymbol} balance{" "}
            </StyledTextLabelItem>
            <StyledTextValueItem>
              {getBalanceNumber(
                new BigNumber(vault?.userData?.stakedBalance)
                  .multipliedBy(vault.nonQuoteTokenAmount)
                  .dividedBy(vault.totalLPTokensStakedInFarms)
              ).toFixed(2)}{" "}
              {vault.quoteTokenSymbol} ($
              {getBalanceNumber(
                new BigNumber(vault?.userData?.stakedBalance)
                  .multipliedBy(vault.nonQuoteTokenAmount)
                  .dividedBy(vault.totalLPTokensStakedInFarms)
                  .multipliedBy(vault.priceOfNonQuoteToken)
              ).toFixed(2)}
              )
            </StyledTextValueItem>
          </StyledText>

          <StyledText style={{ marginTop: "10px" }}>
            <StyledTextLabelItem>In Wallet</StyledTextLabelItem>
            <StyledTextValueItem>
              {" "}
              {wallet?.value} {vault?.lpTokenName} LP ($
              {totalBalanceValue.toFixed(2)})
            </StyledTextValueItem>
          </StyledText>
          <StyledText style={{ marginTop: "10px" }}>
            <StyledTextLabelItem> Daily ROI</StyledTextLabelItem>{" "}
            <StyledTextValueItem>{apr?.value}%</StyledTextValueItem>
          </StyledText>
          <StyledText>
            <StyledTextLabelItem> APY ROI </StyledTextLabelItem>
            <StyledTextValueItem> {apy?.value}%</StyledTextValueItem>
          </StyledText>
        </MainInfoContainer>
        <StakeContainer>
          <StyledLinkExternal href={vault.addLiquidityLink}>
            {TranslateString(999, `Get  ${lpLabel}`, { name: lpLabel })}
          </StyledLinkExternal>
          <StyledLinkExternal href={vault.blockExplorerLink}>
            {TranslateString(999, "BlockExplorer")}
          </StyledLinkExternal>
        </StakeContainer>
      </InfoContainer>
    </Container>
  );
};

export default ActionPanel;
