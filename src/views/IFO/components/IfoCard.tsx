import React from "react";
import styled from "styled-components";
import Telegram from "../icons/Telegram";
import Twitter from "../icons/Twitter";

const IfoCard = () => {
  const ifo = {
    projectName: "MahaDAO",
    whitepaper: "6.68583 DOT / BNB",
    circulatingSupply: "6.68583 DOT / BNB",
    supplyMarketCap: "6.68583 DOT / BNB",
    description:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type",
    twitter: "",
    telegram: "",
  };

  return (
    <CardContainer>
      <Card>
        <LabelContainer>
          <Label>Project Name</Label>
          <Text>{ifo.projectName}</Text>
        </LabelContainer>

        <LabelContainer>
          <Label>Whitepaper</Label>
          <Text>{ifo.whitepaper}</Text>
        </LabelContainer>

        <LabelContainer>
          <Label>Circulating Supply</Label>
          <Text>{ifo.circulatingSupply}</Text>
        </LabelContainer>

        <LabelContainer>
          <Label>Circ. Supply Market Cap</Label>
          <Text>{ifo.supplyMarketCap}</Text>
        </LabelContainer>

        <div style={{ margin: "40px 0px" }} />

        <LabelContainer style={{ flexDirection: "column" }}>
          <Label style={{ marginBottom: "5px", marginRight: "0px" }}>
            Description
          </Label>
          <Text>{ifo.description}</Text>
        </LabelContainer>

        <LabelContainer style={{ marginBottom: "0px" }}>
          <Label>Socials</Label>
          <SocialContainer>
            <TelegramIcon href={ifo.telegram}>
              <Telegram />
            </TelegramIcon>
            <TwitterIcon href={ifo.twitter}>
              <Twitter />
            </TwitterIcon>
          </SocialContainer>
        </LabelContainer>
      </Card>
    </CardContainer>
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
  margin-bottom: 20px;
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
  width: 100%;
  max-width: 400px;
  padding: 1px;
  background: linear-gradient(to bottom, #2082e9, #9208fe);
  border-radius: 15px;
  margin: 20px;
`;

const Card = styled.div`
  background-color: #1a1b23;
  border-radius: 15px;
  padding: 40px 27px 27px 27px;
`;

export default IfoCard;
