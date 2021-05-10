import React from "react";
import styled from "styled-components";
import {
  ListViewIcon,
  CardViewIcon,
  IconButton,
} from "cryption-uikit";
import { ViewMode } from "../types";

interface ToogleViewProps {
  viewMode: ViewMode;
  onToggle: (mode: ViewMode) => void;
}

const Container = styled.div`
  margin-left: -8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 0;
  }
`;

const ToggleView: React.FunctionComponent<ToogleViewProps> = ({
  viewMode,
  onToggle,
}) => {
  const handleToggle = (mode: ViewMode) => {
    if (viewMode !== mode) {
      onToggle(mode);
    }
  };

  return (
    <Container>
      <IconButton
        variant="text"
        scale="sm"
        onClick={() => handleToggle(ViewMode.CARD)}
      >
        <CardViewIcon
          color={viewMode === ViewMode.CARD ? "#3C64EF" : "textDisabled"}
        />
      </IconButton>
      <IconButton
        variant="text"
        scale="sm"
        onClick={() => handleToggle(ViewMode.TABLE)}
      >
        <ListViewIcon
          color={viewMode === ViewMode.TABLE ? "#3C64EF" : "textDisabled"}
        />
      </IconButton>
    </Container>
  );
};

export default ToggleView;
