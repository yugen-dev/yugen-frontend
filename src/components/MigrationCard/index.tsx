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
import { usePolydexMigratorContract, usePairContract } from "hooks/useContract";
import { getBep20Contract } from "utils/contractHelpers";
import { useMigrationpairRemover } from "state/user/hooks";
import ConfirmationPendingContent from "components/TransactionConfirmationModal/ConfirmationPendingContent";
import TransactionSubmittedContent from "components/TransactionConfirmationModal/TransactionSubmittedContent";
import Modal from "components/Modal"
import { useToast } from "state/hooks";
import { useActiveWeb3React } from "hooks";

interface ModalProps {
  pairAddress: string;
  exchangePlatform: string;
  factoryAddrees: string;
}

export default function MigrationCard({
  pairAddress,
  exchangePlatform,
  factoryAddrees,
}: ModalProps) {
  const { chainId } = useActiveWeb3React();
  const pairContract = usePairContract(pairAddress, true);
  const [totalPoolTokens, setTotalPoolTokens] = useState(null);
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
  const [migrateSuccess, setMigrateSuccess] = useState(false);
  const [migratetxHash, setMigratetxHash] = useState(null);
  const [balance, setBal] = useState("0");
  const [allowence, setallowence] = useState(null);
  const removePair = useMigrationpairRemover()
  const web3 = useWeb3();
  const { account } = useWeb3React();
  const polydexMigrator = usePolydexMigratorContract();
  const polydexMigratorAddress = getPolydexMigratorAddress();
  let poolTokenPercentage = 0.0;
  if (totalPoolTokens && balance) {
    poolTokenPercentage = (parseFloat(balance) * 100) / parseFloat(totalPoolTokens);
  }

  const onMigrateClicked = async () => {
    setMigrateLoading(true);
    const now = new Date();
    const utcMilllisecondsSinceEpoch = now.getTime();
    const utcSecondsSinceEpoch =
      Math.round(utcMilllisecondsSinceEpoch / 1000) + 1200;
    try {
      const balanceInWei = web3.utils.toWei(balance);
      const txHash = await polydexMigrator.functions.migrate(
        token0Address,
        token1Address,
        balanceInWei,
        1,
        1,
        utcSecondsSinceEpoch
      );
      const receipt = await txHash.wait();
      if (receipt.status) {
        setMigrateSuccess(true)
        setMigratetxHash(txHash.hash);
        getBalance()
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
      const receipt = await txHash.wait();
      if (receipt.status) {
        const checkAllowence = await pairContract.allowance(
          account,
          polydexMigratorAddress
        );
        toastSuccess("Success", "Account successfully approved");
        setApproveLoading(false);
        setallowence(parseFloat(checkAllowence.toString()));
      }
    } catch (error) {
      setApproveLoading(false);
    }
  };
  const getBalance = async () => {
    if (pairContract) {
      let lpBalance = await pairContract.balanceOf(account);
      const checkAllowence = await pairContract.allowance(
        account,
        polydexMigratorAddress
      );
      const getTotalSupply = await pairContract.totalSupply();
      const getReserves = await pairContract.getReserves();
      const getToken0Address = await pairContract.token0();
      const getToken1Address = await pairContract.token1();
      const token0contract = getBep20Contract(getToken0Address, web3);
      const token1contract = getBep20Contract(getToken1Address, web3);
      const gettoken0Symbol = await token0contract.methods.symbol().call();
      const gettoken1Symbol = await token1contract.methods.symbol().call();
      lpBalance = web3.utils.fromWei(lpBalance.toString(), "ether");
      const totalSupply = web3.utils.fromWei(
        getTotalSupply.toString(),
        "ether"
      );
      const weiReserve1 = web3.utils.fromWei(
        getReserves.reserve0.toString(),
        "ether"
      );
      const weiReserve2 = web3.utils.fromWei(
        getReserves.reserve1.toString(),
        "ether"
      );
      const token0Bal =
        (parseFloat(lpBalance.toString()) /
          parseFloat(totalSupply.toString())) *
        parseFloat(weiReserve1);
      const token1Bal =
        (parseFloat(lpBalance.toString()) /
          parseFloat(totalSupply.toString())) *
        parseFloat(weiReserve2.toString());
      lpBalance = parseFloat(lpBalance).toFixed(3).toString();
      setToken0Symbol(gettoken0Symbol);
      setToken1Symbol(gettoken1Symbol);
      setToken0Address(getToken0Address);
      setToken1Address(getToken1Address);
      setallowence(parseFloat(checkAllowence.toString()));
      setToken0Deposited(token0Bal.toFixed(3));
      setToken1Deposited(token1Bal.toFixed(3));
      setBal(lpBalance.toString());
      setTotalPoolTokens(totalSupply.toString());
    }
  };
  const onRemovepair = () => {
    removePair(chainId, factoryAddrees, pairAddress)
  }
  useEffect(() => {
    if (account) getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3.eth.Contract]);
  let jsxForRow = (<div />)
  if (parseFloat(balance) > 0) {
    jsxForRow = (
      <MigrationRow>
        {token1Address && token0Address ? (
          <div>
            <Modal isOpen={migrateLoading || migrateSuccess}
              onDismiss={() => {
                setMigrateLoading(false);
                setMigrateSuccess(false)
              }} maxHeight={90}>
              {migrateLoading && <ConfirmationPendingContent
                onDismiss={() => setMigrateLoading(false)}
                pendingText="Transcation is in progress, please wait..."
              />}
              {migrateSuccess &&
                <TransactionSubmittedContent
                  chainId={chainId}
                  hash={migratetxHash}
                  onDismiss={() => {
                    setMigrateLoading(false);
                    setMigrateSuccess(false)
                  }}
                />
              }
            </Modal>
            <RowData onClick={() => toggleDetails(!showDetails)}>
              <ImageDiv>
                <img src={`/images/tokens/${token0Symbol.toLowerCase()}.png`} alt={token0Symbol} width="20px" />
                <img src={`/images/tokens/${token1Symbol.toLowerCase()}.png`} alt={token1Symbol} width="20px" />
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
                      {balance}
                    </Text>
                  </InfoDiv>
                  <InfoDiv>
                    <Text color="#9d9fa8" fontSize="18px">
                      Your LP share:
                  </Text>
                    <Text fontSize="18px" bold>
                      {`${poolTokenPercentage.toFixed(2)}%`}
                    </Text>
                  </InfoDiv>
                </InfoContainer>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  {allowence && allowence !== 0 ? (
                    <Button
                      style={{
                        maxWidth: "300px",
                        width: "100%",
                        marginTop: "20px",
                      }}
                      scale="md"
                      onClick={onMigrateClicked}
                      isLoading={migrateLoading}
                      disabled={migrateLoading || parseFloat(balance) === 0}
                      endIcon={
                        migrateLoading && (
                          <AutoRenewIcon spin color="currentColor" />
                        )
                      }
                    >
                      {migrateLoading ? "Processing" : "Migrate Liquidity"}
                    </Button>
                  ) : (
                    <Button
                      onClick={onApprove}
                      style={{
                        marginTop: "20px",
                      }}
                      isLoading={approveLoading}
                      endIcon={
                        approveLoading && (
                          <AutoRenewIcon spin color="currentColor" />
                        )
                      }
                    >
                      {approveLoading ? "Processing" : "Approve"}
                    </Button>
                  )}
                  <Button
                    style={{
                      width: "150px",
                      marginTop: "20px",
                      marginLeft: '20px'
                    }}
                    scale="md"
                    variant="secondary"
                    onClick={onRemovepair}
                    isLoading={migrateLoading}
                  >
                    Remove Pair
                </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Text color="#9d9fa8" fontSize="18px">
            Getting Pair Details...
          </Text>
        )}
      </MigrationRow>
    )
  }
  return jsxForRow;
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
