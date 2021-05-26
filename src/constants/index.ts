import { ChainId, JSBI, Percent, Token, WETH } from "@pancakeswap-libs/sdk";

import tokenABI from "./abis/token.json";
import usdcABI from "./abis/usdc.json";

export const ROUTER_ADDRESS = "0x3fd7a9b75154471a7A7c24103BcBb54485eEA345";

export const biconomyAPIKey = "b8dPfq5r9.4828e19b-d67b-454b-823d-da8c44e83da4";
export const META_TXN_DISABLED = false;

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

export const DAI = new Token(
  ChainId.MAINNET,
  "0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3",
  18,
  "DAI",
  "Dai Stablecoin"
);
export const BUSD = new Token(
  ChainId.MAINNET,
  "0xe9e7cea3dedca5984780bafc599bd69add087d56",
  18,
  "BUSD",
  "Binance USD"
);
export const USDT = new Token(
  ChainId.MAINNET,
  "0x55d398326f99059ff775485246999027b3197955",
  18,
  "USDT",
  "Tether USD"
);
export const UST = new Token(
  ChainId.MAINNET,
  "0x23396cf899ca06c4472205fc903bdb4de249d6fc",
  18,
  "UST",
  "Wrapped UST Token"
);
export const ETH = new Token(
  ChainId.MAINNET,
  "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
  18,
  "ETH",
  "Binance-Peg Ethereum Token"
);

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.MATICTESTNET]: [WETH[ChainId.MATICTESTNET]],
};

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, BUSD, USDT, UST, ETH],
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: {
  [chainId in ChainId]?: { [tokenAddress: string]: Token[] };
} = {
  [ChainId.MAINNET]: {},
};

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, BUSD, USDT],
};

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, BUSD, USDT],
};

export const PINNED_PAIRS: {
  readonly [chainId in ChainId]?: [Token, Token][];
} = {
  [ChainId.MAINNET]: [
    [
      new Token(
        ChainId.MAINNET,
        "0xca88C11D7cc8f080a4A96e99E1f02628FAB572D8",
        18,
        "CNT",
        "Cryption Network Token"
      ),
      new Token(
        ChainId.MAINNET,
        "0x608b868Cc04cb70447eCAE7C12A847A4b8cB6Ec8",
        18,
        "WMATIC",
        "Wrapped Matic"
      ),
    ],
    [BUSD, USDT],
    [DAI, USDT],
  ],
};

export const META_TXN_SUPPORTED_TOKENS: any = {
  "0xc2132d05d31c914a87c6611c10748aeb04b58e8f": { abi: tokenABI },
  "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619": { abi: tokenABI },
  "0x2791bca1f2de4661ed88a30c99a7a9449aa84174": { abi: usdcABI },
  "0x8505b9d2254a7ae468c0e9dd10ccea3a837aef5c": { abi: tokenABI },
  "0x313d009888329c9d1cf4f75ca3f32566335bd604": { abi: tokenABI },
  "0xda537104d6a5edd53c6fbba9a898708e465260b6": { abi: tokenABI },
  "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063": { abi: tokenABI },
  "0xdab529f40e671a1d4bf91361c21bf9f0c9712ab7": { abi: tokenABI },
  "0xa1c57f48f0deb89f569dfbe6e2b7f46d33606fd4": { abi: tokenABI },
  "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6": { abi: tokenABI },
  "0x71b821aa52a49f32eed535fca6eb5aa130085978": { abi: tokenABI },
  "0x578360adf0bbb2f10ec9cec7ef89ef495511ed5f": { abi: tokenABI },
  "0x556f501cf8a43216df5bc9cc57eb04d4ffaa9e6d": { abi: tokenABI },
  "0xeab9cfb094db203e6035c2e7268a86debed5bd14": { abi: tokenABI },
  "0xb33eaad8d922b1083446dc23f610c2567fb5180f": { abi: tokenABI },
  "0x5a2fdf906ada9353ebe496fa5d351b39f8908d19": { abi: tokenABI },
  "0xe6fc6c7cb6d2c31b359a49a33ef08ab87f4de7ce": { abi: tokenABI },
  "0x16eccfdbb4ee1a85a33f3a9b21175cd7ae753db4": { abi: tokenABI },
  "0x03247a4368a280bec8133300cd930a3a61d604f6": { abi: tokenABI },
  "0x840195888db4d6a99ed9f73fcd3b225bb3cb1a79": { abi: tokenABI },
  "0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39": { abi: tokenABI },
  "0x385eeac5cb85a38a9a07a70c73e0a3271cfb54a7": { abi: tokenABI },
  "0x462d8d82c2b2d2ddabf7f8a93928de09d47a5807": { abi: tokenABI },
  "0x72d6066f486bd0052eefb9114b66ae40e0a6031a": { abi: tokenABI },
  "0xc3ec80343d2bae2f8e680fdadde7c17e71e114ea": { abi: tokenABI },
  "0xc91c06db0f7bffba61e2a5645cc15686f0a8c828": { abi: tokenABI },
  "0x4fdce518fe527439fe76883e6b51a1c522b61b7c": { abi: tokenABI },
  "0xa3ed22eee92a3872709823a6970069e12a4540eb": { abi: tokenABI },
  "0xbe5cf150e1ff59ca7f2499eaa13bfc40aae70e78": { abi: tokenABI },
  "0xf6f85b3f9fd581c2ee717c404f7684486f057f95": { abi: tokenABI },
  "0x40ccd55b789fdee8d434915dc2aa6bd938506a92": { abi: tokenABI },
  "0xa79e0bfc579c709819f4a0e95d4597f03093b011": { abi: tokenABI },
  "0xcda600560dbfb638d1acd860e0a33d57874931e9": { abi: tokenABI },
  "0xba6fc2c28844c129c4e5b9116095881fe4f5584c": { abi: tokenABI },
  "0x6ca0ad12bb5191823cb0b44199db6341b971976b": { abi: tokenABI },
  "0xf2def4fd74149231a45d6d5ddc4e5b38f7584e26": { abi: tokenABI },
};

export const NetworkContextName = "NETWORK";

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 80;
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20;

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(
  JSBI.BigInt(100),
  BIPS_BASE
); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(
  JSBI.BigInt(300),
  BIPS_BASE
); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(
  JSBI.BigInt(500),
  BIPS_BASE
); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(
  JSBI.BigInt(1000),
  BIPS_BASE
); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(
  JSBI.BigInt(1500),
  BIPS_BASE
); // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(
  JSBI.BigInt(10),
  JSBI.BigInt(16)
); // .01 ETH
