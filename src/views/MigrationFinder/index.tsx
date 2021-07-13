/* eslint-disable no-nested-ternary */
import { Currency, ETHER } from "@pancakeswap-libs/sdk";
import React, { useCallback, useState } from "react";
import styled from "styled-components";
import {
  Button,
  ChevronDownIcon,
  AddIcon,
  CardBody,
  Text,
  Card,
} from "cryption-uikit";
import { LightCard } from "components/Card";
import { AutoColumn, ColumnCenter } from "components/Column";
import CurrencyLogo from "components/CurrencyLogo";
import {
  useFactoryContract,
} from "hooks/useContract";
import { FindPoolTabs } from "components/NavigationTabs";
import { MinimalPositionCard } from "components/MigratiolnImport";
import CurrencySearchModal from "components/SearchModal/CurrencySearchModal";
import { useActiveWeb3React } from "hooks";
import { useMigrationpairAdder } from "state/user/hooks";
import Select, { OptionProps } from "components/Select/Select";
import useI18n from "hooks/useI18n";
import migrate from "config/constants/migrate";
import FactoryAbi from "config/abi/FactoryAbi.json";
import { Dots } from "../Pool/styleds";

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

export default function PoolFinder() {
  const { account, chainId } = useActiveWeb3React();
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [pairAddresses, setPairAddresses] = useState(null);
  const [factoryAddress, setFactoryAddress] = useState(migrate[0].value);
  const [isValidPair, setValidPair] = useState(false);
  const [pairLoading, setPairLoading] = useState(false);
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1);

  const [currency0, setCurrency0] = useState<Currency | null>(ETHER);
  const [currency1, setCurrency1] = useState<Currency | null>(null);

  const addPair = useMigrationpairAdder()
  const TranslateString = useI18n();
  const factoryContract = useFactoryContract(factoryAddress, FactoryAbi, true);
  const getPairAddress = async (token1, token2) => {
    setPairLoading(true);
    if (token1 && token2 && !token1.equals(token2) && factoryContract) {
      const pairAddress = await factoryContract.getPair(
        token1.address,
        token2.address
      );
      addPair(chainId, factoryAddress, pairAddress );
      setPairAddresses(pairAddress);
      setValidPair(true);
      setPairLoading(false);
    } else {
      setValidPair(false);
      setPairLoading(false);
    }
  };
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

  const handleSortOptionChange = (option: OptionProps): void => {
    setFactoryAddress(option.value);

  };

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
        <CardBody style={{ width: '100%' }}>
          <div>
            <Text textAlign="center">Select Exchange Platform</Text>
            <Select
              options={migrate}
              onChange={handleSortOptionChange}
            />
          </div>
          <Text textAlign="center" mb="10px">Select Pair Tokens</Text>
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
  width: 100%;
  max-width: 500px;
  padding: 30px;
  background-color: #1e202a;
  display: flex;
  margin-top: 70px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
