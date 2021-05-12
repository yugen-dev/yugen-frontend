import React from "react";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
// import { Heading, Text, BaseLayout } from "cryption-uikit";
import useI18n from "hooks/useI18n";
import Container from "@material-ui/core/Container";
import FarmStakingCard from "views/Home/components/FarmStakingCard";
import LotteryCard from "views/Home/components/LotteryCard";
import CakeStats from "views/Home/components/CakeStats";
import TotalValueLockedCard from "views/Home/components/TotalValueLockedCard";
import EarnAPYCard from "views/Home/components/EarnAPYCard";
import EarnAssetCard from "views/Home/components/EarnAssetCard";
// import WinCard from "views/Home/components/WinCard";

const Hero = styled.div`
  align-items: left;
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
  text-align: center;
`;

// const Cards = styled(BaseLayout)`
//   align-items: stretch;
//   justify-content: stretch;
//   margin-bottom: 32px;

//   & > div {
//     grid-column: span 6;
//     width: 100%;
//   }

//   ${({ theme }) => theme.mediaQueries.sm} {
//     & > div {
//       grid-column: span 8;
//     }
//   }

//   ${({ theme }) => theme.mediaQueries.lg} {
//     & > div {
//       grid-column: span 6;
//     }
//   }
// `;

const Home: React.FC = () => {
  const TranslateString = useI18n();

  return (
    <Container maxWidth="lg" style={{ marginTop: '50px' }}>
      <Grid container spacing={5} justify="center">
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
            <Hero>
              <CNHeading>{TranslateString(576, "PolyDex")}</CNHeading>
              <CNText>
                {TranslateString(
                  578,
                  "The #1 AMM and yield farm on Matic BlockChain."
                )}
              </CNText>
            </Hero>
            <FarmStakingCard />
          </div>
        </Grid>
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <LotteryCard />
        </Grid>

        <Grid item xs={12} md={6} lg={6} xl={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6} xl={6}>
              <EarnAssetCard />
            </Grid>
            <Grid item xs={12} md={6} lg={6} xl={6}>
              <EarnAPYCard />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} lg={6} xl={6}>
          <TotalValueLockedCard />
        </Grid>
        {/* <Grid item xs={12} md={6} lg={6} xl={6}>
          <WinCard />
        </Grid> */}
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <CakeStats />
        </Grid>
      </Grid>
    </Container>
  );
};

const CNHeading = styled.div`
  font-size: 50px;
  font-weight: bold;
  text-align: center;
  color: white;
  margin-bottom: 20px;
`;

const CNText = styled.div`
  font-size: 20px;
  font-weight: normal;
  text-align: center;
  color: #9d9fa8;
`;
export default Home;
