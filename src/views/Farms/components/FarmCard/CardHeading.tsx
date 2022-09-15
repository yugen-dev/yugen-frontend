import React from "react";
import styled from "styled-components";
import { Tag, Flex, Heading, Image, Text } from "yugen-uikit";
import Question from "components/QuestionHelper";

export interface ExpandableSectionProps {
  lpLabel?: string;
  multiplier?: string;
  farmImage?: string;
  tokenSymbol?: string;
  tag?: string;
  isPool?: boolean;
  subtitle?: string;
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`;

const MultiplierTag = styled(Tag)`
  margin-left: 10px;
  background: #887963;
`;

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  tag,
  farmImage,
  tokenSymbol,
  subtitle,
  isPool,
}) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <Flex flexDirection="column" alignItems="flex-start">
        <Image
          src={`/images/farms/${farmImage}.webp`}
          alt={tokenSymbol}
          width={isPool ? 100 : 120}
          height={isPool ? 94 : 70}
        />
        {tag && (
          <Tag marginTop="10px" variant="secondary">
            {tag}
          </Tag>
        )}
      </Flex>
      <Flex flexDirection="column" alignItems="flex-end">
        <Heading mb="15px">
          {lpLabel}
          {subtitle && <Text color="gray">{subtitle}</Text>}
        </Heading>
        <Flex justifyContent="center">
          {/* {isCommunityFarm ? <CommunityTag /> : <CoreTag />} */}
          <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
          <Question text="The multiplier represents the amount of rewards each farm gets. For example, if a 1x farm was getting 1 fYGN per block, a 20.5x farm would be getting 20.5 fYGN per block" />
        </Flex>
      </Flex>
    </Wrapper>
  );
};

export default CardHeading;
