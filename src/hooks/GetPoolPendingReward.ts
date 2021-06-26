import { useSousChef } from "hooks/useContract";
import BigNumber from "bignumber.js";

export const GetPoolPendingReward = async (poolid, account, rewardPosition) => {
  const contract = useSousChef(poolid);

  const pendingreward = await contract.methods
    .pendingReward(account, rewardPosition)
    .call();

  return new BigNumber(pendingreward).div(new BigNumber(10).pow(18));
};

export default { GetPoolPendingReward };
