/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useMemo } from "react";
import { JSBI, Pair, Percent } from "@pancakeswap-libs/sdk";
import { Button, Card as ToolKitCard, Text } from "cryption-uikit";
import { darken } from "polished";
import { ChevronDown, ChevronUp } from "react-feather";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { abi as IUniswapV2PairABI } from "@uniswap/v2-core/build/IUniswapV2Pair.json";
import { Interface } from "@ethersproject/abi";
import { useMultipleContractSingleData } from "state/multicall/hooks";
import {
  usePolydexMigratorContract,
  usePairContract,
  useFactoryContract,
} from "hooks/useContract";
import { getBalanceNumber } from "utils/formatBalance";
import { getLibrary } from "utils/web3React";
import { useTotalSupply } from "../../data/TotalSupply";

import { useActiveWeb3React } from "../../hooks";
import { useTokenBalance } from "../../state/wallet/hooks";
import { currencyId } from "../../utils/currencyId";
import { unwrappedToken } from "../../utils/wrappedCurrency";
import Card from "../Card";
import { AutoColumn } from "../Column";
import CurrencyLogo from "../CurrencyLogo";
import DoubleCurrencyLogo from "../DoubleLogo";
import { RowBetween, RowFixed } from "../Row";
import { Dots } from "../swap/styleds";

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`;

export const HoverCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.invertedContrast};
  :hover {
    border: 1px solid
      ${({ theme }) => darken(0.06, theme.colors.invertedContrast)};
  }
`;
const UIKitCard = styled(ToolKitCard)`
  background: #353547;
  padding: 20px;
`;
interface PositionCardProps {
  token0: any;
  token1: any;
  // eslint-disable-next-line react/no-unused-prop-types
  showUnwrapped?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  pairAddress?: any;
}

export function MinimalPositionCard({
  token0,
  token1,
  showUnwrapped = false,
  pairAddress,
}: PositionCardProps) {
  const { account } = useActiveWeb3React();
  const [userPoolBalance, setUserPoolBalance] = useState(null);
  const [totalPoolTokens, setTotalPoolTokens] = useState(null);
  const [token0Deposited, setToken0Deposited] = useState(null);
  const [token1Deposited, setToken1Deposited] = useState(null);
  const currency0 = showUnwrapped ? token0 : unwrappedToken(token0);
  const currency1 = showUnwrapped ? token1 : unwrappedToken(token1);
  const pairContract = usePairContract(pairAddress);
  const [showMore, setShowMore] = useState(false);
  const PAIR_INTERFACE = new Interface(IUniswapV2PairABI);
  // const [token0Deposited, token1Deposited] =
  //   !!pair &&
  //     !!totalPoolTokens &&
  //     !!userPoolBalance &&
  //     // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
  //     JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
  //     ? [
  //       pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
  //       pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
  //     ]
  //     : [undefined, undefined]
  const getBalance = async () => {
    const getLiquidity = await pairContract.balanceOf(account);
    const getTotalSupply = await pairContract.totalSupply();
    const getReserves = await pairContract.getReserves();
    const token1Bal = (parseFloat(getLiquidity.toString()) / parseFloat(getTotalSupply.toString())) * parseFloat(getReserves.reserve0.toString());
    const token2Bal = (parseFloat(getLiquidity.toString()) / parseFloat(getTotalSupply.toString())) * parseFloat(getReserves.reserve1.toString());
    setToken0Deposited(token1Bal);
    setToken1Deposited(token2Bal);
    setUserPoolBalance(getLiquidity);
    setTotalPoolTokens(getTotalSupply);
  };
  useEffect(() => {
    getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, pairAddress]);

  // const results = useMultipleContractSingleData(
  //   [pairAddress],
  //   PAIR_INTERFACE,
  //   "getReserves"
  // );

  // useMemo(() => {
  //   // eslint-disable-next-line array-callback-return
  //   results.map((result, i) => {
  //     console.log({ result }, { i });
  //   });
  // }, [results]);
  console.log({ token0Deposited }, { token1Deposited });
  return (
    <>
      {userPoolBalance && (
        <UIKitCard>
          <AutoColumn gap="12px">
            <FixedHeightRow>
              <RowFixed>
                <Text
                  style={{ textTransform: "uppercase", fontWeight: 600 }}
                  fontSize="14px"
                  color="white"
                  textAlign="center"
                >
                  LP Tokens in your Wallet
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <FixedHeightRow onClick={() => setShowMore(!showMore)}>
              <RowFixed>
                <DoubleCurrencyLogo
                  currency0={currency0}
                  currency1={currency1}
                  margin
                  size={20}
                />
                <Text fontSize="14px" color="#9d9fa8">
                  {currency0.symbol}/{currency1.symbol}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontSize="18px" color="#2082E9">
                  {userPoolBalance ? userPoolBalance.toString() : "-"}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap="4px">
              <FixedHeightRow>
                <Text fontSize="14px" color="#9d9fa8">
                  {currency0.symbol}:
                </Text>
                <RowFixed>
                  <Text ml="6px" fontSize="18px" color="#2082E9">
                    {token0Deposited}
                  </Text>
                </RowFixed>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize="14px" color="#9d9fa8">
                  {currency1.symbol}:
                </Text>
                <RowFixed>
                  <Text ml="6px" fontSize="18px" color="#2082E9">
                    {token1Deposited}
                  </Text>
                </RowFixed>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text fontSize="14px" color="#9d9fa8">
                  Your Pool Share:
                </Text>
                <RowFixed>
                  <Text ml="6px" fontSize="18px" color="#2082E9">
                    {parseFloat(userPoolBalance.toString()) * 100 / parseFloat(totalPoolTokens.toString())}
                  </Text>
                </RowFixed>
              </FixedHeightRow>
            </AutoColumn>
          </AutoColumn>
        </UIKitCard>
      )}
    </>
  );
}

