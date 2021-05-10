import React from "react";
import styled from "styled-components";

export interface TooltipProps {
  content: React.ReactNode;
}

const TooltipContent = styled.div`
  background: linear-gradient(58.88deg, #2082e9 -1.8%, #9900ff 89.9%);
  color: white;
  padding: 16px;
  border-radius: 14px;
  width: max-content;
  display: none;
  padding: 16px;
  max-height: 500px;
  z-index: ${({ theme }) => theme.zIndices.modal};
  position: absolute;
  bottom: calc(100% + 16px);
  transform: translate(34px, 0);
  right: 0;
  max-width: 246px;

  &:after {
    content: "";
    display: block;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #9900ff;
    bottom: 0;
    position: absolute;
    transform: translate(-34px, 9px);
    right: 0;
    background: linear-gradient(58.88deg, #2082e9 -1.8%, #9900ff 89.9%);
  }
`;

const Container = styled.div`
  position: relative;

  &:hover ${TooltipContent}, &:focus-within ${TooltipContent} {
    display: block;
  }
`;

const Tooltip: React.FunctionComponent<TooltipProps> = ({
  content,
  children,
}) => {
  return (
    <Container>
      {children}
      <TooltipContent>{content}</TooltipContent>
    </Container>
  );
};

export default Tooltip;
