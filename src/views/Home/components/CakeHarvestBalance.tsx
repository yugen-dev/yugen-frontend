import React from "react";
import { useWeb3React } from "@web3-react/core";
import BigNumber from "bignumber.js";
import useAllEarnings from "hooks/useAllEarnings";
import { usePriceCakeBusd } from "state/hooks";
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

const CakeHarvestBalance = () => {
  const { account } = useWeb3React("web3");
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
    return <Text>Locked</Text>;
  }

  return (
    <Block>
      <CardValue
        value={earningsSum}
        lineHeight="1.5"
        decimals={4}
        color="#424945"
      />
      <CardBusdValue value={earningsBusd} />
    </Block>
  );
};

export default CakeHarvestBalance;
