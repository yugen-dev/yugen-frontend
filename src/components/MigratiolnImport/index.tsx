/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { Button, Card as ToolKitCard, Text } from "cryption-uikit";
import { darken } from "polished";
import useWeb3 from "hooks/useWeb3";
import { ChevronDown, ChevronUp } from "react-feather";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  usePairContract,
} from "hooks/useContract";

import { useActiveWeb3React } from "../../hooks";
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
  const web3 = useWeb3();
  const [token0Deposited, setToken0Deposited] = useState(null);
  const [token1Deposited, setToken1Deposited] = useState(null);
  const currency0 = showUnwrapped ? token0 : unwrappedToken(token0);
  const currency1 = showUnwrapped ? token1 : unwrappedToken(token1);
  const pairContract = usePairContract(pairAddress);
  const [showMore, setShowMore] = useState(false);
  // const PAIR_INTERFACE = new Interface(IUniswapV2PairABI);
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
  let poolTokenPercentage = '0.0';
  if (totalPoolTokens && userPoolBalance) {
    poolTokenPercentage = ((parseFloat(userPoolBalance) * 100) / parseFloat(totalPoolTokens)).toFixed(2).toString();
  }
  const getBalance = async () => {
    if (pairContract) {
      let getLiquidity = await pairContract.balanceOf(account);
      getLiquidity = web3.utils.fromWei(
        getLiquidity.toString(),
        "ether"
      );
      let getTotalSupply = await pairContract.totalSupply();
      getTotalSupply = web3.utils.fromWei(
        getTotalSupply.toString(),
        "ether"
      );
      const getReserves = await pairContract.getReserves();
      const weiReserve1 = web3.utils.fromWei(
        getReserves.reserve0.toString(),
        "ether"
      );
      const weiReserve2 = web3.utils.fromWei(
        getReserves.reserve1.toString(),
        "ether"
      );
      const token1Bal = (parseFloat(getLiquidity.toString()) / parseFloat(getTotalSupply.toString())) * parseFloat(weiReserve1.toString());
      const token2Bal = (parseFloat(getLiquidity.toString()) / parseFloat(getTotalSupply.toString())) * parseFloat(weiReserve2.toString());
      setToken0Deposited(token1Bal);
      setToken1Deposited(token2Bal);
      setUserPoolBalance(getLiquidity);
      setTotalPoolTokens(getTotalSupply);
    }
  };
  useEffect(() => {
    getBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, pairAddress]);

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
                <Text color="white" fontSize="18px" bold>
                  {currency0.symbol}/{currency1.symbol}
                </Text>
              </RowFixed>
              <RowFixed>
                <Text fontSize="18px" bold >
                  {userPoolBalance ? parseFloat(userPoolBalance).toFixed(2) : "-"}
                </Text>
              </RowFixed>
            </FixedHeightRow>
            <AutoColumn gap="4px">
              <FixedHeightRow>
                <Text color="#9d9fa8" fontSize="18px">
                  {currency0.symbol}:
                </Text>
                <RowFixed>
                  <Text ml="6px" fontSize="18px" bold >
                    {parseFloat(token0Deposited).toFixed(2)}
                  </Text>
                </RowFixed>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text color="#9d9fa8" fontSize="18px">
                  {currency1.symbol}:
                </Text>
                <RowFixed>
                  <Text ml="6px" fontSize="18px" bold>
                    {parseFloat(token1Deposited).toFixed(2)}
                  </Text>
                </RowFixed>
              </FixedHeightRow>
              <FixedHeightRow>
                <Text color="#9d9fa8" fontSize="18px">
                  Your Pool Share:
                </Text>
                <RowFixed>
                  <Text ml="6px" fontSize="18px" bold>
                  {poolTokenPercentage
                  ? `${poolTokenPercentage}%`
                  : "-"}
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
  // showUnwrapped = false,
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
  const poolTokenPercentage = 0.0;
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
                  ? `${poolTokenPercentage}%`
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
