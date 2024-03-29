import React, { useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import styled, { keyframes } from "styled-components";
import { Flex, Text, Skeleton } from "yugen-uikit";
import { communityFarms } from "config/constants";
import { Farm, Vault } from "state/types";
import { provider as ProviderType } from "web3-core";
import useI18n from "hooks/useI18n";
import ExpandableSectionButton from "components/ExpandableSectionButton";
import { QuoteToken } from "config/constants/types";
import getLiquidityUrlPathParts from "utils/getLiquidityUrlPathParts";
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK } from "config";
import DetailsSection from "./DetailsSection";
import CardHeading from "./CardHeading";
import CardActionsContainer from "./CardActionsContainer";
import ApyButton from "./ApyButton";

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber;
  liquidity?: BigNumber;
}
export interface VaultWithStakedValue extends Vault {
  apy?: BigNumber;
  liquidity?: BigNumber;
}

const RainbowLight = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

const StyledCardAccent = styled.div`
  /* background: linear-gradient(
    45deg,
    rgba(42, 118, 235, 0.1) 0%,
    rgba(42, 118, 235, 0.2) 10%,
    rgba(42, 118, 235, 0.4) 20%,
    rgba(42, 118, 235, 0.6) 30%,
    rgba(42, 118, 235, 0.6) 40%,
    #2a76eb 50%,
    #9702ff 60%,
    rgba(151, 2, 255, 0.6) 70%,
    rgba(151, 2, 255, 0.6) 80%,
    rgba(151, 2, 255, 0.4) 90%,
    rgba(151, 2, 255, 0.2) 100%
  ); */
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 0.625rem !important;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
  /* */
`;

const FCard = styled.div`
  align-self: baseline;
  background: #ffffff;
  border-radius: 0.625rem !important;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 30px 15px;
  position: relative;
  text-align: center;
`;

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? "100%" : "0px")};
  overflow: hidden;
