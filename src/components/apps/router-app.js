/*eslint-disable*/
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Menu from "../tools/menu";
import { RowWrapper } from "../ui-kit/styled-templates";

// import HomePage from "../pages/home-page";
// import UpdateStatusModal from "../modals/update-status-modal";

const RouterApp = () => {
    return (
        <>
            {/* <UpdateStatusModal /> */}
            <RowWrapper>
                <Menu />
                <Switch>
                    {/* <Route exact path={[`/home`, `/home/:section`]} component={HomePage} /> */}
                    <Route path={`/`}>
                        <Redirect to={`/home`} />
                    </Route>
                </Switch>
            </RowWrapper>
        </>
    );
};

export default RouterApp;
/*eslint-enable*/
