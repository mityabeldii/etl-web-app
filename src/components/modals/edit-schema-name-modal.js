/*eslint-disable*/
import { useState } from "react";
import styled, { css } from "styled-components";
import { MODALS, FORMS } from "../../constants/config";

import { Frame, Button, Input, Dropdown, H1, P, Link, Form, ErrorBox } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import PopUpWrapper from "./pop-up-wrapper";

import DatasourceAPI from "../../api/datasource-api";
import SchemasAPI from "../../api/schemas-api";

import { eventDispatch } from "../../hooks/useEventListener";
import useFormControl from "../../hooks/useFormControl";
import ModalsHelper from "../../utils/modals-helper";
import useModal from "../../hooks/useModal";

const schema = (yup) =>
    yup.object().shape({
        datasourceId: yup.number().required(`Это поле обязательно`),
        oldSchemaName: yup
            .string()
            .matches(/[a-zA-Z0-9_]/g, `Латиница, цифры и «_»`)
            .required(`Это поле обязательно`),
        newSchemaName: yup
            .string()
            .matches(/[a-zA-Z0-9_]/g, `Латиница, цифры и «_»`)
            .required(`Это поле обязательно`),
    });

const EditSchemaNameModal = () => {
    const { onSubmit, clearForm, setValues } = useFormControl({ name: FORMS.EDIT_SCHEMA_NAME, schema });
    const { close: closeModal } = useModal(MODALS.EDIT_SCHEMA_NAME, {
        onOpen: (d) => {
            setValues({
                datasourceId: d?.datasourceId,
                oldSchemaName: d?.name,
                newSchemaName: d?.name,
            });
        },
        onClose: clearForm,
    });
    const handleSubmit = async (data) => {
        await SchemasAPI.updateSchema(data);
        closeModal();
    };
    return (
        <PopUpWrapper name={MODALS.EDIT_SCHEMA_NAME} onClickOutside={closeModal}>
            <Form name={FORMS.EDIT_SCHEMA_NAME} onSubmit={onSubmit(handleSubmit)}>
                <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px;`}>Редактировать наименование схемы</H1>
                <Control.Row>
                    <Control.Input
                        name={`newSchemaName`}
                        label={`Новое наименование`}
                        placeholder={`Наименование схемы (латиница, цифры и «_»)`}
                        isRequired
                        maxLength={25}
                        regex="[^a-zA-Z0-9_]"
                    />
                </Control.Row>
                <Control.Row>
                    <Button background={`grey`} variant={`outlined`} extra={`margin-left: calc(50% + 8px);`} formNoValidate onClick={closeModal}>
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

export default EditSchemaNameModal;
/*eslint-enable*/
