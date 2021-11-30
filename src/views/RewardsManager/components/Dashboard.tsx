import React, { memo } from "react";
import styled from "styled-components";
import DisplayInfo from "./DisplayInfo";

export const VestingDashBoard = ({ vestedValues }) => {
  return (
    <Container>
      <DisplayInfo description="YGN locked" value={vestedValues.Unclaimable} />
      <DisplayInfo
        description="Available to claim"
        value={vestedValues.Claimable}
      />
      <DisplayInfo description="Total claimed" value={vestedValues.Claimed} />
      {vestedValues.AmountBurnt !== "0" ? (
        <DisplayInfo
          description="Total burnt"
          value={vestedValues.AmountBurnt}
        />
      ) : (
        <></>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  min-width: 100%;
`;

export default memo(VestingDashBoard);
