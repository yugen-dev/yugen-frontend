import BigNumber from "bignumber.js";
import { fetchPrice } from "state/hooks";
import { getPoolApy } from "utils/apy";
import { getBalanceNumber } from "utils/formatBalance";

const calculatePoolsFunc = async (pool, prices, ygnPrice) => {
  if (prices) {
    let tempStakingTokenPrice;
    if (pool.tokenName === "LUSD") tempStakingTokenPrice = 0.08;
    else if (pool.tokenName === "LARTH") tempStakingTokenPrice = 0.25;
    else {
      tempStakingTokenPrice =
        prices[`${pool.stakingTokenAddress}`.toLowerCase()];
    }

    let apy = 0;

    pool.multiRewardTokenPerBlock.forEach(async (element, i) => {
      let tempRewardTokenPrice;
      const stakingTokenPrice = new BigNumber(tempStakingTokenPrice);

      if (pool.rewardTokenCoinGeckoid === "PEAR") {
        tempRewardTokenPrice = await fetchPrice(pool.rewardTokenCoinGeckoid);
      } else if (pool.rewardTokenCoinGeckoid === "YGN") {
        tempRewardTokenPrice = ygnPrice;
      } else {
        tempRewardTokenPrice = prices[`${pool.coinGeckoIds[i]}`.toLowerCase()];
      }

      const rewardTokenPrice = tempRewardTokenPrice
        ? new BigNumber(tempRewardTokenPrice)
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
