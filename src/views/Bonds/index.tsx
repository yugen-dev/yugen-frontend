import React from "react";
import styled from "styled-components";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { Lock } from "react-feather";
import BondInfo from "./components/BondInfo";
import BondTable from "./components/BondTable";

const Bonds = () => {
  return (
    <BondContainer maxWidth="lg">
      <BondOverlay>
        <Lock size="64px" />
        <span style={{ margin: "0px 0px 0px 10px" }}> Coming Soon..... </span>
      </BondOverlay>

      <BondMainCard container lg={12} spacing={2}>
        <Grid item lg={12}>
          <Heading>Bond (1, 1)</Heading>
        </Grid>
        <Grid item lg={12}>
          <Grid container xs={12} lg={12} spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <BondInfo heading="Treasury Balance" value="765,613,296" />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <BondInfo heading="CNT price" value="850.72" />
            </Grid>
          </Grid>
        </Grid>

        <Grid item lg={12}>
          <BondTable />
        </Grid>
      </BondMainCard>
    </BondContainer>
  );
};

const BondOverlay = styled.div`
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  position: absolute;
  font-size: 74px;
  text-align: center;
  z-index: 99;
  /* background: #d4c8ae; */
  padding: 5px 0px;
  color: #424945;
  width: 100%;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  &:hover {
    cursor: not-allowed;
  }
`;

const Heading = styled.h1`
  font-size: 25px;
`;

const BondMainCard = styled(Grid)`
  background: #fff;
  min-height: 100%;
  padding: 20px 10px;
  border-radius: 12px;
  opacity: 0.6;
  z-index: 1;
  position: relative;

  &:hover {
    cursor: not-allowed;
  }
`;

const BondContainer = styled(Container)`
  margin: 40px 0px;
`;

export default Bonds;
