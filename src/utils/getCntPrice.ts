import { YgnInUSDLink } from "config";

const getYgnPrice = async () => {
  try {
    const res = await fetch(YgnInUSDLink);
    const data = await res.json();
    const value = data["cryption-network"].usd;
    return value;
  } catch {
    // eslint-disable-next-line no-console
    console.error("Failed to get YGN price in USD");
    return 0;
  }
};
export default getYgnPrice;
