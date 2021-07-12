import React, { useCallback, useState } from "react";
import styled from "styled-components";
import Popover, { PopoverProps } from "../Popover";

const TooltipContainer = styled.div`
  width: 228px;
  padding: 0.6rem 1rem;
  line-height: 150%;
  color: #9d9fa8;
  font-weight: 400;
`;

const CustomTooltipContainer = styled.div`
  width: 100%;
  padding: 0.6rem 1rem;
  line-height: 150%;
  color: #9d9fa8;
  font-weight: 400;
`;

interface TooltipProps extends Omit<PopoverProps, "content"> {
  text: string;
  forceToNewLine?: boolean;
}

export default function Tooltip({
  text,
  forceToNewLine,
  ...rest
}: TooltipProps) {
  if (forceToNewLine) {
    const temp = text;
    const newTemp = temp.split("\n").map((str) => <p>{str}</p>);
    return (
      <Popover
        content={<CustomTooltipContainer>{newTemp}</CustomTooltipContainer>}
        {...rest}
      />
    );
  }
  return (
    <Popover content={<TooltipContainer>{text}</TooltipContainer>} {...rest} />
  );
}

export function MouseoverTooltip({
  children,
  ...rest
}: Omit<TooltipProps, "show">) {
  const [show, setShow] = useState(false);
  const open = useCallback(() => setShow(true), [setShow]);
  const close = useCallback(() => setShow(false), [setShow]);
  return (
    <Tooltip {...rest} show={show}>
      <div onMouseEnter={open} onMouseLeave={close}>
        {children}
      </div>
    </Tooltip>
  );
}
