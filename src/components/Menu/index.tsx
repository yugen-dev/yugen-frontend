/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useEffect } from "react";
import {
  Menu as UikitMenu,
  connectorLocalStorageKey,
  ConnectorNames,
} from "cryption-uikit";
import { useLocation } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useDispatch } from "react-redux";
import { allLanguages } from "config/localisation/languageCodes";
import { LanguageContext } from "contexts/Localisation/languageContext";
import useTheme from "hooks/useTheme";
import useAuth from "hooks/useAuth";
import { toggleMetaTranscationState } from "state/actions";
import { usePriceCakeBusd, useProfile } from "state/hooks";
import LogoIcon from "images/PolyDEX White Text (2).svg";
import config from "./config";

const Menu = (props) => {
  const { login, logout, loginEther, logoutEther } = useAuth();
  const location = useLocation();

  let accountId = "";
  if (["/swap", "/find", "/pool", "/add"].includes(location.pathname)) {
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
      if (connectorId && connectorId !== ConnectorNames.BSC) {
        if (["/swap", "/find", "/pool", "/add"].includes(location.pathname)) {
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
  const cakePriceUsd = usePriceCakeBusd();

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
  return (
    <UikitMenu
      account={accountId}
      showGasslessTranscationTab={!!accountId}
      gaslessTranscationChecked={checkedState}
      gasslessTranscationLabel="Meta Trandaction"
      toggleTranscationState={handleMetaToggle}
      login={
        ["/swap", "/find", "/pool", "/add"].includes(location.pathname)
          ? loginEther
          : login
      }
      logout={
        ["/swap", "/find", "/pool", "/add"].includes(location.pathname)
          ? logoutEther
          : logout
      }
      logoIcon={LogoIcon}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={selectedLanguage && selectedLanguage.code}
      langs={allLanguages}
      setLang={setSelectedLanguage}
      cakePriceUsd={cakePriceUsd.toNumber()}
      links={config}
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
