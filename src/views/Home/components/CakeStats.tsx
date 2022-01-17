import React from "react";
import { Card, Text } from "yugen-uikit";
import styled from "styled-components";
import { getBalanceNumber } from "utils/formatBalance";
import { useTotalSupply, useBurnedBalance } from "hooks/useTokenBalance";
import useI18n from "hooks/useI18n";
import { getCakeAddress } from "utils/addressHelpers";
import CardValue from "./CardValue";

const StyledCakeStats = styled(Card)`
  height: 100%;
  padding: 30px 40px;
  background: #ffffff;
  box-shadow: 1px 2px 4px 3px rgba(0, 0, 0, 0.16);
  margin-left: auto;
  margin-right: auto;
`;

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
`;

const CakeStats = () => {
  const TranslateString = useI18n();
  const totalSupply = useTotalSupply();
  const burnedBalance = getBalanceNumber(useBurnedBalance(getCakeAddress()));
  const cakeSupply = totalSupply
    ? getBalanceNumber(totalSupply) - burnedBalance
    : 0;

  return (
    <StyledCakeStats>
      <CNCardBody>
        <CNHeading>{TranslateString(534, "Cake Stats")}</CNHeading>
        <CNTable>
          <Row>
            <Text fontSize="14px" bold color="#686B7A">
              {TranslateString(536, "Total CAKE Supply")}
            </Text>
            {cakeSupply && (
              <CardValue
                fontSize="14px"
                value={cakeSupply}
                bold
                color="#686B7A"
              />
            )}
          </Row>
          <Row>
            <Text fontSize="14px" bold color="#686B7A">
              {TranslateString(538, "Total CAKE Burned")}
            </Text>
            <CardValue
              fontSize="14px"
              decimals={0}
              value={burnedBalance}
              bold
              color="#686B7A"
            />
          </Row>
          <Row>
            <Text fontSize="14px" bold color="#686B7A">
              {TranslateString(540, "New CAKE/block")}
            </Text>
            <CardValue
              fontSize="14px"
              decimals={0}
              value={25}
              bold
              color="#686B7A"
            />
          </Row>
        </CNTable>
      </CNCardBody>
    </StyledCakeStats>
  );
};

const CNTable = styled.div`
  margin: 15px 0 0 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CNHeading = styled.div`
  color: white;
  font-size: 32px;
  font-weight: bold;
  text-transform: capitalize;
`;

const CNCardBody = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`;

export default CakeStats;
