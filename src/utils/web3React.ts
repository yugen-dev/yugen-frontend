import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { TorusConnector } from "@web3-react/torus-connector";
import { ConnectorNames } from "cryption-uikit";
import Web3 from "web3";
import getNodeUrl from "./getRpcUrl";

const POLLING_INTERVAL = 12000;
const rpcUrl = getNodeUrl();
const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10);

const injected = new InjectedConnector({ supportedChainIds: [chainId] });

const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
});

const googleConnect = new TorusConnector({
  chainId,
  loginOptions: {
    verifier: "google",
  },
});
const facebookConnect = new TorusConnector({
  chainId,
  loginOptions: {
    verifier: "facebook",
  },
});
const discordConnect = new TorusConnector({
  chainId,
  loginOptions: {
    verifier: "discord",
  },
});

const twitterConnect = new TorusConnector({
  chainId,
  loginOptions: {
    verifier: "torus-auth0-twitter",
  },
});

const redditConnect = new TorusConnector({
  chainId,
  loginOptions: {
    verifier: "reddit",
  },
});

const emailConnect = new TorusConnector({
  chainId,
  initOptions: {
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
});

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.GoogleTorusConnector]: googleConnect,
  [ConnectorNames.FacebookTorusConnector]: facebookConnect,
  [ConnectorNames.TwitterTorusConnector]: twitterConnect,
  [ConnectorNames.RedditTorusConnector]: redditConnect,
  [ConnectorNames.DiscordTorusConnector]: discordConnect,
  [ConnectorNames.EmailTorusConnector]: emailConnect,
};

export const getLibrary = (provider): Web3 => {
  return provider;
};
