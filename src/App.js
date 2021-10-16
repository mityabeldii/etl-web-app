import { ThemeProvider } from "styled-components";
import { HashRouter as Router } from "react-router-dom";

import UserApp from "./components/apps/user-app";

import theme from "./constants/theme-constants";
import { setUpInterceptors } from "./utils/api-helper";

import { StorageProvider } from "./hooks/useStorage";

setUpInterceptors();

const App = () => {
    return (
        <StorageProvider>
            <ThemeProvider theme={theme}>
                <Router>
                    <UserApp />
                </Router>
            </ThemeProvider>
        </StorageProvider>
    );
};

export default App;
