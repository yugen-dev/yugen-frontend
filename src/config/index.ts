import BigNumber from "bignumber.js/bignumber";

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export const CAKE_PER_BLOCK = new BigNumber(1);
export const BLOCKS_PER_YEAR = new BigNumber(10512000);
export const BSC_BLOCK_TIME = 3;
export const CAKE_POOL_PID = 1;
export const BASE_URL = "https://pancakeswap.finance";
export const BASE_EXCHANGE_URL = "https://exchange.pancakeswap.finance";
export const BASE_ADD_LIQUIDITY_URL = `${BASE_EXCHANGE_URL}/#/add`;
export const BASE_LIQUIDITY_POOL_URL = `${BASE_EXCHANGE_URL}/#/pool`;
export const LOTTERY_MAX_NUMBER_OF_TICKETS = 50;
export const LOTTERY_TICKET_PRICE = 1;
export const CNTinUSDLink = "https://api.coingecko.com/api/v3/simple/price?ids=cryption-network&vs_currencies=USD";
export const CNT_CIRCULATING_SUPPLY_LINK = "http://ec2-3-142-124-163.us-east-2.compute.amazonaws.com:3000/circulating-supply"
