/*eslint-disable*/
import React, { Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";
import { useKeycloak } from "@react-keycloak/web";

import { Button, ErrorBox, Form, Frame, H1 } from "../ui-kit/styled-templates";

import { FORMS } from "../../constants/config";

import { Wrapper } from "./user-app";
import useFormControl from "../../hooks/useFormControl";
import { Control } from "../ui-kit/control";
import { useEffect } from "react/cjs/react.development";

const schema = (yup) =>
    yup.object().shape({
        username: yup.string().email(`Неверный формат email`).required(`Обязательное поле`),
        password: yup.string().required(`Это поле обязательно`),
    });

const GuestApp = () => {
    const { keycloak } = useKeycloak();
    const handlers = {
        logout: () => {
            keycloak?.logout();
        },
    };
    return (
        <>
            <Wrapper>
                <Frame extra={`width: 100%; max-width: 350px; padding: 25px; border-radius: 4px; align-items: flex-end;`}>
                    <ErrorBox.Component title={`Доступ запрещен`} />
                    <Button onClick={handlers.logout} background={`red`} >Выход</Button>
                </Frame>
            </Wrapper>
        </>
    );
};

export default GuestApp;
/*eslint-enable*/
