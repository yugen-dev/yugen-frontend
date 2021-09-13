import gql from "graphql-tag";
import { getCNTStakerAddress } from "utils/addressHelpers";

export const dayDataFieldsQuery = gql`
  fragment dayDataFields on DayData {
    id
    date
    volumeETH
    volumeUSD
    untrackedVolume
    liquidityETH
    liquidityUSD
    txCount
  }
`;

// Dashboard...
export const dayDatasQuery = gql`
  query dayDatasQuery($first: Int! = 1000, $date: Int! = 0) {
    dayDatas(first: $first, orderBy: date, orderDirection: desc) {
      ...dayDataFields
    }
  }
  ${dayDataFieldsQuery}
`;
export const burnQuery = gql`
  {
    cntBurns(first: 5) {
      id
      amount
    }
  }
`;
const cntStakerAddress = getCNTStakerAddress();
//  Value of `id` must not be checksummed.
export const cntStakerQuery = gql`
  query cntStaker($id: String! = "${
    cntStakerAddress
      ? cntStakerAddress.toLocaleLowerCase()
      : "0x82C2Fb7410dcfFEd4e9147413BD5005a0a6F58aA"
  }") {
    cntstaker(id: $id) {
      id
      totalSupply
      ratio
      xCNTMinted
      xCNTBurned
      CNTStaked
      cntStakedUSD
      cntHarvested
      cntHarvestedUSD
      xCNTAge
      xCNTAgeDestroyed
      # histories(first: 1000) {
      #   id
      #   date
      #   timeframe
      #   sushiStaked
      #   sushiStakedUSD
      #   sushiHarvested
      #   sushiHarvestedUSD
      #   xSushiAge
      #   xSushiAgeDestroyed
      #   xSushiMinted
      #   xSushiBurned
      #   xSushiSupply
      #   ratio
      # }
    }
  }
`;

export const stakerAllocatedQquery = gql`
  query weekDatas($first: Int! = 1, $orderBy: String! = "blockNumber") {
    weekDatas(first: $first, orderBy: $orderBy, orderDirection: desc) {
      blockNumber
      stakersAllocated
    }
  }
`;
