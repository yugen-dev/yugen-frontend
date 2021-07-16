import BigNumber from "bignumber.js";
import styled from "styled-components";
import React, { useMemo, useState } from "react";
import { AutoRenewIcon, Button, Modal } from "cryption-uikit";
import ModalActions from "components/ModalActions";
import Balance from "components/Balance";
import useI18n from "hooks/useI18n";
import { getFullDisplayBalance } from "utils/formatBalance";

interface DepositModalProps {
  earnings: BigNumber;
  onConfirm: (amount: string, decimals: number) => void;
  onDismiss?: () => void;
  tokenName?: string;
  stakingTokenDecimals?: number;
}

const CompoundModal: React.FC<DepositModalProps> = ({
  earnings,
  onConfirm,
  onDismiss,
  tokenName = "",
  stakingTokenDecimals = 18,
}) => {
  const [pendingTx, setPendingTx] = useState(false);
  const TranslateString = useI18n();
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(earnings, stakingTokenDecimals);
  }, [earnings, stakingTokenDecimals]);

  const BtnLoadingComp =
    pendingTx === false ? (
      <Button
        id="compound-cake"
        width="100%"
        onClick={async () => {
          setPendingTx(true);
          await onConfirm(fullBalance, stakingTokenDecimals);
          setPendingTx(false);
          onDismiss();
        }}
      >
        {TranslateString(464, "Confirm")}
      </Button>
    ) : (
      <Button isLoading endIcon={<AutoRenewIcon spin color="currentColor" />}>
        {TranslateString(488, "Pending Confirmation")}
      </Button>
    );

  return (
    <Modal
      title={`${TranslateString(704, "Compound")} ${TranslateString(
        330,
        `${tokenName} Earned`
      )}`}
      onDismiss={onDismiss}
    >
      <BalanceRow>
        <Balance value={Number(fullBalance)} />
      </BalanceRow>
      <ModalActions>
        <Button width="100%" variant="secondary" onClick={onDismiss}>
          {TranslateString(462, "Cancel")}
        </Button>
        {/* <Button
          id="compound-cake"
          width="100%"
          disabled={pendingTx}
          onClick={async () => {
            setPendingTx(true);
            await onConfirm(fullBalance, stakingTokenDecimals);
            setPendingTx(false);
            onDismiss();
          }}
        >
          {pendingTx
            ? TranslateString(488, "Pending Confirmation")
            : TranslateString(464, "Confirm")}
        </Button> */}
        {BtnLoadingComp}
      </ModalActions>
    </Modal>
  );
};

export default CompoundModal;

const BalanceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;
