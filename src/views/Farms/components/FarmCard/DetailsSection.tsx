import React from "react";
import useI18n from "hooks/useI18n";
import styled from "styled-components";
import { Text, Flex, Link, LinkExternal } from "cryption-uikit";

export interface ExpandableSectionProps {
  maticExplorerAddress?: string;
  removed?: boolean;
  totalValueFormated?: string;
  lpLabel?: string;
  addLiquidityUrl?: string;
}

const Wrapper = styled.div`
  margin-top: 24px;
`;

const StyledLinkExternal = styled(LinkExternal)`
  text-decoration: none;
  font-weight: normal;
  color: #3869EE;
  display: flex;
  align-items: center;

  svg {
    padding-left: 4px;
    height: 18px;
    width: auto;
    fill: #3869EE;
  }
`;

const DetailsSection: React.FC<ExpandableSectionProps> = ({
  maticExplorerAddress,
  removed,
  totalValueFormated,
  lpLabel,
  addLiquidityUrl,
}) => {
  const TranslateString = useI18n();

  return (
    <Wrapper>
      <Flex justifyContent="space-between">
        <Text>{TranslateString(316, "Stake")}:</Text>
        <StyledLinkExternal href={addLiquidityUrl}>
          {lpLabel}
        </StyledLinkExternal>
      </Flex>
      {!removed && (
        <Flex justifyContent="space-between">
          <Text>{TranslateString(23, "Total Liquidity")}:</Text>
          <Text>{totalValueFormated}</Text>
        </Flex>
      )}
      <Flex justifyContent="flex-start">
        <Link external href={maticExplorerAddress} bold={false} color="#3869EE">
          {TranslateString(356, "View on MaticExplorer")}
        </Link>
      </Flex>
    </Wrapper>
  );
};

export default DetailsSection;
