import styled from 'styled-components';

export const ActionContainer = styled.div`
  padding: 25px;
  border-radius: 14px;
  flex-grow: 1;
  flex-basis: 0;
  margin-bottom: 16px;
  background: #1e202a;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 12px;
    margin-right: 12px;
    margin-bottom: 0;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-left: 48px;
    margin-right: 0;
    margin-bottom: 0;
  }
  box-shadow: 1px 1px 0 2px #2082e9, -1px -1px 0 2px #9208fe;
`;

export const ActionTitles = styled.div`
  font-weight: 600;
  font-size: 12px;
  margin-bottom: 15px;
`;

export const Title = styled.span`
  color: #b7b7b8;
  font-size: 16px;
  font-weigth: 600;
`;

export const Subtle = styled.span`
  font-size: 16px;
  font-weigth: 600;
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
