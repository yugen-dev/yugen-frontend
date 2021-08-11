import React, { memo, useEffect, useState } from "react";
import styled from "styled-components";
import Web3 from "web3";
import { MetamaskIcon } from "cryption-uikit";
import { registerToken } from "utils/wallet";
import { useToast } from "state/hooks";
import BigNumber from "bignumber.js";
import QuestionHelper from "components/QuestionHelper";
import ChanceCardHeaderImg from "../images/ChanceCard.png";
import Loader from "./Loader";
import StatusLoader from "./StatusLoader";
import LoserBtnContainer from "./LoserBtnContainer";
import getERC20SmartContract from "../utils/getERC20SmartContract";
import getLotterySmartContract from "../utils/getLotterySmartContract";

const SecondChanceCard = ({ account, tokenInfo, tooltipInfo }) => {
  const { toastError } = useToast();
  const web3 = new Web3(window.ethereum);

  const [fetchValue, setFetchValue] = useState({
    lotterySize: "",
    size: "",
    allowance: "",
    payout: "",
    yourBalance: "",
    lotteryStatus: "",
    players: "",
    settling: false,
  });

  const { playersText, payoutText } = tooltipInfo;

  const loadBlockchainData = async () => {
    const networkId = await web3.eth.net.getId();

    if (networkId === 80001 && account) {
      const lotterySmartContract = await getLotterySmartContract("loser");
      const ERC20SmartContract = await getERC20SmartContract(
        tokenInfo.tokenAddr
      );

      try {
        const { playersLimit, registrationAmount } =
          await lotterySmartContract.methods.lotteryConfig().call();

        const currActivePlayers = await lotterySmartContract.methods
          .getCurrentlyActivePlayers()
          .call();

        const lotteryStatus = await lotterySmartContract.methods
          .lotteryStatus()
          .call();

        const payout = await lotterySmartContract.methods
          .getWinningAmount()
          .call();

        const balance = await ERC20SmartContract.methods
          .balanceOf(account)
          .call();
        const allowance = await ERC20SmartContract.methods
          .allowance(account, tokenInfo.lotteryAddr)
          .call();

        const genLotterySize = Number(
          new BigNumber(registrationAmount).div(
            new BigNumber(10).pow(tokenInfo.tokenDecimals)
          )
        )
          .toFixed(2)
          .toString()
          .replace(/\.00$/, "");

        const genPayout = Number(
          new BigNumber(payout).div(
            new BigNumber(10).pow(tokenInfo.tokenDecimals)
          )
        )
          .toFixed(2)
          .toString()
          .replace(/\.00$/, "");

        const genBalance = Number(
          new BigNumber(balance).div(
            new BigNumber(10).pow(tokenInfo.tokenDecimals)
          )
        )
          .toFixed(2)
          .toString()
          .replace(/\.00$/, "");

        const genAllowance = Number(
          new BigNumber(allowance).div(
            new BigNumber(10).pow(tokenInfo.tokenDecimals)
          )
        ).toString();

        let genSettling;
        if (currActivePlayers === playersLimit) genSettling = true;
        else genSettling = false;

        setFetchValue({
          lotterySize: `${genLotterySize} ${tokenInfo.tokenName}`,
          size: genLotterySize,
          allowance: genAllowance,
          payout: `${genPayout} CNT`,
          yourBalance: `${genBalance} ${tokenInfo.tokenName}`,
          lotteryStatus: lotteryStatus.toString(),
          players: `${currActivePlayers} / ${playersLimit}`,
          settling: genSettling,
        });
      } catch (err) {
        console.error("Error while fetching 2nd Lottery values: ", err);
      }
    } else {
      toastError(
        "Wrong Network",
        "Contract not deployed on this network. Please connect to Matic network"
      );
    }
  };

  useEffect(() => {
    if (account) loadBlockchainData();
    const init = setInterval(() => {
      if (account) loadBlockchainData();
      else
        toastError(
          "No Account connected",
          "Please connect account using Metamask"
        );
    }, 20000);

    return () => clearInterval(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <CardContainer>
      <Card>
        <LabelContainer>
          <Label style={{ fontSize: "24px" }}>
            Second {tokenInfo.tokenName} Lottery
          </Label>
          <Text>
            <ImageContainer>
              <img
                src={ChanceCardHeaderImg}
                alt="Lottery Card Header"
                width="70px"
                style={{ maxWidth: "100px" }}
              />
            </ImageContainer>
          </Text>
        </LabelContainer>

        <LabelContainer>
          <Label>Lottery Size</Label>
          <Loader value={fetchValue.lotterySize} />
        </LabelContainer>

        <LabelContainer>
          <Label>Lottery Status</Label>
          <StatusLoader value={fetchValue.lotteryStatus} />
        </LabelContainer>

        <LabelContainer>
          <Label>
            Players
            <QuestionHelper text={playersText} />
          </Label>
          <Loader value={fetchValue.players} />
        </LabelContainer>

        <LabelContainer>
          <Label>
            Payout
            <QuestionHelper text={payoutText} />
          </Label>
          <Loader value={fetchValue.payout} />
        </LabelContainer>

        <LoserBtnContainer
          fetchValue={fetchValue}
          account={account}
          tokenInfo={tokenInfo}
        />

        <LinkContainer>
          <TokenLink
            onClick={() =>
              registerToken(
                tokenInfo.tokenAddr,
                tokenInfo.tokenName,
                tokenInfo.tokenDecimals,
                tokenInfo.metamaskImg
              )
            }
          >
            Add {tokenInfo.tokenName} to Metamask
          </TokenLink>
          <MetamaskIcon height={15} width={15} ml="4px" />
        </LinkContainer>
      </Card>
    </CardContainer>
  );
};

const LinkContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const TokenLink = styled.a`
  font-size: 14px;
  text-decoration: none;
  color: #2082e9;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
const ImageContainer = styled.div``;
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
  text-align: center;
`;

const CardContainer = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 1px;
  /* background: linear-gradient(to bottom, #2082e9, #9208fe); */
  border-radius: 15px;
  margin: 20px;
  height: 100%;
`;

const Card = styled.div`
  background-color: #1a1b23;
  border-radius: 15px;
  padding: 40px 27px 27px 27px;
`;

export default memo(SecondChanceCard);
