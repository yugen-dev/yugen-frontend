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
    fill: #424945;
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
      <Text color="#424945" bold>
        {expanded ? "Hide" : "Details"}
      </Text>
      {expanded ? (
        <ChevronUpIcon color="#424945" />
      ) : (
        <ChevronDownIcon color="#424945" />
      )}
    </Wrapper>
  );
};

ExpandableSectionButton.defaultProps = {
  expanded: false,
};

export default ExpandableSectionButton;
