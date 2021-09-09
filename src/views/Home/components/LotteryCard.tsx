import React from "react";
import styled, { keyframes } from "styled-components";
import { Card, Button } from "cryption-uikit";
import { Link } from "react-router-dom";
import CrossChainFarmingBg from "../../../images/CrossChainFarmingBg.png";

const RainbowLight = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;
const StyledCardAccent = styled.div`
  visibility: hidden;
  background: linear-gradient(
    45deg,
    rgba(42, 118, 235, 0.1) 0%,
    rgba(42, 118, 235, 0.2) 10%,
    rgba(42, 118, 235, 0.4) 20%,
    rgba(42, 118, 235, 0.6) 30%,
    rgba(42, 118, 235, 0.6) 40%,
    #2a76eb 50%,
    #9702ff 60%,
    rgba(151, 2, 255, 0.6) 70%,
    rgba(151, 2, 255, 0.6) 80%,
    rgba(151, 2, 255, 0.4) 90%,
    rgba(151, 2, 255, 0.2) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 0.625rem !important;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
  /* */
`;

const StyledFarmStakingCard = styled(Card)<{ redirectLink?: boolean }>`
  background-color: #1e202a;
  overflow: initial;
  position: relative;
  border-radius: 0.625rem !important;
  padding: 30px 15px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  cursor: pointer;
  ${StyledCardAccent} {
    visibility: visible;
  }
  background-image: url(${CrossChainFarmingBg});

  @media (max-width: 650px) {
    padding: 10px 10px;
  }
`;

const EarnAssetCard = () => {
  return (
    <Link to="/farms">
      <StyledFarmStakingCard>
        <StyledCardAccent />
        <CNCardBody>
          <div>
            <FirstHeading>CROSS CHAIN FARMING</FirstHeading>
            <SecondHeading>IS NOW LIVE</SecondHeading>
          </div>
          <Link to="/farms">
            <StyledButton>GET STARTED</StyledButton>
          </Link>
        </CNCardBody>
      </StyledFarmStakingCard>
    </Link>
  );
};

const StyledButton = styled(Button)`
  padding: 0px 45px;
  @media (max-width: 650px) {
    width: 100%;
  }
`;

const FirstHeading = styled.div`
  font-size: 44px;
  font-weight: 900;
  margin-bottom: 10px;
  @media (max-width: 650px) {
    margin-top: 5px;
    font-size: 24px;
  }
`;
const SecondHeading = styled.div`
  font-size: 74px;
  font-weight: 900;
  margin-bottom: 20px;
  @media (max-width: 650px) {
    margin-bottom: 20px;
    font-size: 34px;
  }
`;

const CNCardBody = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: column;
  text-align: center;

  @media (max-width: 650px) {
    font-size: 34px;
    justify-content: space-between;
  }
`;

export default EarnAssetCard;
