import React, { useEffect, lazy } from "react";
import { Router, Redirect, Route, Switch } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { ResetCSS } from "cryption-uikit";
import BigNumber from "bignumber.js";
import useEagerConnect from "hooks/useEagerConnect";
import { useFetchPriceList, useFetchPublicData } from "state/hooks";
import { useApollo } from "apollo/index";
import GlobalStyle from "./style/Global";
import Menu from "./components/Menu";
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
} from "./views/AddLiquidity/redirects";
import { RedirectOldRemoveLiquidityPathStructure } from "./views/RemoveLiquidity/redirects";
import SuspenseWithChunkError from "./components/SuspenseWithChunkError";
import ToastListener from "./components/ToastListener";
import PageLoader from "./components/PageLoader";
import EasterEgg from "./components/EasterEgg";
import Pools from "./views/Pools";
import history from "./routerHistory";

// Route-based code splitting
// Only pool is included in the main bundle because of it's the most visited page
const Home = lazy(() => import("./views/Home"));
const Farms = lazy(() => import("./views/Farms"));
const FarmsMultiRewards = lazy(() => import("./views/FarmsMultiRewards"));
const Migrate = lazy(() => import("./views/Migrate"));
const CNTStaker = lazy(() => import("./views/CNTStaker"));
const Swap = lazy(() => import("./views/Swap"));
const AddLiquidity = lazy(() => import("./views/AddLiquidity"));
const Pool = lazy(() => import("./views/Pool"));
const PoolFinder = lazy(() => import("./views/PoolFinder"));
const MigrateFinder = lazy(() => import("./views/MigrationFinder"));
const RemoveLiquidity = lazy(() => import("./views/RemoveLiquidity"));
// const IFO = lazy(() => import("./views/IFO"));
const Lottery = lazy(() => import("./views/Lottery"));
const RewardsManager = lazy(() => import("./views/RewardsManager"));

// const Ifos = lazy(() => import("./views/IFO"));
const NotFound = lazy(() => import("./views/NotFound"));
// const Teams = lazy(() => import("./views/Teams"));
// const Team = lazy(() => import("./views/Teams/Team"));
// const Profile = lazy(() => import("./views/Profile"));

// This config is required for number formating
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

const App: React.FC = () => {
  // Monkey patch warn() because of web3 flood
  // To be removed when web3 1.3.5 is released
  useEffect(() => {
    console.warn = () => null;
  }, []);

  useEagerConnect();
  useFetchPublicData();
  // useFetchProfile();
  useFetchPriceList();
  // useGetDocumentTitlePrice();
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
              <Route path="/multirewards">
                <FarmsMultiRewards />
              </Route>
              <Route path="/pools">
                <Pools />
              </Route>
              <Route exact strict path="/migrate">
                <Migrate />
              </Route>
              <Route path="/cntstaker">
                <CNTStaker />
              </Route>
              <Route exact strict path="/swap" component={Swap} />
              <Route exact strict path="/find" component={PoolFinder} />
              <Route
                exact
                strict
                path="/migrate/find"
                component={MigrateFinder}
              />
              <Route exact strict path="/pool" component={Pool} />
              <Route exact path="/add" component={AddLiquidity} />
              <Route
                exact
                strict
                path="/remove/:currencyIdA/:currencyIdB"
                component={RemoveLiquidity}
              />
              {/* <Route exact path="/ifo" component={IFO} /> */}
              <Route exact path="/lottery" component={Lottery} />
              <Route exact path="/rewardsmanager" component={RewardsManager} />

              {/* Redirection: These old routes are still used in the code base */}
              <Route
                exact
                path="/add/:currencyIdA"
                component={RedirectOldAddLiquidityPathStructure}
              />
              <Route
                exact
                path="/add/:currencyIdA/:currencyIdB"
                component={RedirectDuplicateTokenIds}
              />
              <Route
                exact
                strict
                path="/remove/:tokens"
                component={RedirectOldRemoveLiquidityPathStructure}
              />

              {/* <Route path="/lottery">
              <Lottery />
            </Route> */}
              {/* <Route path="/ifo">
                <Ifos />
              </Route> */}
              {/* <Route path="/collectibles">
              <Collectibles />
            </Route> */}
              {/* <Route exact path="/teams">
              <Teams />
            </Route> */}
              {/* <Route path="/teams/:id">
              <Team />
            </Route> */}
              {/* <Route path="/profile">
              <Profile />
            </Route> */}
              {/* Redirect */}
              <Route path="/staking">
                <Redirect to="/pools" />
              </Route>
              <Route path="/syrup">
                <Redirect to="/pools" />
              </Route>
              <Route path="/nft">
                <Redirect to="/collectibles" />
              </Route>
              {/* 404 */}
              <Route component={NotFound} />
            </Switch>
          </SuspenseWithChunkError>
        </Menu>
        <EasterEgg iterations={2} />
        <ToastListener />
      </Router>
    </ApolloProvider>
  );
};

export default React.memo(App);
