import React, { useState, useCallback } from "react";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import styled from "styled-components";
import { Button, IconButton, useModal, AddIcon, Image } from "cryption-uikit";
import InfoIcon from "@material-ui/icons/Info";
import { useWeb3React } from "@web3-react/core";
import UnlockButton from "components/UnlockButton";
import Label from "components/Label";
import { getContract } from "utils/contractHelpers";
import { getAddress } from "utils/addressHelpers";
import useI18n from "hooks/useI18n";
// import { GetPoolPendingReward } from "hooks/GetPoolPendingReward";
import { useSousStake } from "hooks/useStake";
import useWeb3 from "hooks/useWeb3";
import { useSousUnstake } from "hooks/useUnstake";
import { getBalanceNumber } from "utils/formatBalance";
import { getPoolApy } from "utils/apy";
import { useSousHarvest } from "hooks/useHarvest";
import Balance from "components/Balance";
import { QuoteToken, PoolCategory } from "config/constants/types";
import { Pool } from "state/types";
import cakeAbi from "config/abi/cake.json";
import Tooltip from "components/Tooltip";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";
// import CompoundModal from "./CompoundModal";
import CardTitle from "./CardTitle";
import Card from "./Card";
import OldSyrupTitle from "./OldSyrupTitle";
import CardFooter from "./CardFooter";

interface HarvestProps {
  pool: Pool;
}

