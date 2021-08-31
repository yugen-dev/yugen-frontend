import React, { useEffect } from "react";
import BigNumber from "bignumber.js";
import { fetchPrice, UseGetApiPrice } from "state/hooks";
import { getPoolApyMultiRewards } from "utils/apy";
import { getBalanceNumber } from "utils/formatBalance";

const useGetFarmsMultirewardsAPY = (pool) => {
  const [RewardTokenCoinGeckoPrice, setRewardTokenCoinGeckoPrice] =
    React.useState(new BigNumber(1));

  useEffect(() => {
    const pricefunc = async () => {
      if (pool.rewardTokenCoinGeckoid.length > 0) {
        const rewardTokenPriceCoinGeckoPrice = await fetchPrice(
          pool.rewardTokenCoinGeckoid
        );

        if (rewardTokenPriceCoinGeckoPrice) {
          setRewardTokenCoinGeckoPrice(rewardTokenPriceCoinGeckoPrice);
        }
      }
    };
    pricefunc();
  }, [pool]);

  const tokenInLpPrice = UseGetApiPrice(pool.tokenAdressInLp);

  let tokenInLpSeconPrice = UseGetApiPrice(pool.tokenAddressSecondInLp);

  tokenInLpSeconPrice =
    pool.tokenAddressSecondInLp === "0x34C1b299A74588D6Abdc1b85A53345A48428a521"
      ? RewardTokenCoinGeckoPrice.toNumber()
      : tokenInLpSeconPrice;

  let apy = 0;
  let apyString = "";
  const apyArray = [];

  pool.multiRewardTokenPerBlock.forEach(async (element, i) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    let tokenPrice = 100;

    tokenPrice =
      pool.coinGeckoIds[i] === "0x34C1b299A74588D6Abdc1b85A53345A48428a521" &&
      pool.multiReward[i] === "EASY"
        ? RewardTokenCoinGeckoPrice.toNumber()
        : UseGetApiPrice(pool.coinGeckoIds[i].toLowerCase());

    const rewardTokenPrice = tokenPrice
      ? new BigNumber(tokenPrice)
      : new BigNumber(1);

    const currentTokenApy = getPoolApyMultiRewards(
      new BigNumber(tokenInLpPrice)
        .times(pool.quoteTokeFirstAmount)
        .plus(
          new BigNumber(tokenInLpSeconPrice).times(
            new BigNumber(pool.quoteTokenSecondAmount)
          )
        )
        .toNumber(),
      rewardTokenPrice.toNumber(),
      getBalanceNumber(pool.totalStaked, pool.stakingTokenDecimals),
      parseFloat(element)
    );

    if (currentTokenApy && pool.multiRewardTokenPerBlock.length === i + 1) {
      apyString += `${currentTokenApy.toFixed(2)}% ${pool.multiReward[i]}\n`;
    } else if (currentTokenApy) {
      apyString += `${currentTokenApy.toFixed(2)}% ${pool.multiReward[i]} +\n`;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      apyString += `100% ${pool.multiReward[i]}\n`;
    }

    apy += currentTokenApy;
    apyArray.push(currentTokenApy);
  });

  return apy;
};

export default useGetFarmsMultirewardsAPY;
