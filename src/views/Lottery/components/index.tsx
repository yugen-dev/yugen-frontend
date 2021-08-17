import React from "react";
import styled from "styled-components";
import { Heading, Text, LinkExternal } from "cryption-uikit";
import { useWeb3React } from "@web3-react/core";
import Addresses from "config/constants/contracts";
import FirstChanceCard from "./components/FirstChanceCard";
import SecondChanceCard from "./components/SecondChanceCard";

const Lottery = () => {
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
            Double Chance lotteries give you two chances at winning the lottery.
            Those who lose the lottery are automatically given a second chance
            lottery token. This token can be used to enter the Second Chance
            lottery. The winnings will be automatically sent to the winners.
            <LinkExternal href="https://docs.cryption.network/products/second-chance-lotteries">
              {" "}
              Click here to learn more
            </LinkExternal>
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
  margin-bottom: 40px;
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
