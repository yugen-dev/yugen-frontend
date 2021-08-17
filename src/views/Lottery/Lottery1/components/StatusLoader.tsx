import React, { memo } from "react";
import styled from "styled-components";
import { Skeleton } from "cryption-uikit";

const Loader = ({ value }) => {
  let displayValue = "OPEN";
  let displayColor = "#50DE39";

  if (value === "0") {
    displayValue = "NOT STARTED";
    displayColor = "#DCFE08";
  } else if (value === "1") {
    displayValue = "IN PROGRESS";
    displayColor = "#50DE39";
  } else {
    displayValue = "CLOSED";
    displayColor = "#EF4542";
  }

  return (
    <>
      {value !== "" ? (
        <Text style={{ color: `${displayColor}` }}>{displayValue}</Text>
      ) : (
        <BackgroundLoading>
          <Skeleton height={10} width={100} />
        </BackgroundLoading>
      )}
    </>
  );
};

const Text = styled.div`
  color: #86878f;
  font-weight: 600;
  font-size: 18px;
  width: 100%;
  text-align: center;
`;

const BackgroundLoading = styled.div`
  padding: 1px;
  background-image: linear-gradient(to right, #2082e9, #9900ff);
  border-radius: 5px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default memo(Loader);
