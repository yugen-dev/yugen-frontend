/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDown } from "react-feather";
import { CurrencyAmount, JSBI, Token, Trade } from "@pancakeswap-libs/sdk";
import {
  ArrowDownIcon,
  Button,
  IconButton,
  Text,
  Card,
  Flex,
} from "cryption-uikit";
import styled from "styled-components";
import AddressInputPanel from "components/AddressInputPanel";
import { GreyCard } from "components/Card";
import ConfirmSwapModal from "components/swap/ConfirmSwapModal";
import CurrencyInputPanel from "components/CurrencyInputPanel";
import CardNav from "components/CardNav";
import { AutoRow, RowBetween } from "components/Row";
import AdvancedSwapDetailsDropdown from "components/swap/AdvancedSwapDetailsDropdown";
import confirmPriceImpactWithoutFee from "components/swap/confirmPriceImpactWithoutFee";
import {
  ArrowWrapper,
  BottomGrouping,
  SwapCallbackError,
} from "components/swap/styleds";
import TradePrice from "components/swap/TradePrice";
import TokenWarningModal from "components/TokenWarningModal";
// import SyrupWarningModal from "components/SyrupWarningModal";
import ProgressSteps from "components/ProgressSteps";

import { INITIAL_ALLOWED_SLIPPAGE } from "constants/index";
import { useActiveWeb3React } from "hooks";
import { useCurrency } from "hooks/Tokens";
import {
  ApprovalState,
  useApproveCallbackFromTrade,
} from "hooks/useApproveCallback";
import { useSwapCallback } from "hooks/useSwapCallback";
import useWrapCallback, { WrapType } from "hooks/useWrapCallback";
import { Field } from "state/swap/actions";
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from "state/swap/hooks";
import {
  useExpertModeManager,
  useUserDeadline,
  useUserSlippageTolerance,
} from "state/user/hooks";
import { LinkStyledButton } from "components/Shared";
import { maxAmountSpend } from "utils/maxAmountSpend";
import { computeTradePriceBreakdown, warningSeverity } from "utils/prices";
import Loader from "components/Loader";
import useI18n from "hooks/useI18n";
import PageHeader from "components/PageHeader";
import ConnectWalletButton from "components/ConnectWalletButton";
import "./index.css";

const ContainerCard = styled(Card)`
  border-radius: 0.625rem !important;
  max-width: 700px;
  width: 100%;
  padding: 30px;
  background-color: #1e202a;
  display: flex;
  margin-top: 70px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const TrenasferContainer = styled.div`
  border-radius: 0.625rem !important;
  padding: 20px 15px;
  background-color: #353547;
  margin: 20px;
  width: 100%;
`;
const InfoContainer = styled.div`
  width: 100%;
  max-width: 400px;
