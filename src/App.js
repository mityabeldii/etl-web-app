import { ThemeProvider } from "styled-components";
import { HashRouter } from "react-router-dom";

import RouterApp from "./components/apps/router-app";

import theme from "./constants/theme-constants";
import { setUpInterceptors } from "./utils/api-helper";

import { StorageProvider } from "./hooks/useStorage";

setUpInterceptors();

const App = () => {
    return (
        <StorageProvider>
            <ThemeProvider theme={theme}>
                <HashRouter>
                    <RouterApp />
                </HashRouter>
            </ThemeProvider>
        </StorageProvider>
    );
};

export default App;
