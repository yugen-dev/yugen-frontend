/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { Heading, Text, Card, CardBody, Button } from "cryption-uikit";
import { useWeb3React } from "@web3-react/core";

const APRcards = ({ farmsMaxAPR, vaultsMaxAPR }) => {
  const { account } = useWeb3React("web3");

  return (
    <CardContainer>
      <FarmsAPR>
        <Text>In Farms</Text>
        <div style={{ width: "100%" }}>
          <Text>Earn upto</Text>
          <Heading
            size="lg"
            style={{ wordBreak: "break-all", maxWidth: "75%" }}
          >
            {farmsMaxAPR}%
          </Heading>
          <Text textTransform="uppercase">APR</Text>
        </div>
      </FarmsAPR>
      <VaultsAPR>
        <Text>In Vaults</Text>
        <div>
          <Text>Earn upto</Text>
          <Heading
            size="lg"
            style={{ wordBreak: "break-all", maxWidth: "75%" }}
          >
            {vaultsMaxAPR} %
          </Heading>
          <Text textTransform="uppercase">APR</Text>
        </div>
      </VaultsAPR>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  display: flex;
  padding: 20px;
  justify-content: space-between;
  width: 100%;
  overflow-x: auto;
`;
const FarmsAPR = styled.button`
  background: linear-gradient(to bottom right, #fcb035, #f06f18);
  border-radius: 1rem;
  min-width: 250px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  outline: none;
  border: none;
  text-align: left;

  &:hover {
    background: #fcb035;
    cursor: pointer;
  }
  margin: 5px;
`;
const VaultsAPR = styled.button`
  background: linear-gradient(to bottom right, #def229, #59fc35);
  border-radius: 1rem;
  min-width: 250px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  outline: none;
  border: none;
  text-align: left;

  &:hover {
    background: #def229;
    cursor: pointer;
  }
  margin: 5px;
`;

export default APRcards;
