/* eslint-disable react/no-danger */
import React from "react";
import MascotImage from "../../../images/cntmascot.png";

const FarmedStakingCard = () => {

  return (
    // <StyledLotteryCard>
    //   <CardBody>
    //     <Heading size="xl" mb="24px">
    //       {TranslateString(550, "Your Lottery Winnings")}
    //     </Heading>
    //     <CardImage
    //       src="/images/ticket.svg"
    //       alt="cake logo"
    //       width={64}
    //       height={64}
    //     />
    //     <Block>
    //       <Label>{TranslateString(552, "CAKE to Collect")}:</Label>
    //       <CakeWinnings />
    //     </Block>
    //     <Block>
    //       <Label>{TranslateString(554, "Total jackpot this round")}:</Label>
    //       <LotteryJackpot />
    //     </Block>
    //     <Actions>
    //       <Button
    //         id="dashboard-collect-winnings"
    //         disabled={getBalanceNumber(claimAmount) === 0 || requesteClaim}
    //         onClick={handleClaim}
    //         style={{ marginRight: "8px" }}
    //       >
    //         {TranslateString(556, "Collect Winnings")}
    //       </Button>
    //       {renderLotteryTicketButtonBuyOrApprove()}
    //     </Actions>
    //   </CardBody>
    // </StyledLotteryCard>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
      }}
    >
      <img
        src={MascotImage}
        alt="Plydex"
        height="100%"
        style={{ maxWidth: "500px" }}
        width="100%"
      />
      {/* <div
        dangerouslySetInnerHTML={{
          __html:
            '<lottie-player src="https://assets2.lottiefiles.com/packages/lf20_ZBDdP3/data.json"  background="transparent"  speed="1" style="height: 100%;" loop  autoplay></lottie-player>',
        }}
      /> */}
    </div>
  );
};

export default FarmedStakingCard;
