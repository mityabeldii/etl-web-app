/*eslint-disable*/
import { useEffect } from "react";
import styled, { css } from "styled-components";
import { useLocation, useParams } from "react-router-dom";
import _ from "lodash";
import * as yup from "yup";

import { Frame, Button, Input, Dropdown, H1, H2, P, Link, Br, Checkbox, Form } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import PopUpWrapper from "./pop-up-wrapper";

import ProcessesAPI from "../../api/processes-api";
import DatasourceAPI from "../../api/datasource-api";

import { MODALS, FORMS, OPERATORS, TABLES, UPDATE_TYPES } from "../../constants/config";

import { eventDispatch } from "../../hooks/useEventListener";
import { useStorageListener } from "../../hooks/useStorage";
import useFormControl from "../../hooks/useFormControl";

const schema = (yup) =>
    yup.object().shape({
        taskName: yup.string().required(`Это поле обязательно`),
        operator: yup.string().required(`Это поле обязательно`),
        taskQueue: yup.number().required(`Это поле обязательно`),
    });

const operatorStorageScemas = {
    [OPERATORS.SQL_CLONE]: (data) => (state) => ({
        source: {
            schemas: _.get(state, `datasources.schemas.${data?.operatorConfigData?.source?.sourceId}`) ?? [],
            tables: _.get(state, `datasources.tables.${data?.operatorConfigData?.source?.sourceId}`) ?? [],
            columns:
                _.get(
                    state,
                    `datasources.columns.${data?.operatorConfigData?.source?.sourceId}.${data?.operatorConfigData?.source?.targetTableName}`
                ) ?? [],
        },
        target: {
            schemas: _.get(state, `datasources.schemas.${data?.operatorConfigData?.target?.targetId}`) ?? [],
            tables: _.get(state, `datasources.tables.${data?.operatorConfigData?.target?.targetId}`) ?? [],
            columns:
                _.get(
                    state,
                    `datasources.columns.${data?.operatorConfigData?.target?.targetId}.${data?.operatorConfigData?.target?.targetTableName}`
                ) ?? [],
        },
    }),
    [OPERATORS.SQL_EXTRACT]: (data) => (state) => ({
        source: {
            schemas: _.get(state, `datasources.schemas.${data?.operatorConfigData?.source?.sourceId}`) ?? [],
            tables: _.get(state, `datasources.tables.${data?.operatorConfigData?.source?.sourceId}`) ?? [],
            columns:
                _.get(
                    state,
                    `datasources.columns.${data?.operatorConfigData?.source?.sourceId}.${data?.operatorConfigData?.source?.targetTableName}`
                ) ?? [],
        },
    }),
};

