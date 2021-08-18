import {
  ChainId,
  JSBI,
  Percent,
  Token,
  WETH,
} from "@cryption-network/polydex-sdk";
import Web3 from "web3";
import tokenABI from "./abis/token.json";
import usdcABI from "./abis/usdc.json";

declare global {
  interface Window {
    web3: any;
    ethereum: any;
  }
}

const web3 = new Web3(window.ethereum);
export const ROUTER_ADDRESS = "0xBd13225f0a45BEad8510267B4D6a7c78146Be459";

export const META_TXN_DISABLED = false;

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};
export const DAI = new Token(
  ChainId.MAINNET,
  web3.utils.toChecksumAddress("0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"),
  18,
  "DAI",
  "DAI"
);

export const USDT = new Token(
  ChainId.MAINNET,
  web3.utils.toChecksumAddress("0xc2132d05d31c914a87c6611c10748aeb04b58e8f"),
  6,
  "USDT",
  "USDT"
);
export const USDC = new Token(
  ChainId.MAINNET,
  web3.utils.toChecksumAddress("0x2791bca1f2de4661ed88a30c99a7a9449aa84174"),
  18,
  "USDC",
  "USDC"
);
export const ETH = new Token(
  ChainId.MAINNET,
  web3.utils.toChecksumAddress("0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"),
  18,
  "ETH",
  "ETH"
);

export const CNT = new Token(
  ChainId.MAINNET,
  web3.utils.toChecksumAddress("0xD1e6354fb05bF72A8909266203dAb80947dcEccF"),
  18,
  "Cryption Network Token",
  "CNT"
);
export const BTC = new Token(
  ChainId.MAINNET,
  web3.utils.toChecksumAddress("0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6"),
  8,
  "WBTC",
  "WBTC"
);

export const ARTH = new Token(
  ChainId.MAINNET,
  web3.utils.toChecksumAddress("0xE52509181FEb30EB4979E29EC70D50FD5C44D590"),
  18,
  "ARTH",
  "ARTH"
)

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.MATICTESTNET]: [WETH[ChainId.MATICTESTNET]],
};

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [
    ...WETH_ONLY[ChainId.MAINNET],
    DAI,
    BTC,
    USDT,
    USDC,
    ETH,
    CNT,
    ARTH
  ],
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
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, BTC, USDT, CNT, USDC],
};

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDT, USDC, CNT],
};

export const PINNED_PAIRS: {
  readonly [chainId in ChainId]?: [Token, Token][];
} = {
  [ChainId.MAINNET]: [
    [
      new Token(
        ChainId.MAINNET,
        web3.utils.toChecksumAddress(
          "0xD1e6354fb05bF72A8909266203dAb80947dcEccF"
        ),
        18,
        "Cryption Network Token",
        "CNT"
      ),
      new Token(
        ChainId.MAINNET,
        "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
        18,
        "WMATIC",
        "Wrapped Matic"
      ),
    ],
    [CNT, USDC],
    [USDC, DAI],
  ],
};

