import React from "react";
import styled from "styled-components";
import { Card, Skeleton } from "yugen-uikit";
import useI18n from "hooks/useI18n";
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

const TotalValueLockedCard = () => {
  const TranslateString = useI18n();
  const data = new BigNumber(100);

  return (
    <StyledTotalValueLockedCard>
      <CNCardBody>
        <CNHeading>
          {TranslateString(762, "Total Value Locked (TVL)")}
        </CNHeading>
        {data.toNumber() > 0 ? (
          <CardValue
            value={data.toNumber()}
            lineHeight="1.5"
            prefix="$"
            fontSize="28px"
            decimals={0}
            color="#2082E9"
          />
        ) : (
          <>
            <Skeleton height={66} />
          </>
        )}
        <Text>{TranslateString(764, "Across all LPs and Pools")}</Text>
      </CNCardBody>
    </StyledTotalValueLockedCard>
  );
};

const Text = styled.div`
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

export default TotalValueLockedCard;
