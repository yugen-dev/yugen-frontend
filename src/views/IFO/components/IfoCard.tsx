import React, { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import CoinGecko from "coingecko-api";
import styled from "styled-components";
import Telegram from "../icons/Telegram";
import Twitter from "../icons/Twitter";
import Loader from "./Loader";

const IfoCard = () => {
  const [fetchValue, setFetchValue] = useState({
    currPrice: "",
    marketCap: "",
    circSupply: "",
    totalSupply: "",
    desc: "",
    name: "",
    symbol: "",
    telegram: "",
    twitter: "",
  });

  const CoinGeckoClient = new CoinGecko();
  const ifo = {
    projectName: "MahaDAO",
    whitepaper: "https://docs.arthcoin.com/",
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getIFODetails = async (crypto: any) => {
    const result = await CoinGeckoClient.coins.fetch(
      crypto.toLocaleLowerCase(),
      {}
    );
    const currPrice = new BigNumber(
      result.data?.market_data?.current_price?.usd
    );
    const marketCap = new BigNumber(result.data?.market_data?.market_cap?.usd);
    const circSupply = new BigNumber(
      result.data?.market_data?.circulating_supply
    );
    const totalSupply = new BigNumber(result.data?.market_data?.total_supply);
    const desc: string = result.data?.description?.en;
    const name = result.data?.name;
    const symbol = result.data?.symbol;
    const twitter = result.data?.links?.twitter_screen_name;
    const telegram = result.data?.links?.telegram_channel_identifier;

    const res = {
      currPrice: Number(currPrice).toFixed(2).toString(),
      marketCap: Number(marketCap).toFixed(2).toString(),
      circSupply: Number(circSupply).toFixed(2).toString(),
      totalSupply: Number(totalSupply).toFixed(2).toString(),
      desc,
      name,
      symbol,
      twitter,
      telegram,
    };
    return res;
  };

  useEffect(() => {
    const getFunc = async () => {
      const response = await getIFODetails("mahadao");
      setFetchValue(() => response);
    };

    const repeat = setInterval(() => {
      getFunc();
    }, 10000);

    return () => clearInterval(repeat);
  });

  return (
    <MainCardContainer>
      <CardContainer style={{ marginBottom: "1px" }}>
        <Card>
          <LabelContainer>
            <Label>Project Name</Label>
            <Loader value={fetchValue.name} />
          </LabelContainer>

          <LabelContainer>
            <Label>Symbol</Label>
            <Loader value={fetchValue.symbol} />
          </LabelContainer>

          <LabelContainer>
            <Label>Price</Label>
            <Loader value={fetchValue.currPrice} />
          </LabelContainer>

          <LabelContainer>
            <Label>Circulating Supply</Label>
            <Loader value={fetchValue.circSupply} />
          </LabelContainer>

          <LabelContainer>
            <Label>Total Supply</Label>
            <Loader value={fetchValue.totalSupply} />
          </LabelContainer>
          <LabelContainer style={{ marginBottom: "0px" }}>
            <Label>Market Cap</Label>
            <Loader value={fetchValue.marketCap} />
          </LabelContainer>
        </Card>
      </CardContainer>

      <CardContainer style={{ marginTop: "1px" }}>
        <Card>
          <LabelContainer>
            <a href={ifo.whitepaper} target="_blank" rel="noreferrer">
              <Label>Go to White Paper</Label>
            </a>
          </LabelContainer>

          <LabelContainer style={{ flexDirection: "column" }}>
            <Label style={{ marginBottom: "5px", marginRight: "0px" }}>
              Description
            </Label>
            {fetchValue.desc === "" ? (
              <Text>Loading...</Text>
            ) : (
              <Text>{fetchValue.desc}</Text>
            )}
          </LabelContainer>

          <LabelContainer style={{ marginBottom: "0px" }}>
            <Label>Socials</Label>
            <SocialContainer>
              <TelegramIcon
                href={`https://t.me/${fetchValue.telegram}`}
                target="_blank"
              >
                <Telegram />
              </TelegramIcon>
              <TwitterIcon
                href={`https://twitter.com/${fetchValue.twitter}`}
                target="_blank"
              >
                <Twitter />
              </TwitterIcon>
            </SocialContainer>
          </LabelContainer>
        </Card>
      </CardContainer>
    </MainCardContainer>
  );
};

const SocialContainer = styled.div`
  display: flex;
  width: 50%;
  justify-content: space-around;
  align-items: center;
`;

const TelegramIcon = styled.a``;
const TwitterIcon = styled.a``;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 15px;
`;
const Label = styled.div`
  color: #f5f5f5;
  font-weight: 600;
  font-size: 18px;
  text-align: left;
  width: 100%;
  margin-right: 30px;
`;
const Text = styled.div`
  color: #86878f;
  font-weight: 600;
  font-size: 18px;
  width: 100%;
  text-align: left;
`;

const CardContainer = styled.div`
  padding: 1px;
  background: linear-gradient(to bottom, #2082e9, #9208fe);
  border-radius: 15px;
`;

const Card = styled.div`
  background-color: #1a1b23;
  border-radius: 15px;
  padding: 40px 27px 27px 27px;
`;

const MainCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  margin: 20px;
`;

export default IfoCard;
