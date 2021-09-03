import BigNumber from "bignumber.js";
import styled from "styled-components";
import React, { useCallback, useMemo, useState } from "react";
import { Button, AutoRenewIcon, Flex, CloseIcon, IconButton } from "cryption-uikit";
import Modal from "components/Modal";
import StepperContainer from 'components/Stepper/Stepper';
import ModalActions from "components/ModalActions";
import ModalInput from "components/ModalInputCrossChain";
import useI18n from "hooks/useI18n";
import { getFullDisplayBalance } from "utils/formatBalance";

interface DepositModalProps {
  max: BigNumber;
  onConfirm: (amount: string) => void;
  onDismiss?: () => void;
  tokenName?: string;
  activeIndex?: number;
  isOpen: boolean;
  addLiquidityUrl?: string;
}
const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #404040;
  align-items: center;
  padding: 24px 24px;
  margin-bottom: 20px;
`;

const ModalTitle = styled(Flex)`
  align-items: center;
  flex: 1;
  font-size: 23px;
  color: #86878f;
`;
const Heading = styled.div`
  font-weight: 600;
  letter-spacing: -0.015em;
  text-transform: capitalize;
`;
const DepositModal: React.FC<DepositModalProps> = ({
  max,
  onConfirm,
  onDismiss,
  tokenName = "",
  addLiquidityUrl,
  activeIndex,
  isOpen,
}) => {
  const [val, setVal] = useState("");
  const [pendingTx, setPendingTx] = useState(false);
  const [showStakerSteps, toggleStakerSteps] = useState(false);
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
          toggleStakerSteps(true)
          // onDismiss();
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
      // title={TranslateString(1068, "Stake LP tokens")}
      isOpen={isOpen}
      maxHeight={100}
      onDismiss={onDismiss}
    >
      <Flex flexDirection="column" width="100%">
        <ModalHeader>
          <ModalTitle>
            <Heading>Stake LP tokens</Heading>
          </ModalTitle>
          <IconButton variant="text" onClick={onDismiss} aria-label="Close the dialog" size="23px">
            <CloseIcon color="#86878F" />
          </IconButton>
        </ModalHeader>
        {showStakerSteps ?
          <StepperContainer activeIndex={activeIndex} />
          :
          <div>
            <ModalInput
              value={val}
              onSelectMax={handleSelectMax}
              onChange={handleChange}
              max={fullBalance}
              symbol={tokenName}
              addLiquidityUrl={addLiquidityUrl}
              inputTitle={TranslateString(1070, "Stake")}
            />
            <ModalActions>
              <Button variant="secondary" onClick={onDismiss} width="100%">
                {TranslateString(462, "Cancel")}
              </Button>
              {BtnLoadingComp}
            </ModalActions>
          </div>
        }
      </Flex>
    </Modal>
  );
};

export default DepositModal;
