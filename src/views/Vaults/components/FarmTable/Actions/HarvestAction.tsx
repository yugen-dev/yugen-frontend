import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Button } from "yugen-uikit";
import BigNumber from "bignumber.js";
import { FarmWithStakedValue } from "views/Farms/components/FarmCard/FarmCard";
import { getBalanceNumber } from "utils/formatBalance";
import { useHarvest } from "hooks/useHarvest";
import useI18n from "hooks/useI18n";
import { usePriceCakeBusd } from "state/hooks";
import CountUp from "react-countup";

import {
  ActionContainer,
  ActionTitles,
  Title,
  Subtle,
  ActionContent,
  Earned,
  Staked,
} from "./styles";

const HarvestAction: React.FunctionComponent<FarmWithStakedValue> = ({
  pid,
  userData,
}) => {
  const earningsBigNumber = userData ? new BigNumber(userData.earnings) : null;
  const cakePrice = usePriceCakeBusd();
  let earnings = null;
  let earningsBusd = 0;
  let displayBalance = "?";

  if (earningsBigNumber) {
    earnings = getBalanceNumber(earningsBigNumber);
    earningsBusd = new BigNumber(earnings).multipliedBy(cakePrice).toNumber();
    displayBalance = earnings.toLocaleString();
  }

  const [pendingTx, setPendingTx] = useState(false);
  const { account } = useWeb3React("web3");
  const { onReward } = useHarvest(pid);
  const TranslateString = useI18n();

  return (
    // <GradientBorder>
    <ActionContainer>
      <ActionTitles>
        <Title>CAKE </Title>
        <Subtle>EARNED</Subtle>
      </ActionTitles>
      <ActionContent>
        <div>
          <Earned>{displayBalance}</Earned>
          <Staked>
            ~
            <CountUp end={earningsBusd} decimal="." decimals={3} />
          </Staked>
        </div>
        {/* // TODO: re-implement Button CNButton or imported Button  */}
        <Button
          disabled={!earnings || pendingTx || !account}
          onClick={async () => {
            setPendingTx(true);
            await onReward();
            setPendingTx(false);
          }}
          ml="4px"
        >
          {TranslateString(999, "Harvest")}
        </Button>
      </ActionContent>
    </ActionContainer>
    //  </GradientBorder>
  );
};

// const GradientBorder = styled.div`
//   background: linear-gradient(180deg, #2082E9 0%, #9208FE 100%);

//   padding: 2px;
//   border-radius: 14px;
// `;

export default HarvestAction;
