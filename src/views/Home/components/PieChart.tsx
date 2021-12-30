import React, { useState } from "react";
import styled from "styled-components";
import { Card } from "cryption-uikit";
import { Group } from "@visx/group";
import { Pie } from "@visx/shape";
import { Text } from "@visx/text";
import BigNumber from "bignumber.js";

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

const ygnTokenDistribution = [
  { name: "Parker", amount: "1000", color: "#f7eee4" },
  { name: "Stark", amount: "2000", color: "#f1d8c0" },
  { name: "Oliver", amount: "3000", color: "#ebccaa" },
  { name: "Rodgers", amount: "4000", color: "#e0b185" },
  { name: "Kent", amount: "5000", color: "#e79d6b" },
  { name: "Wade", amount: "6000", color: "#f39454" },
  { name: "Wayne", amount: "7000", color: "#df8c3f" },
];

const PieChart = () => {
  const [active, setActive] = useState(null);
  const totalSupplyOfYgn = 1_000_000;
  const width = 300;
  const half = width / 2 - 10;

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
                <Text textAnchor="middle" fill="#424945" fontSize={30} dy={20}>
                  100%
                </Text>
              )}
            </Group>
          </svg>
        </main>
      </CNCardBody>
    </StyledTotalValueLockedCard>
  );
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
