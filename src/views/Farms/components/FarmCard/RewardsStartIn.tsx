import React from "react";
import BigNumber from "bignumber.js";
import Countdown from "react-countdown";
import { Flex, Text } from "yugen-uikit";

const TimerCountdownRenderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}) => {
  if (completed) {
    return "now";
  }
  return (
    <div>
      {days > 0 ? `${days.toString()} days ` : ""}
      {hours > 0 ? `${hours.toString()} hr ` : ""}
      {minutes > 0 ? `${minutes.toString()} min ` : ""}
      {seconds > 0 ? `${seconds.toString()} sec` : ""}
    </div>
  );
};

const RewardsStartIn = ({ farm }) => {
  if (farm.rewardsStartIn) {
    return (
      <Flex justifyContent="space-between">
        <Text color="#9b9382">Rewards start in</Text>
        <Text bold>
          <Countdown
            date={new BigNumber(farm.rewardsStartIn).toNumber() * 1000}
            renderer={TimerCountdownRenderer}
          >
            <div style={{ color: "#424945" }}>Done !</div>
          </Countdown>
        </Text>
      </Flex>
    );
  }
  return <></>;
};

export default RewardsStartIn;
