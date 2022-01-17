import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { Button, useModal, IconButton, AddIcon, MinusIcon } from "yugen-uikit";
import UnlockButton from "components/UnlockButton";
import { useWeb3React } from "@web3-react/core";
import { useFarmUser } from "state/hooks";
import { FarmWithStakedValue } from "views/Farms/components/FarmCard/FarmCard";
import useI18n from "hooks/useI18n";
import { useApprove } from "hooks/useApprove";
import { getERC20Contract } from "utils/contractHelpers";
import { getBalanceNumber } from "utils/formatBalance";
import { useStake } from "hooks/useStake";
import useUnstake from "hooks/useUnstake";
import useWeb3 from "hooks/useWeb3";

import BigNumber from "bignumber.js";
import DepositModal from "../../DepositModal";
import WithdrawModal from "../../WithdrawModal";
import {
  ActionContainer,
  ActionTitles,
  ActionContent,
  Earned,
  Title,
  Subtle,
} from "./styles";

const IconButtonWrapper = styled.div`
  display: flex;
`;

const Staked: React.FunctionComponent<FarmWithStakedValue> = ({
  pid,
  lpSymbol,
  lpAddresses,
  lpDecimals,
}) => {
  const TranslateString = useI18n();
  const { account } = useWeb3React("web3");
  const [requestedApproval, setRequestedApproval] = useState(false);
  const { allowance, tokenBalance, stakedBalance } = useFarmUser(pid);
  const inputDecimals = new BigNumber(lpDecimals || 18).toNumber();
  const { onStake } = useStake(pid, inputDecimals);
  const { onUnstake } = useUnstake(pid, inputDecimals);
  const web3 = useWeb3();

  const isApproved = account && allowance && allowance.isGreaterThan(0);

  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID];

  const addLiquidityUrl = "";
  const rawStakedBalance = getBalanceNumber(stakedBalance);
  const displayBalance = rawStakedBalance.toLocaleString();

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={onStake}
      tokenName={lpSymbol}
      addLiquidityUrl={addLiquidityUrl}
    />
  );
  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onUnstake}
      tokenName={lpSymbol}
    />
  );

  const lpContract = getERC20Contract(lpAddress, web3);

  const { onApprove } = useApprove(lpContract);

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      await onApprove();
      setRequestedApproval(false);
    } catch (e) {
      console.error(e);
    }
  }, [onApprove]);

  if (!account) {
    return (
      // <GradientBorder>
      <ActionContainer>
        <ActionTitles>
          <Subtle>{TranslateString(999, "START FARMING")}</Subtle>
        </ActionTitles>
        <ActionContent>
          <UnlockButton width="100%" />
        </ActionContent>
      </ActionContainer>
      //  </GradientBorder>
    );
  }

  if (isApproved) {
    if (rawStakedBalance) {
      return (
        // <GradientBorder>
        <ActionContainer>
          <ActionTitles>
            <Title>{lpSymbol} </Title>
            <Subtle>{TranslateString(999, "STAKED")}</Subtle>
          </ActionTitles>
          <ActionContent>
            <div>
              <Earned>{displayBalance}</Earned>
            </div>
            <IconButtonWrapper>
              <IconButton
                variant="secondary"
                onClick={onPresentWithdraw}
                mr="6px"
              >
                <MinusIcon color="primary" width="14px" />
              </IconButton>
              <IconButton variant="secondary" onClick={onPresentDeposit}>
                <AddIcon color="primary" width="14px" />
              </IconButton>
            </IconButtonWrapper>
          </ActionContent>
        </ActionContainer>
        //  </GradientBorder>
      );
    }

    return (
      // <GradientBorder>
      <ActionContainer>
        <ActionTitles>
          <Subtle>{TranslateString(999, "STAKE")} </Subtle>
          <Title>{lpSymbol}</Title>
        </ActionTitles>
        <ActionContent>
          <Button width="100%" onClick={onPresentDeposit} variant="secondary">
            {TranslateString(999, "Deposit LP")}
          </Button>
        </ActionContent>
      </ActionContainer>
      //  </GradientBorder>
    );
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Subtle>{TranslateString(999, "ENABLE FARM")}</Subtle>
      </ActionTitles>
      <ActionContent>
        <Button
          width="100%"
          disabled={requestedApproval}
          onClick={handleApprove}
          variant="primary"
        >
          {TranslateString(999, "Enable")}
        </Button>
      </ActionContent>
    </ActionContainer>
  );
};

export default Staked;
