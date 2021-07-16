import React from "react";
import styled from "styled-components";
import { Tag, Flex, Heading, Image } from "cryption-uikit";
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
  background: linear-gradient(161.46deg, #2a76eb 12.56%, #9702ff 90.36%);
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
        </Flex>
      </Flex>
    </Wrapper>
  );
};

export default CardHeading;
