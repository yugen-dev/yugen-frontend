import React from "react";
import { Text } from "cryption-uikit";
import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import useI18n from "hooks/useI18n";
import useAllEarnings from "hooks/useAllEarnings";
import { usePriceCakeBusd } from "state/hooks";
import styled from "styled-components";
import CardValue from "./CardValue";
import CardBusdValue from "./CardBusdValue";

const CNText = styled.div`
  color: #d04863;
  font-size: 16px;
  font-weight: 500;
  text-transform: uppercase;
`;

const Block = styled.div``;

const CakeHarvestBalance = () => {
  const TranslateString = useI18n();
  const { account } = useWeb3React();
  const allEarnings = useAllEarnings();
  const earningsSum = allEarnings.reduce((accum, earning) => {
    return (
      accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
    );
  }, 0);
  const earningsBusd = new BigNumber(earningsSum)
    .multipliedBy(usePriceCakeBusd())
    .toNumber();

  if (!account) {
    return <CNText>{TranslateString(298, "Locked")}</CNText>;
  }

  return (
    <Block>
      <CardValue value={earningsSum} lineHeight="1.5" decimals={4} />
      <CardBusdValue value={earningsBusd} />
    </Block>
  );
};

export default CakeHarvestBalance;
