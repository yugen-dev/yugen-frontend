import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ApplicationUpdater from "./state/application/updater";
import ListsUpdater from "./state/lists/updater";
import MulticallUpdater from "./state/multicall/updater";
import TransactionUpdater from "./state/transactions/updater";
import Providers from "./Providers";

declare const window: any;

if ("ethereum" in window) {
  (window && window.ethereum as any).autoRefreshOnNetworkChange = false;
}

window.addEventListener("error", () => {
  localStorage?.removeItem("redux_localstorage_simple_lists");
});
ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <>
        <ListsUpdater />
        <ApplicationUpdater />
        <TransactionUpdater />
        <MulticallUpdater />
      </>
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById("root")
);
