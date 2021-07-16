import React from "react";
import styled from "styled-components";
import { Flex, Heading, Image } from "cryption-uikit";
import { CoreTag } from "components/Tags";

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

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
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
        {/* <Flex justifyContent="center">
           {isCommunityFarm ? <CommunityTag /> : <CoreTag />} 
          <CoreTag />
        </Flex> */}
      </Flex>
    </Wrapper>
  );
};

export default CardHeading;
