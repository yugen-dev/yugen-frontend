import { HttpLink, from, split } from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";

const testNetLink = {
  cntStaker: "https://api.thegraph.com/subgraphs/name/gulshanvas/cntstaker",
  farm: "https://api.thegraph.com/subgraphs/name/gulshanvas/cntfarm",
  exchange: "https://api.thegraph.com/subgraphs/name/gulshanvas/c-exchange",
  block: "https://api.thegraph.com/subgraphs/name/samarth30/mumbai",
  lockup: "https://api.thegraph.com/subgraphs/name/matthewlilley/lockup",
  burn: "https://api.thegraph.com/subgraphs/name/gulshanvas/cntsubgraph",
};
const maintNetLink = {
  cntStaker:
    "https://api.thegraph.com/subgraphs/name/gulshancryption/cnt-staker",
  farm: "https://api.thegraph.com/subgraphs/name/gulshancryption/cnt-farm",
  exchange:
    "https://api.thegraph.com/subgraphs/name/gulshancryption/cntexchange",
  block: "https://api.thegraph.com/subgraphs/name/sameepsi/maticblocks",
  lockup: "https://api.thegraph.com/subgraphs/name/matthewlilley/lockup",
  burn: "https://api.thegraph.com/subgraphs/name/gulshancryption/cnt",
};
const graphLinks = {
  "80001": testNetLink,
  "1": maintNetLink,
  "5": testNetLink,
  "137": maintNetLink,
};
// export const uniswap = from([
//   new RetryLink(),
//   new HttpLink({
//     uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
//
//   }),
// ]);
const finalLinks =
  window && window.ethereum && window.ethereum.networkVersion
    ? graphLinks[window.ethereum.networkVersion]
    : graphLinks["137"];
export const cntStaker = from([
  new RetryLink(),
  new HttpLink({
    uri: finalLinks.cntStaker,
  }),
]);

export const farm = from([
  new RetryLink(),
  new HttpLink({
    uri: finalLinks.farm,
  }),
]);

export const exchange = from([
  new RetryLink(),
  new HttpLink({
    uri: finalLinks.exchange,
  }),
]);

export const blocklytics = from([
  new RetryLink(),
  new HttpLink({
    uri: finalLinks.block,
  }),
]);

export const lockup = from([
  new RetryLink(),
  new HttpLink({
    uri: finalLinks.lockup,
  }),
]);
export const burn = from([
  new RetryLink(),
  new HttpLink({
    uri: finalLinks.burn,
  }),
]);

export default split(
  (operation) => {
    return operation.getContext().clientName === "blocklytics";
  },
  blocklytics,
  split(
    (operation) => {
      return operation.getContext().clientName === "farm";
    },
    farm,
    split(
      (operation) => {
        return operation.getContext().clientName === "cntstaker";
      },
      cntStaker,
      split(
        (operation) => {
          return operation.getContext().clientName === "lockup";
        },
        lockup,
        split(
          (operation) => {
            return operation.getContext().clientName === "burn";
          },
          burn,
          split((operation) => {
            return operation.getContext().clientName === "exchange";
          }, exchange)
        )
      )
    )
  )
);
