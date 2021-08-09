import React from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  // Input, InputProps
} from "cryption-uikit";
import useI18n from "hooks/useI18n";
import { Input, InputProps } from "@pancakeswap-libs/uikit";
import BigNumber from "bignumber.js";
import styled from "styled-components";

interface TokenInputProps extends InputProps {
  max: number | string;
  symbol: string;
  value: string;
  poolwithdrawalFeeBP: number;
  onSelectMax?: () => void;
  onChange: (evt: React.FormEvent<HTMLInputElement>) => void;
}

const TokenInput: React.FC<TokenInputProps> = ({
  max,
  symbol,
  onChange,
  onSelectMax,
  value,
  poolwithdrawalFeeBP = 0,
}) => {
  const TranslateString = useI18n();

  return (
    <Box>
      <Flex justifyContent="flex-end" minHeight="21px" mb="8px">
        <Text color="primary" fontSize="14px">
          {max.toLocaleString()} {symbol} {TranslateString(526, "Available")}
        </Text>
      </Flex>
      <Flex alignItems="center">
        <Input
          onChange={onChange}
          // onInputChange={onChange}
          placeholder="0"
          value={value}
        />

        <Flex alignItems="center">
          <Text bold color="primary" textTransform="uppercase" mx="8px">
            {symbol}
          </Text>
          <div>
            <Button scale="sm" onClick={onSelectMax}>
              {TranslateString(452, "Max")}
            </Button>
          </div>
        </Flex>
      </Flex>
      {poolwithdrawalFeeBP > 0 ? (
        <StyledMaxText>
          Withdrawal Fee{" "}
          {new BigNumber(value || 0)
            .times(poolwithdrawalFeeBP / 10000)
            .toString()}
          {symbol}
        </StyledMaxText>
      ) : null}
    </Box>
  );
};

const StyledMaxText = styled.div`
  align-items: center;
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  font-size: 14px;
  font-weight: 700;
  height: 44px;
  justify-content: flex-end;
`;

export default TokenInput;
