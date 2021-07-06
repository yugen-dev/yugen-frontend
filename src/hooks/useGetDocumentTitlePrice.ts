import { useEffect } from "react";
import useCNTprice from "hooks/useCNTprice";

const useGetDocumentTitlePrice = () => {
  const { valueOfCNTinUSD } = useCNTprice();
  useEffect(() => {
    document.title = `PolyDex - $${Number(valueOfCNTinUSD).toLocaleString(
      undefined,
      {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      }
    )}`;
  });
};
export default useGetDocumentTitlePrice;
