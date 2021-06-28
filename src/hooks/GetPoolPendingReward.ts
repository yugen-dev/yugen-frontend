import poolsConfig from "config/constants/pools";
import { getAddress } from "utils/addressHelpers";
import sousChefABI from "config/abi/sousChef.json";
import multicall from "utils/multicall";
import BigNumber from "bignumber.js";

export const GetPoolPendingReward = async (poolid, account) => {
  try {
    const config = poolsConfig.find((pool) => pool.sousId === poolid);
    const calls = config.multiReward.map((p, id) => ({
      address: getAddress(config.contractAddress),
      name: "pendingReward",
      params: [account, id],
    }));
    const res = await multicall(sousChefABI, calls);

    const pendingRewards = config.multiReward.reduce(
      (acc, pool, index) => ({
        ...acc,
        [index]: new BigNumber(res[index]).toJSON(),
      }),
      {}
    );

    return { ...pendingRewards };
  } catch (e) {
    return null;
  }
};

export default { GetPoolPendingReward };
