import React, { memo } from "react";
import styled from "styled-components";
import DisplayInfo from "./DisplayInfo";

export const VestingDashBoard = ({ vestedValues }) => {
  return (
    <Container>
      <DisplayInfo
        description="Total CNT locked"
        value={vestedValues.TotalVested}
      />
      <DisplayInfo description="Unclaimable" value={vestedValues.Unclaimable} />
      <DisplayInfo description="Claimable" value={vestedValues.Claimable} />
      <DisplayInfo description="Claimed" value={vestedValues.Claimed} />
      {vestedValues.AmountBurnt !== "0" ? (
        <DisplayInfo
          description="Burnt Amount"
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
