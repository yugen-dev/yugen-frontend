import React from "react";
import styled from "styled-components";
import { Text } from "cryption-uikit";

export interface CardValueProps {
  totalSuply?: number;
  burnedSupply?: number;
  circulatingSupply?: number;
  totalFees?: string;
  stakerFees?: string;
  lpFees?: string;
  burnerFees?: string;
  devFees?: string;
  cntStakerRatio?: string;
  liquidity?: string;
}
const Card = styled.div`
  border-radius: 0.625rem !important;
  padding: 30px 15px;
  background-color: #ffffff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
const ProgressItemText = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
`;

const CardValue: React.FC<CardValueProps> = ({
  // totalSuply,
  circulatingSupply,
  burnedSupply,
  // liquidity,
}) => {
  const numberWithCommas = (number) => {
    const parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  return (
    <Card>
      <ProgressText style={{ marginBottom: "15px", flexDirection: "column" }}>
        <Text color="#424945" fontSize="18px" fontWeight="700">
          YGN & Summary
        </Text>
        <Text color="#887263" fontSize="12px" ml="5px" textAlign="center">
          * Amount allocated through mining is distributed every second
        </Text>
      </ProgressText>

      <ProgressText
        style={{
          flexWrap: "wrap",
          justifyContent: "space-evenly",
        }}
      >
        <ProgressItemText>
          <Text color="#887263" fontSize="15px" textAlign="center">
            Circulating Supply
          </Text>
          <Text
            fontSize="22px"
            fontWeight="700"
            style={{ display: "flex", alignItems: "center" }}
          >
            {numberWithCommas(circulatingSupply)}{" "}
            <Text color="#887263" fontSize="15px" ml="8px">
              {" "}
              YGN{" "}
            </Text>
          </Text>
        </ProgressItemText>
        <ProgressItemText>
          <Text color="#887263" fontSize="15px" textAlign="center">
            Total Burned
          </Text>
          <Text
            fontSize="22px"
            fontWeight="700"
            style={{ display: "flex", alignItems: "center" }}
          >
            {numberWithCommas(burnedSupply)}{" "}
            <Text color="#887263" fontSize="15px" ml="8px">
              {" "}
              YGN{" "}
            </Text>
          </Text>
        </ProgressItemText>
        <ProgressItemText>
          <Text color="#887263" fontSize="15px" textAlign="center">
            Total Supply
          </Text>
          <Text
            fontSize="22px"
            fontWeight="700"
            style={{ display: "flex", alignItems: "center" }}
          >
            {numberWithCommas(100000000)}{" "}
            <Text color="#887263" fontSize="15px" ml="8px">
              {" "}
              YGN
            </Text>
          </Text>
        </ProgressItemText>
        <ProgressItemText>
          <Text color="#887263" fontSize="15px" textAlign="center">
            Current Market Cap
          </Text>
          <Text
            fontSize="22px"
            fontWeight="700"
            style={{ display: "flex", alignItems: "center" }}
          >
            {numberWithCommas(100000000)}{" "}
            <Text color="#887263" fontSize="15px" ml="8px">
              {" "}
              YGN
            </Text>
          </Text>
        </ProgressItemText>
        <ProgressItemText>
          <Text color="#887263" fontSize="15px" textAlign="center">
            Total YGN staked
          </Text>
          <Text
            fontSize="22px"
            fontWeight="700"
            style={{ display: "flex", alignItems: "center" }}
          >
            {numberWithCommas(100000000)}{" "}
            <Text color="#887263" fontSize="15px" ml="8px">
              {" "}
              YGN
            </Text>
          </Text>
        </ProgressItemText>
        <ProgressItemText>
          <Text color="#887263" fontSize="15px" textAlign="center">
            xYGN price
          </Text>
          <Text
            fontSize="22px"
            fontWeight="700"
            style={{ display: "flex", alignItems: "center" }}
          >
            $1.21
            <Text color="#887263" fontSize="15px" ml="8px">
              {" "}
              YGN
            </Text>
          </Text>
        </ProgressItemText>
      </ProgressText>
    </Card>
  );
};

export default CardValue;
