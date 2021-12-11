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

const schema = (yup) =>
    yup.object().shape({
        name: yup.string().required(`Это поле обязательно`),
        host: yup.string().required(`Это поле обязательно`),
        port: yup.string().required(`Это поле обязательно`),
        base: yup.string().required(`Это поле обязательно`),
        user: yup.string().required(`Это поле обязательно`),
        password: yup.string().required(`Это поле обязательно`),
    });

const CreateScheaInStorageModal = () => {
    const { onSubmit, clearForm } = useFormControl({ name: FORMS.CREATE_SCHEMA_IN_STORAGE, schema });
    const [error, setError] = useState();
    const handleSubmit = async (data) => {
        await DatasourceAPI.createDatasource(data);
        eventDispatch(`CLOSE_${MODALS.CREATE_SCHEMA_IN_STORAGE}_MODAL`);
    };
    const closeModal = () => {
        clearForm();
        eventDispatch(`CLOSE_${MODALS.CREATE_SCHEMA_IN_STORAGE}_MODAL`);
    };
    return (
        <PopUpWrapper name={MODALS.CREATE_SCHEMA_IN_STORAGE} onClickOutside={closeModal}>
            <Form name={FORMS.CREATE_SCHEMA_IN_STORAGE} onSubmit={onSubmit(handleSubmit)}>
                <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px;`}>Добавить схему в хранилище</H1>
                <Control.Row>
                    <Control.Input name={`name`} label={`Имя`} placeholder={`Наименование схемы`} isRequired />
                </Control.Row>
                {error && (
                    <ErrorBox>
                        <RowWrapper>
                            <Frame
                                extra={({ theme }) =>
                                    `font-weight: 600; font-size: 14px; line-height: 20px; color: ${theme.red}; margin-bottom: 2px;`
                                }
                            >
                                Ошибка выполнения запроса
                            </Frame>
                            <ErrorSign />
                        </RowWrapper>
                        {error}
                    </ErrorBox>
                )}
                <Control.Row>
                    <Button background={`grey`} variant={`outlined`} extra={`margin-left: calc(50% + 8px);`} type={`cancel`} onClick={closeModal}>
                        Отменить
                    </Button>
                    <Button background={`orange`} type={`submit`}>
                        Добавить
                    </Button>
                </Control.Row>
            </Form>
        </PopUpWrapper>
    );
};

export default CreateScheaInStorageModal;
/*eslint-enable*/
