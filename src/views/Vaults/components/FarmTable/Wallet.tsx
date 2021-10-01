import React from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";

export interface WalletProps {
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

const WalletWrapper = styled.div`
  min-width: 60px;
  text-align: left;
  font-size: 20px;
  font-weight: 600;
  color: #86878f;
`;

const Wallet: React.FC<WalletProps> = ({ value, originalValue }) => {
  return (
    <Container>
      {originalValue ? (
        <WalletWrapper>{value}</WalletWrapper>
      ) : (
        <WalletWrapper>Loading...</WalletWrapper>
      )}
    </Container>
  );
};

export default Wallet;
