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
        schemaName: yup.string().required(`Это поле обязательно`),
    });

const CreateScheaInStorageModal = () => {
    const { onSubmit, clearForm, setValues } = useFormControl({ name: FORMS.CREATE_SCHEMA_IN_STORAGE, schema });
    const { close: closeModal } = useModal(MODALS.CREATE_SCHEMA_IN_STORAGE, {
        onClose: clearForm,
        onOpen: (d) => {
            setValues({ datasourceId: d?.id });
        },
    });
    const [error, setError] = useState(null);
    const handleSubmit = async (data) => {
        try {
            setError(null);
            await SchemasAPI.createSchema(data);
            closeModal();
        } catch (error) {
            setError(error?.response?.data?.message);
        }
    };
    return (
        <PopUpWrapper name={MODALS.CREATE_SCHEMA_IN_STORAGE} onClickOutside={closeModal}>
            <Form name={FORMS.CREATE_SCHEMA_IN_STORAGE} onSubmit={onSubmit(handleSubmit)}>
                <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px;`}>Добавить схему в хранилище</H1>
                <Control.Row>
                    <Control.Input name={`schemaName`} label={`Имя`} placeholder={`Наименование схемы (латиница, цифры и «_»)`} isRequired maxLength={25} regex="[a-zA-Z0-9_]" />
                </Control.Row>
                <Control.Row>
                    <Button background={`grey`} variant={`outlined`} extra={`margin-left: calc(50% + 8px);`} type={`cancel`} onClick={closeModal}>
                        Отменить
                    </Button>
                    <Button background={`orange`} type={`submit`}>
                        Добавить
                    </Button>
                </Control.Row>
            </Form>
            {error && <ErrorBox.Component title={`Ошибка выполнения запроса`} description={error} />}
        </PopUpWrapper>
    );
};

export default CreateScheaInStorageModal;
/*eslint-enable*/
