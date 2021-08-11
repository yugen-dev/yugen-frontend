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
  "0x7A75050c800d15b78fAd0A9271a50eF12BFcAb89";
export const LoserLotteryAddress = "0x4E833b70b226781C65d9BA49d6d640Da02D93148";
export const LotteryUSDC = "0x671b68fb02778D37a885699dA79c13Faf0d3C560";
export const LotteryLUSD = "0x996D0eE46047CD169b8A6854E4F76D6E816653c8";