const PoolCard: React.FC<HarvestProps> = ({ pool }) => {
  // const [pendingMultiRewards, SetpendingMultiRewards] = useState(null);
  const {
    sousId,
    image,
    tokenName,
    tokenAddress,
    stakingTokenName,
    // stakingTokenAddress,
    contractAddress,
    stakingTokenDecimals,
    projectLink,
    harvest,
    tokenDecimals,
    poolCategory,
    totalStaked,
    startBlock,
    endBlock,
    isFinished,
    userData,
    stakingLimit,
  } = pool;
  const { account } = useWeb3React("web3");

  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE;
  const [show, setShow] = useState(false);
  const TranslateString = useI18n();
  // const { onApprove } = useApproveStaking();
  /*  const {onEnter} = useEnter();
  const {onLeave} = useLeave(); */
  const { onStake } = useSousStake(sousId, isBnbPool);
  const { onUnstake } = useSousUnstake(sousId);
  const { onReward } = useSousHarvest(sousId, isBnbPool);

  // APY
  // const rewardTokenPrice = useGetApiPrice(tokenName);

  // const stakingTokenPrice = useGetApiPrice(stakingTokenName);
  const stakingTokenPrice = Number(1);
  let apy = 0;
  let apyString = "";
  const apyArray = [];
  // const pendingRewardArray = [];

  pool.multiRewardTokenPerBlock.forEach(async (element, i) => {
    const rewardTokenPrice = Number(1);

    const currentTokenApy = getPoolApy(
      stakingTokenPrice,
      rewardTokenPrice,
      getBalanceNumber(pool.totalStaked, stakingTokenDecimals),
      parseFloat(element)
    );
    if (currentTokenApy && pool.multiRewardTokenPerBlock.length === i + 1) {
      apyString += `${currentTokenApy.toFixed(2)}% ${pool.multiReward[i]}`;
    } else if (currentTokenApy) {
      apyString += `${currentTokenApy.toFixed(2)}% ${pool.multiReward[i]} + `;
    } else {
      apyString += `100% ${pool.multiReward[i]} `;
    }

    apy += currentTokenApy;
    apyArray.push(currentTokenApy);
  });

  const web3 = useWeb3();
  const [requestedApproval, setRequestedApproval] = useState(false);
  const [pendingTx, setPendingTx] = useState(false);

  const allowance = new BigNumber(userData?.allowance || 0);
  const stakingTokenBalance = new BigNumber(userData?.stakingTokenBalance || 0);
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0);
  const earnings = new BigNumber(userData?.pendingReward || 0);

  const isOldSyrup = stakingTokenName === QuoteToken.SYRUP;
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0;
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber();
  const isCardActive = isFinished && accountHasStakedBalance;
  const convertedLimit = new BigNumber(stakingLimit).multipliedBy(
    new BigNumber(10).pow(tokenDecimals)
  );
  const [onPresentDeposit] = useModal(
    <DepositModal
      max={
        stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit)
          ? convertedLimit
          : stakingTokenBalance
      }
      onConfirm={onStake}
      tokenName={
        stakingLimit
          ? `${stakingTokenName} (${stakingLimit} max)`
          : stakingTokenName
      }
      stakingTokenDecimals={stakingTokenDecimals}
    />
  );

  // const [onPresentCompound] = useModal(
  //   <CompoundModal
  //     earnings={earnings}
  //     onConfirm={onStake}
  //     tokenName={stakingTokenName}
  //   />
  // );

  const [onPresentWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={onUnstake}
      tokenName={stakingTokenName}
      stakingTokenDecimals={stakingTokenDecimals}
    />
  );

  const handleApprove = async () => {
    try {
      const contract = await getContract(cakeAbi, tokenAddress, web3);
      setRequestedApproval(true);
      const txHash = await contract.methods
        .approve(getAddress(contractAddress), ethers.constants.MaxUint256)
        .send({ from: account });
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false);
      }
    } catch (e) {
      console.error("error is", e);
    }
  };
  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);
  return (
    <Card isActive={isCardActive} isFinished={isFinished}>
      {isFinished && <PoolFinishedSash />}
      <div style={{ borderBottom: "1px solid #524B63" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px",
          }}
        >
          <CardTitle isFinished={isFinished}>
            {isOldSyrup && "[OLD]"} {tokenName} {TranslateString(348, "Pool")}
          </CardTitle>
          <Image
            src={`/images/tokens/${image || tokenName.toLowerCase()}.png`}
            width={64}
            height={64}
            alt={tokenName}
          />
        </div>
      </div>
      <div style={{ padding: "24px" }}>
        <div style={{ marginBottom: "8px" }}>
          <div style={{ width: "100%", maxWidth: "400px", margin: "10px 0px" }}>
            <StyledDetails>
              <APRText onMouseEnter={open} onMouseLeave={close}>
                APR :
                <Tooltip show={show} text={apyString}>
                  <InfoIcon
                    style={{
                      color: "#86878f",
                      fontSize: "15px",
                      margin: "4px 4px 0px 4px",
                    }}
                  />
                </Tooltip>
              </APRText>
              {isFinished || isOldSyrup || !apy ? (
                "-"
              ) : (
                <Balance
                  fontSize="16px"
                  isDisabled={isFinished}
                  value={apy}
                  decimals={2}
                  unit="%"
                />
              )}
            </StyledDetails>
            <StyledDetails>
              <div>{TranslateString(384, "Your Stake")}:</div>
              <Balance
                fontSize="16px"
                isDisabled={isFinished}
                value={getBalanceNumber(stakedBalance, stakingTokenDecimals)}
              />
            </StyledDetails>
            {account && harvest && !isOldSyrup && (
              <Button
                disabled={!earnings.toNumber() || pendingTx}
                style={{ width: "100%", maxWidth: "400px" }}
                onClick={async () => {
                  setPendingTx(true);
                  await onReward();
                  setPendingTx(false);
                }}
              >
                {pendingTx ? "Collecting" : "Harvest"}
              </Button>
            )}
          </div>
        </div>
        <div style={{ marginBottom: "8px" }}>
          <RewardsSection>
            <RewardTitle>
              <TitleText>Rewards Earned</TitleText>
            </RewardTitle>
            <RewardDetails>
              {pool.multiReward.map((element, i) => {
                return (
                  <RewardItem>
                    {!isOldSyrup ? (
                      <BalanceAndCompound>
                        <Balance
                          fontSize="22px"
                          value={getBalanceNumber(
                            earnings.multipliedBy(
                              new BigNumber(pool.multiRewardTokenPerBlock[i])
                            ),
                            tokenDecimals
                          )}
                          isDisabled={isFinished}
                        />
                      </BalanceAndCompound>
                    ) : (
                      <OldSyrupTitle hasBalance={accountHasStakedBalance} />
                    )}
                    <Label isFinished={isFinished} text={element} />
                  </RewardItem>
                );
              })}
            </RewardDetails>
          </RewardsSection>
        </div>
        <StyledCardActions>
          {!account && <UnlockButton />}
          {account &&
            (needsApproval && !isOldSyrup ? (
              <div style={{ flex: 1 }}>
                <Button
                  disabled={isFinished || requestedApproval}
                  onClick={handleApprove}
                  width="100%"
                >
                  {`Approve ${stakingTokenName}`}
                </Button>
              </div>
            ) : (
              <>
                <Button
                  disabled={stakedBalance.eq(new BigNumber(0)) || pendingTx}
                  onClick={
                    isOldSyrup
                      ? async () => {
                          setPendingTx(true);
                          await onUnstake("0", stakingTokenDecimals);
                          setPendingTx(false);
                        }
                      : onPresentWithdraw
                  }
                >
                  Unstake {tokenName}
                </Button>
                <StyledActionSpacer />
                {!isOldSyrup && (
                  <IconButton disabled={isFinished} onClick={onPresentDeposit}>
                    <AddIcon color="white" />
                  </IconButton>
                )}
              </>
            ))}
        </StyledCardActions>
      </div>
      <CardFooter
        projectLink={projectLink}
        decimals={stakingTokenDecimals}
        totalStaked={totalStaked}
        startBlock={startBlock}
        endBlock={endBlock}
        isFinished={isFinished}
        poolCategory={poolCategory}
        tokenName={tokenName}
        tokenAddress={tokenAddress}
        tokenDecimals={tokenDecimals}
      />
    </Card>
  );
};

const PoolFinishedSash = styled.div`
  background-image: url("../../../../public/images/pool-finished-sash.svg");
  background-position: top right;
  background-repeat: no-repeat;
  height: 135px;
  position: absolute;
  right: -24px;
  top: -24px;
  width: 135px;
`;

const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
  width: 100%;
  box-sizing: border-box;
`;

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
  color: #86878f;
`;
const APRText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const RewardsSection = styled.div``;
const RewardDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;
const RewardItem = styled.div`
  text-align: center;
`;
const RewardTitle = styled.div`
  width: 100%;
  text-align: center;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: rgb(82, 75, 99);
    z-index: 0;
  }
`;
const TitleText = styled.div`
  position: relative;
  padding: 10px;
  color: #eae2fc;
  background: #1e202a;
  font-weight: 600;
  font-size: 22px;
  line-height: 1.1;
  display: inline-block;
  z-index: 1;
`;
export default PoolCard;
