import React from "react";
import BigNumber from "bignumber.js";
import { IconButton, useModal, CalculateIcon } from "cryption-uikit";
import ApyCalculatorModal from "./ApyCalculatorModal";

export interface ApyButtonProps {
  lpLabel?: string;
  cakePrice?: BigNumber;
  apy?: BigNumber;
  addLiquidityUrl?: string;
}

const ApyButton: React.FC<ApyButtonProps> = ({
  lpLabel,
  cakePrice,
  apy,
  addLiquidityUrl,
}) => {
  const [onPresentApyModal] = useModal(
    <ApyCalculatorModal
      lpLabel={lpLabel}
      cakePrice={cakePrice}
      apy={apy}
      addLiquidityUrl={addLiquidityUrl}
    />
  );

  const handleClickButton = (event): void => {
    event.stopPropagation();
    onPresentApyModal();
  };

  return (
    <IconButton onClick={handleClickButton} variant="text" scale="sm" ml="4px" style={{marginTop: '10px'}}>
      <CalculateIcon width="18px" />
    </IconButton>
  );
};

export default ApyButton;
