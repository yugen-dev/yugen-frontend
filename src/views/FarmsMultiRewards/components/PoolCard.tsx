import React, { useCallback, useMemo, useState } from "react";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import InfoIcon from "@material-ui/icons/Info";
import {
  Button,
  IconButton,
  useModal,
  AddIcon,
  Flex,
  Text,
  Skeleton,
} from "cryption-uikit";
import { useWeb3React } from "@web3-react/core";
import Countdown from "react-countdown";
import UnlockButton from "components/UnlockButton";
import Label from "components/Label";
import { getBep20Contract } from "utils/contractHelpers";
import useI18n from "hooks/useI18n";
import { useSousStake } from "hooks/useStake";
import useWeb3 from "hooks/useWeb3";
import { useSousUnstake } from "hooks/useUnstake";
import { getBalanceNumber } from "utils/formatBalance";
// import { useSousChefGasless } from "hooks/useContract";
import { getPoolApy } from "utils/apy";
import { useSousHarvest } from "hooks/useHarvest";
import Balance from "components/Balance";
import { UseGetApiPrice, useProfile } from "state/hooks";
import Tooltip from "components/Tooltip";
import { useSousApproveWithPermit } from "hooks/useApprove";
import { QuoteToken, PoolCategory } from "config/constants/types";
import { Pool } from "state/types";
import { useStakeWithPermitMultireward } from "hooks/useStakeWithPermitMultirewards";
import CardHeading from "./CardHeading";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";
// import CompoundModal from "./CompoundModal";
import Card from "./Card";
import OldSyrupTitle from "./OldSyrupTitle";
import CardFooter from "./CardFooter";
import ApyButton from "../../Farms/components/FarmCard/ApyButton";

interface HarvestProps {
  pool: Pool;
  valueOfCNTinUSD?: BigNumber;
  bnbPrice?: BigNumber;
  ethPrice?: BigNumber;
}

