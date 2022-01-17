import { useCallback } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { ConnectorNames } from "yugen-uikit";
import { useToast } from "state/hooks";
import { connectorsByName } from "utils/web3React";
import { setupNetwork } from "utils/wallet";

const useAuth = () => {
  const { activate, deactivate } = useWeb3React("web3");
  const activateEther = useWeb3React().activate;
  const deactivateEther = useWeb3React().deactivate;
  const { toastError } = useToast();

  const login = useCallback((connectorID: ConnectorNames) => {
    const connector = connectorsByName[connectorID];
    if (connector) {
      activate(connector, async (error: Error) => {
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupNetwork();
          if (hasSetup) {
            activate(connector);
          }
        } else {
          toastError(error.name, error.message);
        }
      });
    } else {
      toastError("Can't find connector", "The connector config is wrong");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginEther = useCallback((connectorID: ConnectorNames) => {
    const connector = connectorsByName[connectorID];
    if (connector) {
      activateEther(connector, async (error: Error) => {
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupNetwork();
          if (hasSetup) {
            activateEther(connector);
          }
        } else {
          toastError(error.name, error.message);
        }
      });
    } else {
      toastError("Can't find connector", "The connector config is wrong");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    login,
    logout: deactivate,
    loginEther,
    logoutEther: deactivateEther,
  };
};

export default useAuth;
