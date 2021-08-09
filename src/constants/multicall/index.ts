import { ChainId } from "@cryption-network/polydex-sdk";
import MULTICALL_ABI from "./abi.json";

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: "0x429876c4a6f89FB470E92456B8313879DF98B63c",

  [ChainId.MATICTESTNET]: "0xCd4057582ebB4C7502Fdad46C525B47E1db80eBF",
};

export { MULTICALL_ABI, MULTICALL_NETWORKS };
