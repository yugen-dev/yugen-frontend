import React from "react";
import styled from "styled-components";
import { Button, useWalletModal } from "cryption-uikit";
import useAuth from "hooks/useAuth";
import useI18n from "hooks/useI18n";

const UnlockButton = (props) => {
  const TranslateString = useI18n();
  const { login, logout } = useAuth();
  const { onPresentConnectModal } = useWalletModal(login, logout);

  return (
    <Button onClick={onPresentConnectModal} {...props} width="100%">
      {TranslateString(292, "Unlock Wallet")}
    </Button>
  );
};

export default UnlockButton;
