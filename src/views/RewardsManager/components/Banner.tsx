import React, { memo } from "react";
import styled from "styled-components";

const Banner = () => {
  const text =
    "Earn 45% APR on accumulated rewards if claimed after Feb 24th, 2022";

  return (
    <StyledBannerContainer>
      <StyledBanner>{text}</StyledBanner>
    </StyledBannerContainer>
  );
};

const StyledBannerContainer = styled.div`
  padding: 2px;
  background: linear-gradient(#425ef0, #9901ff);
  border: 1px solid;
  border-radius: 10px;
`;

const StyledBanner = styled.div`
  padding: 5px 10px;
  border-radius: 9px;
  background: #1a1b23;
  color: white;
  text-align: center;
`;

export default memo(Banner);
