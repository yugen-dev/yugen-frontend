import React, { useState, useCallback } from "react";
import BigNumber from "bignumber.js";
import styled from "styled-components";
import { provider as ProviderType } from "web3-core";
import Countdown from "react-countdown";
import { getAddress } from "utils/addressHelpers";
import { getBep20Contract } from "utils/contractHelpers";
import { Button, Flex, Text } from "cryption-uikit";
import { Farm } from "state/types";
import { useFarmFromSymbol, useFarmUser, useProfile } from "state/hooks";
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

  const timeleft = harvestInterval.toNumber() - Math.floor(Date.now() / 1000);

  const lpAddress = getAddress(lpAddresses);
  const lpName = farm.lpSymbol.toUpperCase();
  const isApproved = account && allowance && allowance.isGreaterThan(0);
  const web3 = useWeb3();

  const lpContract = getBep20Contract(lpAddress, web3);

  const { metaTranscation } = useProfile();

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
    return isApproved ||
      (signatureData !== null &&
        signatureData.deadline > Math.ceil(Date.now() / 1000)) ? (
      <div>
        <Flex justifyContent="space-between">
          <Text>{TranslateString(318, "Next Harvest in :")}</Text>
          <Text bold>
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
          signatureData={signatureData}
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
