import styled from "styled-components";

export const ActionContainer = styled.div`
  padding: 25px;
  border-radius: 14px;
  flex-grow: 1;
  flex-basis: 0;
  margin: 16px 0px;
  background: #ffffff;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 16px 12px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    width: 400px;
    margin-left: 0;
    margin-right: 48px;
  }
  border: 1px solid #887963;
`;

export const ActionTitles = styled.div`
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 15px;
`;

export const Title = styled.span`
  color: #b7b7b8;
  font-size: 16px;
  font-weight: 600;
`;

export const Subtle = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #86878f;
`;

export const ActionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export const Earned = styled.div`
  font-weight: 600;
  font-size: 25px;
  color: #b7b7b8;
`;

export const Staked = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #86878f;
  margin-top: 5px;
`;
