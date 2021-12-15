import React, { memo, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { Heading, Skeleton, Text } from "cryption-uikit";

const DisplayInfo = ({ description, value }) => {
  const theme = useContext(ThemeContext);

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
          style={{
            display: "inline-block",
            color: `${theme.colors.subHeading}`,
          }}
          fontSize="20px"
          marginLeft="3px"
          bold
        >
          fYGN
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
