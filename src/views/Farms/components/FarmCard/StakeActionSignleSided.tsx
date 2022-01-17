import React, { useCallback, useState } from "react";
import BigNumber from "bignumber.js";
import { Button, Flex, useModal } from "yugen-uikit";
import useWeb3 from "hooks/useWeb3";

import { getERC20Contract } from "utils/contractHelpers";
import { useIfoApprove } from "hooks/useApprove";
import {
  getSingleSidedLiquidityAddress,
  getWbnbAddress,
} from "utils/addressHelpers";
import { useStakeSingleSided } from "hooks/useStake";
import DepositModalSingleSided from "../DepositModalSingleSided";

interface FarmCardActionsProps {
  stakedBalance?: BigNumber;
  tokenBalance?: BigNumber;
  tokenName?: string;
  pid?: number;
  addLiquidityUrl?: string;
  isApproved?: boolean;
  totalValueOfUserFormated?: string;
  singleSidedAddress?: string;
  decimal?: BigNumber;
  singleSidedToTokenAddress?: string;
  lpTokenAddress?: string;
  valueOfEthBalance?: BigNumber;
}

const StakeActionSignleSided: React.FC<FarmCardActionsProps> = ({
  tokenBalance,
  tokenName,
  pid,
  addLiquidityUrl,
  isApproved,
  singleSidedAddress,
  decimal,
  valueOfEthBalance,
}) => {
  const wmatic = getWbnbAddress();
  const [requestedApproval, setRequestedApproval] = useState(false);
  const web3 = useWeb3();
  const singleSidedTokenContract = getERC20Contract(singleSidedAddress, web3);

  const onApprove = useIfoApprove(
    singleSidedTokenContract,
    getSingleSidedLiquidityAddress()
  );

  const handleSignleSidedApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);

      await onApprove();

      setRequestedApproval(false);
    } catch (e) {
      console.error(e);
    }
  }, [onApprove]);

  const inputDecimals = new BigNumber(decimal || 18).toNumber();

  const { onStakeSingleSided } = useStakeSingleSided(pid, inputDecimals);

  const [onPresentDeposit] = useModal(
    <DepositModalSingleSided
      max={singleSidedAddress === wmatic ? valueOfEthBalance : tokenBalance}
      decimals={Number(decimal.toString())}
      onConfirm={onStakeSingleSided}
      tokenName={tokenName}
      addLiquidityUrl={addLiquidityUrl}
    />
  );

  const renderStakingButtons = () => {
    if (isApproved || singleSidedAddress === wmatic) {
      return (
        <Button onClick={onPresentDeposit} variant="secondary" width="100%">
          Provide Single Sided Supply
        </Button>
      );
    }

    return (
      <Button
        mt="8px"
        disabled={requestedApproval}
        onClick={handleSignleSidedApprove}
        width="100%"
      >
        {requestedApproval
          ? `Approving ${tokenName}...`
          : `Approve ${tokenName}`}
      </Button>
    );
  };

  return (
    <div style={{ textAlign: "left" }}>
      <Flex justifyContent="space-between" alignItems="center">
        {renderStakingButtons()}
      </Flex>
    </div>
  );
};

export default StakeActionSignleSided;
