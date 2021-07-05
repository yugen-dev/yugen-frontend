import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { TorusConnector } from "@web3-react/torus-connector";
import getNodeUrl from "./getRpcUrl";

const POLLING_INTERVAL = 12000;
const rpcUrl = getNodeUrl();
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10);

// eslint-disable-next-line func-names
export default function () {
  const injected = new InjectedConnector({ supportedChainIds: [chainId] });

  const walletConnectConnector = new WalletConnectConnector({
    rpc: { [chainId]: rpcUrl },
    bridge: "https://bridge.walletconnect.org",
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
  });

  const torusInitParams = {
    network: {
      host: process.env.REACT_APP_CHAIN_NAME,
      chainId,
    },
  };

  const torusGoogleConnector = new TorusConnector({
    chainId,
    initOptions: torusInitParams,
    loginOptions: {
      verifier: "google",
    },
  });
  const torusFacebookConnector = new TorusConnector({
    chainId,
    initOptions: torusInitParams,
    loginOptions: {
      verifier: "facebook",
    },
  });
  const torusDiscordConnector = new TorusConnector({
    chainId,
    initOptions: torusInitParams,
    loginOptions: {
      verifier: "discord",
    },
  });

  const torusTwitterConnector = new TorusConnector({
    chainId,
    initOptions: torusInitParams,
    loginOptions: {
      verifier: "torus-auth0-twitter",
    },
  });

  const torusRedditConnector = new TorusConnector({
    chainId,
    initOptions: torusInitParams,
    loginOptions: {
      verifier: "reddit",
    },
  });

  const torusEmailConnector = new TorusConnector({
    chainId,
    initOptions: {
      ...torusInitParams,
      ...{
        whiteLabel: {
          theme: {
            isDark: true,
            colors: {
              torusBrand1: "#2082e9",
            },
          },
        },
        enabledVerifiers: {
          google: false,
          facebook: false,
          discord: false,
          twitch: false,
          reddit: false,
          "torus-auth0-twitter": false,
        },
      },
    },
  });

  return {
    injected,
    walletConnectConnector,
    torusDiscordConnector,
    torusEmailConnector,
    torusFacebookConnector,
    torusGoogleConnector,
    torusRedditConnector,
    torusTwitterConnector,
  };
}
