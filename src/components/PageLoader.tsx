import React from "react";
import styled from "styled-components";
import Loader from "react-loader-spinner";
import Page from "./layout/Page";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <Loader type="Oval" height={300} width={200} color="#d47a3e" />
    </Wrapper>
  );
};

export default PageLoader;
