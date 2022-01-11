import React, { useEffect, lazy } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { ResetCSS } from "cryption-uikit";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import useEagerConnect from "hooks/useEagerConnect";
import { useFetchPriceList, useFetchPublicData } from "state/hooks";
import { useApollo } from "apollo/index";
import { useSetChainId } from "state/application/hooks";
import GlobalStyle from "./style/Global";
import Menu from "./components/Menu";
import SuspenseWithChunkError from "./components/SuspenseWithChunkError";
import ToastListener from "./components/ToastListener";
import PageLoader from "./components/PageLoader";
import history from "./routerHistory";
import Farms from "./views/Farms";

// Route-based code splitting
// Only farms is included in the main bundle because of it's the most visited page
const Home = lazy(() => import("./views/Home"));
const YGNStaker = lazy(() => import("./views/YGNStaker"));
const FYGNBurner = lazy(() => import("./views/FYGNBurner"));
const RewardsManager = lazy(() => import("./views/RewardsManagerFactory"));
const Bonds = lazy(() => import("./views/Bonds"));

const NotFound = lazy(() => import("./views/NotFound"));

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const App: React.FC = () => {
  const setChainId = useSetChainId();
  // Monkey patch warn() because of web3 flood
  // To be removed when web3 1.3.5 is released
  useEffect(() => {
    console.warn = () => null;
    if (window && window.ethereum) {
      window.ethereum.on("chainChanged", () => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        window.location.reload();
      });
    }
    const getChainID = async () => {
      const web3 = new Web3(
        window && window.ethereum
          ? window.ethereum
          : process.env.REACT_APP_NETWORK_URL
      );
      const chianId = await web3.eth.net.getId();
      setChainId(chianId);
      if (localStorage) {
        localStorage.setItem("chainId", chianId.toString());
      }
    };
    getChainID();
  }, [setChainId]);

  useEagerConnect();
  useFetchPublicData();
  useFetchPriceList();
  const client = useApollo();
  return (
    <ApolloProvider client={client}>
      <Router history={history}>
        <ResetCSS />
        <GlobalStyle />
        <Menu>
          <SuspenseWithChunkError fallback={<PageLoader />}>
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/farms">
                <Farms />
              </Route>
              <Route path="/ygnstaker">
                <YGNStaker />
              </Route>
              <Route path="/fygnburner">
                <FYGNBurner />
              </Route>
              <Route path="/bonds">
                <Bonds />
              </Route>
              <Route exact path="/rewardsmanager" component={RewardsManager} />

              {/* 404 */}
              <Route component={NotFound} />
            </Switch>
          </SuspenseWithChunkError>
        </Menu>
        <ToastListener />
      </Router>
    </ApolloProvider>
  );
};

export default React.memo(App);