export default function FullPositionCard({
  token0,
  token1,
  showUnwrapped = false,
  pairAddress,
}: PositionCardProps) {
  const { account } = useActiveWeb3React();

  const currency0 = unwrappedToken(token0);
  const currency1 = unwrappedToken(token1);
  const [userPoolBalance, setUserPoolBalance] = useState(null);
  const [totalPoolTokens, setTotalPoolTokens] = useState(null);
  const pairContract = usePairContract(pairAddress);
  const [showMore, setShowMore] = useState(false);

  // const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  // const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  // const poolTokenPercentage =
  //   !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
  //     ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
  //     : undefined

  // const [token0Deposited, token1Deposited] =
  //   !!pair &&
  //     !!totalPoolTokens &&
  //     !!userPoolBalance &&
  //     // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
  //     JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
  //     ? [
  //       pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
  //       pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
  //     ]
  //     : [undefined, undefined]
  const token0Deposited = "0";
  const token1Deposited = "0";
  const poolTokenPercentage = 0.33;
  const getBalance = async () => {
    const getLiquidity = await pairContract.balanceOf(account);
    const getTotalSupply = await pairContract.totalSupply();
    setUserPoolBalance(getLiquidity);
    setTotalPoolTokens(getTotalSupply);
  };
  useEffect(() => {
    getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, pairAddress]);

  return (
    <HoverCard>
      <AutoColumn gap="12px">
        <FixedHeightRow
          onClick={() => setShowMore(!showMore)}
          style={{ cursor: "pointer" }}
        >
          <RowFixed>
            <DoubleCurrencyLogo
              currency0={currency0}
              currency1={currency1}
              margin
              size={20}
            />
            <Text>
              {!currency0 || !currency1 ? (
                <Dots>Loading</Dots>
              ) : (
                `${currency0.symbol}/${currency1.symbol}`
              )}
            </Text>
          </RowFixed>
          <RowFixed>
            {showMore ? (
              <ChevronUp size="20" style={{ marginLeft: "10px" }} />
            ) : (
              <ChevronDown size="20" style={{ marginLeft: "10px" }} />
            )}
          </RowFixed>
        </FixedHeightRow>
        {showMore && (
          <AutoColumn gap="8px">
            <FixedHeightRow>
              <RowFixed>
                <Text>Pooled {currency0.symbol}:</Text>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <Text ml="6px">{token0Deposited?.toString()}</Text>
                  <CurrencyLogo
                    size="20px"
                    style={{ marginLeft: "8px" }}
                    currency={currency0}
                  />
                </RowFixed>
              ) : (
                "-"
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <RowFixed>
                <Text>Pooled {currency1.symbol}:</Text>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <Text ml="6px">{token1Deposited?.toString()}</Text>
                  <CurrencyLogo
                    size="20px"
                    style={{ marginLeft: "8px" }}
                    currency={currency1}
                  />
                </RowFixed>
              ) : (
                "-"
              )}
            </FixedHeightRow>
            <FixedHeightRow>
              <Text>Your pool tokens:</Text>
              <Text>
                {userPoolBalance ? userPoolBalance.toSignificant(4) : "-"}
              </Text>
            </FixedHeightRow>
            <FixedHeightRow>
              <Text>Your pool share:</Text>
              <Text>
                {poolTokenPercentage
                  ? `${poolTokenPercentage.toFixed(2)}%`
                  : "-"}
              </Text>
            </FixedHeightRow>

            <RowBetween marginTop="10px">
              <Button
                as={Link}
                to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                style={{ width: "48%" }}
              >
                Add
              </Button>
              <Button
                as={Link}
                style={{ width: "48%" }}
                to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
              >
                Remove
              </Button>
            </RowBetween>
          </AutoColumn>
        )}
      </AutoColumn>
    </HoverCard>
  );
}
