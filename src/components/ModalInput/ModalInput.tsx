import React from "react";
import styled from "styled-components";
import { Text, Button, Flex, Link, Input, InputProps } from "yugen-uikit";
import useI18n from "../../hooks/useI18n";

interface ModalInputProps {
  max: string;
  symbol: string;
  onSelectMax?: () => void;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  // placeholder?: string;
  value: string;
  addLiquidityUrl?: string;
  inputTitle?: string;
}

const getBoxShadow = ({ isWarning = false, theme }) => {
  if (isWarning) {
    return theme.shadows.warning;
  }

  return theme.shadows.inset;
};

const StyledTokenInput = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  /* background-color: rgba(0, 0, 0, 0.71); */
  background-color: #ebc5ab;
  border-radius: 16px;
  box-shadow: ${getBoxShadow};
  color: ${({ theme }) => theme.colors.text};
  padding: 16px 16px 16px 0px;
  width: 100%;
`;

const StyledInput = styled(Input)`
  box-shadow: none;
  width: 60px;
  margin-right: 8px;

  ${({ theme }) => theme.mediaQueries.xs} {
    width: 80px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
  }
`;

const StyledErrorMessage = styled(Text)`
  margin-top: 8px;
  a {
    display: inline;
  }
`;

const ModalInput: React.FC<ModalInputProps> = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  addLiquidityUrl,
  inputTitle,
}) => {
  const TranslateString = useI18n();
  const isBalanceZero = max === "0" || !max;

  const displayBalance = isBalanceZero ? "0" : parseFloat(max).toFixed(4);

  return (
    <div style={{ position: "relative" }}>
      <StyledTokenInput isWarning={isBalanceZero}>
        <Flex justifyContent="space-between" pl="16px">
          <Text fontSize="14px">{inputTitle}</Text>
          <Text fontSize="14px">
            {TranslateString(1120, "Balance")}:{" "}
            {displayBalance.toLocaleString()}
          </Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-around">
          <StyledInput onInputChange={onChange} placeholder="0" value={value} />
          <Button scale="sm" onClick={onSelectMax} mr="8px">
            {TranslateString(452, "Max")}
          </Button>
          <Text fontSize="16px">{symbol}</Text>
        </Flex>
      </StyledTokenInput>
      {isBalanceZero && (
        <StyledErrorMessage fontSize="14px" color="failure">
          No tokens to stake:{" "}
          <Link
            fontSize="14px"
            bold={false}
            href={addLiquidityUrl}
            external
            color="failure"
          >
            {TranslateString(999, "get")} {symbol}
          </Link>
        </StyledErrorMessage>
      )}
    </div>
  );
};

export default ModalInput;
