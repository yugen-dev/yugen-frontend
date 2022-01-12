import React, { useCallback, useState } from "react";
import BigNumber from "bignumber.js";
import { AutoRenewIcon, Button, Flex, Heading } from "cryption-uikit";
import { useHarvest } from "hooks/useHarvest";
import { getBalanceNumber } from "utils/formatBalance";
import ConfirmSwapModal from "components/harvestAndStake/ConfirmSwapModal";
import { useActiveWeb3React } from "hooks";

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
  const [isFetchingHarvestValues, setIsFetchingHarvestValues] = useState(false);
  const { account } = useActiveWeb3React();
  const recipient = account ?? null;

  const fetchHarvestValues = async () => {
    setIsFetchingHarvestValues(true);
    try {
      setIsFetchingHarvestValues(false);
    } catch (e) {
      setIsFetchingHarvestValues(false);
    }
  };

  const [
    { showConfirm, harvestErrorMessage, attemptingTxn, txHash },
    setSwapState,
  ] = useState<{
    showConfirm: boolean;
    attemptingTxn: boolean;
    harvestErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    showConfirm: false,
    attemptingTxn: false,
    harvestErrorMessage: undefined,
    txHash: undefined,
  });
  const [pendingTx, setPendingTx] = useState(false);
  const { onReward } = useHarvest(pid);
  const rawEarningsBalance = getBalanceNumber(earnings);
  let harvestDisabled = false;
  if (rawEarningsBalance === 0) {
    harvestDisabled = true;
  }

  const displayBalance = rawEarningsBalance.toLocaleString();

  const handleConfirmDismiss = () => {
    setSwapState(() => ({
      showConfirm: false,
      attemptingTxn,
      harvestErrorMessage,
      txHash,
    }));
  };

  const handleHarvestAndStake = useCallback(async () => {
    setSwapState(() => ({
      attemptingTxn: true,
      harvestErrorMessage,
      showConfirm: undefined,
      txHash: undefined,
    }));

    try {
      const hash = await onReward();
      setSwapState(() => ({
        attemptingTxn: false,
        harvestErrorMessage: undefined,
        showConfirm: false,
        txHash: hash,
      }));
    } catch (e: any) {
      setSwapState(() => ({
        attemptingTxn: false,
        harvestErrorMessage: e.message,
        showConfirm: false,
        txHash: undefined,
      }));
    }
  }, [harvestErrorMessage, onReward]);

  const BtnLoadingComp =
    pendingTx === false ? (
      <Flex justifyContent="space-around" width="100%">
        <Button
          variant="secondary"
          disabled={harvestDisabled}
          onClick={async () => {
            setPendingTx(true);
            await onReward();
            setPendingTx(false);
          }}
        >
          Harvest
        </Button>
        <Button
          onClick={async () => {
            await fetchHarvestValues();
            setSwapState(() => ({
              attemptingTxn: false,
              harvestErrorMessage: undefined,
              showConfirm: true,
              txHash: undefined,
            }));
          }}
        >
          Harvest & Stake
        </Button>
      </Flex>
    ) : (
      <Button
        isLoading
        endIcon={<AutoRenewIcon spin color="currentColor" />}
        width="100%"
      >
        Processing
      </Button>
    );

  return (
    <Flex
      mb="8px"
      justifyContent="space-between"
      alignItems="center"
      flexDirection="column"
    >
      <Heading
        color={rawEarningsBalance === 0 ? "textDisabled" : "text"}
        mb="10px"
      >
        {displayBalance}
      </Heading>
      <ConfirmSwapModal
        isOpen={showConfirm}
        attemptingTxn={attemptingTxn}
        txHash={txHash}
        recipient={recipient}
        onConfirm={handleHarvestAndStake}
        swapErrorMessage={harvestErrorMessage}
        onDismiss={handleConfirmDismiss}
        ygnGiven={new BigNumber(0)}
        fYgnToHarvest={new BigNumber(0)}
        xYgnGiven={new BigNumber(0)}
      />
      {canHarvest ? (
        BtnLoadingComp
      ) : (
        <Flex justifyContent="space-around" width="100%">
          <Button variant="secondary" disabled>
            Harvest
          </Button>
          <Button disabled>Harvest and Stake</Button>
        </Flex>
      )}
    </Flex>
  );
};

export default HarvestAction;
