/*eslint-disable*/
import React, { useState, useEffect } from "react";
import _ from "lodash";
import styled from "styled-components";

import { Br, Frame, H1, H2, MappingArrow, RowWrapper, Tab } from "../../ui-kit/styled-templates";
import { Control } from "../../ui-kit/control";

import { FORMS, TABLES, UPDATE_TYPES } from "../../../constants/config";
import TasksHelper from "../../../utils/tasks-helper";

import DatasourceAPI from "../../../api/datasource-api";
import SchemasAPI from "../../../api/schemas-api";

import useFormControl from "../../../hooks/useFormControl";
import { useStorageListener } from "../../../hooks/useStorage";

const useDeepEffect = (effect, dependencies) => {
    useEffect(effect, [JSON.stringify(dependencies)]);
};

const SQLClone = (props) => {
    const { mode = `view` } = props;
    const { data, removeValue, setValue } = useFormControl({ name: FORMS.CREATE_TASK });
    const datasources = useStorageListener((state) => state?.tables?.[TABLES.DATASOURCE_LIST]?.rows ?? []);
    const params = useStorageListener((state) => ({
        source: {
            schemas: _.get(state, `datasources.schemas.${data?.operatorConfigData?.source?.sourceId}`) ?? [],
            tables: _.map(
                state?.datasources?.tables?.[data?.operatorConfigData?.source?.sourceId]?.[data?.operatorConfigData?.source?.sourceSchemaName],
                "tableName"
            ),
            columns:
                state?.datasources?.tables?.[data?.operatorConfigData?.source?.sourceId]?.[data?.operatorConfigData?.source?.sourceSchemaName]
                    ?.find?.((i) => i?.tableName === data?.operatorConfigData?.source?.sourceTableName)
                    ?.fields?.map?.((i) => i?.fieldName) ?? [],
        },
        target: {
            schemas: _.get(state, `datasources.schemas.${data?.operatorConfigData?.target?.targetId}`) ?? [],
            tables: _.map(
                state?.datasources?.tables?.[data?.operatorConfigData?.target?.targetId]?.[data?.operatorConfigData?.target?.targetSchemaName],
                "tableName"
            ),
            columns:
                state?.datasources?.tables?.[data?.operatorConfigData?.target?.targetId]?.[data?.operatorConfigData?.target?.targetSchemaName]
                    ?.find?.((i) => i?.tableName === data?.operatorConfigData?.target?.targetTableName)
                    ?.fields?.map?.((i) => i?.fieldName) ?? [],
        },
    }));
    useDeepEffect(() => {
        if (!!_.get(data, `operatorConfigData.source.sourceId`) && !!_.get(data, `operatorConfigData.source.sourceTableName`)) {
            DatasourceAPI.getTableColumns(
                _.get(data, `operatorConfigData.source.sourceId`),
                _.get(data, `operatorConfigData.source.sourceTableName`)
            );
        }
    }, [_.get(data, `operatorConfigData.source.sourceId`), _.get(data, `operatorConfigData.source.sourceTableName`)]);
    useDeepEffect(() => {
        if (!!_.get(data, `operatorConfigData.target.targetId`) && !!_.get(data, `operatorConfigData.target.targetTableName`)) {
            DatasourceAPI.getTableColumns(
                _.get(data, `operatorConfigData.target.targetId`),
                _.get(data, `operatorConfigData.target.targetTableName`)
            );
        }
    }, [_.get(data, `operatorConfigData.target.targetId`), _.get(data, `operatorConfigData.target.targetTableName`)]);
    useDeepEffect(() => {
        const sourceId = _.get(data, `operatorConfigData.source.sourceId`);
        if (sourceId) {
            SchemasAPI.getSchemas(sourceId);
        }
    }, [_.get(data, `operatorConfigData.source.sourceId`)]);
    useDeepEffect(() => {
        const sourceId = _.get(data, `operatorConfigData.source.sourceId`);
        const sourceSchemaName = _.get(data, `operatorConfigData.source.sourceSchemaName`);
        if (sourceId && sourceSchemaName) {
            DatasourceAPI.getDatasourceTables(sourceId, sourceSchemaName);
        }
    }, [_.get(data, `operatorConfigData.source.sourceId`), _.get(data, `operatorConfigData.source.sourceSchemaName`)]);
    useDeepEffect(() => {
        const targetId = _.get(data, `operatorConfigData.target.targetId`);
        if (targetId) {
            SchemasAPI.getSchemas(targetId);
        }
    }, [_.get(data, `operatorConfigData.target.targetId`)]);
    useDeepEffect(() => {
        const targetId = _.get(data, `operatorConfigData.target.targetId`);
        const targetSchemaName = _.get(data, `operatorConfigData.target.targetSchemaName`);
        if (targetId && targetSchemaName) {
            DatasourceAPI.getDatasourceTables(targetId, targetSchemaName);
        }
    }, [_.get(data, `operatorConfigData.target.targetId`), _.get(data, `operatorConfigData.target.targetSchemaName`)]);
    useDeepEffect(() => {
        const mappingStructure = _.get(data, `operatorConfigData.target.mappingStructure`);
        mappingStructure?.forEach(({ sourceFieldName, targetFieldName }, index) => {
            if (!targetFieldName && params?.target?.columns?.includes?.(sourceFieldName)) {
                setValue(`operatorConfigData.target.mappingStructure.${index}.targetFieldName`, sourceFieldName);
            }
        });
    }, [_.get(data, `operatorConfigData.target.mappingStructure`), params?.target?.columns]);
    useDeepEffect(() => {
        if (mode === `create`) {
            const newMappingStructure = TasksHelper.syncMappingStructure(
                _.get(data, `operatorConfigData.source.sourceTableFields`),
                _.get(data, `operatorConfigData.target.mappingStructure`)
            );
            setValue(`operatorConfigData.target.mappingStructure`, newMappingStructure);
        }
    }, [_.get(data, `operatorConfigData.source.sourceTableFields`)]);
    const tabs = {
        [`Источник данных`]: (
            <>
                <Control.Row>
                    <Control.Select
                        name={`operatorConfigData.source.sourceId`}
                        label={`Источник данных`}
                        options={datasources?.map?.(({ id, name }) => ({ label: name, value: id }))}
                        onChange={(e) => {
                            removeValue([
                                `operatorConfigData.source.sourceSchemaName`,
                                `operatorConfigData.source.sourceTableName`,
                                `operatorConfigData.source.sourceTableFields`,
                            ]);
                        }}
                        extra={`flex: 0.5; margin-right: 16px !important;`}
                        isRequired
                        allowSearch
                    />
                </Control.Row>
                <Control.Row>
                    <Control.Select
                        name={`operatorConfigData.source.sourceSchemaName`}
                        label={`Имя схемы в источнике`}
                        options={params?.source?.schemas?.map?.((item) => ({ label: item, value: item }))}
                        readOnly={!params?.source?.schemas?.length}
                        isRequired
                        allowSearch
                        onChange={(e) => {
                            removeValue([`operatorConfigData.source.sourceTableName`, `operatorConfigData.source.sourceTableFields`]);
                        }}
                    />
                    <Control.Select
                        name={`operatorConfigData.source.sourceTableName`}
                        label={`Имя таблицы в источнике`}
                        options={params?.source?.tables?.map?.((item) => ({ label: item, value: item }))}
                        readOnly={!params?.source?.tables?.length}
                        // onChange={(e) => {
                        //     DatasourceAPI.getTableColumns(data?.operatorConfigData?.source?.sourceId, e.target.value);
                        // }}
                        isRequired
                        allowSearch
                        onChange={(e) => {
                            removeValue([`operatorConfigData.source.sourceTableFields`]);
                        }}
                    />
                </Control.Row>
                <Control.Row>
                    <Control.Select
                        name={`operatorConfigData.source.sourceTableFields`}
                        label={`Поля для извлечения`}
                        multiselect
                        options={params?.source?.columns?.map?.((item) => ({ label: item, value: item }))}
                        value={_.get(data, `operatorConfigData.source.sourceTableFields`)?.map?.((item) => item?.sourceFieldName)}
                        onChange={(e) => {
                            e.target.value = e.target.value?.map?.((i) => ({ sourceFieldName: i })) ?? [];
                            return e;
                        }}
                        readOnly={!params?.source?.columns?.length}
                        isRequired
                        allowSearch
                    />
                </Control.Row>
            </>
        ),
        [`Получатель данных`]: (
            <>
                <Control.Row>
                    <H2 extra={`margin-bottom: 20px;`}>Получатель данных</H2>
                </Control.Row>
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
                                // `operatorConfigData.target.mappingStructure`,
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
                        // onChange={(e) => {
                        //     DatasourceAPI.getTableColumns(data?.operatorConfigData?.target?.targetId, e.target.value);
                        // }}
                        isRequired
                        allowSearch
                    />
                </Control.Row>
            </>
        ),
        [`Соответствие полей`]: (
            <>
                <Control.Row>
                    <H2 extra={`margin-bottom: 20px;`}>Соответствие полей</H2>
                </Control.Row>
                <Control.Row>
                    <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start;`}>Поле в источнике</Control.Label>
                    <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start; margin-left: 32px;`} required>
                        Поле в получателе данных
                    </Control.Label>
                </Control.Row>
                {_.get(data, `operatorConfigData.target.mappingStructure`)?.map?.(({ sourceFieldName: item }, index) => {
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
                                // isRequired
                                allowSearch
                            />
                        </Control.Row>
                    );
                })}
            </>
        ),
        [`Настройки обновления`]: (
            <>
                <Control.Row>
                    <H2 extra={`margin-bottom: 20px;`}>Настройки обновления</H2>
                </Control.Row>
                <Control.Row>
                    <Control.Select
                        name={`operatorConfigData.updateSettings.updateType`}
                        label={`Тип обновления`}
                        options={Object.entries(_.pick(UPDATE_TYPES, [`REPLACE`, `INCREMENT_UPSERT`, `INCREMENT_INSERT`, `INCREMENT_LOAD`])).map(
                            ([value, label], index) => ({ label, value })
                        )}
                        extra={`flex: 0.5; margin-right: 16px !important;`}
                        isRequired
                        allowSearch
                    />
                </Control.Row>
                {
                    {
                        REPLACE: null,
                        INCREMENT_UPSERT: (
                            <>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.updateSettings.lastUpdatedFieldSource`}
                                        label={`Поле последнего обновления в таблице источника`}
                                        options={params?.source?.columns?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params?.source?.columns?.length}
                                        isRequired
                                        allowSearch
                                    />
                                    <Control.Select
                                        name={`operatorConfigData.updateSettings.lastUpdatedFieldTarget`}
                                        label={`Поле последнего обновления в таблице получателя`}
                                        options={params?.target?.columns?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params?.target?.columns?.length}
                                        isRequired
                                        allowSearch
                                    />
                                </Control.Row>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.updateSettings.primaryKey`}
                                        label={`Поле первичного ключа в таблице источника`}
                                        extra={`flex: 0.5; margin-right: 16px !important;`}
                                        options={params?.source?.columns?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params?.source?.columns?.length}
                                        isRequired
                                        allowSearch
                                    />
                                </Control.Row>
                            </>
                        ),
                        INCREMENT_INSERT: (
                            <>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.updateSettings.lastCreatedFieldSource`}
                                        label={`Поле создания записи в таблице источника`}
                                        options={params?.source?.columns?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params?.source?.columns?.length}
                                        isRequired
                                        allowSearch
                                    />
                                    <Control.Select
                                        name={`operatorConfigData.updateSettings.lastCreatedFieldTarget`}
                                        label={`Поле создания записи в таблице получателя`}
                                        options={params?.target?.columns?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params?.target?.columns?.length}
                                        isRequired
                                        allowSearch
                                    />
                                </Control.Row>
                            </>
                        ),
                        INCREMENT_LOAD: (
                            <>
                                <Control.Row>
                                    <Control.Select
                                        name={`operatorConfigData.updateSettings.lastUpdatedFieldSource`}
                                        label={`Поле последнего обновления в таблице источника`}
                                        options={params?.source?.columns?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params?.source?.columns?.length}
                                        isRequired
                                        allowSearch
                                    />
                                    <Control.Select
                                        name={`operatorConfigData.updateSettings.lastUpdatedFieldTarget`}
                                        label={`Поле последнего обновления в таблице получателя`}
                                        options={params?.target?.columns?.map?.((item) => ({ label: item, value: item }))}
                                        readOnly={!params?.target?.columns?.length}
                                        isRequired
                                        allowSearch
                                    />
                                </Control.Row>
                            </>
                        ),
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

export default SQLClone;
/*eslint-enable*/
