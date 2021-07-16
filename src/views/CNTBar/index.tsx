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
} from "cryption-uikit";
import Grid from "@material-ui/core/Grid";
import { useQuery } from "@apollo/client";
import { dayDatasQuery, cntStakerQuery } from "apollo/queries";
import { useStakingAllowance } from "hooks/useAllowance";
import { useApproveStaking } from "hooks/useApprove";
import contracts from "config/constants/contracts";
import { useProfile, useToast } from "state/hooks";
import { enter, enterGasless, leave, leaveGasless } from "utils/callHelpers";
import UnlockButton from "components/UnlockButton";
import getCntPrice from "utils/getCntPrice";
import useWeb3 from "hooks/useWeb3";
import cntMascot from "images/CRYPTION NETWORK-Mascots-10.png";
import { getBalanceNumber } from "utils/formatBalance";
import {
  getCakeContract,
  getCNTStakerContract,
  getBep20Contract,
} from "utils/contractHelpers";
import { useCNTStaker, useCNTStakerGasless } from "hooks/useContract";
import { registerToken } from "utils/wallet";

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
  background-color: #1e202a;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
const CustomInputPannel = styled.div`
  margin: 25px 0px;
  width: 100%;
  max-width: 420px;
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
  background: #383357;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 0.625rem !important;
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

const StyledOl = styled.ol`
  list-style-position: outside;
  padding-left: 16px;
