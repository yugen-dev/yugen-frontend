/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
import { Percent } from "@cryption-network/polydex-sdk";
import React from "react";
import { ONE_BIPS } from "../../constants";
import { warningSeverity } from "../../utils/prices";
import { ErrorText } from "./styleds";

/**
 * Formatted version of price impact text with warning colors
 */
export default function FormattedPriceImpact({
  priceImpact,
}: {
  priceImpact?: Percent;
}) {
  return (
    <ErrorText fontSize="18px" severity={warningSeverity(priceImpact)}>
      {priceImpact
        ? priceImpact.lessThan(ONE_BIPS)
          ? "<0.01%"
          : `${priceImpact.toFixed(2)}%`
        : "-"}
    </ErrorText>
  );
}
