import React, { memo, useEffect, useState } from "react";
import styled from "styled-components";
import QuestionHelper from "components/QuestionHelper";
import erc20 from "config/abi/erc20.json";
import Web3 from "web3";
import { useToast } from "state/hooks";
import BigNumber from "bignumber.js";
import multicall from "utils/multicall";
import lotteryABI from "config/abi/lottery.json";
import USDClogo from "../../images/USDClogo.png";
import Loader from "./Loader";
import StatusLoader from "./StatusLoader";
import WinnerBtnContainer from "./WinnerBtnContainer";

const FirstChanceCard = ({ account, tokenInfo, tooltipInfo }) => {
  const { toastError } = useToast();
  const web3 = new Web3(window.ethereum);

  const [fetchValue, setFetchValue] = useState({
    lotterySize: "",
    payout: "",
    yourBalance: "",
    allowance: "",
    size: "",
    lotteryStatus: "",
    players: "",
    winners: "",
    winnerReturn: "",
    settling: false,
  });

  const { playersText, payoutText, winnersROIText } = tooltipInfo;

  const loadBlockchainData = async () => {
    const networkId = await web3.eth.net.getId();

    if (networkId === 80001 && account) {
      try {
        let numOfWinners;
        let playersLimit;
        let registrationAmount;

        const calls = [
          {
            address: tokenInfo.lotteryAddr,
            name: "getCurrentlyActivePlayers",
          },
          {
            address: tokenInfo.lotteryAddr,
            name: "lotteryStatus",
          },
          {
            address: tokenInfo.lotteryAddr,
            name: "getWinningAmount",
          },
          {
            address: tokenInfo.lotteryAddr,
            name: "lotteryConfig",
          },
        ];
        /* eslint-disable   prefer-const */
        let [currActivePlayers, lotteryStatus, payout, lotteryConfig] =
          await multicall(lotteryABI, calls);
        // @ts-ignore

        numOfWinners = new BigNumber(lotteryConfig[0].toString()).toNumber();
        playersLimit = new BigNumber(lotteryConfig[1].toString()).toNumber();
        registrationAmount = new BigNumber(
          lotteryConfig[2].toString()
        ).toNumber();

        currActivePlayers = new BigNumber(currActivePlayers).toNumber();
        lotteryStatus = new BigNumber(lotteryStatus).toNumber();
        payout = new BigNumber(payout).toNumber();

        const callsErc20 = [
          {
            address: tokenInfo.tokenAddr,
            name: "balanceOf",
            params: [account],
          },
          {
            address: tokenInfo.tokenAddr,
            name: "allowance",
            params: [account, tokenInfo.lotteryAddr],
          },
        ];

        let [balance, allowance] = await multicall(erc20, callsErc20);

        balance = new BigNumber(balance).toNumber();
        allowance = new BigNumber(allowance).toNumber();

        const winnerROI = new BigNumber(payout)
          .minus(new BigNumber(registrationAmount))
          .dividedBy(new BigNumber(registrationAmount))
          .multipliedBy(100)
          .toString();

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
          new BigNumber(balance)
            .div(new BigNumber(10).pow(tokenInfo.tokenDecimals))
            .toString()
        )
          .toFixed(2)
          .toString()
          .replace(/\.00$/, "");

        const genWinnerReturn = Number(winnerROI)
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
          payout: `${genPayout} ${tokenInfo.tokenName}`,
          yourBalance: `${genBalance} ${tokenInfo.tokenName}`,
          allowance: genAllowance,
          lotteryStatus: lotteryStatus.toString(),
          players: `${currActivePlayers} / ${playersLimit}`,
          winners: numOfWinners.toString(),
          winnerReturn: `${genWinnerReturn} %`,
          settling: genSettling,
        });
      } catch (err) {
        console.error("Error while fetching 1st Lottery values: ", err);
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
    }, 5000);

    return () => clearInterval(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <CardContainer>
      <Card>
        <LabelContainer>
          <Label style={{ fontSize: "24px" }}>
            {tokenInfo.tokenName} Lottery
          </Label>
          <Text>
            <ImageContainer>
              <img
                src={USDClogo}
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
          <Label>Winners</Label>
          <Loader value={fetchValue.winners} />
        </LabelContainer>

        <LabelContainer>
          <Label>
            Winner ROI
            <QuestionHelper text={winnersROIText} />
          </Label>
          <Loader value={fetchValue.winnerReturn} />
        </LabelContainer>

        <LabelContainer>
          <Label>
            Payout
            <QuestionHelper text={payoutText} />
          </Label>
          <Loader value={fetchValue.payout} />
        </LabelContainer>

        <WinnerBtnContainer
          fetchValue={fetchValue}
          account={account}
          tokenInfo={tokenInfo}
          loadBlockchainData={loadBlockchainData}
        />
      </Card>
    </CardContainer>
  );
};

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
  background: linear-gradient(to bottom, #2082e9, #9208fe);
  border-radius: 15px;
  margin: 20px;
`;

const Card = styled.div`
  background-color: #1a1b23;
  border-radius: 15px;
  padding: 40px 27px 27px 27px;
`;

export default memo(FirstChanceCard);