const PoolCard: React.FC<HarvestProps> = ({
  pool,
  valueOfCNTinUSD,
  bnbPrice,
  ethPrice,
}) => {
  // const [tokenprices, Settokenprices] = useState([null]);
  // const [StakingTokenPrice, setStakingTokenPrice] = useState(new BigNumber(1));
  const {
    sousId,
    image,
    tokenName,
    tokenAddress,
    stakingTokenName,
    // contractAddress,
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
    poolHarvestInterval,
    tokenPriceVsQuote,
    metamaskImg,
    quoteTokenSymbol,
    lpTotalInQuoteToken,
  } = pool;

  const totalValue: BigNumber = useMemo(() => {
    if (!lpTotalInQuoteToken) {
      return null;
    }
    if (quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(lpTotalInQuoteToken);
    }
    if (quoteTokenSymbol === QuoteToken.CNT) {
      return valueOfCNTinUSD.times(lpTotalInQuoteToken);
    }
    if (quoteTokenSymbol === QuoteToken.ETH) {
      return ethPrice.times(lpTotalInQuoteToken);
    }
    return lpTotalInQuoteToken;
  }, [
    bnbPrice,
    valueOfCNTinUSD,
    ethPrice,
    lpTotalInQuoteToken,
    quoteTokenSymbol,
  ]);

  const [signatureData, setSignatureData] = useState<{
    v: number;
    r: string;
    s: string;
    deadline: number;
  } | null>(null);

  const { account } = useWeb3React("web3");
  const [show, setShow] = useState(false);
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE;
  const TranslateString = useI18n();
  // const { onApprove } = useApproveStaking();
  /*  const {onEnter} = useEnter();
  const {onLeave} = useLeave(); */
  const { onStake } = useSousStake(sousId, isBnbPool);
  const { onStakeWithPermit } = useStakeWithPermitMultireward(
    sousId,
    signatureData
  );
  const { onUnstake } = useSousUnstake(sousId);
  const { onReward } = useSousHarvest(sousId, isBnbPool);

  /// harvest interval

  let isDaysGreater = false;
  let isHoursGreater = false;
  const poolHarvestIntervalInDays = poolHarvestInterval
    ? (poolHarvestInterval / 86400).toFixed(0)
    : 0;

  if (poolHarvestIntervalInDays > 0) {
    isDaysGreater = true;
  }
  const poolHarvestIntervalinHours = poolHarvestInterval
    ? (poolHarvestInterval / 3600).toFixed(0)
    : 0;
  if (poolHarvestIntervalinHours > 0) {
    isHoursGreater = true;
  }

  const poolHarvestIntervalinMinutes = poolHarvestInterval
    ? (poolHarvestInterval / 60).toFixed(0)
    : 0;

  let apy = 0;
  let apyString = "";
  const apyArray = [];

  pool.multiRewardTokenPerBlock.forEach(async (element, i) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const tokenPrice = UseGetApiPrice(pool.coinGeckoIds[i].toLowerCase());

    // eslint-disable-next-line  no-nested-ternary
    const rewardTokenPrice = tokenPrice
      ? new BigNumber(tokenPrice)
      : new BigNumber(1);

    const priceoflp = tokenPriceVsQuote
      ? new BigNumber(tokenPriceVsQuote)
      : new BigNumber(1);

    const currentTokenApy = getPoolApy(
      priceoflp.toNumber(),
      rewardTokenPrice.toNumber(),
      getBalanceNumber(pool.totalStaked, stakingTokenDecimals),
      parseFloat(element)
    );

    if (currentTokenApy && pool.multiRewardTokenPerBlock.length === i + 1) {
      apyString += `${currentTokenApy.toFixed(2)}% ${pool.multiReward[i]}\n`;
    } else if (currentTokenApy) {
      apyString += `${currentTokenApy.toFixed(2)}% ${pool.multiReward[i]} +\n`;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      apyString += `100% ${pool.multiReward[i]}\n`;
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
  const canHarvest = userData?.canHarvest ? userData?.canHarvest : false;

  const harvestInterval = userData?.harvestInterval
    ? new BigNumber(userData?.harvestInterval)
    : new BigNumber(0);

  const Renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return "now";
    }
    return (
      <div>
        {days > 0 ? `${days.toString()} days ` : ""}
        {hours > 0 ? `${hours.toString()} Hr ` : ""}
        {minutes > 0 ? `${minutes.toString()} min ` : ""}
        {seconds > 0 ? `${seconds.toString()} sec` : ""}
      </div>
    );
  };

  const isOldSyrup = stakingTokenName === QuoteToken.SYRUP;
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0;
  let needsApproval = !accountHasStakedBalance && !allowance.toNumber();

  if (
    signatureData !== null &&
    signatureData.deadline > Math.ceil(Date.now() / 1000)
  ) {
    needsApproval = false;
  }
  const isCardActive = isFinished && accountHasStakedBalance;
  const convertedLimit = new BigNumber(stakingLimit).multipliedBy(
    new BigNumber(10).pow(tokenDecimals)
  );
  const [onPresentDeposit] = useModal(
    signatureData !== null &&
      signatureData.deadline > Math.ceil(Date.now() / 1000) ? (
      <DepositModal
        max={
          stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit)
            ? convertedLimit
            : stakingTokenBalance
        }
        onConfirm={onStakeWithPermit}
        tokenName={
          stakingLimit
            ? `${stakingTokenName} (${stakingLimit} max)`
            : stakingTokenName
        }
        stakingTokenDecimals={stakingTokenDecimals}
      />
    ) : (
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
    )
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
  const { metaTranscation } = useProfile();

  const tokencontract = getBep20Contract(tokenAddress, web3);

  const { onApprove } = useSousApproveWithPermit(tokencontract, sousId);

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      if (metaTranscation) {
        const { v, r, s, deadlineForSignature } = await onApprove();

        setSignatureData({
          v,
          r,
          s,
          deadline: deadlineForSignature,
        });
      } else {
        await onApprove();
      }
      setRequestedApproval(false);
    } catch (e) {
      console.error(e);
    }
  }, [
    onApprove,
    metaTranscation,
    // sousChefContractGasless,
    // library,
    // account,
    // sousId,
  ]);
  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);
  return (
    <Card isActive={isCardActive} isFinished={isFinished}>
      {isFinished && <PoolFinishedSash />}
      <div style={{ borderBottom: "1px solid #524B63" }}>
        <div style={{ padding: "20px" }}>
          {/* <div
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
            src={`/images/farms/${image || tokenName.toLowerCase()}.png`}
            width={100}
            height={94}
            alt={tokenName}
          />
        </div> */}
          <CardHeading
            lpLabel={`${tokenName} Pool`}
            farmImage={image || tokenName.toLowerCase()}
            tokenSymbol={tokenName}
          />
        </div>
      </div>
      <div style={{ padding: "24px" }}>
        <div style={{ marginBottom: "8px" }}>
          <div style={{ width: "100%", maxWidth: "400px", margin: "10px 0px" }}>
            <Flex justifyContent="space-between" alignItems="center">
              <StyledDetails>
                <APRText onMouseEnter={open} onMouseLeave={close}>
                  {TranslateString(736, "APR")}:
                  <Tooltip show={show} text={apyString} forceToNewLine>
                    <InfoIcon
                      style={{
                        color: "#86878f",
                        fontSize: "15px",
                        margin: "4px 4px 0px 4px",
                      }}
                    />
                  </Tooltip>
                </APRText>
              </StyledDetails>
              <Text bold style={{ display: "flex", alignItems: "center" }}>
                {apy ? (
                  <>
                    {false && (
                      <ApyButton
                        lpLabel={tokenName}
                        addLiquidityUrl="addLiquidityUrl"
                        cakePrice={valueOfCNTinUSD}
                        apy={new BigNumber(apy || 0)}
                      />
                    )}
                    {apy.toFixed(2)}%
                  </>
                ) : (
                  <Skeleton height={24} width={80} />
                )}
              </Text>
            </Flex>
            <StyledDetails>
              <Text>{TranslateString(384, "Your Stake")}:</Text>
              <Balance
                fontSize="16px"
                isDisabled={isFinished}
                value={getBalanceNumber(stakedBalance, stakingTokenDecimals)}
              />
            </StyledDetails>
            <Flex justifyContent="space-between" mb="15px">
              <Text>{TranslateString(318, "Harvest Lock Interval")}:</Text>
              <Text bold>
                {poolHarvestIntervalInDays > 0
                  ? `${poolHarvestIntervalInDays.toString()} Days`
                  : ""}
                {!isDaysGreater && poolHarvestIntervalinHours > 0
                  ? `${poolHarvestIntervalinHours.toString()} Hours`
                  : ""}
                {!isDaysGreater &&
                !isHoursGreater &&
                poolHarvestIntervalinMinutes > 0
                  ? `${poolHarvestIntervalinMinutes.toString()} Minutes`
                  : ""}
              </Text>
            </Flex>

            {account && harvestInterval.toNumber() > 0 && (
              <Flex justifyContent="space-between" mb="15px">
                <Text>{TranslateString(318, "Next Harvest in :")}</Text>
                <Text bold>
                  <Countdown
                    date={harvestInterval.toNumber() * 1000}
                    renderer={Renderer}
                  />
                </Text>
              </Flex>
            )}

            {/* canHarvest */}
            {account && harvest && canHarvest && !isOldSyrup && (
              <Button
                disabled={!canHarvest || !earnings.toNumber() || pendingTx}
                style={{ width: "100%", maxWidth: "400px" }}
                onClick={async () => {
                  setPendingTx(true);
                  await onReward();
                  setPendingTx(false);
                }}
              >
                {pendingTx ? "Collecting..." : "Harvest"}
              </Button>
            )}
            {!canHarvest && (
              <Button
                disabled={!canHarvest}
                style={{ width: "100%", maxWidth: "400px" }}
              >
                {pendingTx ? "Collecting..." : "Harvest"}
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
                              new BigNumber(
                                pool.multiRewardTokenPerBlock[i]
                              ).div(
                                new BigNumber(pool.multiRewardTokenPerBlock[0])
                              )
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
        totalLiquidityLocked={totalValue}
        startBlock={startBlock}
        endBlock={endBlock}
        isFinished={isFinished}
        poolCategory={poolCategory}
        tokenName={tokenName}
        tokenAddress={tokenAddress}
        tokenDecimals={tokenDecimals}
        metamaskImg={metamaskImg}
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
const APRText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default PoolCard;
