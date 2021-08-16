import React, { useState, useCallback, useMemo, useEffect } from "react";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import Web3 from "web3";
import { provider as ProviderType } from "web3-core";
import Countdown from "react-countdown";
import { getAddress, getFarmAddress } from "utils/addressHelpers";
import { Flex, Text, Radio, Heading, Button, useModal } from "cryption-uikit";
import { Farm } from "state/types";
import { getBalanceNumber, getFullDisplayBalance } from "utils/formatBalance";
import { useFarmFromSymbol, useFarmUser, useProfile } from "state/hooks";
import { useUniversalOneSidedFarm } from "hooks/useContract";
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
import StakeEthModal from '../StakeEthModal';
import DepositModal from "../DepositModal";

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
  const universalOneSidedFarm = useUniversalOneSidedFarm();
  const TranslateString = useI18n();
  const [requestedApproval, setRequestedApproval] = useState(false);
  const { pid, lpAddresses, singleSidedToken, singleSidedToToken } =
    useFarmFromSymbol(farm.lpSymbol);

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
  const [ethBal, setEthBal] = React.useState(new BigNumber(0));
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const web3Eth = new Web3(window.ethereum);
        const ethBalance = await web3Eth.eth.getBalance(account);
        setEthBal(new BigNumber(ethBalance))
      } catch (error) {
        console.error({ error });
      }
    };

    if (account) {
      fetchBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);
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
  const [radioTrue, SetradioTrue] = React.useState(true);
  const valueOfEthBalance = useEthBalance();
  const handleRadioChange = (value) => {
    if (value === "LP") {
      SetradioTrue(true);
    } else {
      SetradioTrue(false);
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

    return totalValue.times(stakedBalance).div(farm.lpTotalSupplyInMasterchef);
  }, [
    totalValue,
    stakedBalance,
    farm.lpTotalInQuoteToken,
    account,
    farm.lpTotalSupplyInMasterchef,
  ]);

  const totalValueOfUserFormated = totalValueOfUser
    ? `$${Number(totalValueOfUser).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}`
    : "-";

  const lpContract = getERC20Contract(lpAddress, web3);

  const { metaTranscation } = useProfile();
  const rawStakedBalance = getBalanceNumber(stakedBalance);

  const displayBalance = rawStakedBalance.toLocaleString();
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
        {hours > 0 ? `${hours.toString()} Hr ` : ""}
        {minutes > 0 ? `${minutes.toString()} min ` : ""}
        {seconds > 0 ? `${seconds.toString()} sec` : ""}
      </div>
    );
  };

  const onConfirmStakeEth = async () => {
    try {
      const farmAddress = getFarmAddress();
      console.log({ farmAddress });
      // const getEthBal = getFullDisplayBalance(ethBal);
      console.log(farm.pid, { lpAddress }, { singleSidedAddress }, { farmAddress })
      const onCrossChainoneSidedFarm = await universalOneSidedFarm.methods.crossChainOneSidedFarm('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', false, 0, farm.pid, lpAddress, singleSidedAddress, farmAddress, 1).send({ from: account, value: web3.utils.toWei('0.12', 'ether') });
        console.log('txhash is ', onCrossChainoneSidedFarm);
    } catch (error) {
      console.log('error is', error);
    }
  }
  const [onStakeEth] = useModal(
    <StakeEthModal
      activeIndex={1}
    />
  );
  const [onPresentDeposit] = useModal(
    <DepositModal
      max={ethBal}
      onConfirm={onConfirmStakeEth}
      tokenName="Eth"
      addLiquidityUrl={addLiquidityUrl}
    />
  );
  const RenderNextHarvestIn = () => {
    const check =
      isApproved ||
      (signatureData !== null &&
        signatureData.deadline > Math.ceil(Date.now() / 1000));

    if (check && harvestInterval.toNumber() * 1000) {
      return (
        <>
          <Flex justifyContent="space-between">
            <Text>{TranslateString(318, "Next Harvest in :")}</Text>
            <Text bold>
              <Countdown
                date={harvestInterval.toNumber() * 1000}
                renderer={Renderer}
              >
                <div style={{ color: "white" }}>Done !</div>
              </Countdown>
            </Text>
          </Flex>
        </>
      );
    }

    return (
      <Flex justifyContent="space-between" style={{ color: "#1E202A" }}>
        <Text color="#1E202A">{TranslateString(318, "Next Harvest in :")}</Text>
        <Text bold color="#1E202A">
          <div style={{ color: "#1E202A" }}>Done !</div>
        </Text>
      </Flex>
    );
  };
  // console.log('chec bal', ethBal, new BigNumber(ethBal))
  const renderApprovalOrStakeButton = () => {
    return (
      <>
        <Flex mt="15px" justifyContent="space-between" alignItems="center">
          <div style={{ display: "flex" }}>
            <Text
              bold
              textTransform="uppercase"
              color="#2082E9"
              fontSize="12px"
              pr="5px"
            >
              {lpName}
            </Text>
            <Text
              bold
              textTransform="uppercase"
              color="#86878F"
              fontSize="12px"
              mb="10px"
            >
              {TranslateString(1074, "Staked")}
            </Text>
          </div>
          <Flex justifyContent="space-between" alignItems="center">
            <Heading color={rawStakedBalance === 0 ? "textDisabled" : "text"} style={{ marginRight: '5px' }}>
              {displayBalance}
            </Heading>
            <Subtle> ( {totalValueOfUserFormated} )</Subtle>
          </Flex>
        </Flex>
        {window.ethereum.networkVersion === '1' || window.ethereum.networkVersion === '5' ?
          <Button onClick={onPresentDeposit} variant="secondary" mt="15px">
            {TranslateString(999, "Stake ETH")}
          </Button>
          :
          <div>
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
                    // value="LP"
                    onChange={() => handleRadioChange("LP")}
                    // checked={radioTrue}
                    // defaultChecked
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
                    // value={singleSidedTokenName}
                    onChange={() => handleRadioChange(singleSidedTokenName)}
                    // checked={!radioTrue}
                    style={{ margin: "10px" }}
                  />
                </div>
                {singleSidedtoTokenName !== "CNT" && (
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
                      onChange={() => handleRadioChange(singleSidedtoTokenName)}
                      // checked={!radioTrue}
                      style={{ margin: "10px" }}
                    />
                  </div>
                )}
              </div>
            </Flex>
            {radioTrue && radioValue !== singleSidedtoTokenName && (
              <StakeAction
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
            {!radioTrue && radioValue !== singleSidedtoTokenName && (
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
            {!radioTrue && radioValue === singleSidedtoTokenName && (
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
          </div>}
        {/* :
          (
            <Button
              mt="8px"
              width="100%"
              disabled={requestedApproval}
              onClick={handleApprove}
            >
              {TranslateString(758, "Approve")}
            </Button>
          )
        } */}
      </>
    );
  };

  return (
    <Action>
      <RenderNextHarvestIn />
      <br />
      <Flex>
        <Text
          bold
          textTransform="uppercase"
          color="#2082E9"
          fontSize="12px"
          pr="5px"
        >
          {/* TODO: Is there a way to get a dynamic value here from useFarmFromSymbol? */}
          CNT
        </Text>
        <Text
          bold
          textTransform="uppercase"
          color="#86878F"
          fontSize="12px"
          mb="10px"
        >
          {TranslateString(1072, "Earned")}
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
