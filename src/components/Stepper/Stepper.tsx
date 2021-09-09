/* eslint-disable react/destructuring-assignment */
import React, { useEffect } from "react";
import styled from "styled-components";
import clsx from "clsx";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import StepConnector from "@material-ui/core/StepConnector";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import { StepIconProps } from "@material-ui/core/StepIcon";
import StepLabel from "@material-ui/core/StepLabel";

const StepperContainerDiv = styled.div`
  background: rgb(30, 32, 42);
  border-radius: 0.625rem;
  height: 100%;
  align-items: center;
  padding: 0px;
`;
const TipText = styled.p`
  padding: 0px 24px;
  text-align: center;
  color: rgb(207, 204, 204);
  font-weight: 500;
  font-size: 13px;
`;

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundImage:
        "linear-gradient(101.01deg,#9900FF 41.86%,#2082E9 88.75%)",
    },
  },
  completed: {
    "& $line": {
      backgroundImage:
        "linear-gradient(101.01deg,#9900FF 41.86%,#2082E9 88.75%)",
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#9497A5",
    zIndex: 1,
    color: "white",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundImage: "linear-gradient(101.01deg,#9900FF 41.86%,#2082E9 88.75%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    color: "#ffffff",
  },
  completed: {
    backgroundImage: "linear-gradient(101.01deg,#9900FF 41.86%,#2082E9 88.75%)",
    color: "#ffffff",
  },
});

function ColorlibStepIcon(props: StepIconProps) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {props.icon}
    </div>
  );
}

function getSteps() {
  return ["Initiated", "Deposited on Ethereum", "Staked on Polygon"];
}

const StepperContainer = ({ activeIndex = 1 }) => {
  const [activeStep, setActiveStep] = React.useState(activeIndex);
  const steps = getSteps();
  useEffect(() => {
    setActiveStep(activeIndex);
  }, [activeIndex]);
  return (
    <StepperContainerDiv>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<ColorlibConnector />}
        style={{ background: "#1e202a", borderRadius: "0.625rem" }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>
              <span style={{ color: "white" }}>{label}</span>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <TipText>
        Tip: It Takes around 8-9 minutes for second and third step to complete !
      </TipText>
    </StepperContainerDiv>
  );
};

export default StepperContainer;
