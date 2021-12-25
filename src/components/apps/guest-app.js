/*eslint-disable*/
import React, { Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";
import { useKeycloak } from "@react-keycloak/web";

import { Button, Form, Frame, H1 } from "../ui-kit/styled-templates";

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
    const { onSubmit, clearForm } = useFormControl({ name: FORMS.LOGIN, schema });
    const { keycloak } = useKeycloak();
    const handlers = {
        submit: (d) => {
            console.log(d);
            keycloak?.login({ redirectUri: window?.location?.origin ?? `/` });
        },
    };
    console.log(keycloak);
    useEffect(() => {
        // if (keycloak?.authenticated) {
        //     clearForm();
        // }
        keycloak.loadUserInfo().then((d) => {
            console.log(d);
        });
    }, [keycloak?.login]);
    return null;
    return (
        <>
            <Wrapper>
                <Frame extra={`width: 100%; max-width: 350px; background: #FFFFFF; padding: 25px; border-radius: 4px;`}>
                    <H1>Вход</H1>
                    <Form name={FORMS.LOGIN} onSubmit={onSubmit(handlers.submit)}>
                        <Control.Input name="username" label="Email" isRequired />
                        <Control.Password name="password" label="Пароль" isRequired />
                        <Button type="submit">Войти</Button>
                    </Form>
                </Frame>
            </Wrapper>
        </>
    );
};

export default GuestApp;
/*eslint-enable*/
