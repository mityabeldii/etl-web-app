/*eslint-disable*/
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// import HomePage from "../pages/home-page";
// import UpdateStatusModal from "../modals/update-status-modal";

const UserApp = () => {
    return (
        <>
            {/* <UpdateStatusModal /> */}
            <Switch>
                {/* <Route exact path={[`/home`, `/home/:section`]} component={HomePage} /> */}
                <Route path={`/`}>
                    <Redirect to={`/home`} />
                </Route>
            </Switch>
        </>
    );
};

export default UserApp;
/*eslint-enable*/
