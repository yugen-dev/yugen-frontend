import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { AutoRenewIcon, Button, Flex, Heading } from "cryption-uikit";
import useI18n from "hooks/useI18n";
import { useChainId } from 'state/application/hooks'
import { useHarvest } from "hooks/useHarvest";
import { getBalanceNumber } from "utils/formatBalance";

interface FarmCardActionsProps {
  earnings?: BigNumber;
  pid?: number;
  canHarvest?: boolean;
}

const HarvestAction: React.FC<FarmCardActionsProps> = ({
  earnings,
  pid,
  canHarvest,
}) => {
  const TranslateString = useI18n();
  const [pendingTx, setPendingTx] = useState(false);
  const { onReward } = useHarvest(pid);
  const rawEarningsBalance = getBalanceNumber(earnings);
  const chainId = useChainId().toString();
  let harvestDisabled = false;
  if (rawEarningsBalance === 0) {
    harvestDisabled = true;
  }
  if (chainId === '1' || chainId === '5') {
    harvestDisabled = true;
  }
  const displayBalance = rawEarningsBalance.toLocaleString();

  const BtnLoadingComp =
    pendingTx === false ? (
      <Button
        disabled={harvestDisabled}
        onClick={async () => {
          setPendingTx(true);
          await onReward();
          setPendingTx(false);
        }}
      >
        Harvest
      </Button>
    ) : (
      <Button isLoading endIcon={<AutoRenewIcon spin color="currentColor" />}>
        Processing
      </Button>
    );

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center">
      <Heading color={rawEarningsBalance === 0 ? "textDisabled" : "text"}>
        {displayBalance}
      </Heading>
      {canHarvest ? (
        // <Button
        //   disabled={rawEarningsBalance === 0 || pendingTx}
        //   onClick={async () => {
        //     setPendingTx(true);
        //     await onReward();
        //     setPendingTx(false);
        //   }}
        // >
        //   {TranslateString(562, "Harvest")}
        // </Button>

        BtnLoadingComp
      ) : (
        <Button
          disabled={!canHarvest}
          onClick={async () => {
            setPendingTx(true);
            await onReward();
            setPendingTx(false);
          }}
        >
          {TranslateString(562, "Harvest")}
        </Button>
      )}
    </Flex>
  );
};

export default HarvestAction;
