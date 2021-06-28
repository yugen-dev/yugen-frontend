import { HttpLink, from, split } from "@apollo/client";

import { RetryLink } from "@apollo/client/link/retry";

// export const uniswap = from([
//   new RetryLink(),
//   new HttpLink({
//     uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
//
//   }),
// ]);

export const cntStaker = from([
  new RetryLink(),
  new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/gulshanvas/cntstaker",
  }),
]);

export const farm = from([
  new RetryLink(),
  new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/gulshanvas/cntfarm",
  }),
]);

export const exchange = from([
  new RetryLink(),
  new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/gulshanvas/c-exchange",
  }),
]);

export const blocklytics = from([
  new RetryLink(),
  new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/samarth30/mumbai",
  }),
]);

export const lockup = from([
  new RetryLink(),
  new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/matthewlilley/lockup",
  }),
]);
export const burn = from([
  new RetryLink(),
  new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/gulshanvas/cntsubgraph",
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
          exchange
        )
      )
    )
  )
);
