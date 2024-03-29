import React from "react";
import styled from "styled-components";
import { HelpIcon } from "yugen-uikit";
import useI18n from "hooks/useI18n";

import Tooltip from "../Tooltip/Tooltip";

export interface MultiplierProps {
  multiplier: string;
}

const MultiplierWrapper = styled.div`
  margin-right: 5px;
  font-size: 20px;
  font-weight: 600;
  color: #86878f;
  padding: none;
  text-align: right;

  ${({ theme }) => theme.mediaQueries.sm} {
    text-align: left;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  svg {
    margin-left: 14px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    svg {
      margin-left: 0;
    }
  }
`;

const Multiplier: React.FunctionComponent<MultiplierProps> = ({
  multiplier,
}) => {
  const displayMultipler = multiplier ? multiplier.toLowerCase() : "-";
  const TranslateString = useI18n();

  return (
    <Container>
      <MultiplierWrapper>{displayMultipler}</MultiplierWrapper>
      <Tooltip
        content={
          <div>
            {TranslateString(
              999,
              "The multiplier represents the amount of rewards each farm gets."
            )}
            <br />
            <br />
            {TranslateString(
              999,
              "For example, if a 1x farm was getting 1 fYGN per block, a 20.5x farm would be getting 20.5 fYGN per block."
            )}
          </div>
        }
      >
        <HelpIcon color="#424945" />
      </Tooltip>
    </Container>
  );
};

export default Multiplier;
