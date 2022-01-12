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
  recipient,
  swapErrorMessage,
  isOpen,
  attemptingTxn,
  txHash,
  fYgnToHarvest,
  ygnGiven,
  xYgnGiven,
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
}) {
  const isFetchingValues = false;

  // text to show while loading
  const pendingText = `
  Harvesting ${fYgnToHarvest?.toFixed(6)} fYGNs for ${xYgnGiven?.toFixed(
    6
  )} xYGNs + 
${ygnGiven?.toFixed(6)} YGNs
  `;

  const modalHeader = useCallback(() => {
    return (
      <ConfirmHeader
        isLoading={isFetchingValues}
        ygnValue={ygnGiven}
        xYgnValue={xYgnGiven}
        fYgnValue={fYgnToHarvest}
      />
    );
  }, [fYgnToHarvest, isFetchingValues, xYgnGiven, ygnGiven]);

  const modalBottom = useCallback(() => {
    return <Button width="100%">Confirm Harvest & Stake</Button>;
  }, []);

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
