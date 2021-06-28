import React, { useState } from "react";
import BigNumber from "bignumber.js";
import { Button, Flex } from "cryption-uikit";
import useI18n from "hooks/useI18n";
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

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center">
      {canHarvest ? (
        <Button
          disabled={rawEarningsBalance === 0 || pendingTx}
          style={{ width: "100%", maxWidth: "400px" }}
          onClick={async () => {
            setPendingTx(true);
            await onReward();
            setPendingTx(false);
          }}
        >
          {TranslateString(562, "Harvest")}
        </Button>
      ) : (
        <Button
          disabled={!canHarvest}
          style={{ width: "100%", maxWidth: "400px" }}
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
