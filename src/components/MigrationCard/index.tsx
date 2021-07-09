import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Text,
  Button,
  AutoRenewIcon,
} from "cryption-uikit";
import useWeb3 from "hooks/useWeb3";
import { getPolydexMigratorAddress } from "utils/addressHelpers";
import {
  usePolydexMigratorContract,
  usePairContract,
} from "hooks/useContract";
import {
  getBep20Contract
} from "utils/contractHelpers"
import { useToast } from "state/hooks";

interface ModalProps {
  pairAddress: string;
  exchangePlatform: string;
}

export default function MigrationCard({ pairAddress, exchangePlatform }: ModalProps) {
  const pairContract = usePairContract(pairAddress, true);
  // const [totalPoolTokens, setTotalPoolTokens] = useState(null);
  const [token0Deposited, setToken0Deposited] = useState(null);
  const [token1Deposited, setToken1Deposited] = useState(null);
  const [token0Address, setToken0Address] = useState(null);
  const [token1Address, setToken1Address] = useState(null);
  const [token0Symbol, setToken0Symbol] = useState(null);
  const [token1Symbol, setToken1Symbol] = useState(null);
  const pairName = `${token0Symbol}/${token1Symbol}`;
  const [showDetails, toggleDetails] = useState(false);
  const { toastSuccess } = useToast();
  const [approveLoading, setApproveLoading] = useState(false);
  const [migrateLoading, setMigrateLoading] = useState(false);
  const [lpBal, setLpbal] = useState(0);
  const [balance, setBal] = useState();
  const [allowence, setallowence] = useState(null);
  const web3 = useWeb3();
  const { account } = useWeb3React();
  const polydexMigrator = usePolydexMigratorContract();
  const polydexMigratorAddress = getPolydexMigratorAddress();
  const poolTokenPercentage = 0.21;
  const onMigrateClicked = async () => {
    setMigrateLoading(true);
    const now = new Date();
    const utcMilllisecondsSinceEpoch = now.getTime();
    const utcSecondsSinceEpoch =
      Math.round(utcMilllisecondsSinceEpoch / 1000) + 1200;
    try {
      const txHash = await polydexMigrator.functions.migrate(
        token0Address,
        token1Address,
        balance,
        1,
        1,
        utcSecondsSinceEpoch
      );
      if (txHash) {
        toastSuccess("Success", "Lp Tokens Succfully Migrated");
        setMigrateLoading(false);
      }
    } catch (error) {
      setMigrateLoading(false);
      toastSuccess("Error", "Error occured while migrating");
    }
  };
  const onApprove = async () => {
    setApproveLoading(true);
    try {
      const txHash = await pairContract.approve(
        polydexMigratorAddress,
        ethers.constants.MaxUint256
      );
      if (txHash) {
        toastSuccess("Success", "Account successfully approved");
        setApproveLoading(false);
        getBalance();
      }
    } catch (error) {
      setApproveLoading(false);
    }
  };
  const getBalance = async () => {
    let lpBalance = await pairContract.balanceOf(account);
    const checkAllowence = await pairContract.allowance(
      account,
      polydexMigratorAddress
    );
    const getTotalSupply = await pairContract.totalSupply();
    const getReserves = await pairContract.getReserves();
    const token0Bal = (parseFloat(lpBalance.toString()) / parseFloat(getTotalSupply.toString())) * parseFloat(getReserves.reserve0.toString());
    const token1Bal = (parseFloat(lpBalance.toString()) / parseFloat(getTotalSupply.toString())) * parseFloat(getReserves.reserve1.toString());
    const getToken0Address = await pairContract.token0();
    const getToken1Address = await pairContract.token1();
    const token0contract = getBep20Contract(getToken0Address, web3);
    const token1contract = getBep20Contract(getToken1Address, web3);
    const gettoken0Symbol = await token0contract.methods.symbol().call();
    const gettoken1Symbol = await token1contract.methods.symbol().call();
    lpBalance = web3.utils.fromWei(lpBalance.toString(), "ether");
    lpBalance = parseFloat(lpBalance).toFixed(3).toString();
    setToken0Symbol(gettoken0Symbol)
    setToken1Symbol(gettoken1Symbol)
    setToken0Address(getToken0Address);
    setToken1Address(getToken1Address);
    setallowence(parseFloat(checkAllowence.toString()));
    setToken0Deposited(token0Bal.toFixed(3));
    setToken1Deposited(token1Bal.toFixed(3));
    setBal(lpBalance.toString());
    // setTotalPoolTokens(getTotalSupply.toString());
  };
  useEffect(() => {
    if (account) getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3.eth.Contract]);
  return (
    <MigrationRow>
      {token1Address && token0Address ? <div>
        <RowData onClick={() => toggleDetails(!showDetails)}>
          <ImageDiv>
            <img src={`/images/${token0Symbol}.png`} alt="BNB" width="20px" />
            <img src={`/images/${token1Symbol}.png`} alt="BNB" width="20px" />
            <Text color="white" fontSize="15px" bold ml="10px">
              {pairName}
            </Text>
          </ImageDiv>
          {showDetails ? (
            <ImageDiv>
              <Text color="#2082E9" fontSize="13px" bold mr="7px">
                {exchangePlatform}
              </Text>
              <ChevronUpIcon
                color="white"
                width="24px"
                onClick={() => toggleDetails(!showDetails)}
                style={{ cursor: "pointer" }}
              />
            </ImageDiv>
          ) : (
            <ImageDiv>
              <Text color="#2082E9" fontSize="13px" bold mr="7px">
                {exchangePlatform}
              </Text>
              <ChevronDownIcon
                color="white"
                width="24px"
                onClick={() => toggleDetails(!showDetails)}
                style={{ cursor: "pointer" }}
              />
            </ImageDiv>
          )}
        </RowData>
        {showDetails && (
          <div>
            <InfoContainer>
              <InfoDiv>
                <Text color="#9d9fa8" fontSize="18px">
                  Pooled {token0Symbol}:
                </Text>
                <Text fontSize="18px" bold>
                  {token0Deposited}
                </Text>
              </InfoDiv>
              <InfoDiv>
                <Text color="#9d9fa8" fontSize="18px">
                  Pooled {token1Symbol}:
                </Text>
                <Text fontSize="18px" bold>
                  {token1Deposited}
                </Text>
              </InfoDiv>
              <InfoDiv>
                <Text color="#9d9fa8" fontSize="18px">
                  Your LP Balance:
                </Text>
                <Text fontSize="18px" bold>
                  {lpBal}
                </Text>
              </InfoDiv>
              <InfoDiv>
                <Text color="#9d9fa8" fontSize="18px">
                  Your LP share:
                </Text>
                <Text fontSize="18px" bold>
                  {poolTokenPercentage
                    ? `${poolTokenPercentage.toFixed(2)}%`
                    : "-"}
                </Text>
              </InfoDiv>
            </InfoContainer>
            <div style={{ display: "flex", justifyContent: "center" }}>
              {allowence && allowence !== 0 ? (
                <Button
                  style={{ maxWidth: "300px", width: "100%", marginTop: "20px" }}
                  scale="md"
                  onClick={onMigrateClicked}
                  isLoading={migrateLoading}
                  disabled={migrateLoading}
                  endIcon={
                    migrateLoading && <AutoRenewIcon spin color="currentColor" />
                  }
                >
                  {migrateLoading ? "Processing" : "Migrate Liquidity"}
                </Button>
              ) : (
                <Button
                  onClick={onApprove}
                  isLoading={approveLoading}
                  endIcon={
                    approveLoading && <AutoRenewIcon spin color="currentColor" />
                  }
                >
                  {approveLoading ? "Processing" : "Approve"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
        :
        <Text color="#9d9fa8" fontSize="18px">
          Getting Pair Details...
      </Text>
      }
    </MigrationRow>
  );
}

const MigrationRow = styled.div`
  border: 1px solid #191326;
  width: 100%;
  margin-top: 20px;
  border-radius: 16px;
  padding: 1.25rem;
`;

const RowData = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const InfoContainer = styled.div`
  margin: 20px 0px;
  border-top: 1px solid #2a2d39;
  border-bottom: 1px solid #2a2d39;
  padding-bottom: 10px;
`;
const InfoDiv = styled.div`
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
  align-items: center;
`;
const ImageDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
