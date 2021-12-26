/*eslint-disable*/
import React, { Suspense, lazy, useEffect } from "react";
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
    const { initialized, keycloak } = useKeycloak();
    const { authenticated, login } = keycloak;
    const { role, contextsLoaded } = useStorageListener((state) => ({
        role: state?.user?.contexts
            ?.map?.((i) => _.map(i?.roles, `name`))
            ?.flat?.()
            ?.includes?.(`admin_cpsi`)
            ? `admin`
            : `guest`,
        contextsLoaded: !!state?.user?.contexts,
    }));

    useEffect(() => {
        if (initialized && !authenticated) {
            login();
        }
    }, [initialized, authenticated, login]);

    if (!initialized || !contextsLoaded) {
        return <Frame extra={`width: 100%; height: 100%; min-height: 100vh;`}>Loading...</Frame>;
    }

    return (
        <>
            <Alerts />
            <Modality />
            {initialized &&
                authenticated &&
                ({
                    admin: <UserApp />,
                    guest: <GuestApp />,
                }?.[role] ?? <GuestApp />)}
            )
        </>
    );
};

export default RouterApp;
/*eslint-enable*/
