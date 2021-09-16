import React, { memo } from "react";
import styled from "styled-components";

const Banner = () => {
  const text =
    "Earn 45% APR on accumulated rewards if claimed after Feb 24th, 2022";

  return <StyledBanner>{text}</StyledBanner>;
};

const StyledBanner = styled.div`
  padding: 7px 12px;
  border-radius: 9px;
  background: #424945;
  color: white;
  text-align: center;
`;

export default memo(Banner);
