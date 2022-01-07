/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/style-prop-object */
/* eslint-disable react/no-danger */
import React, { useEffect, useCallback, useState } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import Container from "@material-ui/core/Container";
import { Button, Flex, Input, Text, AutoRenewIcon } from "cryption-uikit";
import Grid from "@material-ui/core/Grid";
import { useApproveBurner } from "hooks/useApprove";
import { useChainId } from "state/application/hooks";
import contracts from "config/constants/contracts";
import { useProfile, useToast } from "state/hooks";
import { burn, burnAndStake, burnGasless } from "utils/callHelpers";
import UnlockButton from "components/UnlockButton";
import useWeb3 from "hooks/useWeb3";
import {
  getBalanceNumber,
  getFullDisplayBalance,
  getFullDisplayBalanceForStaker,
} from "utils/formatBalance";
import {
  getERC20Contract,
  getFygnBurnerContract,
  getFygnContract,
} from "utils/contractHelpers";
import { useFygnBurner, useFygnBurnerGasless } from "hooks/useContract";
import { registerToken } from "utils/wallet";
import { getCakeAddress, getFygnBurnerAddress } from "utils/addressHelpers";

const CNHeading = styled.div`
  font-size: 45px;
  font-weight: bold;
  text-align: center;
  color: white;
  margin-bottom: 20px;
  padding: 0px 10px;
`;
const PoolsContainer = styled.div`
  margin-top: 50px;
`;
const StakingContainer = styled.div`
  border-radius: 0.625rem !important;
  padding: 30px 15px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;
const CustomInputPannel = styled.div`
  margin: 25px 0px;
  width: 100%;
  max-width: 420px;
  background-color: #f7f0ed;
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
      background-color: #f7f0ed;
      box-shadow: none !important;
      color: black;
    }
  }
