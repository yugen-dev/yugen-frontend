import BigNumber from "bignumber.js/bignumber";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

// To-Do ask Ashwin if we need to get this dynamically
export const CAKE_PER_BLOCK = new BigNumber(1);
export const BLOCKS_PER_YEAR = new BigNumber(1);
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
export const SUPPORTED_NETWORK_IDS = [137, 80001, 1, 5];
export const CROSS_CHAIN_API_LINK =
  "https://ccf-backend.polydex.org/transcation";
