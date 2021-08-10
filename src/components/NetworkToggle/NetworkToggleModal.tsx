/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import styled from "styled-components";
import { Modal, Button, Text } from "cryption-uikit";
// import Modal from "components/Modal";
// import LogoIcon from "images/PolyDEX White Text (2).svg";
import config from "./config";

const ConnectDot = styled.div`
  height: 8px;
  width: 8px;
  margin-right: 8px;
  background-color: rgb(39, 174, 96);
  border-radius: 50%;
  margin-right: 10px;
`;
interface ModalProps {
  onDismiss?: () => void;
  activeChainId: string;
}

const NetworkToggleModal: React.FC<ModalProps> = ({ onDismiss, activeChainId }) => {
  return (
    <Modal title="Change Network" onDismiss={onDismiss} >
      <div style={{ maxWidth: '360px' }}>
        {config && config.map(eachNetwork => (
          <Button
            width="100%"
            maxWidth="360px"
            variant="tertiary"
            mb="15px"
            // onClick={() => {
            //   login(walletConfig.connectorId);
            //   window.localStorage.setItem(connectorLocalStorageKey, walletConfig.connectorId);
            //   onDismiss();
            // }}
            style={{ justifyContent: "space-between", background: "#1A1B23", borderRadius: "20px" }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {activeChainId === eachNetwork.chainId && <ConnectDot />}
              <Text color="white" mr="16px" fontSize="18px">
                {eachNetwork.title}
              </Text>
            </div>
            {/* <Icon width="32px" /> */}
          </Button>
        ))}
      </div>
    </Modal>
  );
};

export default NetworkToggleModal;
