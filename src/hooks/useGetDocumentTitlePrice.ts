import { useEffect } from "react";
import { usePriceCakeBusd } from "state/hooks";

const useGetDocumentTitlePrice = () => {
  const cakePriceUsd = usePriceCakeBusd();
  useEffect(() => {
    document.title = `Yugen - $${Number(cakePriceUsd.toNumber()).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }
    )}`;
  });
};
export default useGetDocumentTitlePrice;
