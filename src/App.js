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

moment.tz.setDefault("Europe/Moscow");
setUpInterceptors();

const keycloak = Keycloak({
    url: `${process.env.REACT_APP_KEYCLOAK_URL}/auth`,
    realm: "cpi",
    clientId: "open_portal",
});

const eventLogger = (event, error) => {
    // console.log("onKeycloakEvent", event, error);
};

const tokenLogger = async (tokens) => {
    try {
        if (tokens.token) {
            localStorage.setItem("auth_token_etl", tokens.token);
            await UserAPI.getContexts(tokens?.token);
        }
    } catch (error) {
        localStorage.removeItem("auth_token_etl");
        keycloak.logout();
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
