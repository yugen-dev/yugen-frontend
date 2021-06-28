/* eslint-disable no-nested-ternary */
import { Currency, ETHER, JSBI, TokenAmount } from "@pancakeswap-libs/sdk";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import {
  Button,
  ChevronDownIcon,
  AddIcon,
  CardBody,
  Text,
  Card,
} from "cryption-uikit";
import CardNav from "components/CardNav";
import { LightCard } from "components/Card";
import { AutoColumn, ColumnCenter } from "components/Column";
import CurrencyLogo from "components/CurrencyLogo";
import {
  usePolydexMigratorContract,
  useTokenContract,
  useFactoryContract,
} from "hooks/useContract";
import { FindPoolTabs } from "components/NavigationTabs";
import { MinimalPositionCard } from "components/MigratiolnImport";
import CurrencySearchModal from "components/SearchModal/CurrencySearchModal";
import { PairState, useMigrationPair } from "data/Reserves";
import { useActiveWeb3React } from "hooks";
import { usePairAdder } from "state/user/hooks";
import { useTokenBalances } from "state/wallet/hooks";
import { StyledInternalLink } from "components/Shared";
import { currencyId } from "utils/currencyId";
import useI18n from "hooks/useI18n";

import FactoryAbi from "config/abi/FactoryAbi.json";
import { wrappedCurrency } from "utils/wrappedCurrency";
import { Dots } from "../Pool/styleds";

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

export default function PoolFinder() {
  const { account, chainId } = useActiveWeb3React();
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [pairAddresses, setPairAddresses] = useState(null);
  const [isValidPair, setValidPair] = useState(false);
  const [pairLoading, setPairLoading] = useState(false);
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1);

  const [currency0, setCurrency0] = useState<Currency | null>(ETHER);
  const [currency1, setCurrency1] = useState<Currency | null>(null);

  // const addPair = usePairAdder()
  const factoryContract = useFactoryContract(
    "0x2A59Dcd63A4F7a23d4fF0d2542ab44870199dA17",
    FactoryAbi,
    true
  );
  const TranslateString = useI18n();

  const getPairAddress = async (token1, token2) => {
    setPairLoading(true);
    if (token1 && token2 && !token1.equals(token2)) {
      const pairAddress = await factoryContract.getPair(
        token1.address,
        token2.address
      );
      setPairAddresses(pairAddress);
      setValidPair(true);
      setPairLoading(false);
    } else {
      setValidPair(false);
      setPairLoading(false);
    }
  };
  // const [pairState, pair] = useMigrationPair(currency0 ?? undefined, currency1 ?? undefined, pairAddresses);
  // console.log({ pairState }, { pair });
  // useEffect(() => {
  //   if (pair) {
  //     addPair(pair)
  //   }
  // }, [pair, addPair])
  // const validPairNoLiquidity =
  //   pairState === PairState.NOT_EXISTS ||
  //   Boolean(
  //     pairState === PairState.EXISTS &&
  //     pair &&
  //     JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
  //     JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
  //   )

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency);
        getPairAddress(currency, currency1);
      } else {
        setCurrency1(currency);
        getPairAddress(currency0, currency);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeField]
  );

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false);
  }, [setShowSearch]);

  const prerequisiteMessage = (
    <LightCard padding="45px 10px">
      <Text style={{ textAlign: "center" }}>
        {!account
          ? TranslateString(1174, "Connect to a wallet to find pools")
          : TranslateString(208, "Select a token to find your liquidity.")}
      </Text>
    </LightCard>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ContainerCard>
        <FindPoolTabs />
        <CardBody>
          <AutoColumn gap="md">
            <Button
              onClick={() => {
                setShowSearch(true);
                setActiveField(Fields.TOKEN0);
              }}
              startIcon={
                currency0 ? (
                  <CurrencyLogo
                    currency={currency0}
                    style={{ marginRight: ".5rem" }}
                  />
                ) : null
              }
              endIcon={<ChevronDownIcon width="24px" color="white" />}
              width="100%"
            >
              {currency0
                ? currency0.symbol
                : TranslateString(82, "Select a Token")}
            </Button>

            <ColumnCenter>
              <AddIcon color="textSubtle" />
            </ColumnCenter>

            <Button
              onClick={() => {
                setShowSearch(true);
                setActiveField(Fields.TOKEN1);
              }}
              startIcon={
                currency1 ? (
                  <CurrencyLogo
                    currency={currency1}
                    style={{ marginRight: ".5rem" }}
                  />
                ) : null
              }
              endIcon={<ChevronDownIcon width="24px" color="white" />}
              width="100%"
            >
              {currency1
                ? currency1.symbol
                : TranslateString(82, "Select a Token")}
            </Button>

            {isValidPair && pairAddresses && (
              <ColumnCenter
                style={{
                  justifyItems: "center",
                  backgroundColor: "",
                  padding: "12px 0px",
                  borderRadius: "12px",
                }}
              >
                <Text style={{ textAlign: "center" }}>
                  {TranslateString(210, "Pool found!")}
                </Text>
              </ColumnCenter>
            )}

            {currency0 && currency1 ? (
              isValidPair ? (
                isValidPair &&
                pairAddresses && (
                  <MinimalPositionCard
                    pairAddress={pairAddresses}
                    token0={currency0}
                    token1={currency1}
                  />
                )
              ) : !isValidPair ? (
                <LightCard padding="45px 10px">
                  <AutoColumn gap="sm" justify="center">
                    <Text style={{ textAlign: "center" }}>
                      {TranslateString(136, "Invalid pair.")}
                    </Text>
                  </AutoColumn>
                </LightCard>
              ) : pairLoading ? (
                <LightCard padding="45px 10px">
                  <AutoColumn gap="sm" justify="center">
                    <Text style={{ textAlign: "center" }}>
                      Loading
                      <Dots />
                    </Text>
                  </AutoColumn>
                </LightCard>
              ) : null
            ) : (
              prerequisiteMessage
            )}
          </AutoColumn>

          <CurrencySearchModal
            isOpen={showSearch}
            onCurrencySelect={handleCurrencySelect}
            onDismiss={handleSearchDismiss}
            showCommonBases
            selectedCurrency={
              (activeField === Fields.TOKEN0 ? currency1 : currency0) ??
              undefined
            }
          />
        </CardBody>
      </ContainerCard>
    </div>
  );
}
const ContainerCard = styled(Card)`
  border-radius: 0.625rem !important;
  padding: 30px;
  background-color: #1e202a;
  display: flex;
  margin-top: 70px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
