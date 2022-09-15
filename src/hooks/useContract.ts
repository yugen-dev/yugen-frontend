/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable default-case */

import { useMemo } from "react";
import Web3 from "web3";
import { Contract } from "@ethersproject/contracts";
import { ChainId } from "@cryption-network/polydex-sdk";
import { abi as IUniswapV2PairABI } from "@uniswap/v2-core/build/IUniswapV2Pair.json";
import useWeb3 from "hooks/useWeb3";
import { getBiconomyWeb3 } from "utils/biconomyweb3";
import {
  getERC20Contract,
  getCakeContract,
  getBunnyFactoryContract,
  getBunnySpecialContract,
  getPancakeRabbitContract,
  getProfileContract,
  getIfoContract,
  getLotteryContract,
  getLotteryTicketContract,
  getMasterchefContract,
  getPointCenterIfoContract,
  getSouschefContract,
  getYgnStakerContract,
  getClaimRefundContract,
  getSingleSidedLiquidityContract,
  getHybridStakingContract,
  getUnivesalOneSidedContract,
  getL2IntermediatorContract,
  getVaultContract,
  getFygnContract,
  getFygnBurnerContract,
  getFarmWrapper,
  getCxEthWethFarmWrapper,
  getProxyContract
} from "utils/contractHelpers";
import { useChainId } from "state/application/hooks";
import yugenMigrator from "config/abi/yugenMigrator.json";
import ENS_ABI from "../constants/abis/ens-registrar.json";
import ENS_PUBLIC_RESOLVER_ABI from "../constants/abis/ens-public-resolver.json";
import { ERC20_BYTES32_ABI } from "../constants/abis/erc20";
import ERC20_ABI from "../constants/abis/erc20.json";
import WETH_ABI from "../constants/abis/weth.json";
import { MULTICALL_ABI, MULTICALL_NETWORKS } from "../constants/multicall";
import { getContract } from "../utils";
import { useActiveWeb3React } from "./index";
/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoContract = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getIfoContract(address, web3), [address, web3]);
};

export const useERC20 = (address: string) => {
  const web3 = useWeb3();
  return useMemo(() => getERC20Contract(address, web3), [address, web3]);
};

export const useCake = () => {
  const web3 = useWeb3();
  return useMemo(() => getCakeContract(web3), [web3]);
};

export const useFygn = () => {
  const web3 = useWeb3();
  return useMemo(() => getFygnContract(web3), [web3]);
};

export const useBunnyFactory = () => {
  const web3 = useWeb3();
  return useMemo(() => getBunnyFactoryContract(web3), [web3]);
};

export const usePancakeRabbits = () => {
  const web3 = useWeb3();
  return useMemo(() => getPancakeRabbitContract(web3), [web3]);
};

export const useProfile = () => {
  const web3 = useWeb3();
  return useMemo(() => getProfileContract(web3), [web3]);
};

export const useLottery = () => {
  const web3 = useWeb3();
  return useMemo(() => getLotteryContract(web3), [web3]);
};

export const useLotteryTicket = () => {
  const web3 = useWeb3();
  return useMemo(() => getLotteryTicketContract(web3), [web3]);
};

export const useMasterchef = () => {
  const web3 = useWeb3();
  return useMemo(() => getMasterchefContract(web3), [web3]);
};

export const useProxy = () => {
  const web3 = useWeb3();
  return useMemo(() => getProxyContract(web3), [web3]); // change
};


export const useFarmWrapper = () => {
  const web3 = useWeb3();
  return useMemo(() => getFarmWrapper(web3), [web3]);
};

export const useCxEthWethFarmWrapper = () => {
  const web3 = useWeb3();
  return useMemo(() => getCxEthWethFarmWrapper(web3), [web3]);
};

export const useVaultchef = (vaultAddress) => {
  const web3 = useWeb3();
  return useMemo(() => getVaultContract(vaultAddress, web3), [web3]);
};

export const useHybridStaking = () => {
  const web3 = useWeb3();
  return useMemo(() => getHybridStakingContract(web3), [web3]);
};

export const useSingleSidedLiquidity = () => {
  const web3 = useWeb3();
  return useMemo(() => getSingleSidedLiquidityContract(web3), [web3]);
};

export const useMasterchefGasless = () => {
  const web3 = getBiconomyWeb3();
  return useMemo(() => getMasterchefContract(web3), [web3]);
};

export const useSousChef = (id) => {
  const web3 = useWeb3();
  return useMemo(() => getSouschefContract(id, web3), [id, web3]);
};

export const useSousChefGasless = (id) => {
  const web3 = getBiconomyWeb3();
  return useMemo(() => getSouschefContract(id, web3), [id, web3]);
};

export const useYgnStaker = () => {
  const web3 = useWeb3();
  return useMemo(() => getYgnStakerContract(web3), [web3]);
};

export const useFygnBurner = () => {
  const web3 = useWeb3();
  return useMemo(() => getFygnBurnerContract(web3), [web3]);
};

export const useYgnStakerGasless = () => {
  const web3 = getBiconomyWeb3();
  return useMemo(() => getYgnStakerContract(web3), [web3]);
};

export const useFygnBurnerGasless = () => {
  const web3 = getBiconomyWeb3();
  return useMemo(() => getFygnBurnerContract(web3), [web3]);
};

export const usePointCenterIfoContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getPointCenterIfoContract(web3), [web3]);
};

export const useBunnySpecialContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getBunnySpecialContract(web3), [web3]);
};

export const useClaimRefundContract = () => {
  const web3 = useWeb3();
  return useMemo(() => getClaimRefundContract(web3), [web3]);
};
function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } catch (error) {
      console.error("Failed to get contract", error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useWETHContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  const wethAddress = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
  return useContract(
    chainId ? wethAddress : undefined,
    WETH_ABI,
    withSignerIfPossible
  );
}

export function useENSRegistrarContract(
  withSignerIfPossible?: boolean
): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.MATICTESTNET:
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible);
}

export function useENSResolverContract(
  address: string | undefined,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function usePairContract(
  pairAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible);
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId && MULTICALL_NETWORKS[chainId],
    MULTICALL_ABI,
    false
  );
}
export const useYugenMigratorContract = (address: string) => {
  return useContract(address, yugenMigrator, true);
};
export const useFactoryContract = (
  factoryAddress,
  ABI,
  withSignerIfPossible
) => {
  return useContract(factoryAddress, ABI, withSignerIfPossible);
};

export const useUniversalOneSidedFarm = () => {
  const web3 = useWeb3();
  return useMemo(() => getUnivesalOneSidedContract(web3), [web3]);
};
export const useL2Intermediator = () => {
  // const web3 = useWeb3();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  let nodeRpc = process.env.REACT_APP_WEBSOCKET_MAIN_NODE_MATIC;
  let chainId = useChainId() || "137";
  if (window && window.ethereum) {
    chainId = window.ethereum.networkVersion;
  } else if (localStorage && localStorage.getItem("chainId")) {
    chainId = localStorage.getItem("chainId");
  }
  if (chainId === "80001" || chainId === "5") {
    nodeRpc = process.env.REACT_APP_WEBSOCKET_TEST_NODE_MATIC;
  }
  const web3 = new Web3(nodeRpc);
  return useMemo(() => getL2IntermediatorContract(web3), [web3]);
};
