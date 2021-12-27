/*eslint-disable*/
import { useState } from "react";
import styled, { css } from "styled-components";
import { MODALS, FORMS } from "../../constants/config";

import { Frame, Button, Input, Dropdown, H1, P, Link, Form, ErrorBox } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import PopUpWrapper from "./pop-up-wrapper";

import DatasourceAPI from "../../api/datasource-api";

import { eventDispatch } from "../../hooks/useEventListener";
import useFormControl from "../../hooks/useFormControl";
import ModalsHelper from "../../utils/modals-helper";

const schema = (yup) =>
    yup.object().shape({
        name: yup.string().required(`Это поле обязательно`),
        host: yup.string().required(`Это поле обязательно`),
        port: yup.string().required(`Это поле обязательно`),
        base: yup.string().required(`Это поле обязательно`),
        user: yup.string().required(`Это поле обязательно`),
        password: yup.string().required(`Это поле обязательно`),
    });

const EditTableNameModal = () => {
    const { onSubmit, clearForm } = useFormControl({ name: FORMS.EDIT_TABLE_NAME, schema });
    const handleSubmit = async (data) => {
        await DatasourceAPI.createDatasource(data);
        ModalsHelper.hideModal(MODALS.EDIT_TABLE_NAME);
    };
    const closeModal = () => {
        clearForm();
        ModalsHelper.hideModal(MODALS.EDIT_TABLE_NAME);
    };
    return (
        <PopUpWrapper name={MODALS.EDIT_TABLE_NAME} onClickOutside={closeModal}>
            <Form name={FORMS.EDIT_TABLE_NAME} onSubmit={onSubmit(handleSubmit)}>
                <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px;`}>Редактировать наименование таблицы</H1>
                <Control.Row>
                    <Control.Input name={`name`} label={`Новое наименование`} placeholder={`Новое наименование`} isRequired />
                </Control.Row>
                <Control.Row>
                    <Button background={`grey`} variant={`outlined`} extra={`margin-left: calc(50% + 8px);`} type={`cancel`} onClick={closeModal}>
                        Отменить
                    </Button>
                    <Button background={`green`} type={`submit`}>
                        Сохранить
                    </Button>
                </Control.Row>
            </Form>
        </PopUpWrapper>
    );
};

export default EditTableNameModal;
/*eslint-enable*/
