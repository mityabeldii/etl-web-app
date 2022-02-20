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
import TableFieldsAPI from "../../api/table-fields-api";

const schema = (yup) =>
    yup.object().shape({
        datasourceId: yup.string().required(`Это поле обязательно`),
        schemaName: yup
            .string()
            .matches(/[a-zA-Z0-9_]/g, `Латиница, цифры и «_»`)
            .required(`Это поле обязательно`),
        tableName: yup.string().required(`Это поле обязательно`),
        fields: yup.array().of(
            yup.object().shape({
                fieldName: yup
                    .string()
                    .matches(/[a-zA-Z0-9_]/g, `Латиница, цифры и «_»`)
                    .required(`Это поле обязательно`),
                fieldType: yup.string().required(`Это поле обязательно`),
            })
        ),
    });

const EditTableStructureModal = () => {
    const { onSubmit, clearForm, setValues, data } = useFormControl({ name: FORMS.EDIT_TABLE_STRUCTURE, schema });
    const { close: closeModal, state } = useModal(MODALS.EDIT_TABLE_STRUCTURE, {
        onClose: clearForm,
        onOpen: ({ datasourceId, schemaName, table }) => setValues({ datasourceId, schemaName, ...table }),
    });
    const handlers = {
        submit: async (data) => {
            await TableFieldsAPI.updateTableFields(data);
            ModalsHelper.hideModal(MODALS.EDIT_TABLE_STRUCTURE);
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
        <PopUpWrapper name={MODALS.EDIT_TABLE_STRUCTURE} onClickOutside={closeModal}>
            <Form name={FORMS.EDIT_TABLE_STRUCTURE} onSubmit={onSubmit(handlers.submit)}>
                <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px;`}>
                    Редактировать структуру <span>{state?.tableName}</span>
                </H1>
                <H2 extra={`margin-bottom: 20px;`}>Список полей</H2>
                {data?.fields?.map?.((field, index) => (
                    <Control.Row key={index}>
                        <Control.Input
                            name={`fields.[${index}].fieldName`}
                            label={`Наименование поля (латиница)`}
                            placeholder={`Наименование поля (латиница, цифры и «_»)`}
                            isRequired
                            maxLength={25}
                            regex="[^a-zA-Z0-9_]"
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
                    <Button
                        background={`grey`}
                        variant={`outlined`}
                        extra={`margin-left: calc(50% + 8px);`}
                        formNoValidate
                        onClick={closeModal}
                    >
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

export default EditTableStructureModal;
/*eslint-enable*/
