import React from "react";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  AddIcon,
  MinusIcon,
  useModal,
} from "cryption-uikit";
import useI18n from "hooks/useI18n";
import { useStake } from "hooks/useStake";
import { useStakeWithPermit } from "hooks/useStakeWithPermit";
import useUnstake from "hooks/useUnstake";
import { getBalanceNumber } from "utils/formatBalance";
import DepositModal from "../DepositModal";
import WithdrawModal from "../WithdrawModal";

interface FarmCardActionsProps {
  stakedBalance?: BigNumber;
  tokenBalance?: BigNumber;
  tokenName?: string;
  pid?: number;
  addLiquidityUrl?: string;
  signatureData?: any;
  setSignauteNull?: any;
  approvalDisabled?: boolean;
  handleApprove?: any;
  isApproved?: boolean;
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`;

const StakeAction: React.FC<FarmCardActionsProps> = ({
  stakedBalance,
  tokenBalance,
  tokenName,
  pid,
  addLiquidityUrl,
  signatureData,
  setSignauteNull,
  approvalDisabled,
  handleApprove,
  isApproved,
}) => {
  const TranslateString = useI18n();
  const { onStake } = useStake(pid);
  const { onStakeWithPermit } = useStakeWithPermit(
    pid,
    signatureData,
    setSignauteNull
  );
  const { onUnstake } = useUnstake(pid);

  const rawStakedBalance = getBalanceNumber(stakedBalance);
  const displayBalance = rawStakedBalance.toLocaleString();

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={signatureData !== null ? onStakeWithPermit : onStake}
      tokenName={tokenName}
      addLiquidityUrl={addLiquidityUrl}
    />
  );
  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onUnstake}
      tokenName={tokenName}
    />
  );
  const renderStakingButtons = () => {
    if (
      isApproved ||
      (signatureData !== null &&
        signatureData.deadline > Math.ceil(Date.now() / 1000))
    ) {
      return rawStakedBalance === 0 ? (
        <Button onClick={onPresentDeposit} variant="secondary">
          {TranslateString(999, "Stake LP")}
        </Button>
      ) : (
        <IconButtonWrapper>
          <IconButton variant="tertiary" onClick={onPresentWithdraw} mr="6px">
            <MinusIcon color="primary" width="14px" />
          </IconButton>
          <IconButton variant="tertiary" onClick={onPresentDeposit}>
            <AddIcon color="primary" width="14px" />
          </IconButton>
        </IconButtonWrapper>
      );
    }

    // if(signatureData !== null && signatureData.deadline < Math.ceil(Date.now() / 1000)){
    //   return (
    //     <Button mt="8px" disabled={approvalDisabled} onClick={handleApprove}>
    //       {approvalDisabled ? "Approving..." : "Approve"}
    //     </Button>
    //   );
    // }

    return (
      <Button mt="8px" disabled={approvalDisabled} onClick={handleApprove}>
        {approvalDisabled ? "Approving..." : "Approve"}
      </Button>
    );
  };

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Heading color={rawStakedBalance === 0 ? "textDisabled" : "text"}>
        {displayBalance}
      </Heading>
      {renderStakingButtons()}
    </Flex>
  );
};

export default StakeAction;
