/*eslint-disable*/
import { useState, useEffect, useRef, useMemo, Children, isValidElement, cloneElement, useImperativeHandle } from "react";
import styled, { css } from "styled-components";
import { useLocation, useParams } from "react-router-dom";
import _ from "lodash";
import * as yup from "yup";

import { Frame, Button, Input, Dropdown, H1, H2, P, Link, Br, Checkbox } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import PopUpWrapper from "./pop-up-wrapper";

import ProcessesAPI from "../../api/processes-api";
import DatasourceAPI from "../../api/datasource-api";

import { MODALS, FORMS, OPERATORS, TABLES, base_url, UPDATE_TYPES } from "../../constants/config";

import useForm from "../../hooks/useForm";
import { eventDispatch } from "../../hooks/useEventListener";
import { getStorage, putStorage, omitStorage, useStorageListener } from "../../hooks/useStorage";

const schema = (yup) =>
    yup.object().shape({
        taskName: yup.string().required(`Это поле обязательно`),
        operator: yup.string().required(`Это поле обязательно`),
        taskQueue: yup.number().required(`Это поле обязательно`),
    });

const useSubmit = (name) => {
    const data = useStorageListener((state) => _.get(state, `forms.${name}.values`)) ?? ``;
    const setErrors = (errors) => {
        putStorage(`forms.${name}.errors`, errors);
    };
    const onSubmit = (handleSubmit) => async (e) => {
        try {
            e?.preventDefault?.();
            const data = getStorage((state) => _.get(state, `forms.${name}.values`) ?? {});
            await schema(yup).validate(data, { abortEarly: false });
            setErrors({});
            handleSubmit(data);
        } catch (error) {
            setErrors(Object.fromEntries(error?.inner?.map?.((e) => [e?.path, { message: e?.message }]) ?? []));
        }
    };
    const clearForm = () => {
        omitStorage(`forms.${name}`);
    };
    const setValue = (path, value) => {
        putStorage(`forms.${name}.values.${path}`, value);
    };
    const omitValue = (value) => {
        (Array.isArray(value) ? value : [value]).forEach((i) => {
            omitStorage(`forms.${name}.values.${i}`);
        });
    };
    return {
        data,
        setValue,
        omitValue,
        onSubmit,
        setErrors,
        clearForm,
    };
};

