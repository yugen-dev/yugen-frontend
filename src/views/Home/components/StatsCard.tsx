import React from "react";
import Grid from "@material-ui/core/Grid";
import styled from "styled-components";
import { Text } from "cryption-uikit";
import { useMedia } from "react-use";

export interface CardValueProps {
  totalSuply?: number;
  burnedSupply?: number;
  circulatingSupply?: number;
  totalFees?: string;
  stakerFees?: string;
  lpFees?: string;
  burnerFees?: string;
  devFees?: string;
}
const Card = styled.div`
  border-radius: 0.625rem !important;
  padding: 30px 15px;
  background-color: #1e202a;
`;
const SubCard = styled.div`
  border-radius: 0.625rem !important;
  padding: 15px 15px;
  background-color: #1e202a;
`;
const TextAlignMent = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
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
`;

const BarParent = styled.div`
  overflow: hidden;
  position: relative;
  margin-top: 10px;
  height: 4px;
  border-radius: 2px;
  background-color: #eeeeee;
`;
const RedbBar = styled.div<{ progressVal: number; marginVal: number }>`
  background: #f55c47;
  border-top-left-radius: 0px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 0px;
  transition: transform 0.4s linear;
  top: 0;
  left: ${({ marginVal }) => `${marginVal}%`};
  width: ${({ progressVal }) => `${progressVal}%`};
  bottom: 0;
  position: absolute;
  transition: transform 0.2s linear;
  transform-origin: left;
`;
const BlueBar = styled.div<{ progressVal: number }>`
  background: #2082e9;
  border-radius: 2px;
  border-top-left-radius: 2px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-bottom-left-radius: 2px;
  transition: transform 0.4s linear;
  top: 0;
  left: 0px;
  width: ${({ progressVal }) => `${progressVal}%`};
  bottom: 0;
  position: absolute;
  transition: transform 0.2s linear;
  transform-origin: left;
