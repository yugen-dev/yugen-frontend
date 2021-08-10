/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import styled from "styled-components";
import { Button, useModal } from "cryption-uikit";
import CloseIcon from '@material-ui/icons/Close';
import NetworkToggleModal from './NetworkToggleModal';
// import Modal from "components/Modal";
// import LogoIcon from "images/PolyDEX White Text (2).svg";
import config from "./config";

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: white;
  align-items: center;
  font-weight: 800;
  font-size: 20px;
`;
const NetworkToggle = (props) => {
  let currentNetwork = [];
  const [showModal] = useModal(<NetworkToggleModal activeChainId={window.ethereum.networkVersion} />);
  if (window.ethereum) {
    currentNetwork = config.filter(eachNetwork => eachNetwork.chainId === window.ethereum.networkVersion)
  }
  if (currentNetwork && currentNetwork.length > 0) {
    return (
      <div>
        <Button onClick={showModal}>
          {currentNetwork[0].title}
        </Button>
      </div>
    )
  }
  return <div />
};

export default NetworkToggle;
