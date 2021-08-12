import BigNumber from "bignumber.js/bignumber";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export const CAKE_PER_BLOCK = new BigNumber(0.75);
export const BLOCKS_PER_YEAR = new BigNumber(15768000);
export const BSC_BLOCK_TIME = 2.1;
export const CAKE_POOL_PID = 0;
export const BASE_URL = "https://pancakeswap.finance";
export const BASE_EXCHANGE_URL = "https://exchange.pancakeswap.finance";
export const BASE_ADD_LIQUIDITY_URL = `${BASE_EXCHANGE_URL}/#/add`;
export const BASE_LIQUIDITY_POOL_URL = `${BASE_EXCHANGE_URL}/#/pool`;
export const LOTTERY_MAX_NUMBER_OF_TICKETS = 50;
export const LOTTERY_TICKET_PRICE = 1;
export const ETHERJS_PATHS = [
  "/swap",
  "/find",
  "/pool",
  "/add",
  "/migrate",
  "/migrate/find",
];
export const CNTinUSDLink =
  "https://api.coingecko.com/api/v3/simple/price?ids=cryption-network&vs_currencies=USD";
export const CNT_CIRCULATING_SUPPLY_LINK =
  "https://api.cryption.network/circulating-supply";
export const CNT_TOTAL_SUPPLY_LINK =
  "https://api.cryption.network/total-supply";

// Lottery
export const WinnerLotteryAddress =
  "0x653441299ec28E0301d640006E2ceC4776ebA671";
export const LoserLotteryAddress = "0xC598adCEBfB0E3503149142A663f65B5ac2482f1";
export const LotteryUSDC = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
export const LotteryLUSD = "0xb032512A23Ef041bEc2e48e9b3f07286408B2B26";
