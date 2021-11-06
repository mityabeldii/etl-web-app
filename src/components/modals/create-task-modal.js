/*eslint-disable*/
import { useState, useEffect, useMemo } from "react";
import styled, { css } from "styled-components";
import { useLocation, useParams } from "react-router-dom";
import _ from "lodash";

import { Frame, Button, Input, Dropdown, H1, H2, P, Link, Br } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import PopUpWrapper from "./pop-up-wrapper";

import ProcessesAPI from "../../api/processes-api";
import DatasourceAPI from "../../api/datasource-api";

import { MODALS, FORMS, OPERATORS, TABLES } from "../../constants/config";

import useForm from "../../hooks/useForm";
import { eventDispatch } from "../../hooks/useEventListener";
import { putStorage, useStorageListener } from "../../hooks/useStorage";
import Textarea from "../ui-kit/textarea";
import Select from "../ui-kit/select";

const schema = (yup) =>
    yup.object().shape({
        taskName: yup.string().required(`Это поле обязательно`),
        operator: yup.string().required(`Это поле обязательно`),
        taskQueue: yup.number().required(`Это поле обязательно`),
    });

const CrateTaskModal = () => {
    const { Form, onSubmit, setValue, omitValue, clearForm } = useForm({ name: FORMS.CREATE_TASK, schema });
    const { process_id } = useParams();
    const process = useStorageListener((state) => state?.processes ?? [])?.[process_id] ?? {};
    const { tasks = [] } = process;
    const data = useStorageListener((state) => state?.forms?.[FORMS.CREATE_TASK] ?? {});
    const datasources = useStorageListener((state) => state?.tables?.[TABLES.DATASOURCE_LIST]?.rows ?? []);
    const schemas = useStorageListener(`state.datasources.schemas.${data?.operatorConfigData?.source?.sourceId}`) ?? [];
    const tables = useStorageListener(`state.datasources.tables.${data?.operatorConfigData?.source?.sourceId}`) ?? [];
    const columns =
        useStorageListener(
            `state.datasources.columns.${data?.operatorConfigData?.source?.sourceId}.${data?.operatorConfigData?.source?.targetTableName}`
        ) ?? [];
    useEffect(() => {
        if (data?.operatorConfigData?.source?.sourceId) {
            // omitValue([
            //     `operatorConfigData.source.targetSchemaName`,
            //     `operatorConfigData.source.targetTableName`,
            //     `operatorConfigData.source.sourceTableFields`,
            // ]);
            DatasourceAPI.getSchemas(data?.operatorConfigData?.source?.sourceId);
            DatasourceAPI.getDatasourceTables(data?.operatorConfigData?.source?.sourceId);
        }
    }, [data?.operatorConfigData?.source?.sourceId]);
    useEffect(() => {
        if (data?.operatorConfigData?.source?.sourceId && data?.operatorConfigData?.source?.targetTableName) {
            DatasourceAPI.getTableColumns(data?.operatorConfigData?.source?.sourceId, data?.operatorConfigData?.source?.targetTableName);
        }
    }, [data?.operatorConfigData?.source?.sourceId, data?.operatorConfigData?.source?.targetTableName]);
    useEffect(DatasourceAPI.getDatasources, []);
    const handleSubmit = async (data) => {
        try {
            await ProcessesAPI.createTask(process_id, { ...data, processId: process_id });
            closeModal();
        } catch (error) {}
    };
    const closeModal = () => {
        clearForm();
        eventDispatch(`CLOSE_${MODALS.CREATE_TASK}_MODAL`);
    };
    return useMemo(
        () => (
            <PopUpWrapper name={MODALS.CREATE_TASK} onClickOutside={closeModal}>
                <Form onSubmit={onSubmit(handleSubmit)} extra={`width: 100%; flex-wrap: wrap; flex-direction: row; justify-content: flex-start;`}>
                    <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px;`}>Добавить задачу</H1>
                    <Control.Row>
                        <Control.Input name={`taskName`} label={`Имя`} placeholder={`Имя задачи`} isRequired />
                    </Control.Row>
                    <Control.Row>
                        <Control.Textarea
                            name={`taskDescription`}
                            label={`Описание`}
                            placeholder={`Краткое описание задачи`}
                            controlStyles={`flex: 1;`}
                        />
                    </Control.Row>
                    <Control.Row>
                        <Control.Select
                            name={`operator`}
                            label={`Выберите оператор для задачи`}
                            options={Object.keys(OPERATORS).map((item) => ({ label: item, value: item }))}
                            isRequired
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
                                    <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px;`}>Конфигурация оператора</H1>
                                    <H2 extra={`width: 100%; align-items: flex-start; margin-bottom: 20px;`}>Источник данных</H2>
                                    <Control.Row>
                                        <Control.Select
                                            name={`operatorConfigData.source.sourceId`}
                                            label={`Источник данных`}
                                            options={datasources?.map?.(({ id, name }) => ({ label: name, value: id }))}
                                            isRequired
                                        />
                                        <Control.Checkbox
                                            name={`operatorConfigData.source.sqlQuery`}
                                            label={`Источник данных`}
                                            options={datasources?.map?.(({ id, name }) => ({ label: name, value: id }))}
                                            isRequired
                                        />
                                    </Control.Row>
                                    <Control.Row>
                                        <Control.Select
                                            name={`operatorConfigData.source.targetSchemaName`}
                                            label={`Имя схемы в источнике`}
                                            options={schemas?.map?.((item) => ({ label: item, value: item }))}
                                            readOnly={!schemas?.length}
                                        />
                                        <Control.Select
                                            name={`operatorConfigData.source.targetTableName`}
                                            label={`Имя таблицы в источнике`}
                                            options={tables?.map?.((item) => ({ label: item, value: item }))}
                                            readOnly={!tables?.length}
                                        />
                                    </Control.Row>
                                    <Control.Row>
                                        <Control.Select
                                            name={`operatorConfigData.source.sourceTableFields`}
                                            label={`Поля для извлечения`}
                                            multiselect
                                            options={columns?.map?.((item) => ({ label: item, value: item }))}
                                            readOnly={!columns?.length}
                                        />
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
        ),
        [data?.operator, schemas, tables, columns]
    );
};

export default CrateTaskModal;
/*eslint-enable*/
