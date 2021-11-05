/* eslint-disable dot-notation */
import React, { useState, useCallback, useMemo, useEffect } from "react";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import Web3 from "web3";
import { useDispatch } from "react-redux";
import { provider as ProviderType } from "web3-core";
import Countdown from "react-countdown";
import HistoryIcon from "@material-ui/icons/History";
import { getAddress, getFarmAddress } from "utils/addressHelpers";
import { useChainId } from "state/application/hooks";
import { Flex, Text, Radio, Heading, Button } from "cryption-uikit";
import { Farm } from "state/types";
import { getBalanceNumber } from "utils/formatBalance";
import {
  useFarmFromSymbol,
  useFarmUser,
  useProfile,
  useToast,
} from "state/hooks";
import {
  useUniversalOneSidedFarm,
  useL2Intermediator,
} from "hooks/useContract";
import useI18n from "hooks/useI18n";
import useWeb3 from "hooks/useWeb3";
import { getERC20Contract } from "utils/contractHelpers";
import useEthBalance from "hooks/useEthBalance";
import { useApprove } from "hooks/useApprove";
import UnlockButton from "components/UnlockButton";
import { CROSS_CHAIN_API_LINK } from "config";
import { fetchVaultUserDataAsync } from "state/actions";
import { Subtle } from "../FarmTable/Actions/styles";
import StakeAction from "./StakeAction";
import HarvestAction from "./HarvestAction";
import StakeActionSignleSided from "./StakeActionSignleSided";
import DepositModal from "../DepositModalCrossChain";
import TranscationsModal from "../TranscationsModal";

const Action = styled.div`
  padding-top: 5px;
`;

const BellContainer = styled.div`
  background: #9b9382;
  border-radius: 50%;
  width: 40px;
  position: relative;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  cursor: pointer;
`;

