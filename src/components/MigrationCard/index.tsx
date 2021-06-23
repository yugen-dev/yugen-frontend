import React, { useState, useEffect } from 'react'
import { ethers } from "ethers";
import { JSBI, Pair, Percent } from '@pancakeswap-libs/sdk'
import { AbiItem } from "web3-utils";
import styled from 'styled-components'
import { useWeb3React } from "@web3-react/core";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Text,
  Button,
  AutoRenewIcon
} from "cryption-uikit";
import { useTokenBalance } from 'state/wallet/hooks'
import { useTotalSupply } from 'data/TotalSupply'
import useWeb3 from "hooks/useWeb3";
import cakeAbi from "config/abi/cake.json";
import { getPolydexMigratorAddress } from 'utils/addressHelpers'
import { usePolydexMigratorContract } from "hooks/useContract";
import { useToast } from "state/hooks";
import { approve } from "utils/callHelpers";

interface ModalProps {
  pair: Pair
}

export default function MigrationCard({
  pair,
}: ModalProps) {
  const pairAddress = pair.liquidityToken.address;
  const token1Address = pair.token0.address;
  const token2Address = pair.token1.address
  const token1Symbol = pair.token0.symbol;
  const token2Symbol = pair.token1.symbol;
  const pairName = `${token1Symbol}/${token2Symbol}`;
  const exChangePlatForm = 'Exchange1';
  const [showDetails, toggleDetails] = useState(false);
  const { toastSuccess } = useToast();
  const [approveLoading, setApproveLoading] = useState(false);
  const [migrateLoading, setMigrateLoading] = useState(false);
  const [lpBal, setLpbal] = useState(0);
  const [balance, setBal] = useState();
  const [allowence, setallowence] = useState('');
  const web3 = useWeb3();
  const { account } = useWeb3React();
  const pairContract = new web3.eth.Contract(cakeAbi as unknown as AbiItem, pairAddress);
  const polydexMigrator = usePolydexMigratorContract();
  const polydexMigratorAddress = getPolydexMigratorAddress();

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken);
  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
      !!totalPoolTokens &&
      !!userPoolBalance &&
      // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
      JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
        pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
        pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
      ]
      : [undefined, undefined]

  const onMigrateClicked = async () => {
    setMigrateLoading(true);
    const now = new Date()
    const utcMilllisecondsSinceEpoch = now.getTime();
    const utcSecondsSinceEpoch = Math.round(utcMilllisecondsSinceEpoch / 1000) + 1200;
    try {
      const txHash = await polydexMigrator.methods.migrate(token1Address, token2Address, balance, 1, 1, utcSecondsSinceEpoch).send({ from: account })
      if (txHash) {
        toastSuccess("Success", "Lp Tokens Succfully Migrated");
        setMigrateLoading(false);
      }
    } catch (error) {
      setMigrateLoading(false);
      toastSuccess("Error", "Error occured while migrating");
    }
  }
  const onApprove = async () => {
    setApproveLoading(true);
    try {
      const txHash = await pairContract.methods.approve(polydexMigrator.options.address, ethers.constants.MaxUint256).send({ from: account });
      // const txHash = await approve(pairContract, polydexMigrator, account);
      if (txHash) {
        toastSuccess("Success", "Account successfully approved");
        setApproveLoading(false);
      }
    } catch (error) {
      setApproveLoading(false);
      console.log('error is', error);
    }
  };
  useEffect(() => {
    async function getBalance() {
      let lpBalance = await pairContract.methods.balanceOf(account).call();
      const checkAllowence = await pairContract.methods.allowance(account, polydexMigratorAddress).call();
      setBal(lpBalance);
      lpBalance = web3.utils.fromWei(lpBalance, 'ether');
      lpBalance = parseFloat(lpBalance).toFixed(3).toString();
      setallowence(checkAllowence);
      setLpbal(lpBalance);
    }
    if (account) getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3.eth.Contract])
  return (
    <MigrationRow>
      <RowData onClick={() => toggleDetails(!showDetails)} >
        <ImageDiv>
          <img src={`/images/${token1Symbol}.png`} alt="BNB" width="20px" />
          <img src={`/images/${token2Symbol}.png`} alt="BNB" width="20px" />
          <Text color="white" fontSize="15px" bold ml="10px">{pairName}</Text>
        </ImageDiv>
        {showDetails ? (
          <ImageDiv>
            <Text color="#2082E9" fontSize="13px" bold mr="7px" >{exChangePlatForm}</Text>
            <ChevronUpIcon color="white" width="24px" onClick={() => toggleDetails(!showDetails)} style={{ cursor: 'pointer' }} />
          </ImageDiv>
        ) : (
          <ImageDiv>
            <Text color="#2082E9" fontSize="13px" bold mr="7px">{exChangePlatForm}</Text>
            <ChevronDownIcon color="white" width="24px" onClick={() => toggleDetails(!showDetails)} style={{ cursor: 'pointer' }} />
          </ImageDiv>
        )}
      </RowData>
      {showDetails &&
        <div>
          <InfoContainer>
            <InfoDiv>
              <Text color="#9d9fa8" fontSize="18px">Pooled {token1Symbol}:</Text>
              <Text fontSize="18px" bold>{token0Deposited?.toSignificant(3)}</Text>
            </InfoDiv>
            <InfoDiv>
              <Text color="#9d9fa8" fontSize="18px">Pooled {token2Symbol}:</Text>
              <Text fontSize="18px" bold>{token1Deposited?.toSignificant(3)}</Text>
            </InfoDiv>
            <InfoDiv>
              <Text color="#9d9fa8" fontSize="18px">Your LP Balance:</Text>
              <Text fontSize="18px" bold>{lpBal}</Text>
            </InfoDiv>
            <InfoDiv>
              <Text color="#9d9fa8" fontSize="18px">Your LP share:</Text>
              <Text fontSize="18px" bold>{poolTokenPercentage ? `${poolTokenPercentage.toFixed(2)}%` : '-'}</Text>
            </InfoDiv>
          </InfoContainer>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {parseFloat(allowence) !== 0 ? (
              <Button
                style={{ maxWidth: "300px", width: "100%", marginTop: '20px' }}
                scale="md"
                onClick={onMigrateClicked}
                isLoading={migrateLoading}
                disabled={migrateLoading}
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
          </div>
        </div>
      }
    </MigrationRow>
  )
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
  border-top: 1px solid #2A2D39;
  border-bottom: 1px solid #2A2D39;
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