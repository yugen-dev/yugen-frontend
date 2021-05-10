import { useEffect } from "react";
import { usePriceCakeBusd } from "state/hooks";

const useGetDocumentTitlePrice = () => {
  const cakePriceUsd = usePriceCakeBusd();
  useEffect(() => {
    document.title = `SwapCafe - $${Number(cakePriceUsd).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }
    )}`;
  });
};
export default useGetDocumentTitlePrice;
