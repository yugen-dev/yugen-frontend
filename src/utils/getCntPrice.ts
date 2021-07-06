import { CNTinUSDLink } from "config";

const getCntPrice = async () => {
  try {
    const res = await fetch(CNTinUSDLink);
    const data = await res.json();
    const value = data["cryption-network"].usd;
    return value;
  } catch {
    // eslint-disable-next-line no-console
    console.error("Failed to get CNT price in USD");
    return 0;
  }
}
export default getCntPrice;