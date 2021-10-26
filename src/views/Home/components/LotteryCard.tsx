import React from "react";
import MascotImage from "images/yugen-main-img.png";

// const RainbowLight = keyframes`
// 	0% {
// 		background-position: 0% 50%;
// 	}
// 	50% {
// 		background-position: 100% 50%;
// 	}
// 	100% {
// 		background-position: 0% 50%;
// 	}
// `;
// const StyledCardAccent = styled.div`
//   visibility: hidden;
//   background: linear-gradient(
//     45deg,
//     rgba(235, 129, 42, 0.1) 0%,
//     rgba(235, 145, 42, 0.2) 10%,
//     rgba(235, 119, 42, 0.4) 20%,
//     rgba(235, 135, 42, 0.6) 30%,
//     rgba(235, 158, 42, 0.6) 40%,
//     #eba82a 50%,
//     #ff9102 60%,
//     rgba(255, 137, 2, 0.6) 70%,
//     rgba(255, 124, 2, 0.6) 80%,
//     rgba(255, 95, 2, 0.4) 90%,
//     rgba(255, 116, 2, 0.2) 100%
//   );
//   background-size: 300% 300%;
//   animation: ${RainbowLight} 2s linear infinite;
//   border-radius: 0.625rem !important;
//   filter: blur(6px);
//   position: absolute;
//   top: -2px;
//   right: -2px;
//   bottom: -2px;
//   left: -2px;
//   z-index: -1;
//   /* */
// `;

// const StyledFarmStakingCard = styled(Card)<{ redirectLink?: boolean }>`
//   background-color: #ffffff;
//   overflow: initial;
//   position: relative;
//   border-radius: 0.625rem !important;
//   padding: 30px 15px;
//   height: 100%;
//   display: flex;
//   justify-content: space-between;
//   flex-direction: column;
//   align-items: center;
//   height: 100%;
//   width: 100%;
//   cursor: pointer;
//   ${StyledCardAccent} {
//     visibility: visible;
//   }

//   @media (max-width: 650px) {
//     padding: 10px 10px;
//   }
// `;

const EarnAssetCard = () => {
  return <img src={MascotImage} alt="Yugen" height="100%" width="100%" />;
};

// const StyledButton = styled(Button)`
//   padding: 0px 45px;
//   @media (max-width: 650px) {
//     width: 100%;
//   }
// `;

// const FirstHeading = styled.div`
//   font-size: 44px;
//   font-weight: 900;
//   margin-bottom: 10px;
//   @media (max-width: 650px) {
//     margin-top: 5px;
//     font-size: 24px;
//   }
// `;
// const SecondHeading = styled.div`
//   font-size: 74px;
//   font-weight: 900;
//   margin-bottom: 20px;
//   @media (max-width: 650px) {
//     margin-bottom: 20px;
//     font-size: 34px;
//   }
// `;

// const CNCardBody = styled.div`
//   height: 100%;
//   width: 100%;
//   display: flex;
//   justify-content: space-evenly;
//   align-items: center;
//   flex-direction: column;
//   text-align: center;

//   @media (max-width: 650px) {
//     font-size: 34px;
//     justify-content: space-between;
//   }
// `;

export default EarnAssetCard;
