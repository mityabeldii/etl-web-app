/*eslint-disable*/
import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { MODALS, FORMS, TABLES } from "../../constants/config";
import { useParams } from "react-router-dom";

import {
    Frame,
    Button,
    Input,
    Dropdown,
    H1,
    P,
    Link,
    RowWrapper,
    Form,
    ErrorBox,
    Scrollable,
} from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import PopUpWrapper from "./pop-up-wrapper";
import Select from "../ui-kit/select";

import DatasourceAPI from "../../api/datasource-api";

import useFormControl from "../../hooks/useFormControl";
import { eventDispatch } from "../../hooks/useEventListener";
import { omitStorage, useStorageListener } from "../../hooks/useStorage";
import _ from "lodash";
import ModalsHelper from "../../utils/modals-helper";
import useModal from "../../hooks/useModal";
import Table from "../ui-kit/table";

const schema = (yup) =>
    yup.object().shape({
        query: yup.string().required(`Это поле обязательно`),
    });

const DatasourceAdHocQueryModal = () => {
    const { onSubmit, setValue, clearForm, data } = useFormControl({ name: FORMS.DATASOURCE_AD_HOC_FORM, schema });
    const { state = {}, isOpened } = useModal(MODALS.DATASOURCE_AD_HOC_QUERY_MODAL, {
        onOpen: () => {
            omitStorage(`tables.${TABLES.DATASOURCE_TABLE_PREVIEW}`);
        },
        onClose: () => {
            omitStorage(`tables.${TABLES.DATASOURCE_TABLE_PREVIEW}`);
        },
    });
    const { datasourceId, schemaName } = state;
    const [error, setError] = useState();
    const table = useStorageListener((state) => state?.tables?.[TABLES.DATASOURCE_TABLE_PREVIEW]);
    const closeModal = () => {
        clearForm();
        setError(undefined);
        ModalsHelper.hideModal(MODALS.DATASOURCE_AD_HOC_QUERY_MODAL);
    };
    const handlers = {
        fetchPreviewFunction: async () => {
            try {
                setError(undefined);
                await DatasourceAPI.adHocQuery({ query: data?.query, datasourceId, schemaName });
            } catch (error) {
                console.log(error);
                setError(error?.response?.data?.message);
                throw error;
            }
        },
    };

    return (
        <PopUpWrapper
            name={MODALS.DATASOURCE_AD_HOC_QUERY_MODAL}
            onClickOutside={closeModal}
            extra={table?.rows ? `max-width: 90vw; padding: 0; backgorund: transparent;` : ``}
        >
            {table?.rows ? (
                <Scrollable outerExtra={`max-width: 90vw; max-height: 90vh;`}>
                    <Table
                        name={TABLES.DATASOURCE_TABLE_PREVIEW}
                        columns={Object.keys(table?.rows?.[0] ?? {})?.map?.((i) => ({ label: i, name: i })) ?? []}
                        fetchFunction={handlers.fetchPreviewFunction}
                        ignoreInitFetch={true}
                    />
                </Scrollable>
            ) : (
                <Form
                    name={FORMS.DATASOURCE_AD_HOC_FORM}
                    onSubmit={onSubmit(handlers.fetchPreviewFunction)}
                    extra={`width: 100%; flex-wrap: wrap; flex-direction: row; justify-content: flex-start;`}
                >
                    <Control.Row>
                        <H1
                            extra={`width: 100%; align-items: flex-start; margin-bottom: 24px; align-items: flex-start;`}
                        >
                            Выполнить Ad-Hoc запрос
                        </H1>
                    </Control.Row>
                    <Control.Textarea
                        name={`query`}
                        placeholder={`Введите SQL-запрос с указанием схемы`}
                        controlStyles={`flex: 1;`}
                        extra={css`
                            font-family: IBM Plex Mono;
                            font-style: normal;
                            font-weight: normal;
                            font-size: 14px;
                            line-height: 24px;
                            min-height: 120px;
                        `}
                    />
                    {error && <ErrorBox.Component title={`Ошибка выполнения запроса`} description={error} />}
                    <RowWrapper extra={`justify-content: flex-end;`}>
                        <Button background={`orange`} type={`submit`}>
                            Выполнить
                        </Button>
                    </RowWrapper>
                </Form>
            )}
        </PopUpWrapper>
    );
};

export default DatasourceAdHocQueryModal;
/*eslint-enable*/
