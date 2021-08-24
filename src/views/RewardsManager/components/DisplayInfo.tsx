import React, { memo } from "react";
import { Heading, Skeleton, Text } from "cryption-uikit";
import styled from "styled-components";

const DisplayInfo = ({ description, value }) => {
  if (value === "-1") {
    return (
      <SubContainer>
        <Heading textAlign="center">{description}</Heading>
        <Skeleton height={10} width="100%" marginTop="6px" />
      </SubContainer>
    );
  }
  return (
    <SubContainer>
      <Heading textAlign="center">{description}</Heading>
      <Heading size="xl" textAlign="center" marginTop="1px">
        <span>{value}</span>
        <Text
          style={{ display: "inline-block" }}
          fontSize="20px"
          color="#99a3ba"
          marginLeft="3px"
          bold
        >
          CNT
        </Text>
      </Heading>
    </SubContainer>
  );
};

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 30px 10px 0 10px;
`;

export default memo(DisplayInfo);
