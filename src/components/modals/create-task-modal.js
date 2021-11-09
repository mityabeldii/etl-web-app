/*eslint-disable*/
import { useEffect } from "react";
import styled, { css } from "styled-components";
import { useLocation, useParams } from "react-router-dom";
import _ from "lodash";
import * as yup from "yup";

import { Frame, Button, Input, Dropdown, H1, H2, P, Link, Br, Checkbox, Form } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import Select from "../ui-kit/select";
import PopUpWrapper from "./pop-up-wrapper";

import ProcessesAPI from "../../api/processes-api";
import DatasourceAPI from "../../api/datasource-api";

import { MODALS, FORMS, OPERATORS, TABLES, UPDATE_TYPES, JOIN_TYPE, LOGIC_OPERATOR } from "../../constants/config";

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
    [OPERATORS.SQL_LOAD]: (data) => (state) => ({
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
    [OPERATORS.JOIN]: (data) => (state) => ({
        leftFields:
            _.get(state, `datasources.columns.${data?.operatorConfigData?.taskIdSource}.${data?.operatorConfigData?.left?.targetTableName}`) ?? [],
    }),
};

const CrateTaskModal = () => {
    const { data, setValue, removeValue, onSubmit, clearForm } = useFormControl({ name: FORMS.CREATE_TASK, schema });

    const { process_id } = useParams();
    const process = useStorageListener((state) => state?.processes ?? [])?.[process_id] ?? {};
    const { tasks = [] } = process;
    const datasources = useStorageListener((state) => state?.tables?.[TABLES.DATASOURCE_LIST]?.rows ?? []);
    const params = useStorageListener((operatorStorageScemas?.[data?.operator] ?? (() => () => ({})))?.(data));
    useEffect(DatasourceAPI.getDatasources, []);

    // console.log(params);

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
                                    <H1 extra={`margin-bottom: 24px;`}>Конфигурация оператора</H1>
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
                                            removeValue([
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
                                            removeValue([
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
                                        <Control.Row key={index} extra={`align-items: flex-start;`}>
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
                                    <H1 extra={`margin-bottom: 24px;`}>Конфигурация оператора</H1>
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
                                            removeValue([
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
                                        <Control.Row key={index} extra={`align-items: flex-start;`}>
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
                        [OPERATORS.SQL_LOAD]: (
                            <>
                                <Br />
                                <Control.Row>
                                    <H1 extra={`margin-bottom: 24px;`}>Конфигурация оператора</H1>
                                </Control.Row>
                                <Control.Row>
                                    <H2 extra={`align-items: flex-start; margin-bottom: 20px;`}>Источник данных</H2>
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.taskIdSource`}
                                        label={`Наименование задачи`}
                                        options={
                                            tasks
                                                ?.filter?.((i) =>
                                                    [OPERATORS.JOIN, OPERATORS.SQL_EXTRACT, OPERATORS.CALCULATED]?.includes?.(i?.operator)
                                                )
                                                ?.map?.(({ id: value, taskName: label }) => ({ label, value })) ?? []
                                        }
                                        onChange={() => {
                                            removeValue([`operatorConfigData.target.mappingStructure`]);
                                        }}
                                        extra={`flex: 0.5; margin-right: 16px !important;`}
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
                                            removeValue([
                                                `operatorConfigData.target.targetSchemaName`,
                                                `operatorConfigData.target.targetTableName`,
                                                ...(_.get(data, `operatorConfigData.target.mappingStructure`)?.map?.(
                                                    (i, j) => `operatorConfigData.target.mappingStructure.${j}.targetFieldName`
                                                ) ?? []),
                                            ]);
                                            DatasourceAPI.getSchemas(e.target.value);
                                            DatasourceAPI.getDatasourceTables(e.target.value);
                                        }}
                                    />
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.target.targetSchemaName`}
                                        label={`Имя схемы в целевой БД`}
                                        options={params?.target?.schemas?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params?.target?.schemas?.length}
                                    />
                                    <Control.Select
                                        name={`operatorConfigData.target.targetTableName`}
                                        label={`Имя таблицы в целевой БД`}
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
                                    <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start;`}>
                                        Имя поля в промежуточном хранилище
                                    </Control.Label>
                                    <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start; margin-left: 32px;`}>
                                        Имя поля в хранилище
                                    </Control.Label>
                                </Control.Row>
                                {_.get(data, `operatorConfigData.target.mappingStructure`)?.map?.((item, index) => {
                                    return (
                                        <Control.Row key={index} extra={`align-items: flex-start;`}>
                                            <Control.Select
                                                extra={`flex: 1;`}
                                                name={`operatorConfigData.target.mappingStructure.${index}.sourceFieldName`}
                                                value={item?.sourceFieldName}
                                                options={
                                                    tasks
                                                        ?.find?.((i) => i?.id === data?.operatorConfigData?.taskIdSource)
                                                        ?.operatorConfigData?.storageStructure?.map?.((i) => i?.storageFieldName)
                                                        ?.map((i) => ({
                                                            label: i,
                                                            value: i,
                                                            muted: _.get(data, `operatorConfigData.target.mappingStructure`)
                                                                ?.map?.((i) => i?.sourceFieldName)
                                                                ?.includes?.(i),
                                                        })) ?? []
                                                }
                                            />
                                            <MappingArrow />
                                            <Control.Select
                                                name={`operatorConfigData.target.mappingStructure.${index}.targetFieldName`}
                                                extra={`flex: 1;`}
                                                value={item?.targetFieldName}
                                                options={params?.target?.columns?.map?.((item) => ({
                                                    label: item,
                                                    value: item,
                                                    muted: _.get(data, `operatorConfigData.target.mappingStructure`)
                                                        ?.map?.((i) => i?.targetFieldName)
                                                        ?.includes(item),
                                                }))}
                                                readOnly={!params?.target?.columns?.length}
                                            />
                                            <RemoveRowButton
                                                extra={`margin-top: 8px;`}
                                                onClick={() => {
                                                    setValue(
                                                        `operatorConfigData.target.mappingStructure`,
                                                        _.get(data, `operatorConfigData.target.mappingStructure`)?.filter?.((i, j) => j !== index) ??
                                                            []
                                                    );
                                                }}
                                            />
                                        </Control.Row>
                                    );
                                })}
                                <Button
                                    onClick={() => {
                                        setValue(`operatorConfigData.target.mappingStructure`, [
                                            ...(_.get(data, `operatorConfigData.target.mappingStructure`) ?? []),
                                            { sourceFieldName: ``, targetFieldName: `` },
                                        ]);
                                    }}
                                >
                                    Добавить строку
                                </Button>
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
                        [OPERATORS.JOIN]: (
                            <>
                                <Br />
                                <Control.Row>
                                    <H1 extra={`margin-bottom: 24px;`}>Конфигурация оператора</H1>
                                </Control.Row>
                                <Control.Row>
                                    <H2 extra={`align-items: flex-start; margin-bottom: 20px;`}>Источник данных</H2>
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.taskIdSource`}
                                        label={`Основной источник (название задачи)`}
                                        options={
                                            tasks
                                                ?.filter?.((i) =>
                                                    [OPERATORS.JOIN, OPERATORS.SQL_EXTRACT, OPERATORS.CALCULATED]?.includes?.(i?.operator)
                                                )
                                                ?.map?.(({ id: value, taskName: label, id }) => ({
                                                    label,
                                                    value,
                                                    muted: id === _.get(data, `operatorConfigData.joinTaskIdSource`),
                                                })) ?? []
                                        }
                                    />
                                    <Control.Select
                                        name={`operatorConfigData.joinTaskIdSource`}
                                        label={`Источник для соединения (название задачи)`}
                                        options={
                                            tasks
                                                ?.filter?.((i) =>
                                                    [OPERATORS.JOIN, OPERATORS.SQL_EXTRACT, OPERATORS.CALCULATED]?.includes?.(i?.operator)
                                                )
                                                ?.map?.(({ id: value, taskName: label, id }) => ({
                                                    label,
                                                    value,
                                                    muted: id === _.get(data, `operatorConfigData.taskIdSource`),
                                                })) ?? []
                                        }
                                    />
                                </Control.Row>
                                <Br />
                                <Control.Row>
                                    <H2 extra={`margin-bottom: 20px;`}>Настройки соединения данных и список условий соединения</H2>
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.joinSettings.joinType`}
                                        label={`Тип соединения`}
                                        options={Object.entries(JOIN_TYPE).map(([value, label], index) => ({ label, value }))}
                                        extra={`flex: 0.5; margin-right: 16px !important;`}
                                    />
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.joinSettings.joinCondition`}
                                        label={`Логический оператор`}
                                        options={Object.values(LOGIC_OPERATOR).map(({ value, label }, index) => ({ label, value }))}
                                        extra={`flex: 0.5; margin-right: 16px !important;`}
                                    />
                                </Control.Row>
                                <Control.Row>
                                    <Control.Label
                                        extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`}
                                    >
                                        Имя поля в основном источнике
                                    </Control.Label>
                                    <Control.Label
                                        extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`}
                                    >
                                        Имя поля в источнике для соединения
                                    </Control.Label>
                                </Control.Row>
                                {_.get(data, `operatorConfigData.joinSettings.conditions`)?.map?.((item, index) => (
                                    <Control.Row key={index} extra={`align-items: flex-start;`}>
                                        <Control.Select
                                            name={`operatorConfigData.joinSettings.conditions.[${index}].leftJoinField`}
                                            options={
                                                _.get(
                                                    tasks?.find?.((i) => i?.id === _.get(data, `operatorConfigData.taskIdSource`)) ?? {},
                                                    `operatorConfigData.storageStructure`
                                                )
                                                    ?.map?.((i) => i?.storageFieldName)
                                                    ?.map?.((i) => ({
                                                        value: i,
                                                        label: i,
                                                        muted: _.get(data, `operatorConfigData.joinSettings.conditions`)
                                                            ?.map?.((i) => i?.leftJoinField)
                                                            ?.includes?.(i),
                                                    })) ?? []
                                            }
                                        />
                                        <Frame
                                            extra={({ theme }) =>
                                                `flex: unset; width: 16px; height: 16px; margin-top: 20px; color: ${theme.text.secondary};`
                                            }
                                        >
                                            =
                                        </Frame>
                                        <Control.Select
                                            name={`operatorConfigData.joinSettings.conditions.[${index}].rightJoinField`}
                                            options={
                                                _.get(
                                                    tasks?.find?.((i) => i?.id === _.get(data, `operatorConfigData.joinTaskIdSource`)) ?? {},
                                                    `operatorConfigData.storageStructure`
                                                )
                                                    ?.map?.((i) => i?.storageFieldName)
                                                    ?.map?.((i) => ({
                                                        value: i,
                                                        label: i,
                                                        muted: _.get(data, `operatorConfigData.joinSettings.conditions`)
                                                            ?.map?.((i) => i?.rightJoinField)
                                                            ?.includes?.(i),
                                                    })) ?? []
                                            }
                                        />
                                        <RemoveRowButton
                                            extra={`margin-top: 9px;`}
                                            onClick={() => {
                                                setValue(
                                                    `operatorConfigData.joinSettings.conditions`,
                                                    _.get(data, `operatorConfigData.joinSettings.conditions`)?.filter((i, j) => j !== index)
                                                );
                                            }}
                                        />
                                    </Control.Row>
                                ))}
                                <Button
                                    background={`orange`}
                                    extra={`margin-bottom: 10px;`}
                                    onClick={() => {
                                        setValue(`operatorConfigData.joinSettings.conditions`, [
                                            ...(_.get(data, `operatorConfigData.joinSettings.conditions`) ?? []),
                                            { fieldName: "", joinFieldName: "" },
                                        ]);
                                    }}
                                >
                                    Добавить строку
                                </Button>
                                <Br />
                                <Control.Row>
                                    <H2 extra={`margin-bottom: 20px;`}>Структура выходных данных</H2>
                                </Control.Row>
                                <Control.Row>
                                    <Control.Label
                                        extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`}
                                    >
                                        Имя поля в основном источнике
                                    </Control.Label>
                                    <Control.Label
                                        extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`}
                                    >
                                        Имя поля в источнике для соединения
                                    </Control.Label>
                                </Control.Row>
                                {_.get(data, `operatorConfigData.storageStructure.leftSourceFields`)?.map?.((item, index) => (
                                    <Control.Row key={index} extra={`align-items: flex-start;`}>
                                        <Control.Select
                                            name={`operatorConfigData.storageStructure.leftSourceFields.[${index}].sourceFieldName`}
                                            options={
                                                _.get(
                                                    tasks?.find?.((i) => i?.id === _.get(data, `operatorConfigData.taskIdSource`)) ?? {},
                                                    `operatorConfigData.storageStructure`
                                                )
                                                    ?.map?.((i) => i?.storageFieldName)
                                                    ?.map?.((i) => ({
                                                        value: i,
                                                        label: i,
                                                        muted: _.get(data, `operatorConfigData.storageStructure.leftSourceFields`)
                                                            ?.map?.((i) => i?.sourceFieldName)
                                                            ?.includes?.(i),
                                                    })) ?? []
                                            }
                                        />
                                        <Frame
                                            extra={({ theme }) =>
                                                `flex: unset; width: 16px; height: 16px; margin-top: 20px; color: ${theme.text.secondary};`
                                            }
                                        >
                                            =
                                        </Frame>
                                        <Control.Input
                                            name={`operatorConfigData.joinSettings.storageStructure.leftSourceFields.[${index}].storageFieldName`}
                                        />
                                        <RemoveRowButton
                                            extra={`margin-top: 9px;`}
                                            onClick={() => {
                                                setValue(
                                                    `operatorConfigData.storageStructure.leftSourceFields`,
                                                    _.get(data, `operatorConfigData.storageStructure.leftSourceFields`)?.filter((i, j) => j !== index)
                                                );
                                            }}
                                        />
                                    </Control.Row>
                                ))}
                                <Button
                                    background={`orange`}
                                    extra={`margin-bottom: 10px;`}
                                    onClick={() => {
                                        setValue(`operatorConfigData.storageStructure.leftSourceFields`, [
                                            ...(_.get(data, `operatorConfigData.storageStructure.leftSourceFields`) ?? []),
                                            { fieldName: "", joinFieldName: "" },
                                        ]);
                                    }}
                                >
                                    Добавить строку
                                </Button>
                                <Br />
                                <Control.Row>
                                    <Control.Label
                                        extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`}
                                    >
                                        Имя поля в источнике для соединения
                                    </Control.Label>
                                    <Control.Label
                                        extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`}
                                    >
                                        Имя поля во вспомогательном хранилище
                                    </Control.Label>
                                </Control.Row>
                                {_.get(data, `operatorConfigData.storageStructure.rightSourceFields`)?.map?.((item, index) => (
                                    <Control.Row key={index} extra={`align-items: flex-start;`}>
                                        <Control.Select
                                            name={`operatorConfigData.storageStructure.rightSourceFields.[${index}].sourceFieldName`}
                                            options={
                                                _.get(
                                                    tasks?.find?.((i) => i?.id === _.get(data, `operatorConfigData.joinTaskIdSource`)) ?? {},
                                                    `operatorConfigData.storageStructure`
                                                )
                                                    ?.map?.((i) => i?.storageFieldName)
                                                    ?.map?.((i) => ({
                                                        value: i,
                                                        label: i,
                                                        muted: _.get(data, `operatorConfigData.storageStructure.rightSourceFields`)
                                                            ?.map?.((i) => i?.sourceFieldName)
                                                            ?.includes?.(i),
                                                    })) ?? []
                                            }
                                        />
                                        <Frame
                                            extra={({ theme }) =>
                                                `flex: unset; width: 16px; height: 16px; margin-top: 20px; color: ${theme.text.secondary};`
                                            }
                                        >
                                            =
                                        </Frame>
                                        <Control.Input
                                            name={`operatorConfigData.joinSettings.storageStructure.rightSourceFields.[${index}].storageFieldName`}
                                        />
                                        <RemoveRowButton
                                            extra={`margin-top: 9px;`}
                                            onClick={() => {
                                                setValue(
                                                    `operatorConfigData.storageStructure.rightSourceFields`,
                                                    _.get(data, `operatorConfigData.storageStructure.rightSourceFields`)?.filter(
                                                        (i, j) => j !== index
                                                    )
                                                );
                                            }}
                                        />
                                    </Control.Row>
                                ))}
                                <Button
                                    background={`orange`}
                                    extra={`margin-bottom: 10px;`}
                                    onClick={() => {
                                        setValue(`operatorConfigData.storageStructure.rightSourceFields`, [
                                            ...(_.get(data, `operatorConfigData.storageStructure.rightSourceFields`) ?? []),
                                            { fieldName: "", joinFieldName: "" },
                                        ]);
                                    }}
                                >
                                    Добавить строку
                                </Button>
                            </>
                        ),
                    }?.[data?.operator]
                }
                {/* <Br/>
                <Control.Row>
                    <H2 extra={`margin-bottom: 20px;`}>Структура выходных данных</H2>
                </Control.Row> */}
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

const RemoveRowButton = (props) => (
    <Button
        background={`orange`}
        leftIcon={`cross-white`}
        {...props}
        extra={`padding: 9px; &:before { margin: 0; }; min-width: unset; width: auto; flex: unset; ${props?.extra ?? ``}`}
    />
);

const MappingArrow = styled(Frame)`
    width: 16px;
    height: 16px;
    margin-top: 20px;
    background: url("${require(`../../assets/icons/mapping-arrow.svg`).default}") no-repeat center center / contain;
`;

export default CrateTaskModal;
/*eslint-enable*/
