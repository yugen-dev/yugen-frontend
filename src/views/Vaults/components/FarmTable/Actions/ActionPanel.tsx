import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import useI18n from "hooks/useI18n";
import { LinkExternal, Text } from "cryption-uikit";
import { VaultWithStakedValue } from "views/Farms/components/FarmCard/FarmCard";
import { BigNumber } from "bignumber.js";
import { fetchPrice, usePriceCakeBusd } from "state/hooks";
import { getBalanceNumber } from "utils/formatBalance";
import { getAddress } from "utils/addressHelpers";
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
  const [arrayOfTokenBalances, setArrayOfTokenBalances] = useState(["0", "0"]);
  const ygnPrice = usePriceCakeBusd();
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
  const liquidityUrlPathParts = `${getAddress(
    vault.lpTokenPart1Address
  )}/${getAddress(vault.lpTokenPart1Address)}`;
  const bsc = `https://polygonscan.com/address/${getAddress(
    vault.lpTokenAddress
  )}`;
  const splitLP = vault.lpTokenName.split("-");

  const getLpPrices = useCallback(
    async (arrayOfLP) => {
      const arrayOfLpPrices = new Array(2);
      arrayOfLpPrices[0] = await fetchPrice(arrayOfLP[0]);
      if (arrayOfLP[1] === "YGN") arrayOfLpPrices[1] = ygnPrice;
      else arrayOfLpPrices[1] = await fetchPrice(arrayOfLP[1]);

      if (vault?.userData) {
        const lpTokenBalancesInUSD = new Array(2);
        lpTokenBalancesInUSD[0] = new BigNumber(arrayOfLpPrices[0])
          .multipliedBy(getBalanceNumber(vault.userData.firstLpTokenBalance))
          .toFixed(2)
          .toString();
        lpTokenBalancesInUSD[1] = new BigNumber(arrayOfLpPrices[1])
          .multipliedBy(getBalanceNumber(vault.userData.secondLpTokenBalance))
          .toFixed(2)
          .toString();

        setArrayOfTokenBalances(lpTokenBalancesInUSD);
      }
    },
    [vault.userData, ygnPrice]
  );

  useEffect(() => {
    if (splitLP.length === 2) getLpPrices(splitLP);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <InfoContainer>
        <StakeContainer>
          <StyledLinkExternal
            href={`https://app.polydex.org/add/${liquidityUrlPathParts}`}
          >
            {TranslateString(999, `Get  ${lpLabel}`, { name: lpLabel })}
          </StyledLinkExternal>
        </StakeContainer>
        <StyledLinkExternal href={bsc}>
          {TranslateString(999, "PolygonScan")}
        </StyledLinkExternal>

        <StyledText>
          Deposited:{" "}
          {getBalanceNumber(
            new BigNumber(vault?.userData?.stakedBalance)
          ).toFixed(2)}{" "}
          {vault?.lpTokenName} LP
        </StyledText>

        <StyledText>
          {splitLP[0]} Balance:{" "}
          {getBalanceNumber(
            new BigNumber(vault?.userData?.firstLpTokenBalance)
          ).toFixed(2)}{" "}
          {splitLP[0]} ($
          {arrayOfTokenBalances[0]})
        </StyledText>

        <StyledText>
          {splitLP[1]} Balance:{" "}
          {getBalanceNumber(
            new BigNumber(vault?.userData?.secondLpTokenBalance)
          ).toFixed(2)}
          {splitLP[1]} (${arrayOfTokenBalances[1]})
        </StyledText>

        <StyledText>Total Balance: ${totalBalanceValue.toString()}</StyledText>
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
