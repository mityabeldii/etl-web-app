/*eslint-disable*/
import React, { Suspense, lazy, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";
import { useKeycloak } from "@react-keycloak/web";

import { Frame } from "components/ui-kit/styled-templates";
import UserApp from "components/apps/user-app";
import GuestApp from "components/apps/guest-app";

import Alerts from "components/modals/alerts";
import Modality from "components/modals/modality";

import { useStorageListener } from "hooks/useStorage";

const RouterApp = () => {
    const { initialized, keycloak } = useKeycloak();
    const { authenticated, login, logout } = keycloak;
    const { role, contextsLoaded } = useStorageListener((state) => ({
        role: state?.user?.contexts
            ?.map?.((i) => _.map(i?.roles, `name`))
            ?.flat?.()
            ?.includes?.(`admin_cpsi`)
            ? `admin`
            : `guest`,
        contextsLoaded: !!state?.user?.contexts,
    }));

    useEffect(async () => {
        if (initialized && !authenticated) {
            try {
                login();
            } catch (error) {
                logout();
            }
        }
    }, [initialized, authenticated, login]);

    if (!initialized || !contextsLoaded) {
        return <Frame extra={`width: 100%; height: 100%; min-height: 100vh;`}>Загрузка...</Frame>;
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
        </>
    );
};

export default RouterApp;
/*eslint-enable*/
