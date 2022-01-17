import React from "react";
import BigNumber from "bignumber.js";
import { Button, useModal } from "yugen-uikit";
import Row from "components/Row";
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
  totalValueOfUserFormated?: string;
}

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
  // totalValueOfUserFormated,
}) => {
  const TranslateString = useI18n();
  // TODO: fix later
  const inputDecimals = new BigNumber(18).toNumber();
  const { onStake } = useStake(pid, inputDecimals);
  const { onStakeWithPermit } = useStakeWithPermit(
    pid,
    signatureData,
    setSignauteNull,
    inputDecimals
  );
  const { onUnstake } = useUnstake(pid, inputDecimals);

  const rawStakedBalance = getBalanceNumber(stakedBalance);

  // const displayBalance = rawStakedBalance.toLocaleString();

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
        // <IconButtonWrapper>
        //   <IconButton variant="tertiary" onClick={onPresentWithdraw} mr="6px">
        //     <MinusIcon color="primary" width="14px" />
        //   </IconButton>
        //   <IconButton variant="tertiary" onClick={onPresentDeposit}>
        //     <AddIcon color="primary" width="14px" />
        //   </IconButton>
        // </IconButtonWrapper>
        <Row justifyContent="space-around">
          {/* <Column> */}
          <Button
            mt="8px"
            scale="md"
            height="45px"
            onClick={onPresentDeposit}
            minWidth="120px"
            width="auto"
            mr="15px"
          >
            {/* {approvalDisabled ? "Staking..." : "Stake"} */}
            Stake
          </Button>
          <Button
            mt="8px"
            scale="md"
            height="45px"
            onClick={onPresentWithdraw}
            minWidth="120px"
            width="auto"
          >
            {/* {approvalDisabled ? "Unstaking..." : "Unstake"} */}
            Unstake
          </Button>
          {/* </Column> */}
          {/* <Column>
           
          </Column> */}
        </Row>
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
      <div>
        <Row justifyContent="space-around">
          <Button
            mt="8px"
            mr="15px"
            scale="md"
            height="45px"
            disabled={approvalDisabled}
            onClick={handleApprove}
            minWidth="120px"
            width="100%"
          >
            {approvalDisabled ? "Approving..." : "Approve"}
          </Button>
          {/* <Button
            mt="8px"
            scale="md"
            height="45px"
            // disabled={approvalDisabled}
            minWidth="120px"
            onClick={onPresentWithdraw}
            width="auto"
          >
            Unstake
          </Button> */}
        </Row>
      </div>
    );
  };

  return (
    <div>
      {/* <Flex justifyContent="space-between" alignItems="center">
        <Heading color={rawStakedBalance === 0 ? "textDisabled" : "text"}>
          {displayBalance}
        </Heading>
        <Subtle style={{ alignSelf: "flex-start" }}>
          {" "}
          {totalValueOfUserFormated}
        </Subtle>
      </Flex> */}
      {renderStakingButtons()}
    </div>
  );
};

export default StakeAction;