`;
const CNTBar = () => {
  // const tokenName = "CNT";
  const [valueOfCNTinUSD, setCNTVal] = useState(0);
  const xCNTLogo = "https://i.ibb.co/zfhRMxc/xCNT.png";
  const CNTLogo = "https://i.ibb.co/8D5r4Hp/CNT.png";
  const [index, setIndex] = React.useState(0);
  const [tokenBalance, setTokenBalance] = React.useState(new BigNumber(0));
  const [xCNTBalance, setxCNTBalance] = React.useState(new BigNumber(0));

  // const { onEnter } = useEnter();
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
  const allowance = useStakingAllowance();

  const { onApprove } = useApproveStaking();
  const cake = getCakeContract();
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  // const xTokenName = "xCNT";
  const web3 = useWeb3();
  // const { onLeave } = useLeave();
  const cntStaker = useCNTStaker();
  const cntStakerGasless = useCNTStakerGasless();
  const { metaTranscation } = useProfile();
  let cntStakingRatio = 0.0;
  const { toastSuccess, toastError } = useToast();
  if (index === 1) {
    tokenBal = xCNTBalance;
  }
  const fetchBalances = async (tokenAddress) => {
    try {
      const contract = getBep20Contract(tokenAddress, web3);
      const res = await contract.methods.balanceOf(account).call();
      return new BigNumber(res);
    } catch (error) {
      console.error({ error });
      return new BigNumber(0);
    }
  };

  const getTokenBalances = async () => {
    const tokenBalanceResp = await fetchBalances(contracts.cake[80001]);
    const xCNTBalanceResp = await fetchBalances(contracts.cntStaker[80001]);

    setTokenBalance(tokenBalanceResp);
    setxCNTBalance(xCNTBalanceResp);
  };

  useEffect(() => {
    async function fetchTotalSupply() {
      const xCNTContract = getCNTStakerContract();
      const supply = await xCNTContract.methods.totalSupply().call();
      setTotalSupply(new BigNumber(supply));
    }
    if (cake) {
      fetchTotalSupply();
    }
  }, [cake, setTotalSupply]);
  useEffect(() => {
    const getPrice = async () => {
      const apiResp = await getCntPrice();
      setCNTVal(apiResp);
    };
    getPrice();
  }, []);
  useEffect(() => {
    if (account) {
      getTokenBalances();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);
  const dayDatas = useQuery(dayDatasQuery);
  const getCNTStakerInfo = useQuery(cntStakerQuery, {
    context: {
      clientName: "cntstaker",
    },
  });
  if (
    getCNTStakerInfo &&
    getCNTStakerInfo.data &&
    getCNTStakerInfo.data.cntstaker &&
    dayDatas &&
    dayDatas.data &&
    dayDatas.data.dayDatas &&
    valueOfCNTinUSD
  ) {
    cntStakingRatio =
      (((parseFloat(dayDatas.data.dayDatas[1].volumeUSD) * 0.05) /
        parseFloat(getCNTStakerInfo.data.cntstaker.totalSupply)) *
        365) /
      (parseFloat(getCNTStakerInfo.data.cntstaker.ratio) *
        parseFloat(valueOfCNTinUSD.toString()));
  }
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

  const stakeCnt = async () => {
    setPendingDepositTx(true);
    try {
      if (metaTranscation) {
        await enterGasless(cntStakerGasless, tokenAmount, account, library);
        toastSuccess(
          "Success!",
          `You have successfully staked ${tokenAmount} CNT !`
        );
      } else {
        await enter(cntStaker, tokenAmount, account);
        toastSuccess(
          "Success!",
          `You have successfully staked ${tokenAmount} CNT !`
        );
      }

      await getTokenBalances();
    } catch (error) {
      toastError("An error occurred while staking CNT");
    }
    setPendingDepositTx(false);
  };
  const unstakeCnt = async () => {
    setPendingTx(true);
    try {
      if (metaTranscation) {
        await leaveGasless(cntStakerGasless, tokenAmount, account, library);
        toastSuccess(
          "Success!",
          `You have successfully unstaked ${tokenAmount} xCNT !`
        );
      } else {
        await leave(cntStaker, tokenAmount, account);
        toastSuccess(
          "Success!",
          `You have successfully unstaked ${tokenAmount} xCNT !`
        );
      }

      await getTokenBalances();
    } catch (error) {
      toastError("An error occurred while unstaking xCNT");
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
        Approve CNT
      </Button>
    ) : (
      <Button isLoading endIcon={<AutoRenewIcon spin color="currentColor" />}>
        Approving CNT ...
      </Button>
    );

  const renderBottomButtons = () => {
    if (!account) {
      return <UnlockButton mt="8px" width="100%" />;
    }
    if (index === 0) {
      if (!allowance.toNumber()) {
        return (
          // <Button
          //   disabled={requestedApproval}
          //   onClick={handleApprove}
          //   style={{ maxWidth: "400px", width: "100%" }}
          // >
          //   Approve CNT
          // </Button>
          // <BtnLoadingComp />
          pendingTx === false ? (
            <Button
              style={{ maxWidth: "400px", width: "100%" }}
              onClick={async () => {
                setPendingTx(true);
                await handleApprove();
                setPendingTx(false);
              }}
            >
              Approve CNT
            </Button>
          ) : (
            <Button
              isLoading
              style={{ maxWidth: "400px", width: "100%" }}
              endIcon={<AutoRenewIcon spin color="currentColor" />}
            >
              Approving CNT ...
            </Button>
          )
        );
      }
      return (
        // <Button
        //   disabled={tokenBalance.eq(new BigNumber(0)) || pendingDepositTx}
        //   onClick={stakeCnt}
        //   style={{ maxWidth: "400px", width: "100%" }}
        // >
        //   {pendingDepositTx ? "Staking CNT..." : "Stake CNT"}
        // </Button>

        pendingTx === false ? (
          <Button
            style={{ maxWidth: "400px", width: "100%" }}
            onClick={async () => {
              setPendingTx(true);
              await stakeCnt();
              setPendingTx(false);
            }}
          >
            Stake CNT
          </Button>
        ) : (
          <Button
            isLoading
            style={{ maxWidth: "400px", width: "100%" }}
            endIcon={<AutoRenewIcon spin color="currentColor" />}
          >
            Staking CNT...
          </Button>
        )
      );
    }
    return (
      // <Button
      //   disabled={!xCNTBalance.toNumber() || pendingTx}
      //   onClick={unstakeCnt}
      // >
      //   {pendingTx ? "Converting to CNT..." : "Convert to CNT"}
      // </Button>
      pendingTx === false ? (
        <Button
          style={{ maxWidth: "400px", width: "100%" }}
          onClick={async () => {
            setPendingTx(true);
            await stakeCnt();
            setPendingTx(false);
          }}
        >
          Convert to CNT
        </Button>
      ) : (
        <Button
          isLoading
          style={{ maxWidth: "400px", width: "100%" }}
          endIcon={<AutoRenewIcon spin color="currentColor" />}
        >
          Converting to CNT...
        </Button>
      )
    );
  };
  return (
    <PoolsContainer>
      <Container maxWidth="lg">
        <HeaderGrid container spacing={3}>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <CNHeading>CNT Staker</CNHeading>
            <StyledOl>
              <DescriptionTextLi>Stake CNT to earn more CNT.</DescriptionTextLi>
              <DescriptionTextLi>
                You will earn a portion of the swap fees based on the amount of
                xCNT held relative to the weight of the staking.
              </DescriptionTextLi>
              <DescriptionTextLi>
                xCNT can be minted by staking CNT. To redeem the CNT staked plus
                swap fees, convert xCNT back to CNT.
              </DescriptionTextLi>
            </StyledOl>
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={cntMascot} alt="Cryption Netwrok" width="250px" />
            </div>
          </Grid>
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
                  color="white"
                  textTransform="uppercase"
                  style={{ whiteSpace: "nowrap" }}
                  fontSize="18px"
                >
                  {index === 0 ? "Stake CNT" : "Unstake CNT"}
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
                  {/* <Button variant="secondary" scale="sm">
                    {" "}
                    View Stats
                  </Button> */}
                </div>
                <div>
                  <Text
                    bold
                    color="white"
                    textTransform="uppercase"
                    style={{ whiteSpace: "nowrap" }}
                    fontSize="24px"
                  >
                    {cntStakingRatio.toFixed(2)}%
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
                    style={{ marginRight: "10px", cursor: "pointer" }}
                    onClick={() =>
                      registerToken(contracts.cake[80001], "CNT", 18, CNTLogo)
                    }
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
                    src="/images/xCNT.png"
                    alt="xCNT"
                    width="24px"
                    onClick={() =>
                      registerToken(
                        contracts.cntStaker[80001],
                        "xCNT",
                        18,
                        xCNTLogo
                      )
                    }
                    style={{ marginRight: "10px", cursor: "pointer" }}
                  />
                  <Text
                    bold
                    color="#9d9fa8"
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
