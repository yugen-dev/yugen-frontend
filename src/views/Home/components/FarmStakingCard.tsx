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
  min-width: 100%;
  justify-content: space-around;
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
  const { account } = useWeb3React();
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
          width="40px"
          height="40px"
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
  color: #cfcccc;
`;
const HeadingSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  max-width: 400px;
  width: 100%;
`;
const CNCardBody = styled.div`
  text-align: center;
  padding: 25px;
  max-width: 420px;
  align-self: center;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #48494e;
  border-radius: 20px;
  background: linear-gradient(
    123.13deg,
    rgba(255, 253, 253, 0.12) 25.56%,
    rgba(255, 255, 255, 0.03) 97.77%
  );
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
`;

export default FarmedStakingCard;
