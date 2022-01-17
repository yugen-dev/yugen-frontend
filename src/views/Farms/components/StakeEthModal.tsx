import React from "react";
import StepperContainer from "components/Stepper/Stepper";
import { Modal } from "yugen-uikit";

interface DepositModalProps {
  onConfirm?: (amount: string) => void;
  onDismiss?: () => void;
  tokenName?: string;
  activeIndex?: number;
}

const StakeEthModal: React.FC<DepositModalProps> = ({
  activeIndex,
  onDismiss,
}) => {
  return (
    <Modal title="Stake Ethereum tokens" onDismiss={onDismiss}>
      <StepperContainer activeIndex={activeIndex} />
    </Modal>
  );
};

export default StakeEthModal;