const UnreadCount = styled.div`
  position: absolute;
  top: -9px;
  right: -3px;
  background: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  font-weight: 900;
  color: #424945;
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
  crossChainTranscations?: any;
}

const CardActions: React.FC<FarmCardActionsProps> = ({
  farm,
  account,
  addLiquidityUrl,
  totalValue,
  crossChainTranscations,
}) => {
  const universalOneSidedFarm = useUniversalOneSidedFarm();
  const { toastSuccess, toastError } = useToast();
  const L2IntermediatoryContract = useL2Intermediator();
  const TranslateString = useI18n();
  const [requestedApproval, setRequestedApproval] = useState(false);
  const [showSteps, toggleShowSteps] = useState(false);
  const [pendingCrossChainTrx, togglependingCrossChainTrx] = useState(false);
  const [showDepositModal, onPresentDeposit] = useState(false);
  const [showTranscationsModal, toggleTranscationsModal] = useState(false);
  const [stakeEthProcessEth, setStakeEthProcessEth] = useState(0);
  const chainId = useChainId().toString();
  // console.log('farm details', crossChainTranscations);
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
        setEthBal(new BigNumber(ethBalance));
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
  const dispatch = useDispatch();
  const singleSidedAddress = getAddress(singleSidedToken);
  const singleSidedToTokenAddress = getAddress(singleSidedToToken);

  const lpName = farm.lpSymbol.toUpperCase();
  const singleSidedTokenName = farm.singleSidedTokenName.toUpperCase();
  const singleSidedtoTokenName = farm.singleSidedToTokenName.toUpperCase();
  const isApproved = account && allowance && allowance.isGreaterThan(0);
  const pendingTranscations = crossChainTranscations.filter(
    (transcation) =>
      transcation.status === "depositeOnEthereum" ||
      transcation.status === "initiated"
  ).length;
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
    ? `$${Number(totalValueOfUser).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })}`
    : "-";

  const lpContract = getERC20Contract(lpAddress, web3);

  const { metaTranscation } = useProfile();
  const rawStakedBalance = getBalanceNumber(stakedBalance);
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
        {hours > 0 ? `${hours.toString()} Hr ` : ""}
        {minutes > 0 ? `${minutes.toString()} min ` : ""}
        {seconds > 0 ? `${seconds.toString()} sec` : ""}
      </div>
    );
  };
  const onConfirmStakeEth = async (amount) => {
    try {
      const farmAddress = getFarmAddress();
      let amoountInWei = web3.utils.toWei(amount).toString();
      // const eastimedGas = await universalOneSidedFarm.methods.crossChainOneSidedFarm('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', false, 0, farm.pid, lpAddress, singleSidedAddress, farmAddress, 0).estimateGas({ from: account, value: amoountInWei });
      if (ethBal.toString() === amoountInWei.toString()) {
        const amoountDiff =
          parseFloat(amoountInWei.toString()) - 1000000000000000;
        // @ts-ignore
        amoountInWei = amoountDiff.toString();
      }
      togglependingCrossChainTrx(true);
      universalOneSidedFarm.methods
        .crossChainOneSidedFarm(
          "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
          false,
          0,
          farm.pid,
          lpAddress,
          singleSidedAddress,
          farmAddress,
          0
        )
        .send({ from: account, value: amoountInWei })
        .on("transactionHash", async (hash) => {
          toggleShowSteps(true);
          const Header = new Headers();
          let network = "mainnet";
          if (chainId === "80001" || chainId === "5") {
            network = "testnet";
          }
          Header.append("Content-Type", "application/x-www-form-urlencoded");
          const urlencoded = new URLSearchParams();
          urlencoded.append("userAddress", account.toLowerCase());
          urlencoded.append("etherTxHash", hash);
          urlencoded.append("status", "initiated");
          urlencoded.append("farmContract", farmAddress);
          urlencoded.append("pid", farm.pid.toString());
          urlencoded.append("amount", amoountInWei.toString());
          urlencoded.append("currency", "MATIC");
          urlencoded.append("timestampInms", "0");
          urlencoded.append("network", network);
          const requestOptions = {
            method: "POST",
            headers: Header,
            body: urlencoded,
          };
          await fetch(`${CROSS_CHAIN_API_LINK}/addTranscation`, requestOptions);
          setStakeEthProcessEth(0);
        })
        .on("receipt", async (receipt) => {
          toggleShowSteps(true);
          const Header = new Headers();
          Header.append("Content-Type", "application/x-www-form-urlencoded");
          const urlencoded = new URLSearchParams();
          urlencoded.append("userAddress", account.toLowerCase());
          urlencoded.append("etherTxHash", receipt.transactionHash);
          urlencoded.append("status", "depositeOnEthereum");
          urlencoded.append("farmContract", farmAddress);
          urlencoded.append("pid", farm.pid.toString());
          urlencoded.append("amount", amoountInWei.toString());
          urlencoded.append("currency", "MATIC");
          if (
            receipt.events.InitiatedCrossChainFarming &&
            receipt.events.InitiatedCrossChainFarming.returnValues &&
            receipt.events.InitiatedCrossChainFarming.returnValues
              .inititatedTime
          ) {
            urlencoded.append(
              "timestampInms",
              receipt.events.InitiatedCrossChainFarming.returnValues
                .inititatedTime
            );
          }
          const requestOptions = {
            method: "POST",
            headers: Header,
            body: urlencoded,
          };
          await fetch(
            `${CROSS_CHAIN_API_LINK}/updateTranscation`,
            requestOptions
          );
          listentToEvents(
            amoountInWei.toString(),
            receipt.events.InitiatedCrossChainFarming.returnValues
              .inititatedTime
          );
          setStakeEthProcessEth(1);
        })
        .on("error", async (error) => {
          // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
          if (error["code"] === 4001) {
            toastError("Transcation is denied by User");
          }
          toastError("Transcation failed");
          toggleShowSteps(false);
          togglependingCrossChainTrx(false);
        });
    } catch (error) {
      console.error("error is", error);
      togglependingCrossChainTrx(false);
    }
  };
  const listentToEvents = async (amount, timestamp) => {
    L2IntermediatoryContract.events
      .DepositedCrossChainFarm()
      .on("data", (event) => {
        if (
          event &&
          event.returnValues &&
          event.returnValues.user === account &&
          event.returnValues.pid === farm.pid.toString() &&
          event.returnValues.amount === amount &&
          event.returnValues.depositedTime === timestamp
        ) {
          dispatch(fetchVaultUserDataAsync(account));
          setStakeEthProcessEth(2);
          toastSuccess("Success", "Your Last Transcation was Successfull");
        }
      })
      .on("error", (error) => {
        console.error("error is ", error);
      });
  };
  // const [onPresentDeposit] = useModal(
  //   <DepositModal
  //     max={ethBal}
  //     activeIndex={stakeEthProcessEth}
  //     onConfirm={onConfirmStakeEth}
  //     tokenName="Eth"
  //     addLiquidityUrl={addLiquidityUrl}
  //   />
  // );
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
        <DepositModal
          max={ethBal}
          showSteps={showSteps}
          isOpen={showDepositModal}
          pendingTx={pendingCrossChainTrx}
          activeIndex={stakeEthProcessEth}
          onDismiss={() => {
            onPresentDeposit(false);
            toggleShowSteps(false);
            togglependingCrossChainTrx(false);
          }}
          onConfirm={onConfirmStakeEth}
          tokenName="Eth"
          addLiquidityUrl={addLiquidityUrl}
        />
        <TranscationsModal
          isOpen={showTranscationsModal}
          onDismiss={() => toggleTranscationsModal(false)}
          transcations={crossChainTranscations}
        />
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
        {chainId === "1" || chainId === "5" ? (
          <Flex
            justifyContent={
              crossChainTranscations && crossChainTranscations.length > 0
                ? "space-between"
                : "center"
            }
            alignItems="center"
            mt="20px"
          >
            <Button
              onClick={() => onPresentDeposit(true)}
              variant="primary"
              mr="15px"
            >
              {TranslateString(999, "Deposit ETH")}
            </Button>
            {/* <Button onClick={() => onPresentDeposit(true)} variant="success" mt="15px">
              Transcations
            </Button> */}
            {crossChainTranscations && crossChainTranscations.length > 0 && (
              <BellContainer onClick={() => toggleTranscationsModal(true)}>
                {pendingTranscations && pendingTranscations > 0 ? (
                  <UnreadCount>{pendingTranscations}</UnreadCount>
                ) : (
                  <div />
                )}
                <HistoryIcon />
              </BellContainer>
            )}
          </Flex>
        ) : (
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
          </div>
        )}
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
          color="#887263"
          fontSize="12px"
          pr="5px"
        >
          {/* TODO: Is there a way to get a dynamic value here from useFarmFromSymbol? */}
          CNT
        </Text>
        <Text
          bold
          textTransform="uppercase"
          color="#887263"
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
