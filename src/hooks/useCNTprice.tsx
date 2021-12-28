import { CNTinUSDLink } from "config";
import { useEffect, useState } from "react";

const useHarvest = () => {
  const [valueOfCNTinUSD, setValueOfCNTinUSD] = useState(0);

  const getCNTinUSD = async () => {
    try {
      const res = await fetch(CNTinUSDLink);
      const data = await res.json();
      // TODO: get price of YGN here
      const value = data["cryption-network"].usd;
      setValueOfCNTinUSD(() => value);
    } catch {
      // eslint-disable-next-line no-console
      console.error("Failed to get YGN price in USD");
    }
  };

  useEffect(() => {
    getCNTinUSD();
  });

  return { valueOfCNTinUSD };
};
export default useHarvest;
