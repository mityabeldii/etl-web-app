/*eslint-disable*/
import React, { useEffect } from "react";
import _ from "lodash";
import styled from "styled-components";

import { Br, Frame, H1, H2, MappingArrow, Button, RemoveRowButton } from "../../ui-kit/styled-templates";
import { Control } from "../../ui-kit/control";

import { FORMS, TABLES, UPDATE_TYPES, OPERATORS } from "../../../constants/config";

import DatasourceAPI from "../../../api/datasource-api";
import SchemasAPI from "../../../api/schemas-api";

import useFormControl from "../../../hooks/useFormControl";
import { getStorage, useStorageListener } from "../../../hooks/useStorage";
import TasksHelper from "../../../utils/tasks-helper";

const SQLLoad = ({ tasks = [], mode = `view` }) => {
    const { data, removeValue, setValue } = useFormControl({ name: FORMS.CREATE_TASK });
    const datasources = useStorageListener((state) => state?.tables?.[TABLES.DATASOURCE_LIST]?.rows ?? []);
    const params = useStorageListener((state) => ({
        target: {
            schemas: _.get(state, `datasources.schemas.${_.get(data, `operatorConfigData.target.targetId`)}`) ?? [],
            tables: _.get(state, `datasources.tables.${_.get(data, `operatorConfigData.target.targetId`)}`) ?? [],
            columns:
                _.get(
                    state,
                    `datasources.columns.${_.get(data, `operatorConfigData.target.targetId`)}.${_.get(
                        data,
                        `operatorConfigData.target.targetTableName`
                    )}`
                ) ?? [],
        },
    }));
    useEffect(() => {
        const targetId = _.get(data, `operatorConfigData.target.targetId`);
        if (targetId) {
            SchemasAPI.getSchemas(targetId);
            DatasourceAPI.getDatasourceTables(targetId);
        }
    }, [_.get(data, `operatorConfigData.target.targetId`)]);
    useEffect(() => {
        const targetId = _.get(data, `operatorConfigData.target.targetId`);
        const targetTableName = _.get(data, `operatorConfigData.target.targetTableName`);
        if (targetId && targetId) {
            DatasourceAPI.getTableColumns(targetId, targetTableName);
        }
    }, [_.get(data, `operatorConfigData.target.targetId`), _.get(data, `operatorConfigData.target.targetTableName`)]);
    return (
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
                            ?.filter?.((i) => [OPERATORS.JOIN, OPERATORS.SQL_EXTRACT, OPERATORS.CALCULATED]?.includes?.(i?.operator))
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
                        SchemasAPI.getSchemas(e.target.value);
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
                />
            </Control.Row>
            <Br />
            <Control.Row>
                <H2 extra={`margin-bottom: 20px;`}>Маппинг полей</H2>
            </Control.Row>
            <Control.Row>
                <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start;`}>Имя поля в промежуточном хранилище</Control.Label>
                <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start; margin-left: 32px;`}>Имя поля в хранилище</Control.Label>
            </Control.Row>
            {_.get(data, `operatorConfigData.target.mappingStructure`)?.map?.((item, index) => {
                return (
                    <Control.Row key={index} extra={`align-items: flex-start;`}>
                        <Control.Select
                            extra={`flex: 1;`}
                            name={`operatorConfigData.target.mappingStructure.${index}.sourceFieldName`}
                            value={item?.sourceFieldName}
                            options={
                                TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.taskIdSource`))?.map?.((i) => ({
                                    value: i,
                                    label: i,
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
            <Br />
            <Control.Row>
                <H2 extra={`margin-bottom: 20px;`}>Настройки обновления</H2>
            </Control.Row>
            <Control.Row>
                <Control.Select
                    name={`operatorConfigData.updateSettings.updateType`}
                    label={`Тип обновления`}
                    options={Object.entries(_.pick(UPDATE_TYPES, [`REPLACE`, `UPSERT`, `INSERT`])).map(([value, label], index) => ({ label, value }))}
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
                                    label={`Первичный ключ таблицы-источника`}
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
    );
};

export default SQLLoad;
/*eslint-enable*/
