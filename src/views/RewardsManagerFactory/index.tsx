/* eslint-disable import/no-named-as-default */
import React, { memo, useEffect, useState } from "react";
import styled from "styled-components";
import Page from "components/layout/Page";
import Web3 from "web3";
import { useToast } from "state/hooks";
import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import { getRewardsManagerContract } from "utils/contractHelpers";
import Grid from "@material-ui/core/Grid";
// import Timer from "./components/Timer";
import Dashboard from "./components/Dashboard";
import { ClaimButtons } from "./components/ClaimButtons";

const CNHeading = styled.div`
  font-size: 45px;
  font-weight: bold;
  text-align: center;
  color: white;
  margin-bottom: 20px;
  padding: 0px 10px;
`;

const HeaderGrid = styled(Grid)`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  margin: 20px;
  border-radius: 10px;
  img {
    height: auto;
    max-width: 100%;
  }
  @media (min-width: 576px) {
    max-width: none;
  }
`;

const DescriptionTextLi = styled.li`
  font-size: 17px;
  font-weight: normal;
  text-align: center;
  margin-bottom: 10px !important;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 860px;
`;

const StyledOl = styled.ol`
  list-style-position: outside;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

declare global {
  interface Window {
    web3: any;
    ethereum: any;
  }
}

const VestingFactory = () => {
  const { account } = useWeb3React("web3");
  const [vestedValues, setVestedValues] = useState({
    TotalVested: "-1",
    Unclaimable: "-1",
    Claimed: "-1",
    Claimable: "-1",
    AmountBurnt: "-1",
  });
  // TODO: hardcoded start time & end time
  // const startDistributionTime = 1643810400;
  // const endDistributionTime = 1645020000;

  const [penaltyValue] = useState(350);

  const web3 = new Web3(window.ethereum);
  const { toastError } = useToast();

  const loadBlockchainData = async () => {
    const networkId = await web3.eth.net.getId();

    if (networkId && account) {
      const rewardMgSmartContract = getRewardsManagerContract(web3);

      // get account values
      try {
        const {
          totalVested,
          totalDrawnAmount,
          amountBurnt,
          claimable,
          stillDue,
        } = await rewardMgSmartContract.methods
          .userTotalVestingInfo(account)
          .call();

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
          claimedRewards = (
            Number(totalVestedRewards) -
            Number(rewardsBurnt) -
            Number(unclaimableRewards)
          )
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
      <HeaderGrid container spacing={3}>
        <div
          style={{
            backgroundColor: "#887963",
            width: "100%",
            borderRadius: "10px",
            padding: "20px 10px",
          }}
        >
          <CNHeading>Rewards Manager</CNHeading>
          <StyledOl>
            <DescriptionTextLi>
              35% of fYGN is given on harvest (the rest, 65% of the remaining
              fYGN) is held for a cliff period of 2 weeks and then linearly
              distributed over the next 2 weeks.
            </DescriptionTextLi>
          </StyledOl>
        </div>
      </HeaderGrid>
      <MainContainer>
        <Dashboard vestedValues={vestedValues} />
        <ClaimButtons
          vestedValues={vestedValues}
          account={account}
          penaltyValue={penaltyValue}
        />
        {/* <Timer
          startDistributionTime={startDistributionTime}
          endDistributionTime={endDistributionTime}
        /> */}
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

export default memo(VestingFactory);
