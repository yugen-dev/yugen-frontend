import React, { useState } from "react";
import styled from "styled-components";
import { Card, Heading } from "yugen-uikit";
import { Group } from "@visx/group";
import { Pie } from "@visx/shape";
import { Text } from "@visx/text";
import BigNumber from "bignumber.js";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const StyledTotalValueLockedCard = styled(Card)`
  height: 100%;
  border-radius: 0.625rem !important;
  padding: 30px 15px;
  background-color: #ffffff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  align-items: center;
  display: flex;
  flex: 1;
  text-align: left;
`;

const PieChart = ({ pieData, pieLoading, pieError }) => {
  const [active, setActive] = useState(null);
  const width = 300;
  const half = width / 2 - 10;

  if (pieLoading) {
    return (
      <StyledTotalValueLockedCard>
        <CNCardBody>
          <CNHeading>YGN Distribution</CNHeading>
          <Loader type="Oval" height={300} width={200} color="#d47a3e" />
        </CNCardBody>
      </StyledTotalValueLockedCard>
    );
  }
  if (pieError) {
    return (
      <StyledTotalValueLockedCard>
        <CNCardBody>
          <CNHeading>YGN Distribution</CNHeading>
          <Heading color="#9c2c2c">Error occurred while fetching data</Heading>
        </CNCardBody>
      </StyledTotalValueLockedCard>
    );
  }

  if (pieData) {
    const ygnTokenDistribution = [
      {
        name: "YGN Staker",
        amount: `${pieData?.totalYgnStaked}`,
        color: "#f1d8c0",
      },
      {
        name: "fYGN Burner",
        amount: `${pieData?.ygnInBurner}`,
        color: "#e0b185",
      },
      {
        name: "QuickSwap LP",
        amount: `${pieData?.ygnInMaticLp}`,
        color: "#e4a86d",
      },
      // { name: "SpookSwap LP", amount: ``, color: "#c58154 " },
      // { name: "Bonds", amount: "5000", color: "#d47a3e" },
    ];
    const totalSupplyOfYgn = 20_000;

    return (
      <StyledTotalValueLockedCard>
        <CNCardBody>
          <CNHeading>YGN Distribution</CNHeading>
          <main>
            <svg width={width} height={width}>
              <Group top={half + 10} left={half + 10}>
                <Pie
                  data={ygnTokenDistribution}
                  pieValue={(data) => new BigNumber(data.amount).toNumber()}
                  outerRadius={({ data }) => {
                    const size = active && active.name === data.name ? 10 : 5;
                    return half + size;
                  }}
                  innerRadius={({ data }) => {
                    const size = active && active.name === data.name ? 70 : 50;
                    return half - size;
                  }}
                  padAngle={0.01}
                >
                  {(pie) => {
                    return pie.arcs.map((arc) => {
                      return (
                        <g key={arc.data.amount}>
                          <path
                            d={pie.path(arc)}
                            fill={arc.data.color}
                            onMouseEnter={() => setActive(arc.data)}
                            onMouseLeave={() => setActive(null)}
                          />
                        </g>
                      );
                    });
                  }}
                </Pie>

                {active ? (
                  <>
                    <Text
                      textAnchor="middle"
                      fill="#424945"
                      fontSize={30}
                      dy={20}
                    >
                      {`${new BigNumber(active.amount)
                        .dividedBy(totalSupplyOfYgn)
                        .multipliedBy(100)
                        .toFixed(2)}%`}
                    </Text>
                    <Text
                      textAnchor="middle"
                      fill="#86878f"
                      fontSize={15}
                      dy={-20}
                    >
                      {`${active.name}`}
                    </Text>
                  </>
                ) : (
                  <Text
                    textAnchor="middle"
                    fill="#424945"
                    fontSize={30}
                    dy={20}
                  >
                    100%
                  </Text>
                )}
              </Group>
            </svg>
          </main>
        </CNCardBody>
      </StyledTotalValueLockedCard>
    );
  }
  return <></>;
};

const CNHeading = styled.div`
  color: #887263;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  text-transform: capitalize;
  margin-bottom: 20px;
`;
const CNCardBody = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export default PieChart;
