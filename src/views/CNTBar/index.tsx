/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/style-prop-object */
/* eslint-disable react/no-danger */
import React, { useEffect, useCallback, useState } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import Container from "@material-ui/core/Container";
import {
  ButtonMenu,
  ButtonMenuItem,
  Button,
  Flex,
  Input,
  Text,
  useModal,
} from "cryption-uikit";
import Grid from "@material-ui/core/Grid";
import useEnter from "hooks/useEnter";
import useLeave from "hooks/useLeave";
import { useStakingAllowance } from "hooks/useAllowance";
import { useApproveStaking } from "hooks/useApprove";
import contracts from "config/constants/contracts";
import useTokenBalance from "hooks/useTokenBalance";
import UnlockButton from "components/UnlockButton";
import { getBalanceNumber } from "utils/formatBalance";
import { getCakeContract, getCoffeeTableContract } from "utils/contractHelpers";
import DepositModal from "../Pools/components/DepositModal";
import WithdrawModal from "../Pools/components/WithdrawModal";

const CNHeading = styled.div`
  font-size: 23px;
  font-weight: bold;
  text-align: center;
  color: white;
  margin-bottom: 20px;
`;
const PoolsContainer = styled.div`
  margin-top: 50px;
`;
const CNText = styled.div`
  font-size: 17px;
  font-weight: normal;
  text-align: center;
  color: #9d9fa8;
`;
const StakingContainer = styled.div`
  border-radius: 0.625rem !important;
  padding: 30px 15px;
  background-color: #1e202a;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
const CustomInputPannel = styled.div`
  margin: 25px 0px;
  width: 100%;
  max-width: 400px;
  background-color: #202231;
  display: flex;
  padding: 0px 15px;
  border-radius: 10px;
  justify-content: space-between;
`;
const InputWrapper = styled.div`
  width: 100%;
  > div {
    width: 100%;
    margin: 0px;
    > input {
      width: 100%;
      padding: 0px;
      background-color: #202231;
      box-shadow: none !important;
    }
  }
`;
const InfoDiv = styled.div`
  margin-top: 25px;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  display: flex;
  align-items: center;
