import React, { useState } from "react";
import styled from "styled-components";
import { ChevronRightIcon } from "cryption-uikit";
import Page from "../../components/layout/Page";

const Migrate = () => {
  return (
    <>
      <Page style={{ backgroundColor: "#100C18" }}>
        <Heading>Migrate Liquidity</Heading>
        <SubHeading>
          Migrate your Uniswap LP tokens to SushiSwap LP tokens.
        </SubHeading>
        <MigrateCardContainer>
          <MigrateCard>
            <MigrateWallet />
            <MigrateCardHeading>Your Uniswap Liquidity</MigrateCardHeading>
            <MigrateCardHeading>Amount of Tokens</MigrateCardHeading>
            <MigrateCardSubCard />
          </MigrateCard>
        </MigrateCardContainer>
      </Page>
    </>
  );
};

const MigrateWallet = () => {
  const [nonHardwareWallet, setNonHardwareWallet] = useState(true);
  const [hardwareWallet, setHardwareWallet] = useState(true);

  return (
    <>
      <WalletHeading>Wallet Type</WalletHeading>
      <>
        {nonHardwareWallet ? (
          <DisplayNonHardwareWallet
            // nonHardwareWallet={nonHardwareWallet}
            // setNonHardwareWallet={setNonHardwareWallet}

            hardwareWallet={hardwareWallet}
            setHardwareWallet={setHardwareWallet}
          />
        ) : (
          <></>
        )}
      </>
      <>
        {hardwareWallet ? (
          <DisplayHardwareWallet
            nonHardwareWallet={nonHardwareWallet}
            setNonHardwareWallet={setNonHardwareWallet}

            // hardwareWallet={hardwareWallet}
            // setHardwareWallet={setHardwareWallet}
          />
        ) : (
          <></>
        )}
      </>
    </>
  );
};

const DisplayNonHardwareWallet = ({ hardwareWallet, setHardwareWallet }) => {
  return (
    <>
      <ButtonCard onClick={() => setHardwareWallet(!hardwareWallet)}>
        <div>
          <ButtonCardHeading>Non-Hardware Wallet</ButtonCardHeading>
          <ButtonCardSubHeading>
            Migration is done in one-click using your signature(permit).
          </ButtonCardSubHeading>
        </div>
        <div>
          <ChevronRightIcon color="#2082E9" />
        </div>
      </ButtonCard>
    </>
  );
};

const DisplayHardwareWallet = ({ nonHardwareWallet, setNonHardwareWallet }) => {
  return (
    <>
      <ButtonCard onClick={() => setNonHardwareWallet(!nonHardwareWallet)}>
        <div>
          <ButtonCardHeading>
            Hardware Wallet (Trezor, Ledger, etc.)
          </ButtonCardHeading>
          <ButtonCardSubHeading>
            You need to first approve LP tokens and then migrate it.
          </ButtonCardSubHeading>
        </div>
        <div>
          <ChevronRightIcon color="#2082E9" />
        </div>
      </ButtonCard>
    </>
  );
};

const MigrateCardSubCard = () => {
  return (
    <>
      <MigrateSubCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: " 0 0 20px 0",
          }}
        >
          <div>SushiSwap LP</div>
          <div>N/A</div>
        </div>
        <div>Migrate Liquidity</div>
      </MigrateSubCard>
    </>
  );
};

const MigrateSubCard = styled.div`
  padding: 20px;
  border: 1px solid #686b7a;
  border-radius: 14px;
  color: #cfcccc;
  display: flex;
  font-weight: bold;
  text-align: center;
  justify-content: center;
  flex-direction: column;
`;

const WalletHeading = styled.div`
  color: white;
  font-size: 24px;
  margin: 0 0 20px 0;
  font-weight: bold;
`;

const MigrateCardHeading = styled.div`
  color: #cfcccc;
  font-size: 24px;
  margin: 20px 0;
  font-weight: bold;
`;

const ButtonCard = styled.div`
  width: 100%;
  padding: 14px;
  border: 1px solid #686b7a;
  color: white;
  margin: 10px 0;
  border-radius: 14px;
  display: flex;
  justify-content: space-between;
  align-content: flex-start;

  &:hover {
    border: 1px solid #1a1b23;
    box-shadow: 1px 1px 0 0 #9900ff, -1px -1px 0 0 #2082e9;
  }
`;

const ButtonCardHeading = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: white;
`;

const ButtonCardSubHeading = styled.div`
  font-size: 14px;
  color: #cfcccc;
`;

const MigrateCardContainer = styled.div`
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const MigrateCard = styled.div`
  justify-content: center;
  padding: 40px;
  border-radius: 27px;
  height: 100%;
  margin-bottom: 32px;
  background: #1e202a;
  box-shadow: 1px 2px 4px 3px rgba(0, 0, 0, 0.16);
  min-width: clamp(250px, 100%, 650px);
`;

const Heading = styled.div`
  text-align: center;
  font-size: 54px;
  font-weight: bold;
  letter-spacing: -0.015em;
  text-transform: capitalize;
  margin-left: 10px;
  color: white;
`;

const SubHeading = styled.div`
  text-align: center;
  margin: 10px 0 20px 10px;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: -0.015em;
  text-transform: capitalize;
  color: #686b7a;
`;

export default Migrate;
