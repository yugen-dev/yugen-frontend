/* eslint-disable import/no-named-as-default */
import React from "react";
import styled from "styled-components";
import Addresses from "config/constants/contracts";
import { useWeb3React } from "@web3-react/core";
import { Heading, Text, LinkExternal } from "cryption-uikit";
import USDClogo from "images/USDClogo.png";
import LUSDlogo from "images/LUSDlogo.png";
import FirstChanceCard from "./components/FirstChanceCard";
import SecondChanceCard from "./components/SecondChanceCard";

interface LotteryInfoProps {
  lotteryId: number;
  winnerLottery: {
    lotteryAddress: string;
    tokenName: string;
    tokenAddress: string;
    tokenDecimals: number;
    tokenLogo: any;
    metamaskImg?: string;
    rewardToken: string;
  };
  loserLottery: {
    lotteryAddress: string;
    tokenName: string;
    tokenAddress: string;
    tokenLogo: any;
    tokenDecimals: number;
    metamaskImg?: string;
    rewardToken: string;
  };
}

const Lottery = () => {
  const { account } = useWeb3React("web3");

  const LotteryInfo: LotteryInfoProps[] = [
    {
      lotteryId: 1,
      winnerLottery: {
        lotteryAddress: Addresses.winnerLottery[80001],
        tokenName: "USDC",
        tokenAddress: Addresses.lotteryUSDC[80001],
        tokenDecimals: 6,
        tokenLogo: USDClogo,
        rewardToken: "USDC",
      },
      loserLottery: {
        lotteryAddress: Addresses.loserLottery[80001],
        tokenName: "LUSD",
        tokenAddress: Addresses.lotteryLUSD[80001],
        tokenDecimals: 18,
        tokenLogo: LUSDlogo,
        metamaskImg:
          "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10300.png",
        rewardToken: "CNT",
      },
    },
    {
      lotteryId: 2,
      winnerLottery: {
        lotteryAddress: Addresses.winnerLottery2[80001],
        tokenName: "ARTH",
        tokenAddress: Addresses.lotteryARTH[80001],
        tokenDecimals: 18,
        tokenLogo: USDClogo,
        rewardToken: "ARTH",
      },
      loserLottery: {
        lotteryAddress: Addresses.loserLottery2[80001],
        tokenName: "LARTH",
        tokenAddress: Addresses.lotteryLARTH[80001],
        tokenDecimals: 18,
        tokenLogo: USDClogo,
        metamaskImg:
          "https://cryption-network.s3.us-east-2.amazonaws.com/tokens/Group_10300.png",
        rewardToken: "MAHA",
      },
    },
  ];

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
        {LotteryInfo.map((lottery) => (
          <PageSubContainer key={lottery.lotteryId}>
            <FirstChanceCard
              account={account}
              tokenInfo={lottery.winnerLottery}
              tooltipInfo={tooltipInfo}
            />
            <SecondChanceCard
              account={account}
              tokenInfo={lottery.loserLottery}
              tooltipInfo={tooltipInfo}
            />
          </PageSubContainer>
        ))}
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
