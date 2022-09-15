import React from "react";
import styled from "styled-components";
import { Text, Image, Tag } from "yugen-uikit";

export interface FarmProps {
  label: string;
  pid: number;
  image: string;
  tag?: string;
}

const IconImage = styled(Image)`
  width: 24px;
  height: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 40px;
    height: 40px;
  }
`;

const Container = styled.div`
  padding-left: 16px;
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 32px;
  }
`;

const Farm: React.FunctionComponent<FarmProps> = ({ image, label, tag }) => {
  return (
    <Container>
      <IconImage
        src={`/images/farms/${image}.png`}
        alt="icon"
        width={80}
        height={50}
        mr="8px"
      />
      <div>
        <Text bold>{label}</Text>
        {tag && <Tag>{tag}</Tag>}
      </div>
    </Container>
  );
};

export default Farm;
