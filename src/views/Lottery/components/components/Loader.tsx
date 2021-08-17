import React, { memo } from "react";
import styled from "styled-components";
import { Skeleton } from "cryption-uikit";

const Loader = ({
  value,
  customTextAlign = "center",
  customFontSize = "18px",
}) => {
  return (
    <>
      {value !== "" ? (
        <Text
          style={{
            textAlign: `${customTextAlign === "left" ? "left" : "center"}`,
            fontWeight: `${customTextAlign === "left" ? "normal" : "bold"}`,
            fontSize: customFontSize,
          }}
        >
          {value}
        </Text>
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
