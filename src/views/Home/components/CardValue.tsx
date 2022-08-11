import React from "react";
import CountUp from "react-countup";
import { Text } from "yugen-uikit";

export interface CardValueProps {
  value: number;
  decimals?: number;
  fontSize?: string;
  lineHeight?: string;
  prefix?: string;
  bold?: boolean;
  color?: string;
}

const CardValue: React.FC<CardValueProps> = ({
  value,
  decimals,
  fontSize = "24px",
  lineHeight = "0",
  prefix = "",
  bold = true,
  color = "#424945",
}) => {
  return (
    <Text
      bold={bold}
      fontSize={fontSize}
      style={{ lineHeight, letterSpacing: "2px", wordBreak: "break-all" }}
      color={color}
    >
      {prefix}
      <CountUp
        end={value}
        decimal="."
        decimals={decimals !== undefined ? decimals : 2}
      />
    </Text>
  );
};

export default CardValue;
