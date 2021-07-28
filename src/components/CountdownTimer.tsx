/* eslint-disable no-console */
/* eslint-disable no-bitwise */
import { Heading } from "cryption-uikit";
import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import styled from "styled-components";

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

const timerProps = {
  isPlaying: true,
  size: 120,
  strokeWidth: 6,
};

const renderTime = (dimension, time) => {
  return (
    <TimeWrapper>
      <TimeStyles>{time}</TimeStyles>
      <div style={{ color: "#99a3ba" }}>{dimension}</div>
    </TimeWrapper>
  );
};

const getTimeSeconds = (time) => (minuteSeconds - time) | 0;
const getTimeMinutes = (time) => ((time % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = (time) => ((time % daySeconds) / hourSeconds) | 0;
const getTimeDays = (time) => (time / daySeconds) | 0;

const CountdownTimer = ({ unixEndTimeInSeconds }) => {
  const stratTime = Date.now() / 1000; // use UNIX timestamp in seconds
  const endTime = unixEndTimeInSeconds; // use UNIX timestamp in seconds
  const remainingTime = endTime - stratTime;

  if (endTime && remainingTime > 0) {
    const days = Math.ceil(remainingTime / daySeconds);
    const daysDuration = days * daySeconds;

    return (
      <Container>
        <div>
          <Heading marginBottom="5px" color="#99a3ba">
            Rewards starting in
          </Heading>
        </div>
        <CountdownContainer>
          <SingleCountdownContainer>
            <CountdownCircleTimer
              {...timerProps}
              colors={[
                ["#2A76EB", 0.5],
                ["#9702FF", 0.5],
              ]}
              duration={daysDuration}
              initialRemainingTime={remainingTime}
              strokeWidth={2}
              size={75}
              isLinearGradient
            >
              {({ elapsedTime }) =>
                renderTime("day", getTimeDays(daysDuration - elapsedTime))
              }
            </CountdownCircleTimer>
          </SingleCountdownContainer>
          <SingleCountdownContainer>
            <CountdownCircleTimer
              {...timerProps}
              colors={[
                ["#2A76EB", 0.5],
                ["#9702FF", 0.5],
              ]}
              duration={daySeconds}
              initialRemainingTime={remainingTime % daySeconds}
              onComplete={(totalElapsedTime) => [
                remainingTime - totalElapsedTime > hourSeconds,
                0,
              ]}
              strokeWidth={2}
              size={75}
              isLinearGradient
            >
              {({ elapsedTime }) =>
                renderTime("hour", getTimeHours(daySeconds - elapsedTime))
              }
            </CountdownCircleTimer>
          </SingleCountdownContainer>
          <SingleCountdownContainer>
            <CountdownCircleTimer
              {...timerProps}
              colors={[
                ["#2A76EB", 0.5],
                ["#9702FF", 0.5],
              ]}
              duration={hourSeconds}
              initialRemainingTime={remainingTime % hourSeconds}
              onComplete={(totalElapsedTime) => [
                remainingTime - totalElapsedTime > minuteSeconds,
                0,
              ]}
              strokeWidth={2}
              isLinearGradient
              size={75}
            >
              {({ elapsedTime }) =>
                renderTime("min", getTimeMinutes(hourSeconds - elapsedTime))
              }
            </CountdownCircleTimer>
          </SingleCountdownContainer>
          <SingleCountdownContainer>
            <CountdownCircleTimer
              {...timerProps}
              colors={[
                ["#2A76EB", 0.5],
                ["#9702FF", 0.5],
              ]}
              duration={minuteSeconds}
              initialRemainingTime={remainingTime % minuteSeconds}
              onComplete={(totalElapsedTime) => [
                remainingTime - totalElapsedTime > 0,
                0,
              ]}
              strokeWidth={2}
              isLinearGradient
              size={75}
            >
              {({ elapsedTime }) =>
                renderTime("sec", getTimeSeconds(elapsedTime))
              }
            </CountdownCircleTimer>
          </SingleCountdownContainer>
        </CountdownContainer>
      </Container>
    );
  }
  return <></>;
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  margin: 40px 0 0 0;
  flex-direction: column;
`;

const CountdownContainer = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
`;

const SingleCountdownContainer = styled.div`
  margin: 10px;
`;

const TimeWrapper = styled.div``;
const TimeStyles = styled.div`
  font-size: 22px;
  color: white;
`;

export default CountdownTimer;
