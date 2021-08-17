/* eslint-disable import/no-named-as-default */
import React from "react";
import styled from "styled-components";
import { Heading, Text, LinkExternal } from "cryption-uikit";
import Lottery1 from "./Lottery1";
import Lottery2 from "./Lottery2";

const Lottery = () => {
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
        <Lottery1 />
        <Lottery2 />
      </Page>
    </>
  );
};

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
