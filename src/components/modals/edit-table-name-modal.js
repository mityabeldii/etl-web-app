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
import useModal from "../../hooks/useModal";
import TablesAPI from "../../api/tables-api";

const schema = (yup) =>
    yup.object().shape({
        datasourceId: yup.string().required(`Это поле обязательно`),
        newTableName: yup.string().matches(/[a-zA-Z0-9_]/g, `Латиница, цифры и «_»`).required(`Это поле обязательно`),
        oldTableName: yup.string().required(`Это поле обязательно`),
        schemaName: yup.string().required(`Это поле обязательно`),
    });

const EditTableNameModal = () => {
    const { onSubmit, clearForm, setValues, data } = useFormControl({ name: FORMS.EDIT_TABLE_NAME, schema });
    const modal = useModal(MODALS.EDIT_TABLE_NAME, {
        onOpen: (d) => setValues({ ...d, oldTableName: d.tableName, newTableName: d.tableName }),
    });
    const handleSubmit = async (data) => {
        await TablesAPI.updateTable({ ...data });
        ModalsHelper.hideModal(MODALS.EDIT_TABLE_NAME);
    };
    const closeModal = () => {
        clearForm();
        ModalsHelper.hideModal(MODALS.EDIT_TABLE_NAME);
    };
    return (
        <PopUpWrapper name={MODALS.EDIT_TABLE_NAME} onClickOutside={closeModal}>
            <Form name={FORMS.EDIT_TABLE_NAME} onSubmit={onSubmit(handleSubmit)}>
                <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px;`}>
                    Редактировать наименование таблицы
                </H1>
                <Control.Row>
                    <Control.Input
                        name={`newTableName`}
                        label={`Новое наименование`}
                        placeholder={`Новое наименование (латиница, цифры и «_»)`}
                        isRequired
                        maxLength={25}
                        regex="[^a-zA-Z0-9_]"
                    />
                </Control.Row>
                <Control.Row>
                    <Button
                        background={`grey`}
                        variant={`outlined`}
                        extra={`margin-left: calc(50% + 8px);`}
                        formNoValidate
                        onClick={closeModal}
                    >
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
