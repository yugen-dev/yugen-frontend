/* eslint-disable prefer-destructuring */
/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { useLocation } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import {
  Button,
  ButtonProps,
  useWalletModal,
  ConnectorNames,
} from "cryption-uikit";
import { connectorsByName } from "connectors";
import useI18n from "hooks/useI18n";
import "./index.css";

const UnlockButton: React.FC<ButtonProps> = (props) => {
  const TranslateString = useI18n();
  const location = useLocation();
  let accountId = "";
  accountId = useWeb3React("web3").account;
  let { activate } = useWeb3React("web3");
  let { deactivate } = useWeb3React("web3");
  if (["/swap", "/find", "/pool", "/add"].includes(`/${location.pathname.split('/')[1]}`)) {
    accountId = useWeb3React().account;
    activate = useWeb3React().activate;
    deactivate = useWeb3React().deactivate;
  }
  const handleLogin = (connectorId: ConnectorNames) => {
    const connector = connectorsByName[connectorId];
    if (connector) {
      activate(connector);
    }
  };

  const { onPresentConnectModal } = useWalletModal(
    handleLogin,
    deactivate,
    accountId as string
  );

  return (
    <Button onClick={onPresentConnectModal} {...props} className="button-style">
      {TranslateString(292, "Unlock Wallet")}
    </Button>
  );
};

export default UnlockButton;
