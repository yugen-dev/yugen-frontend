import React from "react";
import styled from "styled-components";
import { Heading, Text } from "cryption-uikit";
import { useWeb3React } from "@web3-react/core";
import {
  LotteryUSDC,
  LotteryLUSD,
  WinnerLotteryAddress,
  LoserLotteryAddress,
} from "config";
import FirstChanceCard from "./components/FirstChanceCard";
import SecondChanceCard from "./components/SecondChanceCard";

const Lottery = () => {
  const { account } = useWeb3React("web3");

  const tokenWinnerInfo = {
    tokenName: "USDC",
    tokenAddr: LotteryUSDC,
    tokenDecimals: 6,
    metamaskImg: "",
    lotteryAddr: WinnerLotteryAddress,
  };

  const tokenLoserInfo = {
    tokenName: "L-USD",
    tokenAddr: LotteryLUSD,
    tokenDecimals: 18,
    metamaskImg: "",
    lotteryAddr: LoserLotteryAddress,
  };

  const tooltipInfo = {
    playersText:
      "Represents players in the lottery out of the total users needed.",
    payoutText: "The amount a user receives if he wins.",
    winnersROIText: "The profit the users makes if he wins the lottery.",
  };

  return (
    <>
      <Page>
        <Container>
          <Heading
            fontWeight="800"
            color="white"
            textAlign="left"
            style={{ fontSize: "42px", marginBottom: "15px" }}
          >
            Double Chance Lotteries
          </Heading>
          <Text
            textAlign="left"
            fontSize="18px"
            fontWeight="600"
            color="#86878F"
          >
            Double Chance lotteries Give you two chances at winning the lottery.
            Those who lose the lottery are automatically given a second chance
            lottery token. This token can be used to enter the Second chance
            lottery. Winning will automatically be sent to the winner. Click
            here to learn more{" "}
          </Text>
        </Container>
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
      </Page>
    </>
  );
};

const PageSubContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
`;

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
  padding-left: 16px;
  padding-right: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 24px;
    padding-right: 24px;
  }
  display: flex;
  /* justify-content: center; */
  /* align-items: center; */
  flex-direction: column;
  text-align: left;
`;

const Page = styled(Container)`
  min-height: calc(100vh - 64px);
  padding-top: 16px;
  padding-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`;

export default Lottery;
