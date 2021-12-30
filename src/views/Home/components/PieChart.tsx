import React from "react";
import styled from "styled-components";
import { Card, Skeleton } from "cryption-uikit";
import BigNumber from "bignumber.js";
import CardValue from "./CardValue";

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

const Pie = () => {
  return (
    <StyledTotalValueLockedCard>
      <CNCardBody>
        <CNHeading>YGN Distribution</CNHeading>
      </CNCardBody>
    </StyledTotalValueLockedCard>
  );
};

const CNText = styled.div`
  font-size: 16px;
  text-align: center;
  font-weight: normal;
  color: #bfb1a6;
`;

const CNHeading = styled.div`
  color: #887263;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  text-transform: capitalize;
`;
const CNCardBody = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export default Pie;
