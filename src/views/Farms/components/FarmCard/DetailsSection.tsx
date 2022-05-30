import React from "react";
import useI18n from "hooks/useI18n";
import styled from "styled-components";
import { Text, Flex, LinkExternal } from "yugen-uikit";

export interface ExpandableSectionProps {
  maticExplorerAddress?: string;
  removed?: boolean;
  totalValueFormated?: string;
  lpLabel?: string;
  addLiquidityUrl?: string;
  isPool?: boolean;
}

const Wrapper = styled.div`
  margin-top: 24px;
`;

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: #424945;
  display: flex;
  align-items: center;

  svg {
    padding-left: 4px;
    height: 18px;
    width: auto;
    fill: #424945;
  }
`;

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  removed,
  totalValueFormated,
  lpLabel,
  addLiquidityUrl,
  isPool,
}) => {
  const TranslateString = useI18n();

  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <Text color="#887263">{TranslateString(316, isPool ? "Get Token" : "Get LP")}</Text>
        <StyledLinkExternal href={addLiquidityUrl} color="#424945">
          {lpLabel}
        </StyledLinkExternal>
      </Flex>
      {!removed && (
        <Flex justifyContent="space-between">
          <Text color="#887263">
            {TranslateString(23, "Liquidity in Farm")}
          </Text>
          <Text color="#424945">{totalValueFormated}</Text>
        </Flex>
      )}
      {/* <Flex justifyContent="center">
        <Link external href={maticExplorerAddress} bold={false} color="#887263">
          {TranslateString(356, "View on PolygonScan")}
        </Link>
      </Flex> */}
    </Wrapper>
  );
};

export default DetailsSection;
