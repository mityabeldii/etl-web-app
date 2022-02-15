/*eslint-disable*/
import styled, { css } from "styled-components";
import { MODALS, FORMS, FIELD_TYPES } from "../../constants/config";

import { Frame, Button, Input, Dropdown, H1, H2, P, Link, Form, RemoveRowButton } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import PopUpWrapper from "./pop-up-wrapper";

import DatasourceAPI from "../../api/datasource-api";

import { eventDispatch } from "../../hooks/useEventListener";
import useFormControl from "../../hooks/useFormControl";
import ModalsHelper from "../../utils/modals-helper";
import useModal from "../../hooks/useModal";
import _ from "lodash";
import TablesAPI from "../../api/tables-api";

const schema = (yup) =>
    yup.object().shape({
        datasourceId: yup.string().required(`Это поле обязательно`),
        schemaName: yup.string().required(`Это поле обязательно`),
        tableName: yup.string().required(`Это поле обязательно`),
        fields: yup.array().of(
            yup.object().shape({
                fieldName: yup.string().required(`Это поле обязательно`),
                fieldType: yup.string().required(`Это поле обязательно`),
            })
        ),
    });

const CreateTableInSchemaModal = () => {
    const { onSubmit, clearForm, setValues, data } = useFormControl({ name: FORMS.CREATE_TABLE_IN_SCHEMA, schema });
    const { close: closeModal } = useModal(MODALS.CREATE_TABLE_IN_SCHEMA, {
        onClose: clearForm,
        onOpen: ({ datasourceId, schema: schemaName }) => {
            setValues({ datasourceId, schemaName });
        },
    });
    const handlers = {
        submit: async (data) => {
            await TablesAPI.createTable(data);
            ModalsHelpersHelper.hideModal(MODALS.CREATE_TABLE_IN_SCHEMA);
        },
        addNewField: () => {
            setValues({
                fields: [...(data.fields ?? []), { fieldName: "", fieldType: "" }],
            });
        },
        removeFieldByIndex: (index) => () => {
            setValues({
                fields: data.fields.filter((_, i) => i !== index),
            });
        },
    };
    return (
        <PopUpWrapper name={MODALS.CREATE_TABLE_IN_SCHEMA} onClickOutside={closeModal}>
            <Form name={FORMS.CREATE_TABLE_IN_SCHEMA} onSubmit={onSubmit(handlers.submit)}>
                <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px;`}>
                    Добавить таблицу в схему <span>sampleDB</span>
                </H1>
                <Control.Row>
                    <Control.Input
                        name={`tableName`}
                        label={`Наименование таблицы`}
                        placeholder={`Наименование таблицы`}
                        isRequired
                        extra={`margin-right: calc(50% + 8px)`}
                    />
                </Control.Row>
                <Frame extra={`width: 100%; height: 1px; background: #DADADA; margin: 35px 0 20px 0;`} />
                <H2 extra={`margin-bottom: 20px;`}>Список полей</H2>
                {data?.fields?.map?.((field, index) => (
                    <Control.Row key={index}>
                        <Control.Input
                            name={`fields.[${index}].fieldName`}
                            label={`Наименование поля (латиница)`}
                            placeholder={`Наименование поля (латиница)`}
                            isRequired
                        />
                        <Control.Select
                            name={`fields.[${index}].fieldType`}
                            label={`Тип поля`}
                            placeholder={`Тип поля`}
                            options={Object.values(FIELD_TYPES)?.map?.((item) => ({ label: item, value: item }))}
                            isRequired
                        />
                        <RemoveRowButton onClick={handlers.removeFieldByIndex(index)} />
                    </Control.Row>
                ))}
                <Button background={`orange`} onClick={handlers.addNewField}>
                    Добавить поле
                </Button>
                <Control.Row>
                    <Button background={`grey`} variant={`outlined`} extra={`margin-left: calc(50% + 8px);`} formNoValidate onClick={closeModal}>
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
