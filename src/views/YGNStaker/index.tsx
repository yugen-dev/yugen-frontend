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
import {
  ButtonMenu,
  ButtonMenuItem,
  Button,
  Flex,
  Input,
  Text,
  AutoRenewIcon,
} from "yugen-uikit";
import Grid from "@material-ui/core/Grid";
import { useQuery } from "@apollo/client";
import { ygnStakerQuery, stakerAllocatedQquery } from "apollo/queries";
import { useApproveStaking } from "hooks/useApprove";
import { useChainId } from "state/application/hooks";
import contracts from "config/constants/contracts";
import { useProfile, useToast } from "state/hooks";
import { enter, enterGasless, leave, leaveGasless } from "utils/callHelpers";
import UnlockButton from "components/UnlockButton";
import useWeb3 from "hooks/useWeb3";
import {
  getBalanceNumber,
  getFullDisplayBalance,
  getFullDisplayBalanceForStaker,
} from "utils/formatBalance";
import {
  getCakeContract,
  getYgnStakerContract,
  getERC20Contract,
} from "utils/contractHelpers";
import { useYgnStaker, useYgnStakerGasless } from "hooks/useContract";
import { registerToken } from "utils/wallet";
import inputValidator from "utils/inputValidator";

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
  text-align: center;
  margin-bottom: 10px !important;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const StyledOl = styled.ol`
  list-style-position: outside;
  padding-left: 16px;
`;
const YgnStaker = () => {
  const xYGNLogo =
    "https://s3.us-east-2.amazonaws.com/www.yugen.finance/assets/xygn.webp";
  const YGNLogo =
    "https://s3.us-east-2.amazonaws.com/www.yugen.finance/assets/ygn.webp";
  const [index, setIndex] = React.useState(0);
  const [tokenBalance, setTokenBalance] = React.useState(new BigNumber(0));
  const [xygnBalance, setXygnBalance] = React.useState(new BigNumber(0));
  const [ygnAllowance, setYgnAllowance] = React.useState(new BigNumber(0));
  const [exchangeRate, setExchangeRate] = React.useState(new BigNumber(0));
  const CHAINID = useChainId().toString();
  const [requestedApproval, setRequestedApproval] = useState(false);
  const [tokenAmount, handleTokenAmount] = useState("");
  const handleClick = (newIndex) => {
    handleTokenAmount("");
    setIndex(newIndex);
  };
  const { account, library } = useWeb3React("web3");
  const [pendingTx, setPendingTx] = useState(false);
  const [pendingDepositTx, setPendingDepositTx] = useState(false);
  let tokenBal = tokenBalance;

  const { onApprove } = useApproveStaking();
  const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
  const [ygnTotalSupply, setYgnTotalSupply] = useState(new BigNumber(0));
  const web3 = useWeb3();
  const ygnStaker = useYgnStaker();
  const ygnStakerGasless = useYgnStakerGasless();
  const { metaTranscation } = useProfile();
  let ygnStakingRatio = 0.0;
  const { toastSuccess, toastError } = useToast();
  if (index === 1) {
    tokenBal = xygnBalance;
  }
  const fetchBalances = async (tokenAddress) => {
    try {
      const contract = getERC20Contract(tokenAddress, web3);
      const res = await contract.methods.balanceOf(account).call();
      return new BigNumber(res);
    } catch (error) {
      console.error({ error });
      return new BigNumber(0);
    }
  };
  const fetchAllowance = async (tokenAddress, stakerAddress) => {
    try {
      const contract = getERC20Contract(tokenAddress, web3);
      const res = await contract.methods
        .allowance(account, stakerAddress)
        .call();
      return new BigNumber(res);
    } catch (error) {
      console.error({ error });
      return new BigNumber(0);
    }
  };

  const getExchangeRate = React.useCallback(async () => {
    try {
      const contract = getYgnStakerContract(web3);
      const res = await contract.methods
        .getXYGNAmount(
          new BigNumber(1).times(new BigNumber(10).pow(18)).toString()
        )
        .call();
      setExchangeRate(new BigNumber(res).dividedBy(new BigNumber(10).pow(18)));
    } catch (error) {
      console.error("error: ", error);
    }
  }, [web3]);

  const getTokenBalances = async () => {
    const tokenBalanceResp = await fetchBalances(contracts.cake[CHAINID]);
    const xygnBalanceResp = await fetchBalances(contracts.ygnStaker[CHAINID]);
    const allowanceOfYgn = await fetchAllowance(
      contracts.cake[CHAINID],
      contracts.ygnStaker[CHAINID]
    );
    setYgnAllowance(allowanceOfYgn);
    setTokenBalance(tokenBalanceResp);
    setXygnBalance(xygnBalanceResp);
  };

  useEffect(() => {
    async function fetchTotalSupply() {
      const xygnContract = getYgnStakerContract();
      const ygnContract = getCakeContract();
      const totalYgnInStaker = await ygnContract.methods
        .balanceOf(contracts.ygnStaker[CHAINID])
        .call();
      const supply = await xygnContract.methods.totalSupply().call();
      setYgnTotalSupply(new BigNumber(totalYgnInStaker));
      setTotalSupply(new BigNumber(supply));
    }
    if (account) {
      fetchTotalSupply();
      getExchangeRate();
    }
  }, [CHAINID, account, getExchangeRate, setTotalSupply, setYgnTotalSupply]);

  useEffect(() => {
    if (account) {
      getTokenBalances();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);
  const getStakerallocated = useQuery(stakerAllocatedQquery, {
    context: {
      clientName: "convertor",
    },
  });
  const getYgnStakerInfo = useQuery(ygnStakerQuery, {
    context: {
      clientName: "cntstaker",
    },
  });
  if (
    getYgnStakerInfo &&
    getYgnStakerInfo.data &&
    getYgnStakerInfo.data.ygnstakers &&
    getStakerallocated &&
    getStakerallocated.data &&
    getStakerallocated.data.weekDatas
  ) {
    ygnStakingRatio =
      (parseFloat(getStakerallocated.data.weekDatas[0].stakersAllocated) /
        10e18 /
        (parseFloat(getYgnStakerInfo.data.ygnstakers[0].totalSupply) *
          parseFloat(getYgnStakerInfo.data.ygnstakers[0].ratio))) *
      52 *
      100;
  }
  const onChange = (event) => {
    handleTokenAmount(event.target.value);
  };
  const onSelectMax = () => {
    if (index === 0) {
      handleTokenAmount(getFullDisplayBalance(tokenBalance).toString());
    } else {
      handleTokenAmount(getFullDisplayBalance(xygnBalance).toString());
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

  const stakeYgn = async () => {
    setPendingDepositTx(true);
    try {
      if (metaTranscation) {
        try {
          await enterGasless(ygnStakerGasless, tokenAmount, account, library);
          toastSuccess(
            "Success!",
            `You have successfully staked ${tokenAmount} YGN !`
          );
        } catch (e) {
          toastError("An error occurred while staking YGN");
        }
      } else {
        await enter(ygnStaker, tokenAmount, account);
        toastSuccess(
          "Success!",
          `You have successfully staked ${tokenAmount} YGN !`
        );
      }

      await getTokenBalances();
    } catch (error) {
      toastError("An error occurred while staking YGN");
    }
    setPendingDepositTx(false);
  };
  const unstakeYgn = async () => {
    setPendingTx(true);
    try {
      if (metaTranscation) {
        await leaveGasless(ygnStakerGasless, tokenAmount, account, library);
      } else {
        await leave(ygnStaker, tokenAmount, account);
      }

      await getTokenBalances();
      toastSuccess(
        "Success!",
        `You have successfully unstaked ${tokenAmount} xYGN !`
      );
    } catch (error) {
      toastError("An error occurred while unstaking xYGN");
    }
    setPendingTx(false);
  };

  const BtnLoadingComp =
    pendingTx === false ? (
      <Button
        width="100%"
        onClick={async () => {
          setPendingTx(true);
          await handleApprove();
          setPendingTx(false);
        }}
      >
        Approve YGN
      </Button>
    ) : (
      <Button isLoading endIcon={<AutoRenewIcon spin color="currentColor" />}>
        Approving YGN...
      </Button>
    );

  const renderBottomButtons = () => {
    if (!account) {
      return <UnlockButton mt="8px" width="100%" />;
    }
    if (index === 0) {
      if (tokenBalance.toNumber() > 0) {
        if (ygnAllowance.toNumber() <= 0) {
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
              Approve YGN
            </Button>
          ) : (
            <Button
              isLoading
              style={{ maxWidth: "400px", width: "100%" }}
              endIcon={<AutoRenewIcon spin color="currentColor" />}
            >
              Approving YGN...
            </Button>
          );
        }
      } else {
        return (
          <Button style={{ maxWidth: "400px", width: "100%" }} disabled>
            Insufficent YGN Balance
          </Button>
        );
      }
      return pendingTx === false ? (
        <Button
          style={{ maxWidth: "400px", width: "100%" }}
          onClick={async () => {
            const goAheadWithYgnStakeTxn = inputValidator(
              toastError,
              tokenAmount,
              tokenBalance
            );
            if (goAheadWithYgnStakeTxn) {
              setPendingTx(true);
              await stakeYgn();
              setPendingTx(false);
            }
          }}
        >
          Stake YGN
        </Button>
      ) : (
        <Button
          isLoading
          style={{ maxWidth: "400px", width: "100%" }}
          endIcon={<AutoRenewIcon spin color="currentColor" />}
        >
          Staking YGN...
        </Button>
      );
    }
    if (xygnBalance.toNumber() <= 0) {
      return (
        <Button style={{ maxWidth: "400px", width: "100%" }} disabled>
          Insufficent xYGN Balance
        </Button>
      );
    }

    return pendingTx === false ? (
      <Button
        style={{ maxWidth: "400px", width: "100%" }}
        onClick={async () => {
          const goAheadWithXygnStakeTxn = inputValidator(
            toastError,
            tokenAmount,
            xygnBalance
          );
          if (goAheadWithXygnStakeTxn) {
            setPendingTx(true);
            await unstakeYgn();
            setPendingTx(false);
          }
        }}
      >
        Convert to YGN
      </Button>
    ) : (
      <Button
        isLoading
        style={{ maxWidth: "400px", width: "100%" }}
        endIcon={<AutoRenewIcon spin color="currentColor" />}
      >
        Converting to YGN...
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
            <CNHeading>YGN Staker</CNHeading>
            <StyledOl>
              <DescriptionTextLi>Stake YGN to earn more YGN.</DescriptionTextLi>
              <DescriptionTextLi>
                10% of the Interest generated is given back to the stakers of
                YGN.
              </DescriptionTextLi>
            </StyledOl>
          </div>
        </HeaderGrid>
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
                  Unstake
                </ButtonMenuItem>
              </ButtonMenu>
              <InfoDiv>
                <Text
                  bold
                  color="#424945"
                  textTransform="uppercase"
                  style={{ whiteSpace: "nowrap" }}
                  fontSize="18px"
                >
                  {index === 0 ? "Stake YGN" : "Unstake YGN"}
                </Text>
                {totalSupply && (
                  <ConversionInfo>
                    {`There are currently ${getBalanceNumber(
                      totalSupply
                    ).toFixed(2)} xYGN`}
                  </ConversionInfo>
                )}
              </InfoDiv>

              <CustomInputPannel>
                <InputWrapper>
                  <Input
                    onInputChange={onChange}
                    placeholder="0 YGN"
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
                    Balance: {getFullDisplayBalanceForStaker(tokenBal)}
                  </Text>
                  <Button scale="sm" onClick={onSelectMax}>
                    Max
                  </Button>
                </Flex>
              </CustomInputPannel>
              {!exchangeRate.isZero() &&
                index === 0 &&
                !new BigNumber(tokenAmount).isZero() &&
                !new BigNumber(tokenAmount)
                  .multipliedBy(exchangeRate)
                  .isNaN() && (
                  <Text color="#887263" mb="15px">
                    You will recieve approx{" "}
                    {new BigNumber(tokenAmount)
                      .multipliedBy(exchangeRate)
                      .toFixed(6)}{" "}
                    xYGNs
                  </Text>
                )}
              {!totalSupply.isZero() &&
                index === 1 &&
                !ygnTotalSupply.isZero() &&
                !new BigNumber(tokenAmount).isZero() &&
                !new BigNumber(tokenAmount)
                  .multipliedBy(ygnTotalSupply)
                  .isNaN() && (
                  <Text color="#887263" mb="15px">
                    You will recieve approx{" "}
                    {new BigNumber(tokenAmount)
                      .multipliedBy(ygnTotalSupply)
                      .dividedBy(totalSupply)
                      .toFixed(6)}{" "}
                    YGNs
                  </Text>
                )}
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
                    Staking APR
                  </Text>
                </div>
                <div>
                  <Text
                    bold
                    color="#424945"
                    textTransform="uppercase"
                    style={{ whiteSpace: "nowrap" }}
                    fontSize="24px"
                  >
                    {parseFloat(ygnStakingRatio.toFixed(2))} %
                  </Text>
                  <Text
                    color="#887263"
                    style={{ whiteSpace: "nowrap" }}
                    fontSize="16px"
                  >
                    Tentative APR
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
                    alt="YGN"
                    width="24px"
                    loading="lazy"
                    style={{ marginRight: "10px", cursor: "pointer" }}
                    onClick={() =>
                      registerToken(contracts.cake[CHAINID], "YGN", 18, YGNLogo)
                    }
                  />
                  <Text
                    bold
                    color="#887263"
                    textTransform="uppercase"
                    style={{ whiteSpace: "nowrap" }}
                    fontSize="18px"
                  >
                    YGN:{" "}
                    <span style={{ color: "#424945" }}>
                      {getBalanceNumber(tokenBalance).toFixed(2)}
                    </span>
                  </Text>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src="/images/tokens/xygn.webp"
                    alt="xYGN"
                    width="24px"
                    loading="lazy"
                    onClick={() =>
                      registerToken(
                        contracts.ygnStaker[CHAINID],
                        "xYGN",
                        18,
                        xYGNLogo
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
                    xYGN:{" "}
                    <span style={{ color: "#424945" }}>
                      {getBalanceNumber(xygnBalance).toFixed(2)}
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

export default YgnStaker;