export const PINNED_MIGRATION_PAIRS = {
  [ChainId.MAINNET]: {
    "0xc35DADB65012eC5796536bD9864eD8773aBc74C4": {
      "0x55FF76BFFC3Cdd9D5FdbBC2ece4528ECcE45047e": {
        pid: "1",
        isPool: false,
        contractAddress: null,
      },
      "0x2813d43463c374a680f235c428fb1d7f08de0b69": {
        pid: "12",
        isPool: false,
        contractAddress: null,
      },
      "0x6ff62bfb8c12109e8000935a6de54dad83a4f39f": {
        pid: "11",
        isPool: false,
        contractAddress: null,
      },
      "0xc2755915a85c6f6c1c0f3a86ac8c058f11caa9c9": {
        pid: "10",
        isPool: false,
        contractAddress: null,
      },
      "0xcd578f016888b57f1b1e3f887f392f0159e26747": {
        pid: "9",
        isPool: false,
        contractAddress: null,
      },
      "0x34965ba0ac2451a34a0471f04cca3f990b8dea27": {
        pid: "8",
        isPool: false,
        contractAddress: null,
      },
      "0x4b1f1e2435a9c96f7330faea190ef6a7c8d70001": {
        pid: "7",
        isPool: false,
        contractAddress: null,
      },
      "0xe62ec2e799305e0d367b0cc3ee2cda135bf89816": {
        pid: "6",
        isPool: false,
        contractAddress: null,
      },
      "0xd02b870c556480491c70aaf98c297fddd93f6f5c": {
        pid: "5",
        isPool: false,
        contractAddress: null,
      },
      "0xc4e595acdd7d12fec385e5da5d43160e8a0bac0e": {
        pid: "4",
        isPool: false,
        contractAddress: null,
      },
      "0xcd353f79d9fade311fc3119b841e1f456b54e858": {
        pid: "2",
        isPool: false,
        contractAddress: null,
      },
    },
    "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32": {
      "0x604229c960e5CACF2aaEAc8Be68Ac07BA9dF81c3": {
        pid: "1",
        isPool: false,
        contractAddress: null,
      },
      "0x90bc3e68ba8393a3bf2d79309365089975341a43": {
        pid: "12",
        isPool: false,
        contractAddress: null,
      },
      "0x4a35582a710e1f4b2030a3f826da20bfb6703c09": {
        pid: "11",
        isPool: false,
        contractAddress: null,
      },
      "0xf6422b997c7f54d1c6a6e103bcb1499eea0a7046": {
        pid: "10",
        isPool: false,
        contractAddress: null,
      },
      "0xf04adbf75cdfc5ed26eea4bbbb991db002036bdd": {
        pid: "9",
        isPool: false,
        contractAddress: null,
      },
      "0x853ee4b2a13f8a742d64c8f088be7ba2131f670d": {
        pid: "8",
        isPool: false,
        contractAddress: null,
      },
      "0x2cf7252e74036d1da831d11089d326296e64a728": {
        pid: "7",
        isPool: false,
        contractAddress: null,
      },
      "0xdc9232e2df177d7a12fdff6ecbab114e2231198d": {
        pid: "6",
        isPool: false,
        contractAddress: null,
      },
      "0xf6a637525402643b0654a54bead2cb9a83c8b498": {
        pid: "5",
        isPool: false,
        contractAddress: null,
      },
      "0xadbf1854e5883eb8aa7baf50705338739e558e5b": {
        pid: "4",
        isPool: false,
        contractAddress: null,
      },
      "0x6e7a5fafcec6bb1e78bae2a1f0b612012bf14827": {
        pid: "2",
        isPool: false,
        contractAddress: null,
      },
    },
    "0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B": {
      "0x7162c0acf32820920a741d8fa466b8e6d60d530d": {
        pid: "12",
        isPool: false,
        contractAddress: null,
      },
      "0xe69fe44b087eab9d0f1cbdcf63c1b266dcc556fe": {
        pid: "11",
        isPool: false,
        contractAddress: null,
      },
      "0x5d577d6cdc82d7b6cac7a101766b68f45bc3e34e": {
        pid: "10",
        isPool: false,
        contractAddress: null,
      },
      "0xb7bd6d48c9b1af7e126d0389c6970f157d974f33": {
        pid: "9",
        isPool: false,
        contractAddress: null,
      },
      "0x7d51bad48d253dae37cc82cad07f73849286deec": {
        pid: "8",
        isPool: false,
        contractAddress: null,
      },
      "0xbe40f7fff5a2235af9a8cb79a17373162efefa9c": {
        pid: "7",
        isPool: false,
        contractAddress: null,
      },
      "0x39eaa90a70e8fdc04e1f63db04e1c62c9ace0641": {
        pid: "6",
        isPool: false,
        contractAddress: null,
      },
      "0xc0ab47b79bc66f98e5c9ee5ff386a7150d3f4174": {
        pid: "5",
        isPool: false,
        contractAddress: null,
      },
      "0xc3379226aeef21464d05676305dad1261d6f3fac": {
        pid: "3",
        isPool: false,
        contractAddress: null,
      },
      "0x4f5df10b9991482bcd2db19dae1fd0e0184397c2": {
        pid: "2",
        isPool: false,
        contractAddress: null,
      },
    },
  },
  [ChainId.MATICTESTNET]: {
    "0x2A59Dcd63A4F7a23d4fF0d2542ab44870199dA17": {
      "0xa526cF2316549e808e2d607f084953c0E465524f": {
        pid: null,
        isPool: true,
        contractAddress: "0x718Fa9fA91f4bFF9B57f660D46B53ed39d300731",
      },
      "0x3793F13Aca9fdfd4F56EfB201d2ab8AF6B6DcCC5": {
        pid: "0",
        isPool: false,
        contractAddress: null,
      },
    },
  },
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
  "0xd1e6354fb05bf72a8909266203dab80947dceccf": { abi: tokenABI },
  "0xd6df932a45c0f255f85145f286ea0b292b21c90b": { abi: tokenABI },
  "0xc168e40227e4ebd8c1cae80f7a55a4f0e6d66c97": { abi: tokenABI },
  "0x34c1b299a74588d6abdc1b85a53345a48428a521": { abi: tokenABI },
  "0x9c78ee466d6cb57a4d01fd887d2b5dfb2d46288f": { abi: tokenABI },
  "0x104592a158490a9228070e0a8e5343b499e125d0": { abi: tokenABI },
  "0x67480287cb3715d1d9429b38772c71d6e94c16da": { abi: tokenABI },
  "0xd0252fb67606ed74d0cacd17b2eb38446e4466c9": { abi: tokenABI },
  "0x5B4CF2C120A9702225814E18543ee658c5f8631e": { abi: tokenABI },
  "0x24834bbec7e39ef42f4a75eaf8e5b6486d3f0e57": { abi: tokenABI },
  "0x692597b009d13c4049a947cab2239b7d6517875f": { abi: tokenABI },
  "0x0bd820ad2d7ab7305b5c9538ba824c9b9beb0561": { abi: tokenABI },
  "0x968f6f898a6df937fc1859b323ac2f14643e3fed": { abi: tokenABI },
  "0x9613282539b6d0e3cb1edc843a43da7768ac3838": { abi: tokenABI },
  "0x361a5a4993493ce00f61c32d4ecca5512b82ce90": { abi: tokenABI },
  "0x76d383e8c97b2e01ef6d24108f655c9727df4a54": { abi: tokenABI },
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