const CrateTaskModal = () => {
    const { data, setValue, omitValue, onSubmit, clearForm } = useSubmit(FORMS.CREATE_TASK);
    
    const { process_id } = useParams();
    const process = useStorageListener((state) => state?.processes ?? [])?.[process_id] ?? {};
    const { tasks = [] } = process;
    const datasources = useStorageListener((state) => state?.tables?.[TABLES.DATASOURCE_LIST]?.rows ?? []);
    const source = useStorageListener((state) => ({
        schemas: _.get(state, `datasources.schemas.${data?.operatorConfigData?.source?.sourceId}`) ?? [],
        tables: _.get(state, `datasources.tables.${data?.operatorConfigData?.source?.sourceId}`) ?? [],
        columns:
            _.get(state, `datasources.columns.${data?.operatorConfigData?.source?.sourceId}.${data?.operatorConfigData?.source?.targetTableName}`) ??
            [],
    }));
    useEffect(() => {
        if (data?.operatorConfigData?.source?.sourceId) {
            omitValue([
                `operatorConfigData.source.targetSchemaName`,
                `operatorConfigData.source.targetTableName`,
                `operatorConfigData.source.sourceTableFields`,
            ]);
            DatasourceAPI.getSchemas(data?.operatorConfigData?.source?.sourceId);
            DatasourceAPI.getDatasourceTables(data?.operatorConfigData?.source?.sourceId);
        }
    }, [data?.operatorConfigData?.source?.sourceId]);
    useEffect(() => {
        if (data?.operatorConfigData?.source?.sourceId && data?.operatorConfigData?.source?.targetTableName) {
            DatasourceAPI.getTableColumns(data?.operatorConfigData?.source?.sourceId, data?.operatorConfigData?.source?.targetTableName);
        }
    }, [data?.operatorConfigData?.source?.sourceId, data?.operatorConfigData?.source?.targetTableName]);
    const target = useStorageListener((state) => ({
        schemas: _.get(state, `datasources.schemas.${data?.operatorConfigData?.target?.targetId}`) ?? [],
        tables: _.get(state, `datasources.tables.${data?.operatorConfigData?.target?.targetId}`) ?? [],
        columns:
            _.get(state, `datasources.columns.${data?.operatorConfigData?.target?.targetId}.${data?.operatorConfigData?.target?.targetTableName}`) ??
            [],
    }));
    useEffect(() => {
        if (data?.operatorConfigData?.target?.targetId) {
            omitValue([
                `operatorConfigData.target.targetSchemaName`,
                `operatorConfigData.target.targetTableName`,
                `operatorConfigData.target.mappingStructure`,
            ]);
            DatasourceAPI.getSchemas(data?.operatorConfigData?.target?.targetId);
            DatasourceAPI.getDatasourceTables(data?.operatorConfigData?.target?.targetId);
        }
    }, [data?.operatorConfigData?.target?.targetId]);
    useEffect(() => {
        if (data?.operatorConfigData?.target?.targetId && data?.operatorConfigData?.target?.targetTableName) {
            DatasourceAPI.getTableColumns(data?.operatorConfigData?.target?.targetId, data?.operatorConfigData?.target?.targetTableName);
        }
    }, [data?.operatorConfigData?.target?.targetId, data?.operatorConfigData?.target?.targetTableName]);
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
                <Control.Row>
                    <Control.Input name={`taskQueue`} label={`Порядок запуска`} placeholder={``} isRequired />
                    <Control.Select
                        multiselect={true}
                        name={`downstreamTaskIds`}
                        label={`Следующие задачи`}
                        options={tasks.map(({ taskName, id }) => ({ label: taskName, value: id }))}
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
                                    />
                                    <Control.Checkbox label={`Указать SQL-запрос`} name={`operatorConfigData.source.sqlQuery`} isRequired />
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.source.targetSchemaName`}
                                        label={`Имя схемы в источнике`}
                                        options={source?.schemas?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!source?.schemas?.length}
                                    />
                                    <Control.Select
                                        name={`operatorConfigData.source.targetTableName`}
                                        label={`Имя таблицы в источнике`}
                                        options={source?.tables?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!source?.tables?.length}
                                    />
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.source.sourceTableFields`}
                                        label={`Поля для извлечения`}
                                        multiselect
                                        options={source?.columns?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!source?.columns?.length}
                                    />
                                </Control.Row>
                                <Br />
                                <Control.Row>
                                    <H2 extra={`margin-bottom: 20px;`}>Получатель данных</H2>
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.target.targetId`}
                                        label={`Источник данных`}
                                        options={datasources?.map?.(({ id, name }) => ({ label: name, value: id }))}
                                        isRequired
                                    />
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.target.targetSchemaName`}
                                        label={`Имя схемы в промежуточном хранилище`}
                                        options={target?.schemas?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!target?.schemas?.length}
                                    />
                                    <Control.Select
                                        name={`operatorConfigData.target.targetTableName`}
                                        label={`Имя таблицы в промежуточном хранилище`}
                                        options={target?.tables?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!target?.tables?.length}
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
                                                options={target?.columns?.map?.((item) => ({
                                                    label: item,
                                                    value: item,
                                                    muted: _.get(data, `operatorConfigData.target.mappingStructure`)
                                                        ?.map?.((i) => i?.targetFieldName)
                                                        ?.includes(item),
                                                }))}
                                                readOnly={!target?.columns?.length}
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
                                        options={[]}
                                    />
                                    <Control.Select name={`operatorConfigData.updateSettings.primaryKey`} label={`ID`} options={[]} />
                                </Control.Row>
                            </>
                        ),
                    }?.[data?.operator]
                }
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

const Form = styled.form`
    width: 100%;
    align-items: flex-start;
`;

export default CrateTaskModal;
/*eslint-enable*/
