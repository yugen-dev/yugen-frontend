import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { Button, useModal, IconButton, AddIcon, MinusIcon } from "yugen-uikit";
import UnlockButton from "components/UnlockButton";
import { useWeb3React } from "@web3-react/core";
import { useVaultUser } from "state/hooks";
import { VaultWithStakedValue } from "views/Farms/components/FarmCard/FarmCard";
import useI18n from "hooks/useI18n";
import { useVaultApprove } from "hooks/useApprove";
import { getERC20Contract } from "utils/contractHelpers";
import { BASE_ADD_LIQUIDITY_URL } from "config";
import { getBalanceNumber } from "utils/formatBalance";
// import { useVaultStake } from "hooks/useStake";
import { useVaultStake } from "hooks/useProxyStake";
import { useVaultUnstake } from "hooks/useProxyUnstake";
import useWeb3 from "hooks/useWeb3";

import { getAddress } from "utils/addressHelpers";
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

const Staked: React.FunctionComponent<VaultWithStakedValue> = ({
  pid,
  lpTokenName,
  lpTokenAddress,
  vaultAddress,
}) => {
  const TranslateString = useI18n();
  const { account } = useWeb3React("web3");
  const [requestedApproval, setRequestedApproval] = useState(false);
  const { allowance, tokenBalance, stakedBalance } = useVaultUser(pid);
  const vaultContractAddress = getAddress(vaultAddress);
  const { onStake } = useVaultStake(vaultContractAddress);
  const { onUnstake } = useVaultUnstake(vaultContractAddress);
  const web3 = useWeb3();

  const isApproved = account && allowance && allowance.isGreaterThan(0);

  const lpAddress = getAddress(lpTokenAddress);
  const liquidityUrlPathParts = "";
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`;
  const rawStakedBalance = getBalanceNumber(stakedBalance);
  const displayBalance = rawStakedBalance.toLocaleString();

  const [onPresentDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={onStake}
      tokenName={lpTokenName}
      addLiquidityUrl={addLiquidityUrl}
    />
  );
  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onUnstake}
      tokenName={lpTokenName}
    />
  );

  const lpContract = getERC20Contract(lpAddress, web3);

  const { onApprove } = useVaultApprove(lpContract, vaultContractAddress);

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      await onApprove();
      setRequestedApproval(false);
    } catch (e) {
      console.error("Error while trying to approve: ", e);
    }
  }, [onApprove]);

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>
          <Subtle>{TranslateString(999, `${lpTokenName} Vault`)}</Subtle>
        </ActionTitles>
        <ActionContent>
          <UnlockButton width="100%" />
        </ActionContent>
      </ActionContainer>
    );
  }

  if (isApproved) {
    if (rawStakedBalance) {
      return (
        <ActionContainer>
          <ActionTitles>
            <Title>{lpTokenName} </Title>
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
      );
    }

    return (
      <ActionContainer>
        <ActionTitles>
          <Subtle>{TranslateString(999, "Deposit")} </Subtle>
          <Title>{lpTokenName}</Title>
        </ActionTitles>
        <ActionContent>
          <Button width="100%" onClick={onPresentDeposit} variant="secondary">
            {TranslateString(999, "Deposit LP")}
          </Button>
        </ActionContent>
      </ActionContainer>
    );
  }

  return (
    <ActionContainer>
      <ActionTitles>
        <Subtle>{TranslateString(999, "Approve Vault")}</Subtle>
      </ActionTitles>
      <ActionContent>
        <Button
          width="100%"
          disabled={requestedApproval}
          onClick={handleApprove}
          variant="primary"
        >
          {TranslateString(999, "Approve")}
        </Button>
      </ActionContent>
    </ActionContainer>
  );
};

export default Staked;
