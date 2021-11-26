import React from "react";
import styled from "styled-components";
import { Grid } from "@material-ui/core";

const BondInfo = ({ heading, value }) => {
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Heading>{heading}</Heading>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Value>&#36;{value}</Value>
      </Grid>
    </Grid>
  );
};

const Heading = styled.h3`
  font-size: 32px;
  text-align: center;
  color: #9b9382;
`;

const Value = styled.p`
  font-size: 32px;
  text-align: center;
  font-weight: bold;
  color: #424945;
`;

export default BondInfo;
