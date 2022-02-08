import { HttpLink, from, split } from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";

const testNetLink = {
  ygnStaker: "https://api.thegraph.com/subgraphs/name/yugen-dev/ygn-staker",
  farm: "",
  exchange: "",
  block: "",
  lockup: "",
  burn: "",
  convertor:
    "https://api.thegraph.com/subgraphs/name/yugen-dev/yugen-converter",
};
const maintNetLink = {
  ygnStaker: "https://api.thegraph.com/subgraphs/name/yugen-dev/ygn-staker",
  farm: "",
  exchange: "",
  block: "",
  lockup: "",
  burn: "",
  convertor:
    "https://api.thegraph.com/subgraphs/name/yugen-dev/yugen-converter",
};
const graphLinks = {
  "80001": testNetLink,
  "1": maintNetLink,
  "5": testNetLink,
  "137": maintNetLink,
  "250": maintNetLink,
  "40002": testNetLink,
};

let chainId = "137";
if (window && window.ethereum) {
  chainId = process.env.REACT_APP_CHAIN_ID;
} else if (localStorage && localStorage.getItem("chainId")) {
  chainId = localStorage.getItem("chainId");
}
const finalLinks = graphLinks[chainId];
export const ygnStaker = from([
  new RetryLink(),
  new HttpLink({
    uri: finalLinks.ygnStaker,
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
export const convertor = from([
  new RetryLink(),
  new HttpLink({
    uri: finalLinks.convertor,
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
      ygnStaker,
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
          split(
            (operation) => {
              return operation.getContext().clientName === "convertor";
            },
            convertor,
            split((operation) => {
              return operation.getContext().clientName === "exchange";
            }, exchange)
          )
        )
      )
    )
  )
);
