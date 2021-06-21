import React, { useState, useCallback } from "react";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import { provider as ProviderType } from "web3-core";
import Countdown from "react-countdown";
import { getAddress } from "utils/addressHelpers";
import { getBep20Contract } from "utils/contractHelpers";
import { Button, Flex, Text } from "cryption-uikit";
import { Farm } from "state/types";
import { useFarmFromSymbol, useFarmUser } from "state/hooks";
import useI18n from "hooks/useI18n";
import useWeb3 from "hooks/useWeb3";
import { useApprove } from "hooks/useApprove";
import UnlockButton from "components/UnlockButton";
import StakeAction from "./StakeAction";
import HarvestAction from "./HarvestAction";

const Action = styled.div`
  padding-top: 16px;
`;
export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber;
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue;
  provider?: ProviderType;
  account?: string;
  addLiquidityUrl?: string;
}

const CardActions: React.FC<FarmCardActionsProps> = ({
  farm,
  account,
  addLiquidityUrl,
}) => {
  const TranslateString = useI18n();
  const [requestedApproval, setRequestedApproval] = useState(false);
  const { pid, lpAddresses } = useFarmFromSymbol(farm.lpSymbol);
  const {
    allowance,
    tokenBalance,
    stakedBalance,
    earnings,
    canHarvest,
    harvestInterval,
  } = useFarmUser(pid);

  // let isgreater = false;
  const timeleft = harvestInterval.toNumber() - Math.floor(Date.now() / 1000);
  // let day;
  // let hours;
  // let minute;
  // let seconds;
  // if (timeleft > 0) {
  //   isgreater = true;

  //   day = new BigNumber(timeleft).div(new BigNumber(86400));
  //   hours = new BigNumber(timeleft).div(new BigNumber(3600));
  //   minute = new BigNumber(timeleft).div(new BigNumber(60));
  //   seconds = new BigNumber(timeleft);
  // } else {
  //   isgreater = false;
  // }
  const lpAddress = getAddress(lpAddresses);
  const lpName = farm.lpSymbol.toUpperCase();
  const isApproved = account && allowance && allowance.isGreaterThan(0);
  const web3 = useWeb3();

  const lpContract = getBep20Contract(lpAddress, web3);

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

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <div>
        <Flex justifyContent="space-between">
          <Text>{TranslateString(318, "Next Harvest in :")}</Text>
          <Text bold>
            {/* {isgreater && parseFloat(day.toNumber()) > 0
              ? parseFloat(day.toNumber()).toFixed(0)
              : ""}{" "}
            D
            {isgreater && hours.toNumber() > 0
              ? parseFloat(hours.toNumber()).toFixed(0)
              : ""}{" "}
            M{isgreater && minute.toNumber() > 0 ? minute.toNumber() : ""} Min
            {isgreater && seconds.toNumber() > 0 ? seconds.toNumber() : ""} */}
            <Countdown
              date={harvestInterval.toNumber() * 1000}
              renderer={Renderer}
            />
          </Text>
        </Flex>
        <StakeAction
          stakedBalance={stakedBalance}
          tokenBalance={tokenBalance}
          tokenName={lpName}
          pid={pid}
          addLiquidityUrl={addLiquidityUrl}
        />
      </div>
    ) : (
      <Button
        mt="8px"
        width="100%"
        disabled={requestedApproval}
        onClick={handleApprove}
      >
        {TranslateString(758, "Approve Contract")}
      </Button>
    );
  };

  return (
    <Action>
      <Flex>
        <Text
          bold
          textTransform="uppercase"
          color="#2082E9"
          fontSize="12px"
          pr="5px"
        >
          {/* TODO: Is there a way to get a dynamic value here from useFarmFromSymbol? */}
          CAKE
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

      <Flex>
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
      </Flex>

      {!account ? (
        <UnlockButton mt="8px" width="100%" />
      ) : (
        renderApprovalOrStakeButton()
      )}
    </Action>
  );
};

export default CardActions;
