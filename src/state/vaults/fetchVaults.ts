import BigNumber from "bignumber.js";
import erc20 from "config/abi/erc20.json";
import multicall from "utils/multicall";
import { getAddress } from "utils/addressHelpers";
import vaultsConfig from "config/constants/vaults";

const fetchVaults = async () => {
  const data = await Promise.all(
    vaultsConfig.map(async (vault) => {
      const lpAddress = getAddress(vault.lpTokenAddress);
      const calls = [
        // Balance of token in the LP contract
        {
          address: lpAddress,
          name: "totalSupply",
        },
      ];

      const [lpTotalSupply] = await multicall(erc20, calls);

      return {
        ...vault,
        lpTotalSupply: new BigNumber(lpTotalSupply),
      };
    })
  );
  return data;
};

export default fetchVaults;
