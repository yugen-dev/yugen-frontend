import React, { memo, useEffect, useState } from "react";
import styled from "styled-components";
import Page from "components/layout/Page";
import Web3 from "web3";
import { useToast } from "state/hooks";
import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import { getRewardsManagerContract } from "utils/contractHelpers";
import Timer from "./components/Timer";
import Dashboard from "./components/Dashboard";
import { ClaimButtons } from "./components/ClaimButtons";

declare global {
  interface Window {
    web3: any;
    ethereum: any;
  }
}

const Vesting = () => {
  const { account } = useWeb3React("web3");
  const [vestedValues, setVestedValues] = useState({
    TotalVested: "-1",
    Unclaimable: "-1",
    Claimed: "-1",
    Claimable: "-1",
    AmountBurnt: "-1",
  });
  const [timerValue, setTimerValue] = useState(Date.now() / 1000);
  const [penaltyValue, setPenaltyValue] = useState(0);

  const web3 = new Web3(window.ethereum);
  const { toastError } = useToast();

  const loadBlockchainData = async () => {
    const networkId = await web3.eth.net.getId();

    if (networkId === 80001 && account) {
      const rewardMgSmartContract = getRewardsManagerContract(web3);

      // get timer end time
      try {
        const penalty = await rewardMgSmartContract.methods
          .endAccumulation()
          .call();
        if (penalty) {
          setTimerValue(() => Number(penalty));
        }
      } catch (e) {
        console.error("Error while getting timer value: ", e);
      }

      // get pre-mature penalty
      try {
        const time = await rewardMgSmartContract.methods
          .preMaturePenalty()
          .call();
        setPenaltyValue(() => time);
      } catch (e) {
        console.error("Error while getting timer value: ", e);
      }

      // get account values
      try {
        const {
          totalVested,
          totalDrawnAmount,
          amountBurnt,
          claimable,
          stillDue,
        } = await rewardMgSmartContract.methods.vestingInfo(account).call();

        const totalVestedRewards = Number(Web3.utils.fromWei(totalVested))
          .toFixed(2)
          .toString()
          .replace(/\.00$/, "");
        let claimedRewards = Number(Web3.utils.fromWei(totalDrawnAmount))
          .toFixed(2)
          .toString()
          .replace(/\.00$/, "");
        const claimableRewards = Number(Web3.utils.fromWei(claimable))
          .toFixed(2)
          .toString()
          .replace(/\.00$/, "");
        const unclaimableRewards = Number(Web3.utils.fromWei(stillDue))
          .toFixed(2)
          .toString()
          .replace(/\.00$/, "");
        const rewardsBurnt = Number(Web3.utils.fromWei(amountBurnt))
          .toFixed(2)
          .toString()
          .replace(/\.00$/, "");

        if (!new BigNumber(amountBurnt).isZero()) {
          claimedRewards = (Number(totalVestedRewards) - Number(rewardsBurnt))
            .toFixed(2)
            .toString()
            .replace(/\.00$/, "");
        }

        setVestedValues({
          TotalVested: totalVestedRewards,
          Claimed: claimedRewards,
          Claimable: claimableRewards,
          Unclaimable: unclaimableRewards,
          AmountBurnt: rewardsBurnt,
        });
      } catch (err) {
        console.error("Error while fetching account details: ", err);
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
    }, 10000);

    return () => clearInterval(init);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <Page>
      <MainContainer>
        <Dashboard vestedValues={vestedValues} />
        <ClaimButtons
          vestedValues={vestedValues}
          account={account}
          penaltyValue={penaltyValue}
          timerValue={timerValue}
        />
        <Timer timerValue={timerValue} />
      </MainContainer>
    </Page>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  min-height: 80vh;
`;

export default memo(Vesting);
