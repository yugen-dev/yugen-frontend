import { ConnectorNames } from "cryption-uikit";
import { Web3Provider } from "@ethersproject/providers";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { TorusConnector } from "@web3-react/torus-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { NetworkConnector } from "./NetworkConnector";

const NETWORK_URL = process.env.REACT_APP_NETWORK_URL;

export const NETWORK_CHAIN_ID: number = parseInt(
  process.env.REACT_APP_CHAIN_ID ?? "80001" // network change
);

if (typeof NETWORK_URL === "undefined") {
  throw new Error(
    `REACT_APP_NETWORK_URL must be a defined environment variable`
  );
}

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL },
});

let networkLibrary: Web3Provider | undefined;
export function getNetworkLibrary(): Web3Provider {
  // eslint-disable-next-line no-return-assign
  return (networkLibrary =
    networkLibrary ?? new Web3Provider(network.provider as any));
}

export const injected = new InjectedConnector({
  supportedChainIds: [137, 80001],
});

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { [NETWORK_CHAIN_ID]: NETWORK_URL },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: 15000,
});

const googleConnect = new TorusConnector({
  chainId: NETWORK_CHAIN_ID,
  loginOptions: {
    verifier: "google",
  },
});
const facebookConnect = new TorusConnector({
  chainId: NETWORK_CHAIN_ID,
  loginOptions: {
    verifier: "facebook",
  },
});
const discordConnect = new TorusConnector({
  chainId: NETWORK_CHAIN_ID,
  loginOptions: {
    verifier: "discord",
  },
});

const twitterConnect = new TorusConnector({
  chainId: NETWORK_CHAIN_ID,
  loginOptions: {
    verifier: "torus-auth0-twitter",
  },
});

const redditConnect = new TorusConnector({
  chainId: NETWORK_CHAIN_ID,
  loginOptions: {
    verifier: "reddit",
  },
});

const emailConnect = new TorusConnector({
  chainId: NETWORK_CHAIN_ID,
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

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL,
  appName: "Uniswap",
  appLogoUrl:
    "https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg",
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
