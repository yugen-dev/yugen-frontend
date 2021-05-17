import React from "react";
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import LinearProgress from '@material-ui/core/LinearProgress';
import styled from "styled-components";
import { Text } from "cryption-uikit";

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 4,
      borderRadius: 2,
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
      borderRadius: 2,
      background: 'linear-gradient(101.01deg ,#9900FF 41.86%,#2082E9 88.75%)'
    },
  }),
)(LinearProgress);
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CardValueProps {
  totalSuply?: number;
  circulatingSupply?: number;
}
const Card = styled.div`
    border-radius: 0.625rem !important;
    padding: 30px 15px;
    background-color: #1E202A;
`;
const TextAlignMent = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
`;
const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
const ProgressItemText = styled.div`
  display: flex;
  flex-direction: column;
`;
const CardValue: React.FC<CardValueProps> = ({ totalSuply, circulatingSupply }) => {
  const numberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  let progressBar = 0;
  if (totalSuply && circulatingSupply && totalSuply > 0 && circulatingSupply > 0) {
    progressBar = (100 * circulatingSupply) / totalSuply;
  }
  return (
    <Card>
      <ProgressText style={{ marginBottom: '15px' }}>
        <Text color="white" fontSize="18px" fontWeight="700">
          CNt & Summary
          </Text>
        <Text color="#C1C5CB" fontSize="12px" ml="5px">
          * Amount allocated through mining is distributed every second</Text>
      </ProgressText>
      <ProgressText>
        <ProgressItemText>
          <Text color="#9d9fa8" fontSize="15px">
            Circulating Supply
            </Text>
          <Text color="#2082E9" fontSize="22px" fontWeight="700" style={{ display: 'flex', alignItems: 'center' }}>
            {numberWithCommas(circulatingSupply)}  <Text color="#C1C5CB" fontSize="15px" ml="8px"> CNT </Text>
          </Text>
        </ProgressItemText>
        <ProgressItemText>
          <Text color="#9d9fa8" fontSize="15px">
            Total Supply
            </Text>
          <Text color="white" fontSize="22px" fontWeight="700" style={{ display: 'flex', alignItems: 'center' }}>
            {numberWithCommas(totalSuply)} <Text color="#C1C5CB" fontSize="15px" ml="8px"> CNT</Text>
          </Text>
        </ProgressItemText>
      </ProgressText>
      <BorderLinearProgress variant="determinate" value={progressBar} />
      <Grid container spacing={5} style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={6} lg={6} xl={6} style={{ borderRight: '1px solid #524B63' }}>
          <TextAlignMent>
            <ProgressText>
              <Text color="#9d9fa8" fontSize="16px">
                Price
            </Text>
              <Text color="white" fontSize="16px" fontWeight="700"> $122 </Text>
            </ProgressText>
            <ProgressText>
              <Text color="#9d9fa8" fontSize="16px">
                Daily Allocation
            </Text>
              <Text color="white" fontSize="16px" fontWeight="700" style={{ display: 'flex', alignItems: 'center' }}>
                {numberWithCommas(86400)}
                <Text color="#C1C5CB" fontSize="12px" ml="5px"> CNT</Text>
              </Text>
            </ProgressText>
            <ProgressText>
              <Text color="#9d9fa8" fontSize="16px">
                Accumulated
            </Text>
              <Text color="white" fontSize="16px" fontWeight="700" style={{ display: 'flex', alignItems: 'center' }}>
                {numberWithCommas(86400)}
                <Text color="#C1C5CB" fontSize="12px" ml="5px"> CNT</Text>
              </Text>
            </ProgressText>
            <ProgressText>
              <Text color="#9d9fa8" fontSize="16px">
                Remaining
            </Text>
              <Text color="white" fontSize="16px" fontWeight="700" style={{ display: 'flex', alignItems: 'center' }}>
                {numberWithCommas(86400)}
                <Text color="#C1C5CB" fontSize="12px" ml="5px"> CNT</Text>
              </Text>
            </ProgressText>
          </TextAlignMent>
        </Grid>
        <Grid item xs={12} md={6} lg={6} xl={6}>
          <TextAlignMent>
            <ProgressText>
              <Text color="#9d9fa8" fontSize="16px">
                CNT Price
            </Text>
              <Text color="#2082E9" fontSize="16px" fontWeight="700"> $122 </Text>
            </ProgressText>
            <ProgressText>
              <Text color="#9d9fa8" fontSize="16px">
                Fees
            </Text>
              <Text color="white" fontSize="16px" fontWeight="700"> $1312.23 </Text>
            </ProgressText>
            <ProgressText>
              <Text color="#C1C5CB" fontSize="16px">
                Pairs
            </Text>
              <Text color="white" fontSize="16px" fontWeight="700"> 42 </Text>
            </ProgressText>
          </TextAlignMent>
        </Grid>
      </Grid>
    </Card>
  );
};

export default CardValue;
