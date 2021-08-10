/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
// import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { Button, useModal } from "cryption-uikit";
import { ETHERJS_PATHS } from "config";
import NetworkToggleModal from './NetworkToggleModal';
// import Modal from "components/Modal";
// import LogoIcon from "images/PolyDEX White Text (2).svg";
import config from "./config";

// const TitleRow = styled.div`
//   display: flex;
//   justify-content: space-between;
//   width: 100%;
//   color: white;
//   align-items: center;
//   font-weight: 800;
//   font-size: 20px;
// `;
const NetworkToggle = (props) => {
  let currentNetwork = [];
  let accountId = null;
  const location = useLocation();
  if (ETHERJS_PATHS.includes(`/${location.pathname.split("/")[1]}`)) {
    accountId = useWeb3React().account;
  } else {
    accountId = useWeb3React("web3").account;
  }
  const changeNetwork = async (networkData) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        // params: [{ chainId: '0x1' }],
        params: [{ chainId: `0x${parseFloat(networkData.chainId).toString(16)}` }],
      });
    } catch (switchError) {
      console.log('check errors', switchError);
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ chainId: '0x1', rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161' /* ... */ }],
          });
        } catch (addError) {
          // handle "add" error
        }
      }
      // handle other "switch" errors
    }
  }
  const [showModal] = useModal(<NetworkToggleModal activeChainId={window.ethereum.networkVersion} changeNetwork={changeNetwork} />);
  if (window.ethereum) {
    currentNetwork = config.filter(eachNetwork => eachNetwork.chainId === window.ethereum.networkVersion)
  }
  if (accountId && currentNetwork && currentNetwork.length > 0) {
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
