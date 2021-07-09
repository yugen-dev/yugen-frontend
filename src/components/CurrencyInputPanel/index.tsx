/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
import React, { useState, useCallback } from "react";
import { Currency, Pair } from "@pancakeswap-libs/sdk";
import Grid from "@material-ui/core/Grid";
import { Button, ChevronDownIcon, Text, Flex } from "cryption-uikit";
import styled from "styled-components";
import useI18n from "hooks/useI18n";
import { useCurrencyBalance } from "../../state/wallet/hooks";
import CurrencySearchModal from "../SearchModal/CurrencySearchModal";
import CurrencyLogo from "../CurrencyLogo";
import DoubleCurrencyLogo from "../DoubleLogo";
import { Input as NumericalInput } from "../NumericalInput";
import { useActiveWeb3React } from "../../hooks";

const CustomInputPannel = styled.div`
  width: 100%;
  max-width: 400px;
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
const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 34px;
  font-size: 16px;
  font-weight: 500;
  background-color: transparent;
  color: ${({ selected, theme }) => (selected ? theme.colors.text : "#FFFFFF")};
  border-radius: 12px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
`;
const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const InputPanel = styled.div<{ hideInput?: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? "8px" : "20px")};
  z-index: 1;
`;
const Container = styled.div<{ hideInput: boolean }>`
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.inset};
`;
const CurrencyContainer = styled.div`
  display: flex;
  align-items: center;
`;
interface CurrencyInputPanelProps {
  value: string;
  onUserInput: (value: string) => void;
  onMax?: () => void;
  showMaxButton: boolean;
  label?: string;
  onCurrencySelect?: (currency: Currency) => void;
  currency?: Currency | null;
  disableCurrencySelect?: boolean;
  hideBalance?: boolean;
  pair?: Pair | null;
  hideInput?: boolean;
  otherCurrency?: Currency | null;
  id: string;
  showCommonBases?: boolean;
}
export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { account } = useActiveWeb3React();
  const selectedCurrencyBalance = useCurrencyBalance(
    account ?? undefined,
    currency ?? undefined
  );
  const TranslateString = useI18n();
  const translatedLabel = label || TranslateString(132, "Input");
  const handleDismissSearch = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={5} lg={5} xl={5}>
            <CurrencyContainer>
              <div style={{ marginRight: "10px" }}>
                {pair ? (
                  <DoubleCurrencyLogo
                    currency0={pair.token0}
                    currency1={pair.token1}
                    size={54}
                    margin
                  />
                ) : currency ? (
                  <CurrencyLogo currency={currency} size="54px" />
                ) : null}
              </div>
              <div>
                <Text color="#9d9fa8" fontSize="12px">
                  {`Swap ${translatedLabel}: `}
                </Text>
                <CurrencySelect
                  selected={!!currency}
                  className="open-currency-select-button"
                  onClick={() => {
                    if (!disableCurrencySelect) {
                      setModalOpen(true);
                    }
                  }}
                >
                  <Aligner>
                    {pair ? (
                      <Text color="white" fontSize="25px">
                        {pair?.token0.symbol}:{pair?.token1.symbol}
                      </Text>
                    ) : (
                      <Text
                        color="white"
                        fontSize="25px"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {(currency &&
                        currency.symbol &&
                        currency.symbol.length > 20
                          ? `${currency.symbol.slice(
                              0,
                              4
                            )}...${currency.symbol.slice(
                              currency.symbol.length - 5,
                              currency.symbol.length
                            )}`
                          : currency?.symbol) ||
                          TranslateString(1196, "Select a currency")}
                      </Text>
                    )}
                    {!disableCurrencySelect && <ChevronDownIcon />}
                  </Aligner>
                </CurrencySelect>
              </div>
            </CurrencyContainer>
          </Grid>
          <Grid
            item
            xs={12}
            md={7}
            lg={7}
            xl={7}
            style={{ display: "flex", justifyContent: "center" }}
          >
            {!hideInput && (
              <CustomInputPannel>
                <InputWrapper>
                  <NumericalInput
                    className="token-amount-input"
                    value={value}
                    onUserInput={(val) => {
                      onUserInput(val);
                    }}
                  />
                </InputWrapper>
                {account && currency && showMaxButton && label !== "To" && (
                  <Flex alignItems="center">
                    <Text
                      bold
                      color="#9d9fa8"
                      fontSize="15px"
                      mr="10px"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {!hideBalance && !!currency && selectedCurrencyBalance
                        ? `BALANCE: ${selectedCurrencyBalance?.toSignificant(
                            6
                          )}`
                        : " -"}
                    </Text>
                    <Button onClick={onMax} scale="sm">
                      MAX
                    </Button>
                  </Flex>
                )}
              </CustomInputPannel>
            )}
          </Grid>
        </Grid>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  );
}
