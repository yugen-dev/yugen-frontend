/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-danger */
import React, { useMemo } from "react";
import styled from "styled-components";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Card, Text, AutoRenewIcon } from "cryption-uikit";
import { LightCard } from "components/Card";
import MigrationCard from "components/MigrationCard";
import { StyledInternalLink } from "components/Shared";
import UnlockButton from "components/UnlockButton";
import { useWeb3React } from "@web3-react/core";
import { useMigrationPairs } from "state/user/hooks";
import migrate from "config/constants/migrate";

const Migrate = () => {
  const { account } = useWeb3React();
  // const { chainId } = useActiveWeb3React();
  const trackedTokenPairs = useMigrationPairs();
  const allMigrationPairs = useMemo(
    () => {
      const pairs = {};
      Object.keys(trackedTokenPairs).forEach((factoryAddrees) => {
        const checkIfPresent = migrate.filter(eachFactory => eachFactory.value === factoryAddrees);
        if (checkIfPresent && checkIfPresent.length > 0) {
          let pairAddresses = trackedTokenPairs[factoryAddrees];
          pairAddresses = pairAddresses.filter((item, pos) => {
            return pairAddresses.indexOf(item) === pos;
          })
          pairAddresses = pairAddresses.filter(item => item !== null && item !== "0x0000000000000000000000000000000000000000");
          pairs[factoryAddrees] = {
            pairs: pairAddresses,
            exchangePlatform: checkIfPresent[0].label
          }
        }
      })
      return pairs;
    }, [trackedTokenPairs]);
  const v2IsLoading = false;
  return (
    <Container maxWidth="lg">
      <MigrationContainer>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <Infodiv>
              <CNHeading>Migrate Liquidity</CNHeading>
              <CNText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed
                mi malesuada, malesuada massa placerat, accumsan ligula. Morbi
                non pulvinar dolor. Aliquam erat volutpat. Nullam laoreet, magna
                sit amet auctor aliquet, ante augue auctor eros, et elementum
                arcu ex sit amet nisl. Vivamus lobortis euismod ante sed
                porttitor. Suspendisse id lectus ut ipsum luctus pharetra
                fermentum sit amet nisl. Donec id turpis gravida nisi
                consectetur semper. Vivamus sit amet viverra ligula. Suspendisse
                vel eros nec mi eleifend feugiat vel id magna.
              </CNText>
              <div
                style={{ maxWidth: "300px", width: "100%", marginTop: "20px" }}
              >
                {!account && <UnlockButton mt="25px" width="100%" />}
              </div>
            </Infodiv>
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '<lottie-player src="https://assets7.lottiefiles.com/packages/lf20_pbdrsjah.json"  background="transparent"  speed="1" style="height: 200px;" loop  autoplay></lottie-player>',
              }}
            />
          </Grid>
        </Grid>
        <ContainerCard>
          <Text color="white" textAlign="center" fontSize="20px" mb="20px" bold>
            Migrate Liquidity
          </Text>
          {v2IsLoading ? (
            <LoadinCard>
              <Text color="#86878F" textAlign="center" mr="5px">
                Loading
              </Text>
              <AutoRenewIcon spin color="#86878F" />
            </LoadinCard>
          ) : (
            <div style={{ width: "100%" }}>
              {allMigrationPairs && Object.keys(allMigrationPairs).length > 0 ? (
                <div style={{ marginBottom: "20px", width: "100%" }}>
                  {Object.keys(allMigrationPairs).map(eachFacory => {
                    return allMigrationPairs[eachFacory].pairs.map(eachPair => (
                      <MigrationCard
                        pairAddress={eachPair}
                        factoryAddrees={eachFacory}
                        key={eachPair}
                        exchangePlatform={allMigrationPairs[eachFacory].exchangePlatform}
                      />
                    ))
                  })}
                </div>
              ) : (
                <LightCard padding="40px">
                  <Text color="textDisabled" textAlign="center">
                    No liquidity found.
                  </Text>
                </LightCard>
              )}
            </div>
          )}
          <Text
            fontSize="14px"
            style={{ padding: ".5rem 0 .5rem 0" }}
            color="#86878F"
          >
            Don't see a pool you joined?{"  "}
            <StyledInternalLink
              id="import-pool-link"
              to="/migrate/find"
              color="#2082E9"
              style={{ color: "#2082E9" }}
            >
              Import it.
            </StyledInternalLink>
          </Text>
        </ContainerCard>
      </MigrationContainer>
    </Container>
  );
};

const MigrationContainer = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const CNText = styled.div`
  font-size: 17px;
  font-weight: normal;
  text-align: center;
  color: #9d9fa8;
`;

const Infodiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CNHeading = styled.div`
  font-size: 23px;
  font-weight: bold;
  text-align: center;
  color: white;
  margin-bottom: 20px;
`;

const ContainerCard = styled(Card)`
  border-radius: 0.625rem !important;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  background-color: #1e202a;
  display: flex;
  margin-top: 70px;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const LoadinCard = styled.div`
  color: #3f4656;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Migrate;
