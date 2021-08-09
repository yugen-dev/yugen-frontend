import { useEffect } from "react";
import { usePriceCakeBusd } from "state/hooks";

const useGetDocumentTitlePrice = () => {
  const cakePriceUsd = usePriceCakeBusd();
  useEffect(() => {
    document.title = `PolyDex - $${Number(
      cakePriceUsd.toNumber()
    ).toLocaleString(undefined, {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    })}`;
  });
};
export default useGetDocumentTitlePrice;
