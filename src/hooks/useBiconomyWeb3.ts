import { useEffect, useState, useRef } from "react";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { getWeb3NoAccount } from "utils/web3";
import { Biconomy } from "@biconomy/mexa";

/**
 * Provides a web3 instance using the provider provided by useWallet
 * with a fallback of an httpProver
 * Recreate web3 instance only if the provider change
 */
const useBiconomyWeb3 = () => {
  const { library } = useWeb3React();
  const refEth = useRef(library);
  const [web3, setweb3] = useState(
    library ? new Web3(library) : getWeb3NoAccount()
  );

  useEffect(() => {
    if (library !== refEth.current) {
      const biconomy = new Biconomy((window as WindowChain).ethereum, {
        apiKey: "jTZ4rld-C.223a91ce-4426-4344-93d0-81a4a3f596fa",
      });
      const biconomyWeb3 = new Web3(biconomy);
      setweb3(biconomyWeb3);
    }
  }, [library]);

  return web3;
};

export default useBiconomyWeb3;
