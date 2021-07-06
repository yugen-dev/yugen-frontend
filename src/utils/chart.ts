import { getUnixTime, startOfDay, subMonths, subWeeks } from "date-fns";

const locales = ["en-US"];

export const currencyFormatter = new Intl.NumberFormat(locales, {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export function oneMonth() {
  return getUnixTime(startOfDay(subMonths(Date.now(), 1)));
}

export function oneWeek() {
  return getUnixTime(startOfDay(subWeeks(Date.now(), 1)));
}
