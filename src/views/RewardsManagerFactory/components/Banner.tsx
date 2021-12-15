import React, { memo } from "react";
import styled from "styled-components";

const Banner = () => {
  const text =
    "Earn 45% APR on accumulated rewards if claimed after Mar 25th, 2022";

  return (
    <StyledBannerContainer>
      <StyledBanner>{text}</StyledBanner>
    </StyledBannerContainer>
  );
};

const StyledBannerContainer = styled.div`
  background: linear-gradient(#425ef0, #9901ff);
  border-radius: 10px;
  padding: 2px;
`;

const StyledBanner = styled.div`
  padding: 5px 10px;
  border-radius: 9px;
  background: ${({ theme }) => theme.colors.cardBg};
  color: ${({ theme }) => theme.colors.heading};
  text-align: center;
`;

export default memo(Banner);
