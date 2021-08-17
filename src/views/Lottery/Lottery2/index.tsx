import React, { memo } from "react";
import styled from "styled-components";
import Addresses from "config/constants/contracts";
import { useWeb3React } from "@web3-react/core";
import FirstChanceCard from "./components/FirstChanceCard";
import SecondChanceCard from "./components/SecondChanceCard";

export const Lottery2 = () => {
  const { account } = useWeb3React("web3");

  const tokenWinner2Info = {
    tokenName: "ARTH",
    tokenAddr: Addresses.lotteryARTH[80001],
    tokenDecimals: 18,
    metamaskImg: "",
    lotteryAddr: Addresses.winnerLottery2[80001],
  };

  const tokenLoser2Info = {
    tokenName: "L-ARTH",
    tokenAddr: Addresses.lotteryLARTH[80001],
    tokenDecimals: 18,
    metamaskImg:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10300.png",
    lotteryAddr: Addresses.loserLottery2[80001],
  };

  const tooltipInfo = {
    playersText:
      "Represents players in the lottery out of the total users needed.",
    payoutText: "The amount a user receives if he wins.",
    winnersROIText: "The profit users make if he wins the lottery.",
  };

  return (
    <PageSubContainer>
      <FirstChanceCard
        account={account}
        tokenInfo={tokenWinner2Info}
        tooltipInfo={tooltipInfo}
      />
      <SecondChanceCard
        account={account}
        tokenInfo={tokenLoser2Info}
        tooltipInfo={tooltipInfo}
      />
    </PageSubContainer>
  );
};

const PageSubContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  margin-bottom: 40px;
`;

export default memo(Lottery2);
