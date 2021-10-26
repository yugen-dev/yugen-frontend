/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { Heading, Card, CardBody, Button } from "cryption-uikit";
import { useWeb3React } from "@web3-react/core";
import { useAllHarvest } from "hooks/useHarvest";
import useFarmsWithBalance from "hooks/useFarmsWithBalance";
import UnlockButton from "components/UnlockButton";
import CakeHarvestBalance from "./CakeHarvestBalance";
import CakeWalletBalance from "./CakeWalletBalance";

const Block = styled.div`
  display: flex;
  margin-bottom: 20px;
  width: 100%;
  max-width: 400px;
  justify-content: space-between;
  align-items: center;
`;

const CardImage = styled.img`
  margin-right: 20px;
`;

const Label = styled.div`
  color: #887263;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
`;

const Actions = styled.div`
  min-width: 100%;
`;

const FarmedStakingCard = () => {
  const [pendingTx, setPendingTx] = useState(false);
  const { account } = useWeb3React("web3");
  const farmsWithBalance = useFarmsWithBalance();
  const balancesWithValue = farmsWithBalance.filter(
    (balanceType) => balanceType.balance.toNumber() > 0
  );

  const { onReward } = useAllHarvest(
    balancesWithValue.map((farmWithBalance) => farmWithBalance.pid)
  );

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true);
    try {
      await onReward();
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false);
    }
  }, [onReward]);

  return (
    <CNCardBody>
      <HeadingSection>
        <Heading color="#424945" size="xl" fontWeight="700">
          Farms & Staking
        </Heading>
      </HeadingSection>
      <Block>
        <Label>YGN to Harvest{`  `}:</Label>
        <CakeHarvestBalance />
      </Block>
      <Block style={{ marginBottom: "0px" }}>
        <Label>YGN in Wallet{` `}:</Label>
        <CakeWalletBalance />
      </Block>

      {!account && (
        <Block style={{ marginTop: "15px" }}>
          <UnlockButton width="100%" />
        </Block>
      )}
    </CNCardBody>
  );
};

const HeadingSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 400px;
  margin-bottom: 20px;
  width: 100%;
`;
const CNCardBody = styled.div`
  text-align: center;
  border-radius: 0.625rem !important;
  padding: 30px 15px;
  align-self: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;

export default FarmedStakingCard;
