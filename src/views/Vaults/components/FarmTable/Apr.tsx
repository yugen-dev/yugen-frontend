import React from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";

export interface AprProps {
  value: string;
  originalValue: BigNumber;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 10px;
  button {
    width: 20px;
    height: 20px;

    svg {
      path {
        fill: #424945;
      }
    }
  }
`;

const AprWrapper = styled.div`
  min-width: 60px;
  text-align: left;
  font-size: 20px;
  font-weight: 600;
  color: #86878f;
`;

const Apr: React.FC<AprProps> = ({ value, originalValue }) => {
  return (
    <Container>
      {originalValue ? (
        <AprWrapper>{value}%</AprWrapper>
      ) : (
        <AprWrapper>Loading...</AprWrapper>
      )}
    </Container>
  );
};

export default Apr;
