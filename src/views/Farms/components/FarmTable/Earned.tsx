import React from "react";
import styled from "styled-components";

export interface EarnedProps {
  earnings: number;
  pid: number;
}

const Amount = styled.span<{ earned: number }>`
  color: ${({ earned }) => (earned ? "#86878F" : "#86878F")};
  display: flex;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  margin-top: 10px;
`;

const Earned: React.FunctionComponent<EarnedProps> = ({ earnings }) => {
  const displayBalance = earnings !== null ? earnings.toLocaleString() : "?";

  return <Amount earned={earnings}>{displayBalance}</Amount>;
};

export default Earned;
