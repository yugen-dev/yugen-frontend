import React from "react";
import { Grid } from "@material-ui/core";
import { Button } from "cryption-uikit";
import styled from "styled-components";
import bondItems from "../bonds";

const BondTable = () => {
  return (
    <Grid container lg={12} spacing={1} style={{ marginTop: "25px" }}>
      <Grid item lg={12}>
        <Grid container lg={12} spacing={1} style={{ marginBottom: "20px" }}>
          <Grid item lg={1} />
          <Grid item lg={3}>
            <ItemHeading>Bond</ItemHeading>
          </Grid>
          <Grid item lg={2}>
            <ItemHeading>Price</ItemHeading>
          </Grid>
          <Grid item lg={2}>
            <ItemHeading>ROI</ItemHeading>
          </Grid>
          <Grid item lg={2}>
            <ItemHeading>Purchased</ItemHeading>
          </Grid>
          <Grid item lg={2} />
        </Grid>

        {bondItems.map((bond) => (
          <Grid container lg={12} spacing={2}>
            <Grid item lg={1} />
            <Grid item lg={3}>
              <Item>{bond.token}</Item>
            </Grid>
            <Grid item lg={2}>
              <Item>&#36;{bond.price}</Item>
            </Grid>
            <Grid item lg={2}>
              <Item>{bond.roi}&#37;</Item>
            </Grid>
            <Grid item lg={2}>
              <Item>&#36;{bond.purchased}</Item>
            </Grid>
            <Grid item lg={2}>
              <Button disabled>Bond</Button>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

const Item = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #424945;
`;

const ItemHeading = styled.div`
  font-size: 20px;
  font-weight: bold;
  text-decoration: underline;
  color: #9b9382;
`;

export default BondTable;
