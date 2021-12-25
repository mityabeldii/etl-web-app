/*eslint-disable*/
import React, { Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";

import { Button, Form, Frame, H1 } from "../ui-kit/styled-templates";

import { FORMS } from "../../constants/config";

import { Wrapper } from "./user-app";
import useFormControl from "../../hooks/useFormControl";
import { Control } from "../ui-kit/control";

const schema = (yup) =>
    yup.object().shape({
        email: yup.string().email(`Неверный формат email`).required(`Обязательное поле`),
        password: yup.string().required(`Это поле обязательно`),
    });

const GuestApp = () => {
    const { onSubmit, clearForm } = useFormControl({ name: FORMS.LOGIN, schema });
    const handlers = {
        submit: (d) => {
            console.log(d);
            // onSubmit(d)
            // clearForm();
        },
    };
    return (
        <>
            <Wrapper>
                <Frame extra={`width: 100%; max-width: 350px; background: #FFFFFF; padding: 25px; border-radius: 4px;`}>
                    <H1>Вход</H1>
                    <Form name={FORMS.LOGIN} onSubmit={onSubmit(handlers.submit)}>
                        <Control.Input name="email" label="Email" isRequired />
                        <Control.Input name="password" label="Пароль" isRequired />
                        <Button type="submit">Войти</Button>
                    </Form>
                </Frame>
            </Wrapper>
        </>
    );
};

export default GuestApp;
/*eslint-enable*/
