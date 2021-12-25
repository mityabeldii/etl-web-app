/*eslint-disable*/
import React, { Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";
import { useKeycloak } from "@react-keycloak/web";

import { Frame } from "../ui-kit/styled-templates";
import UserApp from "./user-app";
import GuestApp from "./guest-app";

import Alerts from "../modals/alerts";
import Modality from "../modals/modality";

import { useStorageListener } from "../../hooks/useStorage";

const RouterApp = () => {
    const role = useStorageListener((state) => state?.user?.role ?? `guest`);
    const { initialized } = useKeycloak();

    if (!initialized) {
        return <Frame extra={`width: 100%; height: 100%;`}>Loading...</Frame>;
    }

    return (
        <>
            <Alerts />
            <Modality />

            <Switch>
                <Route component={role === `guest` ? GuestApp : UserApp} />
            </Switch>
        </>
    );
};

export default RouterApp;
/*eslint-enable*/