`;
const InfoDiv = styled.div`
  margin-top: 25px;
  justify-content: space-between;
  width: 100%;
  max-width: 420px;
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
  color: #ffffff;
  padding-right: 0.875rem !important;
  background: linear-gradient(90deg, #4e3034, #4e3034),
    linear-gradient(90deg, #9c2c2c, #c4ac3d) !important;
  background-clip: padding-box, border-box !important;
  border-width: 1px !important;
  border-radius: 1.5rem !important;
  border-color: transparent;
  background-origin: padding-box, border-box !important;
`;

const StakingInfo = styled.div`
  background: #ffffff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 0.625rem !important;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
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
  text-align: left;
  margin-bottom: 10px !important;
  color: white;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
`;

const StyledOl = styled.ol`
  list-style-position: outside;
  padding-left: 16px;
`;
const FYGNBurner = () => {
  const [exchangeRate, setExchangeRate] = useState(new BigNumber(1.32));
  const fYGNLogo = "https://i.ibb.co/zfhRMxc/xCNT.png";
  const YGNLogo = "https://i.ibb.co/8D5r4Hp/CNT.png";
  const [fygnBalance, setFygnBalance] = React.useState(new BigNumber(0)); // fygn token balance
  const [ygnBalance, setYgnBalance] = React.useState(new BigNumber(0));
  const [fygnAllowance, setFygnAllowance] = React.useState(new BigNumber(0));
  const CHAINID = useChainId().toString();
  const [tokenAmount, handleTokenAmount] = useState(""); // fygn amount in input box
  const { account, library } = useWeb3React("web3");
  const [pendingTx, setPendingTx] = useState(false);

  const { onApprove } = useApproveBurner();
  const [totalSupply, setTotalSupply] = useState<BigNumber>(); // total fygn supply
  const web3 = useWeb3();
  const fygnBurner = useFygnBurner();
  const fygnBurnerGasless = useFygnBurnerGasless();
  const { metaTranscation } = useProfile();
  const { toastSuccess, toastError } = useToast();

  const fetchYgnBalance = async () => {
    try {
      const ygnAddr = getCakeAddress();
      const contract = getERC20Contract(ygnAddr, web3);
      const res = await contract.methods.balanceOf(account).call();
      return new BigNumber(res);
    } catch (error) {
      console.error({ error });
      return new BigNumber(0);
    }
  };

  const fetchFygnBalance = async () => {
    try {
      const contract = getFygnContract(web3);
      const res = await contract.methods.balanceOf(account).call();
      return new BigNumber(res);
    } catch (error) {
      console.error({ error });
      return new BigNumber(0);
    }
  };

  const fetchFygnAllowance = async () => {
    try {
      const contract = getFygnContract(web3);
      const burnerAddress = getFygnBurnerAddress();
      const res = await contract.methods
        .allowance(account, burnerAddress)
        .call();
      return new BigNumber(res);
    } catch (error) {
      console.error("error: ", error);
      return new BigNumber(0);
    }
  };

  const getExchangeRate = async () => {
    try {
      const contract = getFygnBurnerContract(web3);
      const res = await contract.methods
        .getYGNAmount(
          new BigNumber(1).times(new BigNumber(10).pow(18)).toString()
        )
        .call();
      setExchangeRate(new BigNumber(res).dividedBy(new BigNumber(10).pow(18)));
    } catch (error) {
      console.error("error: ", error);
    }
  };

  const getTokenBalances = async () => {
    const fygnBalanceResp = await fetchFygnBalance();
    const ygnBalanceResp = await fetchYgnBalance();
    const fygnAllowanceResp = await fetchFygnAllowance();
    setFygnAllowance(fygnAllowanceResp);
    setFygnBalance(fygnBalanceResp);
    setYgnBalance(ygnBalanceResp);
  };

  useEffect(() => {
    async function fetchTotalSupply() {
      const fygnContract = getFygnContract();
      const totalSupplyOfFygn = await fygnContract.methods.totalSupply().call();
      setTotalSupply(new BigNumber(totalSupplyOfFygn));
    }
    if (account) {
      fetchTotalSupply();
    }
  }, [account, setTotalSupply]);

  useEffect(() => {
    if (account) {
      getTokenBalances();
      getExchangeRate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const onChange = (event) => {
    handleTokenAmount(event.target.value);
  };

  const onSelectMax = () => {
    handleTokenAmount(getFullDisplayBalance(fygnBalance).toString());
  };

  const handleApprove = useCallback(async () => {
    try {
      const txHash = await onApprove();
      // user rejected tx or didn't go thru
    } catch (e) {
      console.error(e);
    }
  }, [onApprove]);

  const burnFygn = async () => {
    try {
      if (metaTranscation) {
        try {
          await burnGasless(fygnBurnerGasless, tokenAmount, account, library);
          toastSuccess(
            "Success!",
            `You have successfully burned ${tokenAmount} fYGN !`
          );
        } catch (e) {
          toastError("An error occurred while burning fYGN");
        }
      } else {
        await burn(fygnBurner, tokenAmount, account);
        toastSuccess(
          "Success!",
          `You have successfully burned ${tokenAmount} fYGN !`
        );
      }
      await getTokenBalances();
    } catch (error) {
      toastError("An error occurred while burning fYGN");
    }
  };

  const burnAndStakeFygn = async () => {
    try {
      await burnAndStake(fygnBurner, tokenAmount, account);
      toastSuccess(
        "Success!",
        `You have successfully burned ${tokenAmount} fYGN !`
      );
      await getTokenBalances();
    } catch (error) {
      toastError("An error occurred while burning and staking fYGN");
    }
  };

  const validateInput = (val: string) => {
    const valInWei = new BigNumber(val).times(new BigNumber(10).pow(18));

    let errorFree = true;
    if (!/^\d+\.?\d*$/.test(val)) {
      toastError("Please enter a valid number");
      errorFree = false;
      return errorFree;
    }
    if (!new BigNumber(val).isGreaterThan(0)) {
      toastError("Insuffiecint amount to burn");
      errorFree = false;
      return errorFree;
    }
    if (!new BigNumber(valInWei).isLessThanOrEqualTo(fygnBalance)) {
      toastError("Cannot burn more than what you have");
      errorFree = false;
      return errorFree;
    }
    return errorFree;
  };

  const renderBottomButtons = () => {
    if (!account) {
      return <UnlockButton mt="8px" width="100%" />;
    }

    if (!fygnBalance.isZero()) {
      if (fygnAllowance.isLessThanOrEqualTo(0)) {
        return pendingTx === false ? (
          <Button
            style={{ maxWidth: "400px", width: "100%" }}
            onClick={async () => {
              setPendingTx(true);
              await handleApprove();
              await getTokenBalances();
              setPendingTx(false);
            }}
          >
            Approve fYGN
          </Button>
        ) : (
          <Button
            isLoading
            style={{ maxWidth: "400px", width: "100%" }}
            endIcon={<AutoRenewIcon spin color="currentColor" />}
          >
            Approving fYGN...
          </Button>
        );
      }
    } else {
      return (
        <Button style={{ maxWidth: "400px", width: "100%" }} disabled>
          Insufficent fYGN Balance
        </Button>
      );
    }

    return pendingTx === false ? (
      <ButtonContainer>
        <Button
          mr="5px"
          onClick={async () => {
            const goAheadWithBurnAndStakeTxn = validateInput(tokenAmount);
            if (goAheadWithBurnAndStakeTxn) {
              setPendingTx(() => true);
              await burnAndStakeFygn();
              setPendingTx(() => false);
            }
          }}
        >
          Burn & Stake
        </Button>
        <Button
          ml="5px"
          style={{ maxWidth: "400px" }}
          onClick={async () => {
            const goAheadWithBurnTxn = validateInput(tokenAmount);
            if (goAheadWithBurnTxn) {
              setPendingTx(() => true);
              await burnFygn();
              setPendingTx(() => false);
            }
          }}
          variant="secondary"
        >
          Burn fYGN
        </Button>
      </ButtonContainer>
    ) : (
      <Button
        isLoading
        style={{ maxWidth: "400px", width: "100%" }}
        endIcon={<AutoRenewIcon spin color="currentColor" />}
      >
        Processing...
      </Button>
    );
  };
  return (
    <PoolsContainer>
      <Container maxWidth="lg">
        <HeaderGrid container spacing={3}>
          <div
            style={{
              backgroundColor: "#887963",
              width: "100%",
              borderRadius: "10px",
              padding: "20px 10px",
            }}
          >
            <CNHeading>fYGN Burner</CNHeading>
            <StyledOl>
              <DescriptionTextLi>Stake YGN to earn more YGN.</DescriptionTextLi>
              <DescriptionTextLi>
                You will earn a portion of the swap fees based on the amount of
                xYGN held relative to the weight of the staking.
              </DescriptionTextLi>
              <DescriptionTextLi>
                xYGN can be minted by staking YGN. To redeem the YGN staked plus
                swap fees, convert xYGN back to YGN.
              </DescriptionTextLi>
            </StyledOl>
          </div>
        </HeaderGrid>
        <Grid container spacing={3} style={{ marginTop: "30px" }}>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <StakingContainer>
              {/* <Text bold fontSize="32px">
                fYGN Burner
              </Text> */}
              <InfoDiv>
                <Text
                  bold
                  color="#424945"
                  style={{ whiteSpace: "nowrap" }}
                  fontSize="18px"
                >
                  BURN fYGN
                </Text>
                {totalSupply && (
                  <ConversionInfo>
                    {`There are currently ${getBalanceNumber(
                      totalSupply
                    ).toFixed(2)} fYGN`}
                  </ConversionInfo>
                )}
              </InfoDiv>

              <CustomInputPannel>
                <InputWrapper>
                  <Input
                    onInputChange={onChange}
                    placeholder="0 fYGN"
                    value={tokenAmount}
                  />
                </InputWrapper>
                <Flex alignItems="center">
                  <Text
                    bold
                    color="#887263"
                    textTransform="uppercase"
                    mr="10px"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Balance: {getFullDisplayBalanceForStaker(fygnBalance)}
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
                    color="#424945"
                    textTransform="uppercase"
                    style={{ whiteSpace: "nowrap" }}
                    fontSize="18px"
                    mb="6px"
                  >
                    Exchange Rate
                  </Text>
                  {/* <Button variant="secondary" scale="sm">
                    {" "}
                    View Stats
                  </Button> */}
                </div>
                <div>
                  <Text
                    bold
                    color="#424945"
                    textTransform="uppercase"
                    style={{ whiteSpace: "nowrap" }}
                    fontSize="24px"
                    textAlign="center"
                  >
                    {exchangeRate.toFixed(9)}
                  </Text>
                  <Text
                    color="#887263"
                    style={{ whiteSpace: "nowrap" }}
                    fontSize="16px"
                  >
                    1 fYGN = {exchangeRate.toFixed(6)} YGN
                  </Text>
                </div>
              </Flex>
            </StakingInfo>
            <StakingContainer>
              <Text
                bold
                color="#424945"
                textTransform="uppercase"
                style={{ whiteSpace: "nowrap" }}
                fontSize="22px"
              >
                Balances
              </Text>
              <InfoDiv>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/images/tokens/ygn.webp"
                    alt="fYGN"
                    width="24px"
                    style={{ marginRight: "10px", cursor: "pointer" }}
                    onClick={() =>
                      registerToken(
                        contracts.cake[CHAINID],
                        "fYGN",
                        18,
                        fYGNLogo
                      )
                    }
                  />
                  <Text
                    bold
                    color="#887263"
                    textTransform="uppercase"
                    style={{ whiteSpace: "nowrap" }}
                    fontSize="18px"
                  >
                    fYGN:{" "}
                    <span style={{ color: "#424945" }}>
                      {getBalanceNumber(fygnBalance).toFixed(2)}
                    </span>
                  </Text>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/images/tokens/ygn.webp"
                    alt="YGN"
                    width="24px"
                    onClick={() =>
                      registerToken(
                        contracts.cntStaker[CHAINID],
                        "YGN",
                        18,
                        YGNLogo
                      )
                    }
                    style={{ marginRight: "10px", cursor: "pointer" }}
                  />
                  <Text
                    bold
                    color="#887263"
                    style={{ whiteSpace: "nowrap" }}
                    fontSize="18px"
                  >
                    YGN:{" "}
                    <span style={{ color: "#424945" }}>
                      {getBalanceNumber(ygnBalance).toFixed(2)}
                    </span>
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

export default FYGNBurner;
