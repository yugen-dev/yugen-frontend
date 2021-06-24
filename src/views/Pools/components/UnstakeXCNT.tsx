import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Button, useModal } from "@pancakeswap-libs/uikit";
import contracts from "config/constants/contracts";
import useLeave from "hooks/useLeave";
import Label from "../../../components/Label";
import Value from "../../../components/Value";
import useTokenBalance from "../../../hooks/useTokenBalance";

import Card from "./Card";
import CardContent from "./CardContent";
import { getBalanceNumber } from "../../../utils/formatBalance";
import WithdrawModal from "./WithdrawModal";

const UnstakeXCNT: React.FC = () => {
  const xCNTBalance = useTokenBalance(contracts.coffeeTable[80001]);
  const [pendingTx, setPendingTx] = useState(false);
  const [mouseOver, isHovering] = useState(false);

  const { onLeave } = useLeave();

  const tokenName = "xCNT";

  const [onPresentLeave] = useModal(
    <WithdrawModal
      max={xCNTBalance}
      onConfirm={onLeave}
      tokenName={tokenName}
    />
  );

  return (
    <StyledCardWrapper>
      <Card>
        <CardContent>
          <StyledCardContentInner>
            {mouseOver ? <StyledCardAccent /> : <DiabledStyledCardAccent />}
            <StyledCardHeader
              onMouseOver={() => isHovering(true)}
              onMouseOut={() => isHovering(false)}
            >
              <Value value={getBalanceNumber(xCNTBalance)} />
              <Label text="xCNT (CNTStaker) Available" />
            </StyledCardHeader>
            <StyledCardActions>
              <Button
                disabled={!xCNTBalance.toNumber() || pendingTx}
                onClick={async () => {
                  setPendingTx(true);
                  await onPresentLeave();
                  setPendingTx(false);
                }}
              >
                {pendingTx ? "Converting to CNT" : "Convert to CNT"}
              </Button>
            </StyledCardActions>
          </StyledCardContentInner>
        </CardContent>
      </Card>
    </StyledCardWrapper>
  );
};

const RainbowLight = keyframes`

	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

const DiabledStyledCardAccent = styled.div``;

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 12px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`;

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`;

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;
const StyledCardWrapper = styled.div`
  display: flex;
  width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  position: relative;
`;

export default UnstakeXCNT;
