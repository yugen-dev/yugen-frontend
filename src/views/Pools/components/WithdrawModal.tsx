import BigNumber from "bignumber.js";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { AutoRenewIcon, Button, Modal } from "cryption-uikit";
import ModalActions from "components/ModalActions";
import TokenInput from "../../../components/TokenInput";
import useI18n from "../../../hooks/useI18n";
import { getFullDisplayBalance } from "../../../utils/formatBalance";

interface WithdrawModalProps {
  max: BigNumber;
  onConfirm: (amount: string, decimals: number) => void;
  onDismiss?: () => void;
  tokenName?: string;
  tokenAmount?: string;
  stakingTokenDecimals?: number;
  poolwithdrawalFeeBP?: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  onConfirm,
  onDismiss,
  max,
  tokenName = "",
  tokenAmount,
  stakingTokenDecimals = 18,
  poolwithdrawalFeeBP = 0,
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
    <Modal title={`Withdraw ${tokenName}`} onDismiss={onDismiss}>
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
        poolwithdrawalFeeBP={poolwithdrawalFeeBP}
      />
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss}>
          {TranslateString(462, "Cancel")}
        </Button>
        {/* <Button
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

export default WithdrawModal;
