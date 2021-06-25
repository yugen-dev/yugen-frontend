import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { Heading, Card, CardBody, Button } from "cryption-uikit";
import { useWeb3React } from "@web3-react/core";
import useI18n from "hooks/useI18n";
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
  color: white;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
`;

const Actions = styled.div`
  min-width: 100%;
`;

const FarmedStakingCard = () => {
  const [pendingTx, setPendingTx] = useState(false);
  const { account } = useWeb3React('web3');
  const TranslateString = useI18n();
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
        <CardImage
          src="/images/CNLatte.png"
          alt="cake logo"
          width="30px"
          height="30px"
        />
        <CNHeading>{TranslateString(542, "Farms & Staking")}</CNHeading>
      </HeadingSection>
      <Block>
        <Label>
          {TranslateString(544, "CAKE to Harvest")} {`  `}:
        </Label>
        <CakeHarvestBalance />
      </Block>
      <Block>
        <Label>
          {TranslateString(546, "CAKE in Wallet")} {` `}:
        </Label>
        <CakeWalletBalance />
      </Block>
      <Actions>
        {account ? (
          <Button
            id="harvest-all"
            disabled={balancesWithValue.length <= 0 || pendingTx}
            onClick={harvestAllFarms}
            width="100%"
          >
            {pendingTx
              ? TranslateString(548, "Collecting CAKE")
              : TranslateString(
                532,
                `Harvest all (${balancesWithValue.length})`
              )}
          </Button>
        ) : (
          <UnlockButton />
        )}
      </Actions>
    </CNCardBody>
  );
};

const CNHeading = styled.div`
  font-size: 30px;
  font-weight: 700;
  text-transform: uppercase;
  color: white;
`;
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
  background-color: #1E202A;
  align-self: center;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.625rem !important;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

export default FarmedStakingCard;
