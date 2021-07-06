import React from "react";
import styled, { keyframes } from "styled-components";
import { Card, Flex, ArrowForwardIcon } from "cryption-uikit";
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
  :hover {
    cursor: ${({ redirectLink }) => (redirectLink ? "pointer" : "auto")};
    background-color: ${({ redirectLink }) =>
      redirectLink ? "#262626" : "#1E202A"};
    ${StyledCardAccent} {
      visibility: ${({ redirectLink }) => redirectLink && "visible"};
    }
  }
`;
const CardMidContent = styled.div<{ descriptionColor?: string }>`
  font-size: 30px;
  font-weight: bold;
  width: 100%;
  color: ${({ descriptionColor }) => descriptionColor || "#2082E9;"};
  margin: 20px 0px;
  text-align: left;
  text-transform: capitalize;
`;

const CNHeading = styled.div`
  color: #686b7a;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  text-transform: capitalize;
`;
const CNBottomHeader = styled.div`
  font-size: 16px;
  text-align: left;
  font-weight: normal;
  color: #cfcccc;
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
            <CNBottomHeader>{bottomTitle || "in Pools"}</CNBottomHeader>
            {redirectLink && <ArrowForwardIcon color="#2082E9" />}
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
