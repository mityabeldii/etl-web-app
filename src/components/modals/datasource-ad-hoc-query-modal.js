/*eslint-disable*/
import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { MODALS, FORMS } from "../../constants/config";
import { useParams } from "react-router-dom";

import { Frame, Button, Input, Dropdown, H1, P, Link, RowWrapper, Form, ErrorBox } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import PopUpWrapper from "./pop-up-wrapper";
import Select from "../ui-kit/select";

import DatasourceAPI from "../../api/datasource-api";

import useFormControl from "../../hooks/useFormControl";
import { eventDispatch } from "../../hooks/useEventListener";
import { useStorageListener } from "../../hooks/useStorage";
import _ from "lodash";
import ModalsHelper from "../../utils/modals-helper";

const schema = (yup) =>
    yup.object().shape({
        query: yup.string().required(`Это поле обязательно`),
    });

const DatasourceAdHocQueryModal = () => {
    const { onSubmit, setValue, clearForm } = useFormControl({ name: FORMS.DATASOURCE_AD_HOC_FORM, schema });
    const { selectedSourceId: datasourceId } = useParams();
    const schemaName = useStorageListener((state) => state?.datasources?.structures?.find?.((i) => +i?.id === +datasourceId)?.data?.schema);
    const [error, setError] = useState();
    const handleSubmit = async (data) => {
        try {
            setError(undefined);
            const response = await DatasourceAPI.adHocQuery({ ...data, datasourceId, schema: schemaName });
        } catch (error) {
            setError(error?.response?.data?.message);
        }
    };
    const closeModal = () => {
        clearForm();
        setError(undefined);
        ModalsHelper.hideModal(MODALS.DATASOURCE_AD_HOC_QUERY_MODAL);
    };
    return (
        <PopUpWrapper name={MODALS.DATASOURCE_AD_HOC_QUERY_MODAL} onClickOutside={closeModal}>
            <Form
                name={FORMS.DATASOURCE_AD_HOC_FORM}
                onSubmit={onSubmit(handleSubmit)}
                extra={`width: 100%; flex-wrap: wrap; flex-direction: row; justify-content: flex-start;`}
            >
                <Control.Row>
                    <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px; align-items: flex-start;`}>Выполнить Ad-Hoc запрос</H1>
                </Control.Row>
                <Control.Textarea
                    name={`query`}
                    placeholder={`Enter your query here`}
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
                    {/* <Frame
                        extra={({ theme }) => css`
                            font-size: 14px;
                            line-height: 20px;
                            text-align: right;
                            margin-right: 16px;
                            color: ${theme.text.secondary};
                        `}
                    >
                        Показывать строк:
                    </Frame>
                    <Select
                        name={`perPage`}
                        options={[100].map((i) => ({ value: i, label: i }))}
                        extra={`width: 100px; margin-right: 32px;`}
                        placeholder={``}
                        value={100 ?? [100]?.[0] ?? 0}
                        onChange={(e) => {
                            // putStorage(`tables.${name}.pagination.perPage`, e.target.value);
                        }}
                    /> */}
                    <Button background={`orange`} type={`submit`}>
                        Выполнить
                    </Button>
                </RowWrapper>
            </Form>
        </PopUpWrapper>
    );
};

export default DatasourceAdHocQueryModal;
/*eslint-enable*/