`;
const ConversionInfo = styled.div`
  font-size: 16px !important;
  margin-left: 40px;
  text-align: center;
  line-height: 24px !important;
  padding-left: 0.875rem !important;
  padding-top: 0.125rem !important;
  padding-bottom: 0.125rem !important;
  color: white;
  padding-right: 0.875rem !important;
  background: linear-gradient(90deg, #4e3034, #4e3034),
    linear-gradient(90deg, #fe5a75, #fec464) !important;
  background-clip: padding-box, border-box !important;
  border-width: 1px !important;
  border-radius: 1.5rem !important;
  border-color: transparent;
  background-origin: padding-box, border-box !important;
`;

const StakingInfo = styled.div`
  background: #6e5538;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 0.625rem !important;
`;
const CNTBar = () => {
  const tokenName = "CNT";
  const [index, setIndex] = React.useState(0);
  const { onEnter } = useEnter();
  const [requestedApproval, setRequestedApproval] = useState(false);
  const [tokenAmount, handleTokenAmount] = useState("");
  const handleClick = (newIndex) => {
    handleTokenAmount("");
    setIndex(newIndex);
  };
  const { account } = useWeb3React("web3");
  const tokenBalance = useTokenBalance(contracts.cake[80001]);
  const xCNTBalance = useTokenBalance(contracts.coffeeTable[80001]);
  const [pendingTx, setPendingTx] = useState(false);
  const [pendingDepositTx, setPendingDepositTx] = useState(false);
  let tokenBal = tokenBalance;
  const allowance = useStakingAllowance();
  const { onApprove } = useApproveStaking();
  const cake = getCakeContract();
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const xTokenName = "xCNT";
  const { onLeave } = useLeave();
  if (index === 1) {
    tokenBal = xCNTBalance;
  }
  useEffect(() => {
    async function fetchTotalSupply() {
      const xCNTContract = getCoffeeTableContract();
      const supply = await xCNTContract.methods.totalSupply().call();
      setTotalSupply(new BigNumber(supply));
    }
    if (cake) {
      fetchTotalSupply();
    }
  }, [cake, setTotalSupply]);

  const onChange = (event) => {
    handleTokenAmount(event.target.value);
  };
  const onSelectMax = () => {
    if (index === 0) {
      handleTokenAmount(getBalanceNumber(tokenBalance).toString());
    } else {
      handleTokenAmount(getBalanceNumber(xCNTBalance).toString());
    }
  };
  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      const txHash = await onApprove();
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false);
      }
    } catch (e) {
      console.error(e);
    }
  }, [onApprove, setRequestedApproval]);
  const [onPresentDeposit] = useModal(
    <DepositModal
      tokenAmount={tokenAmount}
      max={tokenBalance}
      onConfirm={onEnter}
      tokenName={tokenName}
    />
  );
  const [onPresentLeave] = useModal(
    <WithdrawModal
      tokenAmount={tokenAmount}
      max={xCNTBalance}
      onConfirm={onLeave}
      tokenName={xTokenName}
    />
  );
  const renderBottomButtons = () => {
    if (!account) {
      return <UnlockButton mt="8px" width="100%" />;
    }
    if (index === 0) {
      if (!allowance.toNumber()) {
        return (
          <Button
            disabled={requestedApproval}
            onClick={handleApprove}
            style={{ maxWidth: "400px", width: "100%" }}
          >
            Approve CNT
          </Button>
        );
      }
      return (
        <Button
          disabled={tokenBalance.eq(new BigNumber(0))}
          onClick={async () => {
            setPendingDepositTx(true);
            await onPresentDeposit();
            setPendingDepositTx(false);
          }}
          style={{ maxWidth: "400px", width: "100%" }}
        >
          {pendingDepositTx ? "Converting to xCNT" : "Convert to xCNT"}
        </Button>
      );
    }
    return (
      <Button
        disabled={!xCNTBalance.toNumber() || pendingTx}
        onClick={async () => {
          setPendingTx(true);
          await onPresentLeave();
          setPendingTx(false);
        }}
      >
        {pendingTx ? "Converting to CNT" : "Convert to CNT"}
      </Button>
    );
  };
  return (
    <PoolsContainer>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <CNHeading>Maximize yield by staking CNT</CNHeading>
            <CNText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              luctus sem nulla, id commodo tellus posuere nec. Quisque pulvinar
              lacus sed congue gravida. Duis dignissim dolor sit amet tortor
              pulvinar suscipit. Aliquam erat volutpat
            </CNText>
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '<lottie-player src="https://assets7.lottiefiles.com/packages/lf20_0cvczw8l.json"  background="transparent"  speed="1" style="height: 200px;" loop  autoplay></lottie-player>',
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "30px" }}>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <StakingContainer>
              <ButtonMenu
                activeIndex={index}
                scale="md"
                variant="primary"
                onItemClick={handleClick}
              >
                <ButtonMenuItem style={{ minWidth: "150px" }}>
                  Stake
                </ButtonMenuItem>
                <ButtonMenuItem style={{ minWidth: "150px" }}>
                  UnStake
                </ButtonMenuItem>
              </ButtonMenu>
              <InfoDiv>
                <Text
                  bold
                  color="white"
                  textTransform="uppercase"
                  style={{ whiteSpace: "nowrap" }}
                  fontSize="18px"
                >
                  {index === 0 ? "Stake CNT" : "UnStake CNT"}
                </Text>
                {totalSupply && (
                  <ConversionInfo>
                    {`There are currently ${getBalanceNumber(
                      totalSupply
                    ).toFixed(2)} xCNT`}
                  </ConversionInfo>
                )}
              </InfoDiv>
              <CustomInputPannel>
                <InputWrapper>
                  <Input
                    onInputChange={onChange}
                    placeholder="0 CNT"
                    value={tokenAmount}
                  />
                </InputWrapper>
                <Flex alignItems="center">
                  <Text
                    bold
                    color="#9d9fa8"
                    textTransform="uppercase"
                    mr="10px"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Balance: {getBalanceNumber(tokenBal).toFixed(2)}
                  </Text>
                  <Button scale="sm" onClick={onSelectMax}>
                    Max
                  </Button>
                </Flex>
              </CustomInputPannel>
              {renderBottomButtons()}
            </StakingContainer>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            lg={6}
            xl={6}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <StakingInfo>
              <Flex justifyContent="space-between">
                <div>
                  <Text
                    bold
                    color="white"
                    textTransform="uppercase"
                    style={{ whiteSpace: "nowrap" }}
                    fontSize="18px"
                    mb="6px"
                  >
                    Staking APR
                  </Text>
                  <Button variant="secondary" scale="sm">
                    {" "}
                    View Stats
                  </Button>
                </div>
                <div>
                  <Text
                    bold
                    color="white"
                    textTransform="uppercase"
                    style={{ whiteSpace: "nowrap" }}
                    fontSize="24px"
                  >
                    8.63%
                  </Text>
                  <Text
                    color="#9d9fa8"
                    style={{ whiteSpace: "nowrap" }}
                    fontSize="16px"
                  >
                    Yesterday's APR
                  </Text>
                </div>
              </Flex>
            </StakingInfo>
            <StakingContainer>
              <Text
                bold
                color="white"
                textTransform="uppercase"
                style={{ whiteSpace: "nowrap" }}
                fontSize="22px"
              >
                Balances
              </Text>
              <InfoDiv>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/images/CNT.png"
                    alt="CNT"
                    width="24px"
                    style={{ marginRight: "10px" }}
                  />
                  <Text
                    bold
                    color="#9d9fa8"
                    textTransform="uppercase"
                    style={{ whiteSpace: "nowrap" }}
                    fontSize="18px"
                  >
                    CNT: {getBalanceNumber(tokenBalance).toFixed(2)}
                  </Text>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/images/CNT.png"
                    alt="CNT"
                    width="24px"
                    style={{ marginRight: "10px" }}
                  />
                  <Text
                    bold
                    color="#9d9fa8"
                    textTransform="uppercase"
                    style={{ whiteSpace: "nowrap" }}
                    fontSize="18px"
                  >
                    xCNT: {getBalanceNumber(xCNTBalance).toFixed(2)}
                  </Text>
                </div>
              </InfoDiv>
            </StakingContainer>
          </Grid>
        </Grid>
      </Container>
    </PoolsContainer>
  );
};

export default CNTBar;
