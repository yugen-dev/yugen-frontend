import React from "react";
import styled, { keyframes } from "styled-components";
import { Card, Flex, ArrowForwardIcon } from "yugen-uikit";
import { NavLink } from "react-router-dom";

interface EarnAssestsProps {
  topTitle?: string;
  bottomTitle?: string;
  redirectLink?: string;
  description?: string;
  descriptionColor?: string;
}
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
    rgba(235, 129, 42, 0.1) 0%,
    rgba(235, 145, 42, 0.2) 10%,
    rgba(235, 119, 42, 0.4) 20%,
    rgba(235, 135, 42, 0.6) 30%,
    rgba(235, 158, 42, 0.6) 40%,
    #eba82a 50%,
    #ff9102 60%,
    rgba(255, 137, 2, 0.6) 70%,
    rgba(255, 124, 2, 0.6) 80%,
    rgba(255, 95, 2, 0.4) 90%,
    rgba(255, 116, 2, 0.2) 100%
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
  background-color: #ffffff;
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
  :hover {
    cursor: ${({ redirectLink }) => (redirectLink ? "pointer" : "auto")};
    ${StyledCardAccent} {
      visibility: ${({ redirectLink }) => redirectLink && "visible"};
    }
  }
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
`;
const CardMidContent = styled.div<{ descriptionColor?: string }>`
  font-size: 25px;
  overflow-wrap: break-word;
  font-weight: bold;
  width: 100%;
  color: ${({ descriptionColor }) => descriptionColor || "#2082E9;"};
  margin: 20px 0px;
  text-align: left;
  letter-spacing: 2px;
  text-transform: capitalize;
`;

const CNHeading = styled.div`
  color: #887263;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  text-transform: capitalize;
`;
const CNBottomHeader = styled.div`
  font-size: 16px;
  text-align: left;
  font-weight: normal;
  color: #bfb1a6;
`;

const EarnAssetCard: React.FC<EarnAssestsProps> = ({
  topTitle,
  bottomTitle,
  redirectLink,
  description,
  descriptionColor,
}) => {
  const handleNavigation = (event) => {
    if (redirectLink === null || redirectLink === undefined) {
      event.preventDefault();
    }
  };
  return (
    <NavLink
      exact
      activeClassName="active"
      to={redirectLink || ""}
      onClick={handleNavigation}
    >
      <StyledFarmStakingCard redirectLink={!!redirectLink}>
        <StyledCardAccent />
        <CNCardBody>
          <CNHeading>{topTitle || "Earn"}</CNHeading>
          <CardMidContent descriptionColor={descriptionColor}>
            {description}
          </CardMidContent>
          <Flex justifyContent={redirectLink ? "space-between" : "center"}>
            <CNBottomHeader>{bottomTitle || ""}</CNBottomHeader>
            {redirectLink && <ArrowForwardIcon color="#424945" />}
          </Flex>
        </CNCardBody>
      </StyledFarmStakingCard>
    </NavLink>
  );
};

const CNCardBody = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

export default EarnAssetCard;
