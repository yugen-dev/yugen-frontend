import React, { useCallback, useState } from "react";
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
import useWeb3 from "hooks/useWeb3";

import useI18n from "hooks/useI18n";
import { useApprove, useIfoApprove } from "hooks/useApprove";
import { useProvideSingleSidedLiquidity } from "hooks/useProvideSingleSidedLiquidity";
import {
  getSingleSidedLiquidityAddress,
  getWbnbAddress,
} from "utils/addressHelpers";
import { getBalanceNumber } from "utils/formatBalance";
import { getBep20Contract } from "utils/contractHelpers";
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
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`;

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
}) => {
  const wmatic = getWbnbAddress();
  const [requestedApproval, setRequestedApproval] = useState(false);
  const web3 = useWeb3();
  const singleSidedTokenContract = getBep20Contract(singleSidedAddress, web3);

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

  // pid: number,
  // token: string,
  // toToken: string,
  // pairAddress: string,
  // slippage: string

  const rawStakedBalance = getBalanceNumber(stakedBalance);
  // console.log(decimal ? decimal : 18)                      ;
  // console.log(decimal.toString());
  const [onPresentDeposit] = useModal(
    <DepositModalSingleSided
      max={tokenBalance}
      decimals={Number(decimal.toString())}
      onConfirm={onProvideSingleSidedLiquidity}
      tokenName={tokenName}
      addLiquidityUrl={addLiquidityUrl}
    />
  );

  const renderStakingButtons = () => {
    if (isApproved || singleSidedAddress === wmatic) {
      return rawStakedBalance === 0 ? (
        <Button onClick={onPresentDeposit} variant="secondary">
          {TranslateString(999, "Stake LP")}
        </Button>
      ) : (
        <IconButtonWrapper>
          <IconButton variant="tertiary" onClick={onPresentDeposit}>
            <AddIcon color="primary" width="14px" />
          </IconButton>
        </IconButtonWrapper>
      );
    }

    return (
      <Button
        mt="8px"
        disabled={requestedApproval}
        onClick={handleSignleSidedApprove}
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
      {/* <Subtle style={{ alignSelf: "flex-start" }}>
        {" "}
        {totalValueOfUserFormated}
      </Subtle> */}
    </div>
  );
};

export default StakeActionSignleSided;
