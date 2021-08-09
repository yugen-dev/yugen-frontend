import BigNumber from "bignumber.js";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { AutoRenewIcon, Button, Modal } from "cryption-uikit";
import ModalActions from "components/ModalActions";
import TokenInput from "../../../components/TokenInput";
import useI18n from "../../../hooks/useI18n";
import { getFullDisplayBalance } from "../../../utils/formatBalance";

interface DepositModalProps {
  max: BigNumber;
  onConfirm: (amount: string, decimals: number) => void;
  onDismiss?: () => void;
  tokenName?: string;
  tokenAmount?: string;
  stakingTokenDecimals?: number;
}

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  onConfirm,
  onDismiss,
  tokenName = "",
  tokenAmount,
  stakingTokenDecimals = 18,
}) => {
  const [val, setVal] = useState(tokenAmount || "");
  const [pendingTx, setPendingTx] = useState(false);
  const TranslateString = useI18n();
  useEffect(() => {
    setVal(tokenAmount || "");
  }, [tokenAmount]);
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max, stakingTokenDecimals);
  }, [max, stakingTokenDecimals]);

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value);
    },
    [setVal]
  );

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance);
  }, [fullBalance, setVal]);

  const BtnLoadingComp =
    pendingTx === false ? (
      <Button
        width="100%"
        onClick={async () => {
          setPendingTx(true);
          await onConfirm(val, stakingTokenDecimals);
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
      title={`${TranslateString(316, "Deposit")} ${tokenName} Tokens`}
      onDismiss={onDismiss}
    >
      <TokenInput
        poolwithdrawalFeeBP={0}
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
      />
      <ModalActions>
        <Button width="100%" variant="secondary" onClick={onDismiss}>
          {TranslateString(462, "Cancel")}
        </Button>
        {/* <Button
          width="100%"
          disabled={pendingTx}
          onClick={async () => {
            setPendingTx(true);
            await onConfirm(val, stakingTokenDecimals);
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

export default DepositModal;
