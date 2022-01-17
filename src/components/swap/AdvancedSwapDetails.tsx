import React from "react";
import { Trade, TradeType } from "@cryption-network/polydex-sdk";
import { Text } from "yugen-uikit";
import { Field } from "../../state/swap/actions";
import { useUserSlippageTolerance } from "../../state/user/hooks";
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
} from "../../utils/prices";
import { AutoColumn } from "../Column";
import QuestionHelper from "../QuestionHelper";
import { RowFixed } from "../Row";
import FormattedPriceImpact from "./FormattedPriceImpact";
import { SectionBreak } from "./styleds";
import SwapRoute from "./SwapRoute";

function TradeSummary({
  trade,
  allowedSlippage,
}: {
  trade: Trade;
  allowedSlippage: number;
}) {
  const { priceImpactWithoutFee, realizedLPFee } =
    computeTradePriceBreakdown(trade);
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT;
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(
    trade,
    allowedSlippage
  );

  return (
    <div className="info-container">
      <div className="info-item">
        <Text fontSize="15px" color="#9d9fa8">
          {isExactIn ? "Minimum received" : "Maximum sold"}
          <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
        </Text>
        <Text fontSize="18px" color="#2082E9">
          {isExactIn
            ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${
                trade.outputAmount.currency.symbol
              }` ?? "-"
            : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${
                trade.inputAmount.currency.symbol
              }` ?? "-"}
        </Text>
      </div>
      <div className="info-item">
        <Text fontSize="15px" color="#9d9fa8">
          Price Impact
          <QuestionHelper text="The difference between the market price and estimated price due to trade size." />
        </Text>
        <Text fontSize="18px" color="#2082E9">
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </Text>
      </div>
      <div className="info-item">
        <Text fontSize="15px" color="#9d9fa8">
          Liquidity provider fee
          <QuestionHelper text="For each trade a 0.3% fee is paid. 0.25% goes to liquidity providers and 0.05% goes to reward the stakers." />
        </Text>
        <Text fontSize="18px" color="#2082E9">
          {realizedLPFee
            ? `${realizedLPFee.toSignificant(4)} ${
                trade.inputAmount.currency.symbol
              }`
            : "-"}
        </Text>
      </div>
    </div>
  );
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade;
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageTolerance();

  const showRoute = Boolean(trade && trade.route.path.length > 2);

  return (
    <AutoColumn gap="md">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <SectionBreak />
              <AutoColumn style={{ padding: "0 24px" }}>
                <RowFixed>
                  <Text fontSize="14px">Route</Text>
                  <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
                </RowFixed>
                <SwapRoute trade={trade} />
              </AutoColumn>
            </>
          )}
        </>
      )}
    </AutoColumn>
  );
}
