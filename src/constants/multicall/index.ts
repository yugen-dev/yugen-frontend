import { ChainId } from "@pancakeswap-libs/sdk";
import MULTICALL_ABI from "./abi.json";

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: "0x95028E5B8a734bb7E2071F96De89BABe75be9C8E",

  [ChainId.MATICTESTNET]: "0xCd4057582ebB4C7502Fdad46C525B47E1db80eBF",
};

export { MULTICALL_ABI, MULTICALL_NETWORKS };
