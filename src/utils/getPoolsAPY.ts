import BigNumber from "bignumber.js";
import { fetchPrice } from "state/hooks";
import { getPoolApy } from "utils/apy";
import { getBalanceNumber } from "utils/formatBalance";

const calculatePoolsFunc = async (pool, prices, cntPrice) => {
  if (prices) {
    let rewardTokenCoinGeckoPrice = new BigNumber(1);
    const pricefunc = async () => {
      if (pool.rewardTokenCoinGeckoid.length > 0) {
        if (pool.rewardTokenCoinGeckoid === "CNT")
          rewardTokenCoinGeckoPrice = cntPrice;
        else
          rewardTokenCoinGeckoPrice = await fetchPrice(
            pool.rewardTokenCoinGeckoid
          );
      }
    };
    await pricefunc();
    if (prices[`${pool.stakingTokenAddress}`.toLowerCase()]) {
      let StakingTokenPrice =
        prices[`${pool.stakingTokenAddress}`.toLowerCase()];
      let apy = 0;

      StakingTokenPrice = pool.tokenName === "LUSDT" ? 0.08 : StakingTokenPrice;
      StakingTokenPrice = pool.tokenName === "LARTH" ? 0.25 : StakingTokenPrice;
      pool.multiRewardTokenPerBlock.forEach(async (element, i) => {
        const stakingTokenPrice = new BigNumber(StakingTokenPrice);
        let tokenPrice;

        if (pool.rewardTokenCoinGeckoid === "pear") {
          tokenPrice = rewardTokenCoinGeckoPrice;
        } else {
          tokenPrice = prices[`${pool.coinGeckoIds[i]}`.toLowerCase()];
        }

        const rewardTokenPrice = tokenPrice
          ? new BigNumber(tokenPrice)
          : new BigNumber(1);

        const currentTokenApy = getPoolApy(
          stakingTokenPrice.toNumber(),
          rewardTokenPrice.toNumber(),
          getBalanceNumber(pool.totalStaked, pool.tokenDecimals),
          parseFloat(element)
        );
        apy += currentTokenApy;
      });
      return apy;
    }
  }
  return 0;
};

export default calculatePoolsFunc;
