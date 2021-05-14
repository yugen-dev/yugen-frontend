import React from "react";
import styled from "styled-components";
import { ChevronDownIcon, ChevronUpIcon, Text } from "cryption-uikit";

export interface ExpandableSectionButtonProps {
  onClick?: () => void;
  expanded?: boolean;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    fill: #2082E9;
  }
`;

const ExpandableSectionButton: React.FC<ExpandableSectionButtonProps> = ({
  onClick,
  expanded,
}) => {
  return (
    <Wrapper
      aria-label="Hide or show expandable content"
      role="button"
      onClick={() => onClick()}
    >
      <Text color="#2082E9" bold>
        {expanded ? "Hide" : "Details"}
      </Text>
      {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
    </Wrapper>
  );
};

ExpandableSectionButton.defaultProps = {
  expanded: false,
};

export default ExpandableSectionButton;
