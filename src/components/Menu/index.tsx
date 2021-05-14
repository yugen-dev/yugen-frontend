import React, { useContext } from "react";
import { Menu as UikitMenu } from "cryption-uikit";
import { useWeb3React } from "@web3-react/core";
import { allLanguages } from "config/localisation/languageCodes";
import { LanguageContext } from "contexts/Localisation/languageContext";
import useTheme from "hooks/useTheme";
import useAuth from "hooks/useAuth";
import { usePriceCakeBusd, useProfile } from "state/hooks";
import LogoIcon from 'images/PolyDEX White Text (2).svg';
import config from "./config";

const Menu = (props) => {
  const { account } = useWeb3React();
  const { login, logout } = useAuth();
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext);
  const { isDark, toggleTheme } = useTheme();
  const cakePriceUsd = usePriceCakeBusd();
  // console.log(cakePriceUsd.toNumber());
  const { profile } = useProfile();

  return (
    <UikitMenu
      account={account}
      login={login}
      logout={logout}
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
