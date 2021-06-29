import gql from "graphql-tag";

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

//  Value of `id` must not be checksummed.
export const cntStakerQuery = gql`
  query cntStaker($id: String! = "0x5da1f601486252ca41d04e6caa49b19dd0bfa888") {
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
