import React, { memo } from "react";
import styled from "styled-components";
import Addresses from "config/constants/contracts";
import { useWeb3React } from "@web3-react/core";
import FirstChanceCard from "./components/FirstChanceCard";
import SecondChanceCard from "./components/SecondChanceCard";

export const Lottery1 = () => {
  const { account } = useWeb3React("web3");

  const tokenWinnerInfo = {
    tokenName: "USDC",
    tokenAddr: Addresses.lotteryUSDC[80001],
    tokenDecimals: 6,
    metamaskImg: "",
    lotteryAddr: Addresses.winnerLottery[80001],
  };

  const tokenLoserInfo = {
    tokenName: "L-USD",
    tokenAddr: Addresses.lotteryLUSD[80001],
    tokenDecimals: 18,
    metamaskImg:
      "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10300.png",
    lotteryAddr: Addresses.loserLottery[80001],
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
        tokenInfo={tokenWinnerInfo}
        tooltipInfo={tooltipInfo}
      />
      <SecondChanceCard
        account={account}
        tokenInfo={tokenLoserInfo}
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

export default memo(Lottery1);