const CrateTaskModal = () => {
    const { data, setValue, omitValue, onSubmit, clearForm } = useFormControl({ name: FORMS.CREATE_TASK, schema });

    const { process_id } = useParams();
    const process = useStorageListener((state) => state?.processes ?? [])?.[process_id] ?? {};
    const { tasks = [] } = process;
    const datasources = useStorageListener((state) => state?.tables?.[TABLES.DATASOURCE_LIST]?.rows ?? []);
    const params = useStorageListener((operatorStorageScemas?.[data?.operator] ?? (() => () => ({})))?.(data));
    useEffect(DatasourceAPI.getDatasources, []);

    const closeModal = () => {
        clearForm();
        eventDispatch(`CLOSE_${MODALS.CREATE_TASK}_MODAL`);
    };
    const handleSubmit = async (data) => {
        try {
            await ProcessesAPI.createTask(process_id, { ...data, processId: process_id });
            closeModal();
        } catch (error) {}
    };
    return (
        <PopUpWrapper name={MODALS.CREATE_TASK}>
            <Form name={FORMS.CREATE_TASK} onSubmit={onSubmit(handleSubmit)}>
                <Control.Row>
                    <H1 extra={`margin-bottom: 20px;`}>Добавить задачу</H1>
                </Control.Row>
                <Control.Row>
                    <Control.Input name={`taskName`} label={`Имя`} placeholder={`Имя задачи`} isRequired />
                </Control.Row>
                <Control.Row>
                    <Control.Textarea name={`taskDescription`} label={`Описание`} placeholder={`Краткое описание процесса`} />
                </Control.Row>
                <Control.Row>
                    <Control.Select
                        name={`operator`}
                        label={`Имя оператора`}
                        placeholder={`Выберите оператор для задачи`}
                        options={Object.keys(OPERATORS).map((item) => ({ label: item, value: item }))}
                        extra={`flex: 0.5; margin-right: 16px !important;`}
                        required
                    />
                </Control.Row>
                {
                    {
                        [OPERATORS.SQL_CLONE]: (
                            <>
                                <Br />
                                <Control.Row>
                                    <H1 extra={`align-items: flex-start; margin-bottom: 24px;`}>Конфигурация оператора</H1>
                                </Control.Row>
                                <Control.Row>
                                    <H2 extra={`align-items: flex-start; margin-bottom: 20px;`}>Источник данных</H2>
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.source.sourceId`}
                                        label={`Источник данных`}
                                        options={datasources?.map?.(({ id, name }) => ({ label: name, value: id }))}
                                        isRequired
                                        onChange={(e) => {
                                            omitValue([
                                                `operatorConfigData.source.targetSchemaName`,
                                                `operatorConfigData.source.targetTableName`,
                                                `operatorConfigData.source.sourceTableFields`,
                                            ]);
                                            DatasourceAPI.getSchemas(e.target.value);
                                            DatasourceAPI.getDatasourceTables(e.target.value);
                                        }}
                                    />
                                    <Control.Checkbox label={`Указать SQL-запрос`} name={`operatorConfigData.source.sqlQuery`} isRequired />
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.source.targetSchemaName`}
                                        label={`Имя схемы в источнике`}
                                        options={params?.source?.schemas?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params.source?.schemas?.length}
                                    />
                                    <Control.Select
                                        name={`operatorConfigData.source.targetTableName`}
                                        label={`Имя таблицы в источнике`}
                                        options={params?.source?.tables?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params?.source?.tables?.length}
                                        onChange={(e) => {
                                            DatasourceAPI.getTableColumns(data?.operatorConfigData?.source?.sourceId, e.target.value);
                                        }}
                                    />
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.source.sourceTableFields`}
                                        label={`Поля для извлечения`}
                                        multiselect
                                        options={params.source?.columns?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params.source?.columns?.length}
                                    />
                                </Control.Row>
                                <Br />
                                <Control.Row>
                                    <H2 extra={`margin-bottom: 20px;`}>Получатель данных</H2>
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.target.targetId`}
                                        label={`Целевая БД`}
                                        options={datasources?.map?.(({ id, name }) => ({ label: name, value: id }))}
                                        isRequired
                                        extra={`flex: 0.5; margin-right: 16px !important;`}
                                        onChange={(e) => {
                                            omitValue([
                                                `operatorConfigData.target.targetSchemaName`,
                                                `operatorConfigData.target.targetTableName`,
                                                `operatorConfigData.target.mappingStructure`,
                                            ]);
                                            DatasourceAPI.getSchemas(e.target.value);
                                            DatasourceAPI.getDatasourceTables(e.target.value);
                                        }}
                                    />
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.target.targetSchemaName`}
                                        label={`Имя схемы в промежуточном хранилище`}
                                        options={params?.target?.schemas?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params?.target?.schemas?.length}
                                    />
                                    <Control.Select
                                        name={`operatorConfigData.target.targetTableName`}
                                        label={`Имя таблицы в промежуточном хранилище`}
                                        options={params?.target?.tables?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params?.target?.tables?.length}
                                        onChange={(e) => {
                                            DatasourceAPI.getTableColumns(data?.operatorConfigData?.target?.targetId, e.target.value);
                                        }}
                                    />
                                </Control.Row>
                                <Br />
                                <Control.Row>
                                    <H2 extra={`margin-bottom: 20px;`}>Маппинг полей</H2>
                                </Control.Row>
                                <Control.Row>
                                    <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start;`}>Поле в источнике</Control.Label>
                                    <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start; margin-left: 32px;`}>
                                        Поле на в промежуточном хранилище
                                    </Control.Label>
                                </Control.Row>
                                {_.get(data, `operatorConfigData.source.sourceTableFields`)?.map?.((item, index) => {
                                    return (
                                        <Control.Row key={index}>
                                            <Control.Input extra={`flex: 1;`} value={item} readOnly />
                                            <MappingArrow />
                                            <Control.Select
                                                name={`operatorConfigData.target.mappingStructure.${index}.targetFieldName`}
                                                extra={`flex: 1;`}
                                                onChange={(e) => {
                                                    setValue(`operatorConfigData.target.mappingStructure.${index}.sourceFieldName`, item);
                                                }}
                                                options={params?.target?.columns?.map?.((item) => ({
                                                    label: item,
                                                    value: item,
                                                    muted: _.get(data, `operatorConfigData.target.mappingStructure`)
                                                        ?.map?.((i) => i?.targetFieldName)
                                                        ?.includes(item),
                                                }))}
                                                readOnly={!params?.target?.columns?.length}
                                            />
                                        </Control.Row>
                                    );
                                })}
                                <Br />
                                <Control.Row>
                                    <H2 extra={`margin-bottom: 20px;`}>Настройки обновления</H2>
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.updateSettings.updateType`}
                                        label={`Тип обновления`}
                                        options={Object.entries(UPDATE_TYPES).map(([value, label], index) => ({ label, value }))}
                                        extra={`flex: 0.5; margin-right: 16px !important;`}
                                    />
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.updateSettings.lastUpdatedField`}
                                        label={`Поле последнего обновления`}
                                        options={params?.source?.columns?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params?.source?.columns?.length}
                                    />
                                    <Control.Select
                                        name={`operatorConfigData.updateSettings.primaryKey`}
                                        label={`Первичный ключ`}
                                        options={params?.source?.columns?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params?.source?.columns?.length}
                                    />
                                </Control.Row>
                            </>
                        ),
                        [OPERATORS.SQL_EXTRACT]: (
                            <>
                                <Br />
                                <Control.Row>
                                    <H1 extra={`align-items: flex-start; margin-bottom: 24px;`}>Конфигурация оператора</H1>
                                </Control.Row>
                                <Control.Row>
                                    <H2 extra={`align-items: flex-start; margin-bottom: 20px;`}>Источник данных</H2>
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.source.sourceId`}
                                        label={`Источник данных`}
                                        options={datasources?.map?.(({ id, name }) => ({ label: name, value: id }))}
                                        isRequired
                                        onChange={(e) => {
                                            omitValue([
                                                `operatorConfigData.source.targetSchemaName`,
                                                `operatorConfigData.source.targetTableName`,
                                                `operatorConfigData.source.sourceTableFields`,
                                            ]);
                                            DatasourceAPI.getSchemas(e.target.value);
                                            DatasourceAPI.getDatasourceTables(e.target.value);
                                        }}
                                    />
                                    <Control.Checkbox label={`Указать SQL-запрос`} name={`operatorConfigData.source.sqlQuery`} isRequired />
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.source.targetSchemaName`}
                                        label={`Имя схемы в источнике`}
                                        options={params?.source?.schemas?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params.source?.schemas?.length}
                                    />
                                    <Control.Select
                                        name={`operatorConfigData.source.targetTableName`}
                                        label={`Имя таблицы в источнике`}
                                        options={params?.source?.tables?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params?.source?.tables?.length}
                                        onChange={(e) => {
                                            DatasourceAPI.getTableColumns(data?.operatorConfigData?.source?.sourceId, e.target.value);
                                        }}
                                    />
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.source.sourceTableFields`}
                                        label={`Поля для извлечения`}
                                        multiselect
                                        options={params.source?.columns?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params.source?.columns?.length}
                                    />
                                </Control.Row>
                                <Br />
                                <Control.Row>
                                    <H2 extra={`margin-bottom: 20px;`}>Структура выходных данных</H2>
                                </Control.Row>
                                <Control.Row>
                                    <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start;`}>Поле в источнике</Control.Label>
                                    <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start; margin-left: 32px;`}>
                                        Поле на в промежуточном хранилище
                                    </Control.Label>
                                </Control.Row>
                                {_.get(data, `operatorConfigData.source.sourceTableFields`)?.map?.((item, index) => {
                                    return (
                                        <Control.Row key={index}>
                                            <Control.Input extra={`flex: 1;`} value={item} readOnly />
                                            <MappingArrow />
                                            <Control.Input
                                                name={`operatorConfigData.storageStructure.${index}.storageFieldName`}
                                                extra={`flex: 1;`}
                                                readOnly={!params?.source?.columns?.length}
                                            />
                                        </Control.Row>
                                    );
                                })}
                                <Br />
                                <Control.Row>
                                    <H2 extra={`margin-bottom: 20px;`}>Настройки обновления</H2>
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.updateSettings.updateType`}
                                        label={`Тип обновления`}
                                        options={Object.entries(UPDATE_TYPES).map(([value, label], index) => ({ label, value }))}
                                        extra={`flex: 0.5; margin-right: 16px !important;`}
                                    />
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.updateSettings.lastUpdatedField`}
                                        label={`Поле последнего обновления`}
                                        options={params?.source?.columns?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params?.source?.columns?.length}
                                    />
                                    <Control.Select
                                        name={`operatorConfigData.updateSettings.primaryKey`}
                                        label={`Первичный ключ`}
                                        options={params?.source?.columns?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params?.source?.columns?.length}
                                    />
                                </Control.Row>
                            </>
                        ),
                    }?.[data?.operator]
                }
                <Control.Row>
                    <Control.Input name={`taskQueue`} label={`Порядок запуска`} placeholder={``} isRequired />
                    <Control.Select
                        multiselect={true}
                        name={`downstreamTaskIds`}
                        label={`Следующие задачи`}
                        options={tasks.map(({ taskName, id }) => ({ label: taskName, value: id }))}
                    />
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
        </PopUpWrapper>
    );
};

const MappingArrow = styled(Frame)`
    width: 16px;
    height: 16px;
    margin-bottom: 10px;
    background: url("${require(`../../assets/icons/mapping-arrow.svg`).default}") no-repeat center center / contain;
`;

export default CrateTaskModal;
/*eslint-enable*/
