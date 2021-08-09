import React, { useCallback, useState } from "react";
import BigNumber from "bignumber.js";
import {
  Button,
  Flex,
  Heading,
  useModal,
} from "cryption-uikit";
import useWeb3 from "hooks/useWeb3";

import useI18n from "hooks/useI18n";
import { getERC20Contract } from "utils/contractHelpers";
import { useIfoApprove } from "hooks/useApprove";
import { useProvideSingleSidedLiquidity } from "hooks/useProvideSingleSidedLiquidity";
import {
  getSingleSidedLiquidityAddress,
  getWbnbAddress,
} from "utils/addressHelpers";
import { getBalanceNumber } from "utils/formatBalance";
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
  stakedBalance,
  tokenBalance,
  tokenName,
  pid,
  addLiquidityUrl,
  isApproved,
  singleSidedAddress,
  decimal,
  singleSidedToTokenAddress,
  lpTokenAddress,
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

  const TranslateString = useI18n();
  const { onProvideSingleSidedLiquidity } = useProvideSingleSidedLiquidity(
    pid,
    singleSidedAddress,
    singleSidedToTokenAddress,
    lpTokenAddress,
    "0",
    decimal
  );

  const rawStakedBalance = getBalanceNumber(stakedBalance);

  const [onPresentDeposit] = useModal(
    <DepositModalSingleSided
      max={singleSidedAddress === wmatic ? valueOfEthBalance : tokenBalance}
      decimals={Number(decimal.toString())}
      onConfirm={onProvideSingleSidedLiquidity}
      tokenName={tokenName}
      addLiquidityUrl={addLiquidityUrl}
    />
  );

  const renderStakingButtons = () => {
    if (isApproved || singleSidedAddress === wmatic) {
      //  rawStakedBalance === 0 ? (
      return (
        <Button onClick={onPresentDeposit} variant="secondary" width="100%">
          {TranslateString(999, "Provide Single Sided Liquidity")}
        </Button>
      );
      // ) : (
      //   <IconButtonWrapper>
      //     <IconButton variant="tertiary" onClick={onPresentDeposit}>
      //       <AddIcon color="primary" width="14px" />
      //     </IconButton>
      //   </IconButtonWrapper>
      // );
    }

    return (
      <Button
        mt="8px"
        disabled={requestedApproval}
        onClick={handleSignleSidedApprove}
        width="100%"
      >
        {requestedApproval ? "Approving..." : "Approve"}
      </Button>
    );
  };

  return (
    <div style={{ textAlign: "left" }}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading color={rawStakedBalance === 0 ? "textDisabled" : "text"}>
          {/* {displayBalance} */}
        </Heading>

        {renderStakingButtons()}
      </Flex>
    </div>
  );
};

export default StakeActionSignleSided;
