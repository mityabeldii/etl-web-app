/*eslint-disable*/
import styled, { css } from "styled-components";
import { MODALS, FORMS } from "../../constants/config";

import { Frame, Button, Input, Dropdown, H1, H2, P, Link, Form, RemoveRowButton } from "../ui-kit/styled-templates";
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

const CreateTableInSchemaModal = () => {
    const { onSubmit, clearForm } = useFormControl({ name: FORMS.CREATE_TABLE_IN_SCHEMA, schema });
    const handleSubmit = async (data) => {
        await DatasourceAPI.createDatasource(data);
        eventDispatch(`CLOSE_${MODALS.CREATE_TABLE_IN_SCHEMA}_MODAL`);
    };
    const closeModal = () => {
        clearForm();
        eventDispatch(`CLOSE_${MODALS.CREATE_TABLE_IN_SCHEMA}_MODAL`);
    };
    return (
        <PopUpWrapper name={MODALS.CREATE_TABLE_IN_SCHEMA} onClickOutside={closeModal}>
            <Form name={FORMS.CREATE_TABLE_IN_SCHEMA} onSubmit={onSubmit(handleSubmit)}>
                <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px;`}>
                    Добавить таблицу в схему <span>sampleDB</span>
                </H1>
                <Control.Row>
                    <Control.Input
                        name={`name`}
                        label={`Наименование таблицы`}
                        placeholder={`Наименование таблицы`}
                        isRequired
                        extra={`margin-right: calc(50% + 8px)`}
                    />
                </Control.Row>
                <Frame extra={`width: 100%; height: 1px; background: #DADADA; margin: 35px 0 20px 0;`} />
                <H2 extra={`margin-bottom: 20px;`}>Список полей</H2>
                <Control.Row>
                    <Control.Input name={`name`} label={`Наименование поля (латиница)`} placeholder={`Наименование поля (латиница)`} isRequired />
                    <Control.Input name={`host`} label={`Тип поля`} placeholder={`Тип поля`} isRequired />
                    <RemoveRowButton onClick={() => {}} />
                </Control.Row>
                <Button background={`orange`} >Добавить поле</Button>
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

export default CreateTableInSchemaModal;
/*eslint-enable*/
