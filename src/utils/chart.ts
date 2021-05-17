import { timeFormat } from "d3-time-format";
import { getUnixTime, startOfDay, subMonths, subWeeks } from "date-fns";

const locales = ["en-US"];

export const currencyFormatter = new Intl.NumberFormat(locales, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 4,
});

export function oneMonth() {
  return getUnixTime(startOfDay(subMonths(Date.now(), 1)));
}

export function oneWeek() {
  return getUnixTime(startOfDay(subWeeks(Date.now(), 1)));
}