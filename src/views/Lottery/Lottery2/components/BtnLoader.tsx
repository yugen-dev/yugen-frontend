import React, { memo } from "react";
import styled from "styled-components";
import { IconButton, AutoRenewIcon } from "cryption-uikit";

const BtnLoader = ({ value }) => {
  return (
    <>
      {value !== "" ? (
        <Text>{value}</Text>
      ) : (
        <IconButton
          isLoading
          > <AutoRenewIcon spin color="currentColor" />
        </IconButton>
      )}
    </>
  );
};

const Text = styled.div`
  color: white;
  font-weight: 600;
  font-size: 18px;
  width: 100%;
  text-align: center;
`;



export default memo(BtnLoader);
