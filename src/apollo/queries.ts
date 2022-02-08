import gql from "graphql-tag";
import { getYgnStakerAddress } from "utils/addressHelpers";

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
const ygnStakerAddress = getYgnStakerAddress();
//  Value of `id` must not be checksummed.
export const ygnStakerQuery = gql`
  query ygnstaker($id: String! = "${
    ygnStakerAddress
      ? ygnStakerAddress.toLocaleLowerCase()
      : "0x940920386550c8Bfdd5F0dC685c23A6148e8cD38"
  }") {
    ygnstakers(id: $id) {
      id
      totalSupply
      ratio
      xYGNMinted
      xYGNBurned
      YGNStaked
      ygnStakedUSD
      ygnHarvested
      ygnHarvestedUSD
      xYGNAge
      xYGNAgeDestroyed
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