`;
const ArrowContainer = styled.div``;

const Swap = () => {
  const loadedUrlParams = useDefaultsFromURLSearch();
  const TranslateString = useI18n();

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];
  const [dismissTokenWarning, setDismissTokenWarning] =
    useState<boolean>(false);
  // const [isSyrup, setIsSyrup] = useState<boolean>(false);
  // const [syrupTransactionType, setSyrupTransactionType] = useState<string>("");
  const urlLoadedTokens: Token[] = useMemo(
    () =>
      [loadedInputCurrency, loadedOutputCurrency]?.filter(
        (c): c is Token => c instanceof Token
      ) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  );
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  // const handleConfirmSyrupWarning = useCallback(() => {
  //   setIsSyrup(false);
  //   setSyrupTransactionType("");
  // }, []);

  const { account } = useActiveWeb3React();
  const [isExpertMode] = useExpertModeManager();
  // get custom setting values for user
  const [deadline] = useUserDeadline();
  const [allowedSlippage] = useUserSlippageTolerance();

  // swap state
  const { independentField, typedValue, recipient } = useSwapState();
  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo();
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  );
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const trade = showWrap ? undefined : v2Trade;

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]:
          independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]:
          independentField === Field.OUTPUT
            ? parsedAmount
            : trade?.outputAmount,
      };

  const {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  } = useSwapActionHandlers();
  const isValid = !swapInputError;
  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput]
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput]
  );

  // modal and loading
  const [
    { showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash },
    setSwapState,
  ] = useState<{
    showConfirm: boolean;
    tradeToConfirm: Trade | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ""
      : parsedAmounts[dependentField]?.toSignificant(6) ?? "",
  };

  const route = trade?.route;
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] &&
      currencies[Field.OUTPUT] &&
      parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0))
  );
  const noRoute = !route;

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(
    trade,
    allowedSlippage
  );
  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approval, approvalSubmitted]);
  const [requestedApproval, setRequestedApproval] = useState(false);

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true);
      const txHashh = await approveCallback();
      // user rejected tx or didn't go thru
      // @ts-ignore
      if (!txHashh) {
        setApprovalSubmitted(false);

        setRequestedApproval(false);
      }
      setRequestedApproval(false);
    } catch (e) {
      setApprovalSubmitted(false);
      setRequestedApproval(false);
      console.error(e);
    }
  }, [approveCallback, setRequestedApproval]);

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(
    currencyBalances[Field.INPUT]
  );
  const atMaxAmountInput = Boolean(
    maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput)
  );

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    trade,
    allowedSlippage,
    deadline,
    recipient
  );

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  const handleSwap = useCallback(() => {
    if (
      priceImpactWithoutFee &&
      !confirmPriceImpactWithoutFee(priceImpactWithoutFee)
    ) {
      return;
    }
    if (!swapCallback) {
      return;
    }
    setSwapState((prevState) => ({
      ...prevState,
      attemptingTxn: true,
      swapErrorMessage: undefined,
      txHash: undefined,
    }));
    swapCallback()
      .then((hash) => {
        onUserInput(Field.INPUT, "");
        onUserInput(Field.OUTPUT, "");
        setSwapState((prevState) => ({
          ...prevState,
          attemptingTxn: false,
          swapErrorMessage: undefined,
          txHash: hash,
        }));
      })
      .catch((error) => {
        setSwapState((prevState) => ({
          ...prevState,
          attemptingTxn: false,
          swapErrorMessage: error.message,
          txHash: undefined,
        }));
      });
  }, [priceImpactWithoutFee, swapCallback, setSwapState, onUserInput]);

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false);

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode);

  const handleConfirmDismiss = useCallback(() => {
    onUserInput(Field.INPUT, "");
    onUserInput(Field.OUTPUT, "");
    setSwapState((prevState) => ({ ...prevState, showConfirm: false }));

    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, "");
    }
  }, [onUserInput, txHash, setSwapState]);

  const handleAcceptChanges = useCallback(() => {
    setSwapState((prevState) => ({ ...prevState, tradeToConfirm: trade }));
  }, [trade]);

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection, setApprovalSubmitted]
  );

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact());
    }
  }, [maxAmountInput, onUserInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency) => {
      onCurrencySelection(Field.OUTPUT, outputCurrency);
    },
    [onCurrencySelection]
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
        <TokenWarningModal
          isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
          tokens={urlLoadedTokens}
          onConfirm={handleConfirmTokenWarning}
        />
        <ConfirmSwapModal
          isOpen={showConfirm}
          trade={trade}
          originalTrade={tradeToConfirm}
          onAcceptChanges={handleAcceptChanges}
          attemptingTxn={attemptingTxn}
          txHash={txHash}
          recipient={recipient}
          allowedSlippage={allowedSlippage}
          onConfirm={handleSwap}
          swapErrorMessage={swapErrorMessage}
          onDismiss={handleConfirmDismiss}
        />
        <CardNav />
        <PageHeader
          title={TranslateString(8, "Exchange")}
          description={TranslateString(1192, "Trade tokens in an instant")}
        />
        <TrenasferContainer>
          <CurrencyInputPanel
            label={
              independentField === Field.OUTPUT && !showWrap && trade
                ? TranslateString(194, "From (estimated)")
                : TranslateString(76, "From")
            }
            value={formattedAmounts[Field.INPUT]}
            showMaxButton={!atMaxAmountInput}
            currency={currencies[Field.INPUT]}
            onUserInput={handleTypeInput}
            onMax={handleMaxInput}
            onCurrencySelect={handleInputSelect}
            otherCurrency={currencies[Field.OUTPUT]}
            id="swap-currency-input"
          />
        </TrenasferContainer>
        <ArrowContainer>
          <ArrowWrapper clickable>
            <IconButton
              variant="tertiary"
              onClick={() => {
                setApprovalSubmitted(false); // reset 2 step UI for approvals
                onSwitchTokens();
              }}
              style={{
                borderRadius: "50%",
                background: "#353547",
                height: "50px",
                width: "50px",
              }}
              scale="sm"
            >
              <ArrowDownIcon color="#2082E9" width="24px" />
            </IconButton>
          </ArrowWrapper>
          {recipient === null && !showWrap && isExpertMode ? (
            <LinkStyledButton
              id="add-recipient-button"
              onClick={() => onChangeRecipient("")}
            >
              + Add a send (optional)
            </LinkStyledButton>
          ) : null}
        </ArrowContainer>
        <TrenasferContainer>
          <CurrencyInputPanel
            value={formattedAmounts[Field.OUTPUT]}
            onUserInput={handleTypeOutput}
            label={
              independentField === Field.INPUT && !showWrap && trade
                ? TranslateString(196, "To (estimated)")
                : TranslateString(80, "To")
            }
            showMaxButton={false}
            currency={currencies[Field.OUTPUT]}
            onCurrencySelect={handleOutputSelect}
            otherCurrency={currencies[Field.INPUT]}
            id="swap-currency-output"
          />
        </TrenasferContainer>
        {recipient !== null && !showWrap ? (
          <>
            <AutoRow justify="space-between" style={{ padding: "0 1rem" }}>
              <ArrowWrapper clickable={false}>
                <ArrowDown size="16" color="#2082E9" />
              </ArrowWrapper>
              <LinkStyledButton
                id="remove-recipient-button"
                onClick={() => onChangeRecipient(null)}
              >
                - Remove send
              </LinkStyledButton>
            </AutoRow>
            <AddressInputPanel
              id="recipient"
              value="dw"
              onChange={onChangeRecipient}
            />
          </>
        ) : null}

        {showWrap ? null : (
          <InfoContainer>
            {Boolean(trade) && (
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="15px" color="#9d9fa8">
                  {TranslateString(1182, "Price")}
                </Text>
                <TradePrice
                  price={trade?.executionPrice}
                  showInverted={showInverted}
                  setShowInverted={setShowInverted}
                />
              </Flex>
            )}
            {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="15px" color="#9d9fa8">
                  {TranslateString(88, "Slippage Tolerance")}
                </Text>
                <Text fontSize="18px" color="white">
                  {allowedSlippage / 100}%
                </Text>
              </Flex>
            )}
          </InfoContainer>
        )}
        <BottomGrouping>
          {!account ? (
            <ConnectWalletButton width="100%" />
          ) : showWrap ? (
            <Button
              disabled={Boolean(wrapInputError)}
              onClick={onWrap}
              style={{ maxWidth: "400px", width: "100%" }}
            >
              {wrapInputError ??
                (wrapType === WrapType.WRAP
                  ? "Wrap"
                  : wrapType === WrapType.UNWRAP
                  ? "Unwrap"
                  : null)}
            </Button>
          ) : noRoute && userHasSpecifiedInputOutput ? (
            <GreyCard style={{ textAlign: "center" }}>
              <Text mb="4px">
                {TranslateString(
                  1194,
                  "Insufficient liquidity for this trade."
                )}
              </Text>
            </GreyCard>
          ) : showApproveFlow ? (
            <RowBetween>
              <Button
                onClick={handleApprove}
                disabled={requestedApproval}
                style={{ width: "48%" }}
                // variant={requestedApproval ? "success" : "primary"}
              >
                {approval === ApprovalState.PENDING ? (
                  <AutoRow gap="6px" justify="center">
                    Approving <Loader stroke="white" />
                  </AutoRow>
                ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                  "Approved"
                ) : (
                  `Approve ${currencies[Field.INPUT]?.symbol}`
                )}
              </Button>
              <Button
                onClick={() => {
                  if (isExpertMode) {
                    handleSwap();
                  } else {
                    setSwapState({
                      tradeToConfirm: trade,
                      attemptingTxn: false,
                      swapErrorMessage: undefined,
                      showConfirm: true,
                      txHash: undefined,
                    });
                  }
                }}
                style={{ width: "48%", color: "white" }}
                id="swap-button"
                disabled={
                  !isValid ||
                  approval !== ApprovalState.APPROVED ||
                  (priceImpactSeverity > 3 && !isExpertMode)
                }
                variant={
                  isValid && priceImpactSeverity > 2 ? "danger" : "primary"
                }
              >
                {priceImpactSeverity > 3 && !isExpertMode
                  ? `Price Impact High`
                  : `Swap${priceImpactSeverity > 2 ? " Anyway" : ""}`}
              </Button>
            </RowBetween>
          ) : (
            <Button
              onClick={() => {
                if (isExpertMode) {
                  handleSwap();
                } else {
                  setSwapState({
                    tradeToConfirm: trade,
                    attemptingTxn: false,
                    swapErrorMessage: undefined,
                    showConfirm: true,
                    txHash: undefined,
                  });
                }
              }}
              id="swap-button"
              disabled={
                !isValid ||
                (priceImpactSeverity > 3 && !isExpertMode) ||
                !!swapCallbackError
              }
              variant={
                isValid && priceImpactSeverity > 2 && !swapCallbackError
                  ? "danger"
                  : "primary"
              }
              style={{ maxWidth: "400px", width: "100%", color: "white" }}
            >
              {swapInputError ||
                (priceImpactSeverity > 3 && !isExpertMode
                  ? `Price Impact Too High`
                  : `Swap${priceImpactSeverity > 2 ? " Anyway" : ""}`)}
            </Button>
          )}
          {showApproveFlow && (
            <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
          )}
          {isExpertMode && swapErrorMessage ? (
            <SwapCallbackError error={swapErrorMessage} />
          ) : null}
        </BottomGrouping>
        <AdvancedSwapDetailsDropdown trade={trade} />
      </ContainerCard>
    </div>
  );
};

export default Swap;
