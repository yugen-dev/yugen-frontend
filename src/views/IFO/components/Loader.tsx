import React from "react";
import styled from "styled-components";
import { Skeleton } from "cryption-uikit";

const Loader = ({ value }) => {
  return (
    <>
      {value !== "" ? (
        <Text>{value}</Text>
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
  font-size: 15px;
  width: 100%;
  text-align: left;
`;

const BackgroundLoading = styled.div`
  padding: 1px;
  background-image: linear-gradient(to right, #2082e9, #9900ff);
  border-radius: 5px;
`;

export default Loader;
