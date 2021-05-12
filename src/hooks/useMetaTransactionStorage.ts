import { useEffect, useState } from "react";

const useMetaTransactionStorage = () => {
  const [metaEnabled, setmetaEnabled] = useState(false);

  useEffect(() => {
    let isMetaTransactionEnabled = false;
    const metaTransactionCheck = window.localStorage.getItem("metatransaction");

    if (typeof metaTransactionCheck === null) {
      isMetaTransactionEnabled = false;
    } else if (metaTransactionCheck === "true") {
      isMetaTransactionEnabled = true;
    } else {
      isMetaTransactionEnabled = false;
    }
    setmetaEnabled(isMetaTransactionEnabled);
  }, [metaEnabled]);

  return metaEnabled;
};

export default useMetaTransactionStorage;
