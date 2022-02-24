/* eslint-disable dot-notation */
import React, { useState, useCallback, useMemo } from "react";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import { provider as ProviderType } from "web3-core";
import Countdown from "react-countdown";
import { getAddress } from "utils/addressHelpers";
import { Flex, Text, Heading, Radio } from "yugen-uikit";
import { Farm } from "state/types";
import { getBalanceNumber } from "utils/formatBalance";
import { useFarmFromPid, useFarmUser, useProfile } from "state/hooks";
import useI18n from "hooks/useI18n";
import useWeb3 from "hooks/useWeb3";
import { getERC20Contract } from "utils/contractHelpers";
import useEthBalance from "hooks/useEthBalance";
import { useApprove } from "hooks/useApprove";
import UnlockButton from "components/UnlockButton";
import { Subtle } from "../FarmTable/Actions/styles";
import StakeAction from "./StakeAction";
import HarvestAction from "./HarvestAction";
import StakeActionSignleSided from "./StakeActionSignleSided";

const Action = styled.div`
  padding-top: 5px;
`;

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber;
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue;
  provider?: ProviderType;
  account?: string;
  addLiquidityUrl?: string;
  totalValue?: BigNumber;
}

const CardActions: React.FC<FarmCardActionsProps> = ({
  farm,
  account,
  addLiquidityUrl,
  totalValue,
}) => {
  const TranslateString = useI18n();
  const [requestedApproval, setRequestedApproval] = useState(false);
  const { pid, lpAddresses, singleSidedToken, singleSidedToToken } =
    useFarmFromPid(farm.pid);

  const {
    allowance,
    tokenBalance,
    stakedBalance,
    earnings,
    canHarvest,
    harvestInterval,
    SingleSidedAllowances,
    SingleSidedTokenBalance,
    SingleSidedToTokenBalance,
    SingleSidedToTokenAllowances,
  } = useFarmUser(pid);

  const lpAddress = getAddress(lpAddresses);
  const singleSidedAddress = getAddress(singleSidedToken);
  const singleSidedToTokenAddress = getAddress(singleSidedToToken);

  const lpName = farm.lpSymbol.toUpperCase();
  const singleSidedTokenName = farm.singleSidedTokenName.toUpperCase();
  const singleSidedtoTokenName = farm.singleSidedToTokenName.toUpperCase();
  const isApproved = account && allowance && allowance.isGreaterThan(0);
  const isSignleSidedTokenApproved =
    account && SingleSidedAllowances && SingleSidedAllowances.isGreaterThan(0);
  const isSingleSidedToTokenApproved =
    account &&
    SingleSidedToTokenAllowances &&
    SingleSidedToTokenAllowances.isGreaterThan(0);

  const web3 = useWeb3();
  const singleSidedTokendecimals = farm.singleSidedTokenDecimal
    ? farm.singleSidedTokenDecimal
    : new BigNumber(18);

  const singleSidedToTokendecimals = farm.singleSidedToTokenDecimal
    ? farm.singleSidedToTokenDecimal
    : new BigNumber(18);

  const [radioValue, setRadioValue] = React.useState("LP");
  const [radioTrue, setRadioTrue] = React.useState(true);
  const valueOfEthBalance = useEthBalance();

  const handleRadioChange = (value) => {
    if (value === "LP") {
      setRadioTrue(true);
    } else {
      setRadioTrue(false);
    }
    setRadioValue(() => value);
  };

  const totalValueOfUser: BigNumber = useMemo(() => {
    if (!account) {
      return null;
    }
    if (!stakedBalance) {
      return null;
    }
    if (!farm.lpTotalInQuoteToken) {
      return null;
    }

    if (totalValue === undefined || totalValue === null) {
      return new BigNumber(0);
    }

    return new BigNumber(totalValue)
      .times(stakedBalance)
      .div(farm.lpTotalSupplyInMasterchef);
  }, [
    totalValue,
    stakedBalance,
    farm.lpTotalInQuoteToken,
    account,
    farm.lpTotalSupplyInMasterchef,
  ]);

  const totalValueOfUserFormated = totalValueOfUser
    ? `$${Number(totalValueOfUser).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })}`
    : "-";

  const lpContract = getERC20Contract(lpAddress, web3);

  const { metaTranscation } = useProfile();
  const inputDecimals = new BigNumber(farm.lpDecimals || 18).toNumber();
  const rawStakedBalance = getBalanceNumber(stakedBalance, inputDecimals);
  const displayBalance = rawStakedBalance.toFixed(4).toLocaleString();
  const [signatureData, setSignatureData] = useState<{
    v: number;
    r: string;
    s: string;
    deadline: number;
  } | null>(null);

  const { onApprove } = useApprove(lpContract);

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
  }, [onApprove, metaTranscation]);

  const setSignauteNull = () => {
    setSignatureData(null);
  };

  const Renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return "now";
    }
    return (
      <div>
        {days > 0 ? `${days.toString()} days ` : ""}
        {hours > 0 ? `${hours.toString()} hr ` : ""}
        {minutes > 0 ? `${minutes.toString()} min ` : ""}
        {seconds > 0 ? `${seconds.toString()} sec` : ""}
      </div>
    );
  };

  const RenderNextHarvestIn = () => {
    const check =
      isApproved ||
      (signatureData !== null &&
        signatureData.deadline > Math.ceil(Date.now() / 1000));

    if (check && harvestInterval.toNumber() * 1000) {
      return (
        <>
          <Flex justifyContent="space-between">
            <Text color="#9b9382">
              {TranslateString(318, "Next Harvest in")}
            </Text>
            <Text bold>
              <Countdown
                date={harvestInterval.toNumber() * 1000}
                renderer={Renderer}
              >
                <div style={{ color: "#424945" }}>Done !</div>
              </Countdown>
            </Text>
          </Flex>
        </>
      );
    }

    return (
      <Flex justifyContent="space-between">
        <Text color="#9b9382">{TranslateString(318, "Next Harvest in")}</Text>
        <Text bold color="#424945">
          Done !
        </Text>
      </Flex>
    );
  };
  const renderApprovalOrStakeButton = () => {
    return (
      <>
        <Flex mt="15px" justifyContent="space-between" alignItems="center">
          <div style={{ display: "flex" }}>
            <Text
              bold
              textTransform="uppercase"
              color="#887263"
              fontSize="12px"
              pr="5px"
            >
              {lpName}
            </Text>
            <Text
              bold
              textTransform="uppercase"
              color="#887263"
              fontSize="12px"
              mb="10px"
            >
              {TranslateString(1074, "Staked")}
            </Text>
          </div>
          <Flex justifyContent="space-between" alignItems="center">
            <Heading
              color={rawStakedBalance === 0 ? "textDisabled" : "text"}
              style={{ marginRight: "5px" }}
            >
              {displayBalance}
            </Heading>
            <Subtle> ( {totalValueOfUserFormated} )</Subtle>
          </Flex>
        </Flex>
        <div>
          {farm.showSingleSided && (
            <Flex>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>LP</Text>
                  <Radio
                    name="radio"
                    scale="sm"
                    onChange={() => handleRadioChange("LP")}
                    style={{ margin: "10px" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>{singleSidedTokenName}</Text>
                  <Radio
                    scale="sm"
                    name="radio"
                    onChange={() => handleRadioChange(singleSidedTokenName)}
                    style={{ margin: "10px" }}
                  />
                </div>
                {farm.showSingleSided &&
                  singleSidedtoTokenName !== "NACHO" &&
                  singleSidedtoTokenName !== "CXETH" && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text>{singleSidedtoTokenName}</Text>
                      <Radio
                        scale="sm"
                        name="radio"
                        // value={singleSidedtoTokenName}
                        onChange={() =>
                          handleRadioChange(singleSidedtoTokenName)
                        }
                        // checked={!radioTrue}
                        style={{ margin: "10px" }}
                      />
                    </div>
                  )}
              </div>
            </Flex>
          )}
          {radioTrue && radioValue !== singleSidedtoTokenName && (
            <StakeAction
              lpDecimals={farm.lpDecimals}
              stakedBalance={stakedBalance}
              tokenBalance={tokenBalance}
              tokenName={lpName}
              pid={pid}
              addLiquidityUrl={addLiquidityUrl}
              signatureData={signatureData}
              setSignauteNull={setSignauteNull}
              approvalDisabled={requestedApproval}
              handleApprove={handleApprove}
              isApproved={isApproved}
              totalValueOfUserFormated={totalValueOfUserFormated}
            />
          )}
          {farm.showSingleSided &&
            !radioTrue &&
            radioValue !== singleSidedtoTokenName && (
              <StakeActionSignleSided
                stakedBalance={stakedBalance}
                tokenBalance={SingleSidedTokenBalance}
                tokenName={singleSidedTokenName}
                decimal={singleSidedTokendecimals}
                pid={pid}
                addLiquidityUrl={addLiquidityUrl}
                isApproved={isSignleSidedTokenApproved}
                totalValueOfUserFormated={totalValueOfUserFormated}
                singleSidedAddress={singleSidedAddress}
                singleSidedToTokenAddress={singleSidedToTokenAddress}
                lpTokenAddress={lpAddress}
                valueOfEthBalance={valueOfEthBalance}
              />
            )}
          {farm.showSingleSided &&
            !radioTrue &&
            radioValue === singleSidedtoTokenName && (
              <StakeActionSignleSided
                stakedBalance={stakedBalance}
                tokenBalance={SingleSidedToTokenBalance}
                tokenName={singleSidedtoTokenName}
                decimal={singleSidedToTokendecimals}
                pid={pid}
                addLiquidityUrl={addLiquidityUrl}
                isApproved={isSingleSidedToTokenApproved}
                totalValueOfUserFormated={totalValueOfUserFormated}
                singleSidedAddress={singleSidedToTokenAddress}
                singleSidedToTokenAddress={singleSidedAddress}
                lpTokenAddress={lpAddress}
                valueOfEthBalance={valueOfEthBalance}
              />
            )}
        </div>
      </>
    );
  };

  return (
    <Action>
      <RenderNextHarvestIn />
      <br />
      <Flex justifyContent="center">
        <Text bold color="#887263" fontSize="14px" pr="5px">
          fYGN
        </Text>
        <Text
          bold
          textTransform="uppercase"
          color="#887263"
          fontSize="14px"
          mb="5px"
        >
          Earned
        </Text>
      </Flex>
      <HarvestAction earnings={earnings} canHarvest={canHarvest} pid={pid} />
      {!account ? (
        <UnlockButton mt="8px" width="100%" />
      ) : (
        renderApprovalOrStakeButton()
      )}
    </Action>
  );
};

export default CardActions;
