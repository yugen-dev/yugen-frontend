import { useEffect } from "react";
import { connectorLocalStorageKey, ConnectorNames } from "yugen-uikit";
import { ETHERJS_PATHS } from "config";
// import { useLocation } from "react-router-dom";
import useAuth from "hooks/useAuth";

const useEagerConnect = () => {
  const { loginEther, login } = useAuth();
  const { location } = window;
  useEffect(() => {
    const connectorId = window.localStorage.getItem(
      connectorLocalStorageKey
    ) as ConnectorNames;

    // Disable eager connect for BSC Wallet. Currently the BSC Wallet extension does not inject BinanceChain
    // into the Window object in time causing it to throw an error
    // TODO: Figure out an elegant way to listen for when the BinanceChain object is ready
    if (connectorId && connectorId) {
      if (ETHERJS_PATHS.includes(`/${location?.pathname.split("/")[1]}`)) {
        loginEther(connectorId);
      } else {
        login(connectorId);
      }
    }
  }, [loginEther, login, location]);
};

export default useEagerConnect;
