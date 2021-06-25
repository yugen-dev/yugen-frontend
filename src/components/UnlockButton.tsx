/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { useLocation } from "react-router-dom";
import { Button, useWalletModal } from "cryption-uikit";
import useAuth from "hooks/useAuth";
import useI18n from "hooks/useI18n";
import { ETHERJS_PATHS } from 'config';

const UnlockButton = (props) => {
  const TranslateString = useI18n();
  const location = useLocation();
  let loginFunc = useAuth().login;
  let logoutFunc = useAuth().logout;
  if (ETHERJS_PATHS.includes(location.pathname)) {
    loginFunc = useAuth().loginEther;
    logoutFunc = useAuth().logoutEther;
  }
  const { onPresentConnectModal } = useWalletModal(loginFunc, logoutFunc);

  return (
    <Button onClick={onPresentConnectModal} {...props} width="100%">
      {TranslateString(292, "Unlock Wallet")}
    </Button>
  );
};

export default UnlockButton;
