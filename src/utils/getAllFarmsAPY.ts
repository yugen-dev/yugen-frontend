import BigNumber from "bignumber.js";
import { fetchPrice } from "state/hooks";
import { getPoolApyMultiRewards } from "utils/apy";
import { getBalanceNumber } from "utils/formatBalance";

const calculateFunc = async (pool, prices) => {
  if (prices) {
    let rewardTokenCoinGeckoPrice = new BigNumber(1);
    const pricefunc = async () => {
      if (
        pool.rewardTokenCoinGeckoid &&
        pool.rewardTokenCoinGeckoid.length > 0
      ) {
        rewardTokenCoinGeckoPrice = await fetchPrice(
          pool.rewardTokenCoinGeckoid
        );
      }
    };
    await pricefunc();

    if (
      prices[`${pool.tokenAdressInLp}`.toLowerCase()] &&
      prices[`${pool.tokenAddressSecondInLp}`.toLowerCase()]
    ) {
      const tokenInLpSeconPrice =
        pool.tokenAddressSecondInLp ===
        "0x34C1b299A74588D6Abdc1b85A53345A48428a521"
          ? rewardTokenCoinGeckoPrice.toNumber()
          : prices[`${pool.tokenAddressSecondInLp}`.toLowerCase()];
      const tokenInLpPrice =
        pool.tokenAdressInLp === "0x34C1b299A74588D6Abdc1b85A53345A48428a521"
          ? rewardTokenCoinGeckoPrice.toNumber()
          : prices[`${pool.tokenAdressInLp}`.toLowerCase()];

      let apy = 0;
      pool.multiRewardTokenPerBlock.forEach(async (element, i) => {
        let tokenPrice = 100;

        tokenPrice =
          pool.coinGeckoIds[i] ===
            "0x34C1b299A74588D6Abdc1b85A53345A48428a521" &&
          pool.multiReward[i] === "EASY"
            ? rewardTokenCoinGeckoPrice.toNumber()
            : prices[pool.coinGeckoIds[i].toLowerCase()];

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

        apy += currentTokenApy;
      });
      return apy;
    }
  }
  return 0;
};

export default calculateFunc;
