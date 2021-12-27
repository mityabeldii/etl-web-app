/*eslint-disable*/
import { ThemeProvider } from "styled-components";
import { HashRouter } from "react-router-dom";
import moment from "moment-timezone";
import Keycloak from "keycloak-js";
import { ReactKeycloakProvider } from "@react-keycloak/web";

import RouterApp from "./components/apps/router-app";

import theme from "./constants/theme-constants";
import { setUpInterceptors } from "./utils/api-helper";

import { putStorage, StorageProvider } from "./hooks/useStorage";
import axios from "axios";
import UserAPI from "./api/user-api";

// setUpInterceptors();

moment.tz.setDefault("Europe/Moscow");

const keycloak = Keycloak({
    url: "https://dev.sciencenet.ru/auth",
    realm: "cpi",
    clientId: "open_portal",
});

const eventLogger = (event, error) => {
    // console.log("onKeycloakEvent", event, error);
};

const tokenLogger = async (tokens) => {
    // console.log("onKeycloakTokens", tokens);
    if (tokens.token) {
        try {
            await UserAPI.getContexts(tokens?.token);
        } catch (error) {
            keycloak.logout();
        }
    }
};

const App = () => {
    return (
        <ReactKeycloakProvider authClient={keycloak} onEvent={eventLogger} onTokens={tokenLogger}>
            <StorageProvider>
                <ThemeProvider theme={theme}>
                    <HashRouter>
                        <RouterApp />
                    </HashRouter>
                </ThemeProvider>
            </StorageProvider>
        </ReactKeycloakProvider>
    );
};

export default App;

/*eslint-enable*/
