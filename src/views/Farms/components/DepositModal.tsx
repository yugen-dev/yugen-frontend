import BigNumber from "bignumber.js";
import React, { useCallback, useMemo, useState } from "react";
import { Button, Modal, LinkExternal, AutoRenewIcon } from "cryption-uikit";
import ModalActions from "components/ModalActions";
import ModalInput from "components/ModalInput";
import useI18n from "hooks/useI18n";
import { getFullDisplayBalance } from "utils/formatBalance";

interface DepositModalProps {
  max: BigNumber;
  onConfirm: (amount: string) => void;
  onDismiss?: () => void;
  tokenName?: string;
  addLiquidityUrl?: string;
}

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  onConfirm,
  onDismiss,
  tokenName = "",
  addLiquidityUrl,
}) => {
  const [val, setVal] = useState("");
  const [pendingTx, setPendingTx] = useState(false);
  const TranslateString = useI18n();
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max);
  }, [max]);

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
      title={TranslateString(1068, "Deposit LP tokens")}
      onDismiss={onDismiss}
    >
      <ModalInput
        value={val}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
        addLiquidityUrl={addLiquidityUrl}
        inputTitle={TranslateString(1070, "Deposit")}
      />
      <ModalActions>
        <Button variant="secondary" onClick={onDismiss} width="100%">
          {TranslateString(462, "Cancel")}
        </Button>
        {BtnLoadingComp}
      </ModalActions>
      <LinkExternal href={addLiquidityUrl} style={{ alignSelf: "center" }}>
        {TranslateString(999, "Get")} {tokenName}
      </LinkExternal>
    </Modal>
  );
};

export default DepositModal;