`;
const CardValue: React.FC<CardValueProps> = ({
  totalSuply,
  circulatingSupply,
  burnedSupply,
  totalFees,
  stakerFees,
  lpFees,
  burnerFees,
  devFees,
}) => {
  const isInMobileView = useMedia("(max-width: 950px)");
  const numberWithCommas = (number) => {
    const parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };
  let progressBar = 0;
  if (
    totalSuply &&
    circulatingSupply &&
    totalSuply > 0 &&
    circulatingSupply > 0
  ) {
    progressBar = (100 * circulatingSupply) / totalSuply;
  }
  let burnedProgress = 0;
  if (totalSuply && burnedSupply && totalSuply > 0 && burnedSupply > 0) {
    burnedProgress = (100 * burnedSupply) / totalSuply;
  }

  if (isInMobileView) {
    return (
      <>
        <Card>
          <ProgressText
            style={{ marginBottom: "15px", flexDirection: "column" }}
          >
            <Text color="white" fontSize="18px" fontWeight="700">
              CNT & Summary
            </Text>
            <Text color="#C1C5CB" fontSize="12px" ml="5px" textAlign="center">
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
              <Text color="#9d9fa8" fontSize="15px" textAlign="center">
                Circulating Supply
              </Text>
              <Text
                color="#2082E9"
                fontSize="22px"
                fontWeight="700"
                style={{ display: "flex", alignItems: "center" }}
              >
                {numberWithCommas(circulatingSupply)}{" "}
                <Text color="#C1C5CB" fontSize="15px" ml="8px">
                  {" "}
                  CNT{" "}
                </Text>
              </Text>
            </ProgressItemText>
            <ProgressItemText>
              <Text color="#9d9fa8" fontSize="15px" textAlign="center">
                Total Burned
              </Text>
              <Text
                color="#f55c47"
                fontSize="22px"
                fontWeight="700"
                style={{ display: "flex", alignItems: "center" }}
              >
                {numberWithCommas(burnedSupply)}{" "}
                <Text color="#C1C5CB" fontSize="15px" ml="8px">
                  {" "}
                  CNT{" "}
                </Text>
              </Text>
            </ProgressItemText>
            <ProgressItemText>
              <Text color="#9d9fa8" fontSize="15px" textAlign="center">
                Max Supply
              </Text>
              <Text
                color="white"
                fontSize="22px"
                fontWeight="700"
                style={{ display: "flex", alignItems: "center" }}
              >
                {numberWithCommas(totalSuply)}{" "}
                <Text color="#C1C5CB" fontSize="15px" ml="8px">
                  {" "}
                  CNT
                </Text>
              </Text>
            </ProgressItemText>
          </ProgressText>

          <BarParent>
            <BlueBar progressVal={progressBar} />
            <RedbBar progressVal={burnedProgress} marginVal={progressBar} />
          </BarParent>
        </Card>
        <br />
        <SubCard>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <TextAlignMent>
              <ProgressText>
                <Text color="#9d9fa8" fontSize="16px">
                  Total Supply
                </Text>
                <Text color="white" fontSize="16px" fontWeight="700">
                  {" "}
                  {numberWithCommas(totalSuply - burnedSupply)}
                </Text>
              </ProgressText>
              <ProgressText>
                <Text color="#9d9fa8" fontSize="16px">
                  CNT rewards per day
                </Text>
                <Text
                  color="white"
                  fontSize="16px"
                  fontWeight="700"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {numberWithCommas(25920)}
                  <Text color="#C1C5CB" fontSize="12px" ml="5px">
                    {" "}
                    CNT
                  </Text>
                </Text>
              </ProgressText>
              <ProgressText>
                <Text color="#9d9fa8" fontSize="16px">
                  CNT Rewards per Block
                </Text>
                <Text
                  color="white"
                  fontSize="16px"
                  fontWeight="700"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {numberWithCommas(0.75)}
                  <Text color="#C1C5CB" fontSize="12px" ml="5px">
                    {" "}
                    CNT
                  </Text>
                </Text>
              </ProgressText>
              {totalFees && (
                <ProgressText>
                  <Text color="#9d9fa8" fontSize="16px">
                    Total Fees (24 Hrs)
                  </Text>
                  <Text
                    color="white"
                    fontSize="16px"
                    fontWeight="700"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    ${totalFees}{" "}
                  </Text>
                </ProgressText>
              )}
            </TextAlignMent>
          </Grid>
        </SubCard>
        <br />
        <SubCard>
          {" "}
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <TextAlignMent>
              {lpFees && (
                <ProgressText>
                  <Text color="#9d9fa8" fontSize="16px">
                    LP Fees
                  </Text>
                  <Text color="white" fontSize="16px" fontWeight="700">
                    {" "}
                    ${lpFees}{" "}
                  </Text>
                </ProgressText>
              )}
              {stakerFees && (
                <ProgressText>
                  <Text color="#C1C5CB" fontSize="16x">
                    Staker Distrubution
                  </Text>
                  <Text color="white" fontSize="16px" fontWeight="700">
                    {" "}
                    ${stakerFees}{" "}
                  </Text>
                </ProgressText>
              )}
              {burnerFees && (
                <ProgressText>
                  <Text color="#C1C5CB" fontSize="16px">
                    CNT Burned
                  </Text>
                  <Text color="white" fontSize="16px" fontWeight="700">
                    {" "}
                    ${burnerFees}{" "}
                  </Text>
                </ProgressText>
              )}
              {devFees && (
                <ProgressText>
                  <Text color="#C1C5CB" fontSize="16px">
                    Dev Fees
                  </Text>
                  <Text color="white" fontSize="16px" fontWeight="700">
                    {" "}
                    ${devFees}{" "}
                  </Text>
                </ProgressText>
              )}
            </TextAlignMent>
          </Grid>
        </SubCard>
      </>
    );
  }
  return (
    <Card>
      <ProgressText style={{ marginBottom: "15px" }}>
        <Text color="white" fontSize="18px" fontWeight="700">
          CNT & Summary
        </Text>
        <Text color="#C1C5CB" fontSize="12px" ml="5px">
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
          <Text color="#9d9fa8" fontSize="15px">
            Circulating Supply
          </Text>
          <Text
            color="#2082E9"
            fontSize="22px"
            fontWeight="700"
            style={{ display: "flex", alignItems: "center" }}
          >
            {numberWithCommas(circulatingSupply)}{" "}
            <Text color="#C1C5CB" fontSize="15px" ml="8px">
              {" "}
              CNT{" "}
            </Text>
          </Text>
        </ProgressItemText>
        <ProgressItemText>
          <Text color="#9d9fa8" fontSize="15px">
            Total Burned
          </Text>
          <Text
            color="#f55c47"
            fontSize="22px"
            fontWeight="700"
            style={{ display: "flex", alignItems: "center" }}
          >
            {numberWithCommas(burnedSupply)}{" "}
            <Text color="#C1C5CB" fontSize="15px" ml="8px">
              {" "}
              CNT{" "}
            </Text>
          </Text>
        </ProgressItemText>
        <ProgressItemText>
          <Text color="#9d9fa8" fontSize="15px">
            Max Supply
          </Text>
          <Text
            color="white"
            fontSize="22px"
            fontWeight="700"
            style={{ display: "flex", alignItems: "center" }}
          >
            {numberWithCommas(totalSuply)}{" "}
            <Text color="#C1C5CB" fontSize="15px" ml="8px">
              {" "}
              CNT
            </Text>
          </Text>
        </ProgressItemText>
      </ProgressText>

      <BarParent>
        <BlueBar progressVal={progressBar} />
        <RedbBar progressVal={burnedProgress} marginVal={progressBar} />
      </BarParent>
      <Grid container spacing={5} style={{ marginTop: "20px" }}>
        <Grid
          item
          xs={12}
          md={6}
          lg={6}
          xl={6}
          style={{ borderRight: "1px solid #524B63" }}
        >
          <TextAlignMent>
            <ProgressText>
              <Text color="#9d9fa8" fontSize="16px">
                Total Supply
              </Text>
              <Text color="white" fontSize="16px" fontWeight="700">
                {" "}
                {numberWithCommas(totalSuply - burnedSupply)}
              </Text>
            </ProgressText>
            <ProgressText>
              <Text color="#9d9fa8" fontSize="16px">
                CNT rewards per day
              </Text>
              <Text
                color="white"
                fontSize="16px"
                fontWeight="700"
                style={{ display: "flex", alignItems: "center" }}
              >
                {numberWithCommas(25920)}
                <Text color="#C1C5CB" fontSize="12px" ml="5px">
                  {" "}
                  CNT
                </Text>
              </Text>
            </ProgressText>
            <ProgressText>
              <Text color="#9d9fa8" fontSize="16px">
                CNT Rewards per Block
              </Text>
              <Text
                color="white"
                fontSize="16px"
                fontWeight="700"
                style={{ display: "flex", alignItems: "center" }}
              >
                {numberWithCommas(0.75)}
                <Text color="#C1C5CB" fontSize="12px" ml="5px">
                  {" "}
                  CNT
                </Text>
              </Text>
            </ProgressText>
            {totalFees && (
              <ProgressText>
                <Text color="#9d9fa8" fontSize="16px">
                  Total Fees (24 Hrs)
                </Text>
                <Text
                  color="white"
                  fontSize="16px"
                  fontWeight="700"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  ${totalFees}{" "}
                </Text>
              </ProgressText>
            )}
          </TextAlignMent>
        </Grid>
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <TextAlignMent>
            {lpFees && (
              <ProgressText>
                <Text color="#9d9fa8" fontSize="15px">
                  LP Fees
                </Text>
                <Text color="white" fontSize="15px" fontWeight="700">
                  {" "}
                  ${lpFees}{" "}
                </Text>
              </ProgressText>
            )}
            {stakerFees && (
              <ProgressText>
                <Text color="#C1C5CB" fontSize="15x">
                  Staker Distrubution
                </Text>
                <Text color="white" fontSize="15px" fontWeight="700">
                  {" "}
                  ${stakerFees}{" "}
                </Text>
              </ProgressText>
            )}
            {burnerFees && (
              <ProgressText>
                <Text color="#C1C5CB" fontSize="15px">
                  CNT Burned
                </Text>
                <Text color="white" fontSize="15px" fontWeight="700">
                  {" "}
                  ${burnerFees}{" "}
                </Text>
              </ProgressText>
            )}
            {devFees && (
              <ProgressText>
                <Text color="#C1C5CB" fontSize="15px">
                  Dev Fees
                </Text>
                <Text color="white" fontSize="15px" fontWeight="700">
                  {" "}
                  ${devFees}{" "}
                </Text>
              </ProgressText>
            )}
          </TextAlignMent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CardValue;
