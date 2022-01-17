import React from "react";
import styled from "styled-components";
import { Tag, Flex, Heading, Image } from "yugen-uikit";
import Question from "components/QuestionHelper";
// import { CommunityTag, CoreTag } from "components/Tags";

export interface ExpandableSectionProps {
  lpLabel?: string;
  multiplier?: string;
  isCommunityFarm?: boolean;
  farmImage?: string;
  tokenSymbol?: string;
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
  // isCommunityFarm,
  farmImage,
  tokenSymbol,
}) => {
  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      <Image
        src={`/images/farms/${farmImage}.png`}
        alt={tokenSymbol}
        width={100}
        height={94}
      />
      <Flex flexDirection="column" alignItems="flex-end">
        <Heading mb="15px">{lpLabel}</Heading>
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
