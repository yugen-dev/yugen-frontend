import React, { useEffect, useRef } from "react";
import CountUp from "react-countup";
import styled from "styled-components";
import { Text } from "cryption-uikit";

interface TextProps {
  isDisabled?: boolean;
  fontSize?: string;
  color?: string;
}

interface BalanceProps extends TextProps {
  value?: number;
  decimals?: number;
  unit?: string;
  subText?: string;
}

const StyledText = styled(Text)<TextProps>`
  color: ${({ isDisabled, color, theme }) =>
    isDisabled ? theme.colors.textDisabled : color};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledSubText = styled(Text)<TextProps>`
  color: ${({ isDisabled, color, theme }) =>
    isDisabled ? theme.colors.textDisabled : color};
`;

const Balance: React.FC<BalanceProps> = ({
  value,
  fontSize,
  color,
  decimals,
  isDisabled,
  unit,
  subText,
}) => {
  const previousValue = useRef(0);

  useEffect(() => {
    previousValue.current = value;
  }, [value]);

  return (
    <StyledText bold color={color} fontSize={fontSize} isDisabled={isDisabled}>
      <div>
        <CountUp
          start={previousValue.current}
          end={value}
          decimals={decimals}
          duration={1}
          separator=","
        />
        {value && unit ? <span>{unit}</span> : <></>}
      </div>
      <StyledSubText>{subText}</StyledSubText>
    </StyledText>
  );
};

Balance.defaultProps = {
  fontSize: "32px",
  isDisabled: false,
  color: "text",
  decimals: 3,
};

export default Balance;
