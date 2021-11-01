/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useEffect } from "react";
import {
  Menu as UikitMenu,
  connectorLocalStorageKey,
  ConnectorNames,
} from "cryption-uikit";
import { useLocation } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useChainId } from "state/application/hooks";
import { useDispatch } from "react-redux";
import { allLanguages } from "config/localisation/languageCodes";
import { LanguageContext } from "contexts/Localisation/languageContext";
import useTheme from "hooks/useTheme";
import useAuth from "hooks/useAuth";
import { toggleMetaTranscationState } from "state/actions";
import { ETHERJS_PATHS } from "config";
import { usePriceCakeBusd, useProfile } from "state/hooks";
// import LogoIcon from "images/PolyDEX White Text (2).svg";
import config, { socials, networks, maticTestnetConfig } from "./config";

const Menu = (props) => {
  const { login, logout, loginEther, logoutEther } = useAuth();
  const location = useLocation();
  const cakePriceBusd = usePriceCakeBusd();

  let accountId = "";
  if (ETHERJS_PATHS.includes(`/${location.pathname.split("/")[1]}`)) {
    accountId = useWeb3React().account;
  } else {
    accountId = useWeb3React("web3").account;
  }
  useEffect(() => {
    if (accountId === null || accountId === undefined) {
      const connectorId = window.localStorage.getItem(
        connectorLocalStorageKey
      ) as ConnectorNames;

      // Disable eager connect for BSC Wallet. Currently the BSC Wallet extension does not inject BinanceChain
      // into the Window object in time causing it to throw an error
      // TODO: Figure out an elegant way to listen for when the BinanceChain object is ready
      if (connectorId && connectorId) {
        if (ETHERJS_PATHS.includes(`/${location.pathname?.split("/")[1]}`)) {
          loginEther(connectorId);
        } else {
          login(connectorId);
        }
      }
    }
  }, [accountId, location.pathname, login, loginEther]);
  const dispatch = useDispatch();
  const [checkedState, toggleChecked] = React.useState(false);
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext);
  const { isDark, toggleTheme } = useTheme();
  const { profile } = useProfile();
  const handleMetaToggle = (checked) => {
    toggleChecked(checked);
    dispatch(toggleMetaTranscationState(checked));
    const getTrxItme = {
      [accountId]: checked,
    };
    window.localStorage.setItem("metatransaction", JSON.stringify(getTrxItme));
  };
  useEffect(() => {
    let getTrxItme = window.localStorage.getItem("metatransaction");
    if (getTrxItme) {
      getTrxItme = JSON.parse(getTrxItme);
      if (
        getTrxItme[accountId] !== null ||
        getTrxItme[accountId] !== undefined
      ) {
        dispatch(toggleMetaTranscationState(getTrxItme[accountId]));
        toggleChecked(getTrxItme[accountId]);
      }
    }
  }, [accountId, dispatch]);
  const changeNetwork = async (networkData) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        // params: [{ chainId: '0x1' }],
        params: [
          { chainId: `0x${parseFloat(networkData.chainId).toString(16)}` },
        ],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${parseFloat(networkData.chainId).toString(16)}`,
                rpcUrl: networkData.rpcUrl /* ... */,
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  };
  const chainId = useChainId().toString();

  let menuConfig = config;
  if (chainId === "80001") menuConfig = maticTestnetConfig;

  const currentNetwork = networks.filter(
    (eachNetwork) => eachNetwork.chainId === chainId
  );
  return (
    <UikitMenu
      account={accountId}
      showGasslessTranscationTab={!!accountId}
      gaslessTranscationChecked={checkedState}
      gasslessTranscationLabel="Gasless Mode"
      gaslessTransactionTooltip={
        "This button will toggle PolyDEX's gasless feature for your wallet. Users with hardware wallets should keep this setting turned off."
      }
      toggleTranscationState={handleMetaToggle}
      login={
        ETHERJS_PATHS.includes(`/${location.pathname.split("/")[1]}`)
          ? loginEther
          : login
      }
      logout={
        ETHERJS_PATHS.includes(`/${location.pathname.split("/")[1]}`)
          ? logoutEther
          : logout
      }
      // logoIcon={LogoIcon}
      isDark={isDark}
      locationUrl={location && location.pathname ? location.pathname : "/"}
      toggleTheme={toggleTheme}
      currentLang={selectedLanguage && selectedLanguage.code}
      langs={allLanguages}
      setLang={setSelectedLanguage}
      cakePriceUsd={cakePriceBusd.toNumber()}
      logoSize="53px"
      links={menuConfig}
      socials={socials}
      currentNetwork={
        currentNetwork && currentNetwork.length > 0 ? currentNetwork[0] : {}
      }
      showNetworkSwitch={!!(window && window.ethereum)}
      activeChainId={chainId}
      changeNetwork={changeNetwork}
      networks={networks}
      profile={{
        username: profile?.username,
        image: profile?.nft
          ? `/images/nfts/${profile.nft?.images.sm}`
          : undefined,
        profileLink: "/profile",
        noProfileLink: "/profile",
        showPip: !profile?.username,
      }}
      {...props}
    />
  );
};

export default Menu;
