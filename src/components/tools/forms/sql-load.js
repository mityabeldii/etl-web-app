/*eslint-disable*/
import React, { useState, useEffect } from "react";
import _ from "lodash";
import styled from "styled-components";
import { useParams } from "react-router-dom";

import { Br, Frame, H1, H2, MappingArrow, Button, RemoveRowButton, RowWrapper, Tab } from "../../ui-kit/styled-templates";
import { Control } from "../../ui-kit/control";

import { FORMS, TABLES, UPDATE_TYPES, OPERATORS } from "../../../constants/config";

import TasksHelper from "../../../utils/tasks-helper";

import DatasourceAPI from "../../../api/datasource-api";
import SchemasAPI from "../../../api/schemas-api";

import useFormControl from "../../../hooks/useFormControl";
import { getStorage, useStorageListener } from "../../../hooks/useStorage";

const useDeepEffect = (effect, dependencies) => {
    useEffect(effect, [JSON.stringify(dependencies)]);
};

const SQLLoad = (props) => {
    const { process = [], mode = `view` } = props;
    const { tasks } = process;

    const { data, removeValue, setValue } = useFormControl({ name: FORMS.CREATE_TASK });
    const datasources = useStorageListener((state) => state?.tables?.[TABLES.DATASOURCE_LIST]?.rows ?? []);

    const taskIdSource = _.get(data, `operatorConfigData.taskIdSource`);
    const targetId = _.get(data, `operatorConfigData.target.targetId`);
    const targetSchemaName = _.get(data, `operatorConfigData.target.targetSchemaName`);
    const targetTableName = _.get(data, `operatorConfigData.target.targetTableName`);
    const mappingStructure = _.get(data, `operatorConfigData.target.mappingStructure`);

    const params = useStorageListener((state) => {
        return {
            source: {
                columns: TasksHelper.getMappingStructure(taskIdSource),
            },
            target: {
                schemas: _.get(state, `datasources.schemas.${targetId}`) ?? [],
                tables: _.get(state, `datasources.tables[${targetId}].${targetSchemaName}`)?.map?.((i) => i?.tableName) ?? [],
                columns: _.chain(state)
                    .get(`datasources.tables[${targetId}].${targetSchemaName}`)
                    .find({ tableName: targetTableName })
                    .get(`fields`)
                    .map(`fieldName`)
                    .value(),
            },
        };
    });

    useDeepEffect(() => {
        targetId && SchemasAPI.getSchemas(targetId);
    }, [targetId]);
    useDeepEffect(() => {
        targetId && targetSchemaName && DatasourceAPI.getDatasourceTables(targetId, targetSchemaName);
    }, [targetId, targetSchemaName]);
    useDeepEffect(() => {
        setValue(
            `operatorConfigData.target.mappingStructure`,
            TasksHelper.syncMappingStructure(
                TasksHelper.getMappingStructure(taskIdSource).map((i) => ({
                    sourceFieldName: i,
                    targetFieldName: params?.target?.columns?.includes?.(i) ? i : ``,
                }))
            ) ?? []
        );
    }, [taskIdSource, params?.target?.columns]);
    const tabs = {
        [`Источник данных`]: (
            <>
                <Control.Row>
                    <Control.Select
                        name={`operatorConfigData.taskIdSource`}
                        label={`Наименование задачи`}
                        options={
                            tasks
                                ?.filter?.((i) => [OPERATORS.JOIN, OPERATORS.SQL_EXTRACT, OPERATORS.CALCULATED]?.includes?.(i?.operator))
                                ?.map?.(({ id: value, taskName: label }) => ({ label, value })) ?? []
                        }
                        onChange={() => {
                            removeValue([`operatorConfigData.target.mappingStructure`]);
                        }}
                        extra={`flex: 0.5; margin-right: 16px !important;`}
                        isRequired
                    />
                </Control.Row>
            </>
        ),
        [`Получатель данных`]: (
            <>
                <Control.Row>
                    <Control.Select
                        name={`operatorConfigData.target.targetId`}
                        label={`Получатель данных`}
                        options={datasources?.map?.(({ id, name }) => ({ label: name, value: id }))}
                        extra={`flex: 0.5; margin-right: 16px !important;`}
                        onChange={(e) => {
                            removeValue([
                                `operatorConfigData.target.targetSchemaName`,
                                `operatorConfigData.target.targetTableName`,
                                ...(_.get(data, `operatorConfigData.target.mappingStructure`)?.map?.(
                                    (i, j) => `operatorConfigData.target.mappingStructure.${j}.targetFieldName`
                                ) ?? []),
                            ]);
                        }}
                        isRequired
                        allowSearch
                    />
                </Control.Row>
                <Control.Row>
                    <Control.Select
                        name={`operatorConfigData.target.targetSchemaName`}
                        label={`Имя схемы в получателе данных`}
                        options={params?.target?.schemas?.map?.((item) => ({ label: item, value: item }))}
                        readOnly={!params?.target?.schemas?.length}
                        isRequired
                        allowSearch
                    />
                    <Control.Select
                        name={`operatorConfigData.target.targetTableName`}
                        label={`Имя таблицы в получателе данных`}
                        options={params?.target?.tables?.map?.((item) => ({ label: item, value: item }))}
                        readOnly={!params?.target?.tables?.length}
                        isRequired
                        allowSearch
                    />
                </Control.Row>
            </>
        ),
        [`Соответствие полей`]: (
            <>
                <Control.Row>
                    <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start;`} required>
                        Поле во вспомогательном хранилище
                    </Control.Label>
                    <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start; margin-left: 32px;`} required>
                        Поле в получателе данных
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
                                    params?.source?.columns?.map?.((i) => ({
                                        value: i,
                                        label: i,
                                        muted: _.get(data, `operatorConfigData.target.mappingStructure`)
                                            ?.map?.((i) => i?.sourceFieldName)
                                            ?.includes?.(i),
                                    })) ?? []
                                }
                                allowSearch
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
                                allowSearch
                            />
                            <RemoveRowButton
                                mode={mode}
                                extra={`margin-top: 8px;`}
                                onClick={() => {
                                    setValue(
                                        `operatorConfigData.target.mappingStructure`,
                                        _.get(data, `operatorConfigData.target.mappingStructure`)?.filter?.((i, j) => j !== index) ?? []
                                    );
                                }}
                            />
                        </Control.Row>
                    );
                })}
                {mode !== `view` && (
                    <Button
                        background={`orange`}
                        onClick={() => {
                            setValue(`operatorConfigData.target.mappingStructure`, [
                                ...(_.get(data, `operatorConfigData.target.mappingStructure`) ?? []),
                                { sourceFieldName: ``, targetFieldName: `` },
                            ]);
                        }}
                    >
                        Добавить строку
                    </Button>
                )}
            </>
        ),
        [`Настройки обновления`]: (
            <>
                <Control.Row>
                    <Control.Select
                        name={`operatorConfigData.updateSettings.updateType`}
                        label={`Тип обновления`}
                        options={Object.entries(_.pick(UPDATE_TYPES, [`REPLACE`, `UPSERT`, `INSERT`])).map(([value, label], index) => ({
                            label,
                            value,
                        }))}
                        extra={`flex: 0.5; margin-right: 16px !important;`}
                    />
                </Control.Row>
                {
                    {
                        REPLACE: null,
                        UPSERT: (
                            <>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.updateSettings.primaryKey`}
                                        label={`Поле первичного ключа в таблице источника`}
                                        extra={`flex: 0.5; margin-right: 16px !important;`}
                                        options={
                                            TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.taskIdSource`))?.map?.((i) => ({
                                                value: i,
                                                label: i,
                                                muted: i === _.get(data, `operatorConfigData.updateSettings.primaryKey`),
                                            })) ?? []
                                        }
                                    />
                                </Control.Row>
                            </>
                        ),
                        INSERT: null,
                    }?.[_.get(data, `operatorConfigData.updateSettings.updateType`)]
                }
            </>
        ),
    };
    const [selectedTab, setSelectedTab] = useState(_.keys(tabs)?.[0]);
    return (
        <>
            <Control.Row>
                <H1 extra={`margin-bottom: 24px;`}>Конфигурация оператора</H1>
            </Control.Row>
            <RowWrapper extra={`margin-bottom: 5px; justify-content: flex-start;`}>
                {_.keys(tabs)?.map?.((i, index) => (
                    <Tab key={index} selected={i === selectedTab} onClick={() => setSelectedTab(i)}>
                        {i}
                    </Tab>
                ))}
            </RowWrapper>
            {/* <Frame extra={`max-height: 250px; width: 100%; flex: 1; display: block; overflow: auto; justify-content: flex-start;`}>
                <Frame extra={`width: 100%; display: flex; min-height: min-content;`}>{tabs?.[selectedTab]}</Frame>
            </Frame> */}
            {tabs?.[selectedTab]}
            <Br />
        </>
    );
};

export default SQLLoad;
/*eslint-enable*/
