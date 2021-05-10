/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/style-prop-object */
/* eslint-disable react/no-danger */
import React from "react";
import styled from "styled-components";
import Container from "@material-ui/core/Container";
import {
  ButtonMenu,
  ButtonMenuItem,
  Button,
  Flex,
  Input,
  Text,
} from "cryption-uikit";
import Grid from "@material-ui/core/Grid";

const CNHeading = styled.div`
  font-size: 23px;
  font-weight: bold;
  text-align: center;
  color: white;
  margin-bottom: 20px;
`;
const PoolsContainer = styled.div`
  margin-top: 50px;
`;
const CNText = styled.div`
  font-size: 17px;
  font-weight: normal;
  text-align: center;
  color: #9d9fa8;
`;
const StakingContainer = styled.div`
  border-radius: 0.625rem !important;
  padding: 30px 15px;
  background-color: #161522;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 transparent, 0 0 transparent,
    0px 50px 250px -47px rgba(39, 176, 230, 0.29) !important;
`;
const CustomInputPannel = styled.div`
  margin: 25px 0px;
  width: 100%;
  max-width: 400px;
  background-color: #202231;
  display: flex;
  padding: 0px 15px;
  border-radius: 10px;
  justify-content: space-between;
`;
const InputWrapper = styled.div`
  width: 100%;
  > div {
    width: 100%;
    margin: 0px;
    > input {
      width: 100%;
      padding: 0px;
      background-color: #202231;
      box-shadow: none !important;
    }
  }
`;
const InfoDiv = styled.div`
  margin-top: 25px;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  display: flex;
  align-items: center;
`;
const ConversionInfo = styled.div`
  font-size: 16px !important;
  line-height: 24px !important;
  padding-left: 0.875rem !important;
  padding-top: 0.125rem !important;
  padding-bottom: 0.125rem !important;
  color: white;
  padding-right: 0.875rem !important;
  background: linear-gradient(90deg, #4e3034, #4e3034),
    linear-gradient(90deg, #fe5a75, #fec464) !important;
  background-clip: padding-box, border-box !important;
  border-width: 1px !important;
  border-radius: 1.5rem !important;
  border-color: transparent;
  background-origin: padding-box, border-box !important;
`;

const StakingInfo = styled.div`
  background: #6e5538;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 0.625rem !important;
`;
const CNTBar = () => {
  const [index, setIndex] = React.useState(0);
  const handleClick = (newIndex) => setIndex(newIndex);
  return (
    <PoolsContainer>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <CNHeading>Maximize yield by staking CNT</CNHeading>
            <CNText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              luctus sem nulla, id commodo tellus posuere nec. Quisque pulvinar
              lacus sed congue gravida. Duis dignissim dolor sit amet tortor
              pulvinar suscipit. Aliquam erat volutpat
            </CNText>
          </Grid>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '<lottie-player src="https://assets7.lottiefiles.com/packages/lf20_0cvczw8l.json"  background="transparent"  speed="1" style="height: 200px;" loop  autoplay></lottie-player>',
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "30px" }}>
          <Grid item xs={12} md={6} lg={6} xl={6}>
            <StakingContainer>
              <ButtonMenu
                activeIndex={index}
                scale="md"
                variant="primary"
                onItemClick={handleClick}
              >
                <ButtonMenuItem style={{ minWidth: "150px" }}>
                  Stake
                </ButtonMenuItem>
                <ButtonMenuItem style={{ minWidth: "150px" }}>
                  UnStake
                </ButtonMenuItem>
              </ButtonMenu>
              <InfoDiv>
                <Text
                  bold
                  color="white"
                  textTransform="uppercase"
                  style={{ whiteSpace: "nowrap" }}
                  fontSize="18px"
                >
                  Stake CNT
                </Text>
                <ConversionInfo>1xCNT = 1222 CNT</ConversionInfo>
              </InfoDiv>
              <CustomInputPannel>
                <InputWrapper>
                  <Input
                    // onInputChange={onChange}
                    placeholder="0 CNT"
                    // value={value}
                  />
                </InputWrapper>
                <Flex alignItems="center">
                  <Text
                    bold
                    color="#9d9fa8"
                    textTransform="uppercase"
                    mr="10px"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Balance: 0
                  </Text>
                  <Button
                    scale="sm"
                    // onClick={onSelectMax}
                  >
                    Max
                  </Button>
                </Flex>
              </CustomInputPannel>
              <Button disabled style={{ maxWidth: "400px", width: "100%" }}>
                Connect Wallet
              </Button>
            </StakingContainer>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            lg={6}
            xl={6}
            style={{ display: "flex", flexDirection: "column" }}
            justify="space-between"
          >
            <StakingInfo>
              <Flex justifyContent="space-between">
                <div>
                  <Text
                    bold
                    color="white"
                    textTransform="uppercase"
                    style={{ whiteSpace: "nowrap" }}
                    fontSize="18px"
                    mb="6px"
                  >
                    Staking APR
                  </Text>
                  <Button variant="secondary" scale="sm">
                    {" "}
                    View Seats
                  </Button>
                </div>
                <div>
                  <Text
                    bold
                    color="white"
                    textTransform="uppercase"
                    style={{ whiteSpace: "nowrap" }}
                    fontSize="24px"
                  >
                    8.63%
                  </Text>
                  <Text
                    color="#9d9fa8"
                    style={{ whiteSpace: "nowrap" }}
                    fontSize="16px"
                  >
                    Yesterday's APR
                  </Text>
                </div>
              </Flex>
            </StakingInfo>
            <StakingContainer>
              <Text
                bold
                color="white"
                textTransform="uppercase"
                style={{ whiteSpace: "nowrap" }}
                fontSize="22px"
              >
                Balnces
              </Text>
              <InfoDiv>
                <Text
                  bold
                  color="#9d9fa8"
                  textTransform="uppercase"
                  style={{ whiteSpace: "nowrap" }}
                  fontSize="18px"
                >
                  CNT: 110
                </Text>
                <Text
                  bold
                  color="#9d9fa8"
                  textTransform="uppercase"
                  style={{ whiteSpace: "nowrap" }}
                  fontSize="18px"
                >
                  xCNT: 0222
                </Text>
              </InfoDiv>
            </StakingContainer>
          </Grid>
        </Grid>
      </Container>
    </PoolsContainer>
  );
};

export default CNTBar;
