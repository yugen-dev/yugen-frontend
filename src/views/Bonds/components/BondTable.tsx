import React from "react";
import { Grid } from "@material-ui/core";
import { Button } from "yugen-uikit";
import styled from "styled-components";
import bondItems from "../bonds";

const BondTable = () => {
  return (
    <Grid
      container
      xs={12}
      sm={12}
      md={12}
      lg={12}
      xl={12}
      spacing={1}
      style={{ marginTop: "25px" }}
    >
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Grid
          container
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          spacing={1}
          style={{ marginBottom: "20px" }}
        >
          <Grid item xs={1} sm={1} md={1} lg={1} xl={1} />
          <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
            <ItemHeading>Bond</ItemHeading>
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
            <ItemHeading>Price</ItemHeading>
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
            <ItemHeading>ROI</ItemHeading>
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
            <ItemHeading>Purchased</ItemHeading>
          </Grid>
          <Grid item xs={2} sm={2} md={2} lg={2} xl={2} />
        </Grid>

        {bondItems.map((bond) => (
          <Grid container xs={12} sm={12} md={12} lg={12} xl={12} spacing={1}>
            <Grid
              item
              xs={1}
              sm={1}
              md={1}
              lg={1}
              xl={1}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={`/images/bonds/${bond.token.toLowerCase()}.png`}
                alt={`${bond.token}`}
                width={`${bond.isLP ? "60px" : "30px"}`}
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
              <Item>{bond.token}</Item>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
              <Item>&#36;{bond.price}</Item>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
              <Item>{bond.roi}&#37;</Item>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
              <Item>&#36;{bond.purchased}</Item>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
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
