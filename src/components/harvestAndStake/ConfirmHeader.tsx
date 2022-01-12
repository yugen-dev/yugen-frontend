import { Dots } from "components/swap/styleds";
import { Text } from "cryption-uikit";
import React from "react";
import { ArrowRight } from "react-feather";
import styled from "styled-components";

const ConfirmHeader = ({ isLoading, fYgnValue, ygnValue, xYgnValue }) => {
  return (
    <ConfirmHeaderContainer>
      <TokenWrapper>
        <TokenBox>
          <ImageBox>
            <Image
              src="/images/tokens/fygn.webp"
              alt="fYGN token"
              loading="lazy"
            />
          </ImageBox>
          <TokenName>fYGN</TokenName>
        </TokenBox>
        <ArrowBox>
          <ArrowRight />
        </ArrowBox>
        <TokenBox>
          <ImageBox>
            <Image
              src="/images/tokens/xygn.webp"
              alt="xYGN token"
              loading="lazy"
            />
          </ImageBox>
          <TokenName>xYGN</TokenName>
        </TokenBox>
        <PlusBox>+</PlusBox>
        <TokenBox>
          <ImageBox>
            <Image
              src="/images/tokens/ygn.webp"
              alt="YGN token"
              loading="lazy"
            />
          </ImageBox>
          <TokenName>YGN</TokenName>
        </TokenBox>
      </TokenWrapper>
      {isLoading ? (
        <Text textAlign="center" marginTop="15px">
          Calculating
          <Dots />
        </Text>
      ) : (
        <ValueWrapper>
          <Text>
            Harvesting <Value>{fYgnValue?.toFixed(6)} fYGNs</Value> for{" "}
            <Value>{xYgnValue?.toFixed(6)} xYGNs</Value> +{" "}
            <Value>{ygnValue.toFixed(6)} YGNs</Value>
          </Text>
        </ValueWrapper>
      )}
    </ConfirmHeaderContainer>
  );
};

const Value = styled(Text)`
  font-size: 18px;
  display: inline-block;
  font-weight: bold;
`;

const ValueWrapper = styled.div`
  margin-top: 15px;
  text-align: center;
`;

const ConfirmHeaderContainer = styled.div`
  margin-top: 10px;
  width: 100%;
`;

const TokenName = styled(Text)``;

const ImageBox = styled.div``;

const Image = styled.img`
  width: 30px;
`;

const TokenBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const ArrowBox = styled.div`
  margin: 0px 10px;
`;

const PlusBox = styled.div`
  margin: 0px 10px;
`;

const TokenWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default ConfirmHeader;
