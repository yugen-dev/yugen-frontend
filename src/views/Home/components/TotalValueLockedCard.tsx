import React from "react";
import styled from "styled-components";
import { Card, Skeleton } from "cryption-uikit";
import useI18n from "hooks/useI18n";
import { useTotalValue } from "state/hooks";
import CardValue from "./CardValue";
// import { useGetStats } from "hooks/api";

const StyledTotalValueLockedCard = styled(Card)`
  height: 100%;
  border-radius: 0.625rem !important;
  padding: 30px 15px;
  background-color: #1e202a;
  box-shadow: 1px 2px 4px 3px rgba(0, 0, 0, 0.16);
  align-items: center;
  display: flex;
  flex: 1;
  text-align: left;
`;

const TotalValueLockedCard = () => {
  const TranslateString = useI18n();
  // const data = useGetStats();
  const data = useTotalValue();
  const tvl = data.toNumber();
  console.log(tvl);
  // const tvl = data
  //   ? data.total_value_locked_all.toLocaleString("en-US", {
  //       maximumFractionDigits: 0,
  //     })
  //   : null;
  // const tvl = "128,424,321";

  return (
    <StyledTotalValueLockedCard>
      <CNCardBody>
        <CNHeading>
          {TranslateString(762, "Total Value Locked (TVL)")}
        </CNHeading>
        {data ? (
          <CardValue
            value={data.toNumber()}
            lineHeight="1.5"
            decimals={4}
            color="#2082E9"
          />
        ) : (
          <>
            <Skeleton height={66} />
          </>
        )}
        <CNText>{TranslateString(764, "Across all LPs and Pools")}</CNText>
      </CNCardBody>
    </StyledTotalValueLockedCard>
  );
};

const CNValueHeading = styled.div`
  font-size: 30px;
  font-weight: bold;
  text-transform: capitalize;
  color: white;
`;

const CNText = styled.div`
  font-size: 16px;
  text-align: center;
  font-weight: normal;
  color: #cfcccc;
`;

const CNHeading = styled.div`
  color: #686b7a;
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
