import React, { useEffect } from "react";
import { Dots } from "components/swap/styleds";
import { Text } from "cryption-uikit";
import { ArrowRight } from "react-feather";
import styled from "styled-components";
import BigNumber from "bignumber.js";

const ConfirmHeader = ({
  isLoading,
  fYgnValue,
  ygnValue,
  xYgnValue,
  fetchFunction,
}) => {
  const getValues = () => {
    fetchFunction();
  };

  useEffect(() => {
    getValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ConfirmHeaderContainer>
      {isLoading && new BigNumber(fYgnValue).isZero() ? (
        <Text textAlign="center" marginTop="15px">
          Calculating
          <Dots />
        </Text>
      ) : (
        <TokenWrapper>
          <TokenBox>
            <ImageBox>
              <Image
                src="/images/tokens/fygn.webp"
                alt="fYGN token"
                loading="lazy"
              />
            </ImageBox>
            <TokenValue>{fYgnValue?.toFixed(6)}</TokenValue>
            <TokenName>fYGN</TokenName>
          </TokenBox>
          <ArrowBox>
            <ArrowRight />
          </ArrowBox>
          <TokenBox>
            <ImageBox>
              <Image
                src="/images/tokens/ygn.webp"
                alt="YGN token"
                loading="lazy"
              />
            </ImageBox>
            <TokenValue>{ygnValue?.toFixed(6)}</TokenValue>
            <TokenName>YGN</TokenName>
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
            <TokenValue>{xYgnValue?.toFixed(6)}</TokenValue>
            <TokenName>xYGN</TokenName>
          </TokenBox>
        </TokenWrapper>
      )}
    </ConfirmHeaderContainer>
  );
};

const TokenValue = styled(Text)`
  font-size: 18px;
  display: inline-block;
  font-weight: bold;
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

const TokenWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default ConfirmHeader;
