import React from "react";
import { ModalProvider } from "yugen-uikit";
import { Web3ReactProvider, createWeb3ReactRoot } from "@web3-react/core";
import { Provider } from "react-redux";
import { getLibrary } from "utils/web3React";
import getLibraryEther from "utils/getLibraryEther";
// import { LanguageContextProvider } from "contexts/Localisation/languageContext";
import { ThemeContextProvider } from "contexts/ThemeContext";
// import { RefreshContextProvider } from "contexts/RefreshContext";
import store from "state";
import { NetworkContextName } from "./constants";

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);
const Web3Provider = createWeb3ReactRoot("web3");
const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibraryEther}>
      <Web3Provider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibraryEther}>
          <Provider store={store}>
            <ThemeContextProvider>
              {/* <LanguageContextProvider> */}
              {/* <RefreshContextProvider> */}
              <ModalProvider>{children}</ModalProvider>
              {/* </RefreshContextProvider> */}
              {/* </LanguageContextProvider> */}
            </ThemeContextProvider>
          </Provider>
        </Web3ProviderNetwork>
      </Web3Provider>
    </Web3ReactProvider>
  );
};

export default Providers;
