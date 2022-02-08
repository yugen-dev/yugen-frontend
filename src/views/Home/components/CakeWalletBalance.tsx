import React from "react";
import { useWeb3React } from "@web3-react/core";
import useTokenBalance from "hooks/useTokenBalance";
import useI18n from "hooks/useI18n";
import { getCakeAddress } from "utils/addressHelpers";
import { getBalanceNumber } from "utils/formatBalance";
import { usePriceCakeBusd } from "state/hooks";
import { BigNumber } from "bignumber.js";
import styled from "styled-components";
import CardValue from "./CardValue";
import CardBusdValue from "./CardBusdValue";

const Text = styled.div`
  color: #d04863;
  font-size: 20px;
  font-weight: 500;
  text-transform: uppercase;
`;

const Block = styled.div``;

const CakeWalletBalance = () => {
  const TranslateString = useI18n();
  const cakeBalance = useTokenBalance(getCakeAddress());
  const busdBalance = new BigNumber(getBalanceNumber(cakeBalance))
    .multipliedBy(usePriceCakeBusd())
    .toNumber();
  const { account } = useWeb3React("web3");

  if (!account) {
    return <Text>{TranslateString(298, "Locked")}</Text>;
  }

  return (
    <Block>
      <CardValue
        value={getBalanceNumber(cakeBalance)}
        decimals={4}
        color="#424945"
        lineHeight="1.5"
      />
      <CardBusdValue value={busdBalance} />
    </Block>
  );
};

export default CakeWalletBalance;
