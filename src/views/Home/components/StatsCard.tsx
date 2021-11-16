import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Text } from "cryption-uikit";
import { useQuery } from "@apollo/client";
import { cntStakerQuery } from "apollo/queries";
import { useWeb3React } from "@web3-react/core";
import { usePriceCakeBusd } from "state/hooks";
import BigNumber from "bignumber.js";
import { getCNTStakerContract } from "utils/contractHelpers";

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
  // liquidity,
}) => {
  const { account } = useWeb3React("web3");

  const [totoalYGNStakedInStaker, setTotalYGNStakedInStaker] = useState(
    new BigNumber(0)
  );

  let cntStakingRatio = new BigNumber(0.0);

  const getCNTStakerInfo = useQuery(cntStakerQuery, {
    context: {
      clientName: "cntstaker",
    },
  });
  if (
    getCNTStakerInfo &&
    getCNTStakerInfo.data &&
    getCNTStakerInfo.data.cntstaker
  ) {
    cntStakingRatio = new BigNumber(getCNTStakerInfo?.data?.cntstaker?.ratio);
  }

  const numberWithCommas = (number) => {
    const parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };

  const ygnPrice = usePriceCakeBusd();

  useEffect(() => {
    async function fetchTotalSupply() {
      const xCNTContract = getCNTStakerContract();
      const supply = await xCNTContract.methods.totalSupply().call();
      setTotalYGNStakedInStaker(new BigNumber(supply).dividedBy(1e18));
    }
    if (account) {
      fetchTotalSupply();
    }
  }, [account, setTotalYGNStakedInStaker]);

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
              YGN price
            </Text>
            <Text
              fontSize="22px"
              fontWeight="700"
              style={{ display: "flex", alignItems: "center" }}
            >
              ${numberWithCommas(ygnPrice.toFixed(2))}{" "}
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
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          <ProgressItemText>
            <Text color="#887263" fontSize="15px" textAlign="center">
              Current Market Cap
            </Text>
            <Text
              fontSize="22px"
              fontWeight="700"
              style={{ display: "flex", alignItems: "center" }}
            >
              $
              {numberWithCommas(
                Number(
                  new BigNumber(circulatingSupply)
                    .multipliedBy(ygnPrice)
                    .toFixed(2)
                )
              )}{" "}
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
              {numberWithCommas(totoalYGNStakedInStaker.toFixed(2))}{" "}
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
              ${ygnPrice.multipliedBy(cntStakingRatio).toFixed(2)}
            </Text>
          </ProgressItemText>
        </div>
      </ProgressText>
    </Card>
  );
};

export default CardValue;
