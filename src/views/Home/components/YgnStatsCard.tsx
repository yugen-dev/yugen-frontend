import React from "react";
import styled from "styled-components";
import { Skeleton, Text } from "yugen-uikit";
import BigNumber from "bignumber.js";

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
`;
const ProgressItemText = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  min-width: 100px;
  text-align: center;
  justify-items: center;
  align-items: center;
`;

const Img = styled.img`
  width: 50px;
  margin-bottom: 5px;
`;

const CardValue = ({ data, loading, error }) => {
  const numberWithCommas = (number, numbersAfterDecimalPoint = 2) => {
    const parts = new BigNumber(number)
      .toFixed(numbersAfterDecimalPoint)
      .split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  if (error) {
    return (
      <Card>
        <Text color="#9c2c2c" fontSize="18px" fontWeight="700">
          Error occurred while fetching data
        </Text>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <ProgressText style={{ marginBottom: "15px", flexDirection: "column" }}>
          <Img src="./images/tokens/ygn.webp" alt="YGN token" />
          <Text color="#424945" fontSize="18px" fontWeight="700">
            YGN
          </Text>
        </ProgressText>

        <ProgressText
          style={{
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-evenly",
              width: "100%",
            }}
          >
            <ProgressItemText>
              <Text color="#887263" fontSize="15px" textAlign="center">
                Price
              </Text>
              <Text
                fontSize="22px"
                fontWeight="700"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Skeleton width={100} />
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
                <Skeleton width={100} />
                <Text color="#887263" fontSize="15px" ml="8px">
                  {" "}
                  YGN
                </Text>
              </Text>
            </ProgressItemText>
            <ProgressItemText>
              <Text color="#887263" fontSize="15px" textAlign="center">
                Total Market Cap
              </Text>
              <Text
                fontSize="22px"
                fontWeight="700"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Skeleton width={100} />
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
                <Skeleton width={100} />
                <Text color="#887263" fontSize="15px" ml="8px">
                  {" "}
                  YGN
                </Text>
              </Text>
            </ProgressItemText>
          </div>
        </ProgressText>
      </Card>
    );
  }

  if (data) {
    return (
      <Card>
        <ProgressText style={{ marginBottom: "15px", flexDirection: "column" }}>
          <Img src="./images/tokens/ygn.webp" alt="YGN token" />
          <Text color="#424945" fontSize="18px" fontWeight="700">
            YGN
          </Text>
        </ProgressText>

        <ProgressText
          style={{
            flexWrap: "wrap",
            justifyContent: "space-evenly",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-evenly",
              width: "100%",
            }}
          >
            <ProgressItemText>
              <Text color="#887263" fontSize="15px" textAlign="center">
                Price
              </Text>
              <Text
                fontSize="22px"
                fontWeight="700"
                style={{ display: "flex", alignItems: "center" }}
              >
                ${numberWithCommas(data?.ygnPrice)}{" "}
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
                {numberWithCommas(data?.ygnTotalSupply)}{" "}
                <Text color="#887263" fontSize="15px" ml="8px">
                  {" "}
                  YGN
                </Text>
              </Text>
            </ProgressItemText>
            <ProgressItemText>
              <Text color="#887263" fontSize="15px" textAlign="center">
                Total Market Cap
              </Text>
              <Text
                fontSize="22px"
                fontWeight="700"
                style={{ display: "flex", alignItems: "center" }}
              >
                ${numberWithCommas(data?.ygnTotalMarketCap)}{" "}
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
                {numberWithCommas(data?.totalYgnStaked, 2)}{" "}
                <Text color="#887263" fontSize="15px" ml="8px">
                  {" "}
                  YGN
                </Text>
              </Text>
            </ProgressItemText>
          </div>
        </ProgressText>
      </Card>
    );
  }
  return <></>;
};

export default CardValue;