`;

interface FarmCardProps {
  farm: FarmWithStakedValue;
  removed: boolean;
  cakePrice?: BigNumber;
  bnbPrice?: BigNumber;
  ethPrice?: BigNumber;
  btcPrice?: BigNumber;
  provider?: ProviderType;
  account?: string;
  crossChainTranscations?: any;
}

const FarmCard: React.FC<FarmCardProps> = ({
  farm,
  removed,
  cakePrice,
  bnbPrice,
  ethPrice,
  btcPrice,
  account,
  crossChainTranscations,
}) => {
  const TranslateString = useI18n();

  const [showExpandableSection, setShowExpandableSection] = useState(false);

  const isCommunityFarm = communityFarms.includes(farm.tokenSymbol);
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  const farmImage = farm.lpSymbol.split(" ")[0].toLocaleLowerCase();

  const totalValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return null;
    }
    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(farm.lpTotalInQuoteToken);
    }
    if (farm.quoteTokenSymbol === QuoteToken.CAKE) {
      return cakePrice.times(farm.lpTotalInQuoteToken);
    }
    if (farm.quoteTokenSymbol === QuoteToken.YGN) {
      return cakePrice.times(farm.lpTotalInQuoteToken);
    }
    if (farm.quoteTokenSymbol === QuoteToken.ETH) {
      return ethPrice.times(farm.lpTotalInQuoteToken);
    }
    if (farm.quoteTokenSymbol === QuoteToken.BTC) {
      return btcPrice
        .times(farm.quoteTokenAmount)
        .plus(new BigNumber(farm.tokenAmount));
    }

    if (farm.quoteTokenSymbol === QuoteToken.BUSD) {
      return new BigNumber(farm.tokenAmount).plus(farm.quoteTokenAmount);
    }

    return farm.lpTotalInQuoteToken;
  }, [
    bnbPrice,
    cakePrice,
    ethPrice,
    btcPrice,
    farm.tokenAmount,
    farm.quoteTokenAmount,
    farm.lpTotalInQuoteToken,
    farm.quoteTokenSymbol,
  ]);

  const totalValueFormated = totalValue
    ? `$${Number(totalValue).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })}`
    : "-";

  const lpLabel =
    farm.lpSymbol && farm.lpSymbol.toUpperCase().replace("PANCAKE", "");
  const earnLabel = farm.dual ? farm.dual.earnLabel : "YGN";

  let isDaysGreater = false;
  let isHoursGreater = false;
  const poolHarvestIntervalInDays = farm.poolHarvestInterval
    ? (farm.poolHarvestInterval / 86400).toFixed(0)
    : 0;

  if (poolHarvestIntervalInDays > 0) {
    isDaysGreater = true;
  }
  const poolHarvestIntervalinHours = farm.poolHarvestInterval
    ? (farm.poolHarvestInterval / 3600).toFixed(0)
    : 0;
  if (poolHarvestIntervalinHours > 0) {
    isHoursGreater = true;
  }

  const poolHarvestIntervalinMinutes = farm.poolHarvestInterval
    ? (farm.poolHarvestInterval / 60).toFixed(0)
    : 0;

  // const farmAPY =
  //   farm.apy &&
  //   farm.apy
  //     .times(new BigNumber(100))
  //     .toNumber()
  //     .toLocaleString("en-US", { maximumFractionDigits: 2 });

  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses } = farm;
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAdresses,
    quoteTokenSymbol,
    tokenAddresses,
  });
  const addLiquidityUrl = `add/${liquidityUrlPathParts}`;

  const calculatedAPY = cakePrice
    .multipliedBy(BLOCKS_PER_YEAR)
    .multipliedBy(CAKE_PER_BLOCK)
    .multipliedBy(farm?.multiplier?.replace(/[^\d.-]/g, ""))
    .dividedBy(totalValue)
    .toFixed(2);

  return (
    <FCard>
      {farm.tokenSymbol === "YGN" && <StyledCardAccent />}
      <div style={{ borderBottom: "1px solid #524B63", paddingBottom: "10px" }}>
        <CardHeading
          lpLabel={lpLabel}
          multiplier={farm.multiplier}
          isCommunityFarm={isCommunityFarm}
          farmImage={farmImage}
          tokenSymbol={farm.tokenSymbol}
        />
      </div>
      <div
        style={{
          borderBottom: "1px solid #524B63",
          paddingBottom: "20px",
          margin: "20px 0px",
        }}
      >
        {!removed && (
          <Flex justifyContent="space-between" alignItems="center">
            <Text color="#9b9382">{TranslateString(736, "APR")}</Text>
            <Text bold style={{ display: "flex", alignItems: "center" }}>
              {calculatedAPY !== "NaN" ? (
                <>
                  {false && (
                    <ApyButton
                      lpLabel={lpLabel}
                      addLiquidityUrl={addLiquidityUrl}
                      cakePrice={cakePrice}
                      apy={farm.apy}
                    />
                  )}
                  <span style={{ letterSpacing: "1px", color: "#424945" }}>
                    {calculatedAPY}%
                  </span>
                </>
              ) : (
                <Skeleton height={24} width={80} />
              )}
            </Text>
          </Flex>
        )}
        <Flex justifyContent="space-between">
          <Text color="#9b9382">{TranslateString(318, "Earn")}</Text>
          <Text bold color="#424945">
            {earnLabel}{" "}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="#9b9382">
            {TranslateString(318, "Harvest Lock Interval")}
          </Text>
          <Text bold color="#424945">
            {poolHarvestIntervalInDays > 0
              ? `${poolHarvestIntervalInDays.toString()} Days`
              : ""}
            {!isDaysGreater && poolHarvestIntervalinHours > 0
              ? `${poolHarvestIntervalinHours.toString()} Hours`
              : ""}
            {!isDaysGreater &&
            !isHoursGreater &&
            poolHarvestIntervalinMinutes > 0
              ? `${poolHarvestIntervalinMinutes.toString()} Minutes`
              : ""}
          </Text>
        </Flex>

        <CardActionsContainer
          farm={farm}
          crossChainTranscations={crossChainTranscations}
          account={account}
          addLiquidityUrl={addLiquidityUrl}
          totalValue={totalValue}
        />
      </div>
      <ExpandableSectionButton
        onClick={() => setShowExpandableSection(!showExpandableSection)}
        expanded={showExpandableSection}
      />
      <ExpandingWrapper expanded={showExpandableSection}>
        <DetailsSection
          removed={removed}
          maticExplorerAddress={`https://polygonscan.com/address/${
            farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]
          }`}
          totalValueFormated={totalValueFormated}
          lpLabel={lpLabel}
          addLiquidityUrl={addLiquidityUrl}
        />
      </ExpandingWrapper>
    </FCard>
  );
};

export default FarmCard;
