import BigNumber from "bignumber.js";
import React, { useCallback, useMemo, useState } from "react";
import { AutoRenewIcon, Button, Modal } from "yugen-uikit";
import ModalActions from "components/ModalActions";
import ModalInput from "components/ModalInput";
import useI18n from "hooks/useI18n";
import { getFullDisplayBalance } from "utils/formatBalance";

interface WithdrawModalProps {
  decimals?: BigNumber;
  max: BigNumber;
  onConfirm: (amount: string) => void;
  onDismiss?: () => void;
  tokenName?: string;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  decimals,
  onConfirm,
  onDismiss,
  max,
  tokenName = "",
}) => {
  const [val, setVal] = useState("");
  const [pendingTx, setPendingTx] = useState(false);
  const TranslateString = useI18n();
  const fullBalance = useMemo(() => {
    const inputTokenDecimals = new BigNumber(decimals || 18);
    return getFullDisplayBalance(max, inputTokenDecimals.toNumber());
  }, [max, decimals]);

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
          await onConfirm(val);
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
      title={TranslateString(1126, "Withdraw LP tokens")}
      onDismiss={onDismiss}
    >
      <ModalInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
        inputTitle={TranslateString(588, "Withdraw")}
      />
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%">
          {TranslateString(462, "Cancel")}
        </Button>
        {/* <Button
          disabled={pendingTx}
          onClick={async () => {
            setPendingTx(true);
            await onConfirm(val);
            setPendingTx(false);
            onDismiss();
          }}
          width="100%"
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
