import BigNumber from "bignumber.js";
import { fetchPrice } from "state/hooks";
import { getPoolApy } from "utils/apy";
import { getBalanceNumber } from "utils/formatBalance";

const calculatePoolsFunc = async (pool, prices, cntPrice) => {
  if (prices) {
    let rewardTokenCoinGeckoPrice = new BigNumber(1);
    const getPriceFromCoinGecko = async () => {
      if (pool.rewardTokenCoinGeckoid.length > 0) {
        if (pool.rewardTokenCoinGeckoid === "CNT")
          rewardTokenCoinGeckoPrice = cntPrice;
        else
          rewardTokenCoinGeckoPrice = await fetchPrice(
            pool.rewardTokenCoinGeckoid
          );
      }
    };
    await getPriceFromCoinGecko();

    let tempStakingTokenPrice;
    if (pool.tokenName === "LUSDT") tempStakingTokenPrice = 0.08;
    if (pool.tokenName === "LARTH") tempStakingTokenPrice = 0.25;

    if (prices[`${pool.stakingTokenAddress}`.toLowerCase()]) {
      tempStakingTokenPrice =
        prices[`${pool.stakingTokenAddress}`.toLowerCase()];
    }

    let apy = 0;

    pool.multiRewardTokenPerBlock.forEach(async (element, i) => {
      let tokenPrice;
      const stakingTokenPrice = new BigNumber(tempStakingTokenPrice);

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
  return 0;
};

export default calculatePoolsFunc;
