import BigNumber from "bignumber.js";
import { Button } from "cryption-uikit";
import React, { useCallback } from "react";
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
} from "../TransactionConfirmationModal";
import ConfirmHeader from "./ConfirmHeader";

export default function ConfirmSwapModal({
  onConfirm,
  onDismiss,
  swapErrorMessage,
  isOpen,
  attemptingTxn,
  txHash,
  fYgnToHarvest,
  ygnGiven,
  xYgnGiven,
  isFetchingValues,
  fetchHarvestValuesFunction,
}: {
  isOpen: boolean;
  attemptingTxn: boolean;
  txHash: string | undefined;
  recipient: string | null;
  onConfirm: () => void;
  swapErrorMessage: string | undefined;
  onDismiss: () => void;
  fYgnToHarvest: BigNumber;
  ygnGiven: BigNumber;
  xYgnGiven: BigNumber;
  isFetchingValues: boolean;
  fetchHarvestValuesFunction: () => void;
}) {
  // text to show while loading
  const pendingText = `
  Harvesting ${fYgnToHarvest?.toFixed(6)} fYGN for ${ygnGiven?.toFixed(
    6
  )} YGN then for 
${xYgnGiven?.toFixed(6)} xYGN
  `;

  const modalHeader = useCallback(() => {
    return (
      <ConfirmHeader
        isLoading={isFetchingValues}
        ygnValue={ygnGiven}
        xYgnValue={xYgnGiven}
        fYgnValue={fYgnToHarvest}
        fetchFunction={fetchHarvestValuesFunction}
      />
    );
  }, [
    fYgnToHarvest,
    fetchHarvestValuesFunction,
    isFetchingValues,
    xYgnGiven,
    ygnGiven,
  ]);

  const modalBottom = useCallback(() => {
    return (
      <Button
        width="100%"
        onClick={async () => {
          await onConfirm();
        }}
      >
        Confirm Harvest & Stake
      </Button>
    );
  }, [onConfirm]);

  const confirmationContent = useCallback(
    () =>
      swapErrorMessage ? (
        <TransactionErrorContent
          onDismiss={onDismiss}
          message={swapErrorMessage}
        />
      ) : (
        <ConfirmationModalContent
          title="Confirm Harvest & Stake"
          onDismiss={onDismiss}
          topContent={modalHeader}
          bottomContent={modalBottom}
        />
      ),
    [onDismiss, modalBottom, modalHeader, swapErrorMessage]
  );

  return (
    <TransactionConfirmationModal
      isOpen={isOpen}
      onDismiss={onDismiss}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={confirmationContent}
      pendingText={pendingText}
    />
  );
}
