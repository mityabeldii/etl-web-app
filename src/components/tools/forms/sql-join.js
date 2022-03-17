/*eslint-disable*/
import React, { useState, useEffect } from "react";
import _ from "lodash";
import styled from "styled-components";

import { Br, Frame, H1, H2, MappingArrow, Button, RemoveRowButton, RowWrapper, Tab } from "../../ui-kit/styled-templates";
import { Control } from "../../ui-kit/control";

import { FORMS, TABLES, UPDATE_TYPES, OPERATORS, JOIN_TYPE, LOGIC_OPERATOR } from "../../../constants/config";
import { EComparisonOperators } from "constants/types";

import TasksHelper from "../../../utils/tasks-helper";

import DatasourceAPI from "../../../api/datasource-api";

import useFormControl from "../../../hooks/useFormControl";
import { getStorage, useStorageListener } from "../../../hooks/useStorage";

const SQLJoin = ({ tasks = [], mode = `view` }) => {
    const { data, removeValue, setValue } = useFormControl({ name: FORMS.CREATE_TASK });
    const datasources = useStorageListener((state) => state?.tables?.[TABLES.DATASOURCE_LIST]?.rows ?? []);
    const params = useStorageListener((state) => ({
        leftFields:
            _.get(state, `datasources.columns.${data?.operatorConfigData?.taskIdSource}.${data?.operatorConfigData?.left?.targetTableName}`) ?? [],
    }));
    useEffect(() => {
        if (mode === `create`) {
            setValue(`operatorConfigData.joinSettings.conditions`, [{ leftJoinField: "", rightJoinField: "" }]);
        }
    }, [mode]);

    const leftJoinFields = _.chain(data)
        .get(`operatorConfigData.joinSettings.conditions`)
        .map(`leftJoinField`)
        .filter((i) => !_.isEmpty(i))
        .value();
    const leftSourceFields = _.chain(data)
        .get(`operatorConfigData.storageStructure.leftSourceFields`)
        .map(`sourceFieldName`)
        .filter((i) => !_.isEmpty(i))
        .value();
    useEffect(() => {
        const newKeys = TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.taskIdSource`));
        const newMappingStructure = newKeys.map((i) => ({
            sourceFieldName: i,
            storageFieldName:
                _.chain(data)
                    .get(`operatorConfigData.storageStructure.leftSourceFields`)
                    .find({ sourceFieldName: i })
                    .get(`storageFieldName`)
                    .value() ?? i,
        }));
        setValue(`operatorConfigData.storageStructure.leftSourceFields`, newMappingStructure);
    }, [_.get(data, `operatorConfigData.taskIdSource`)]);

    const rightJoinFields = _.chain(data)
        .get(`operatorConfigData.joinSettings.conditions`)
        .map(`rightJoinField`)
        .filter((i) => !_.isEmpty(i))
        .value();
    const rightSourceFields = _.chain(data)
        .get(`operatorConfigData.storageStructure.rightSourceFields`)
        .map(`sourceFieldName`)
        .filter((i) => !_.isEmpty(i))
        .value();
    useEffect(() => {
        const newKeys = _.chain(rightJoinFields).union(rightSourceFields).uniq().value();
        const newMappingStructure = newKeys.map((i) => ({
            sourceFieldName: i,
            storageFieldName:
                _.chain(data)
                    .get(`operatorConfigData.storageStructure.rightSourceFields`)
                    .find({ sourceFieldName: i })
                    .get(`storageFieldName`)
                    .value() ?? i,
        }));
        setValue(`operatorConfigData.storageStructure.rightSourceFields`, newMappingStructure);
    }, [leftJoinFields, leftSourceFields]);

    const tabs = {
        [`Источник данных`]: (
            <>
                <Control.Row>
                    <Control.Select
                        name={`operatorConfigData.taskIdSource`}
                        label={`Основной источник (название задачи)`}
                        options={
                            tasks
                                ?.filter?.((i) => [OPERATORS.JOIN, OPERATORS.SQL_EXTRACT, OPERATORS.CALCULATED]?.includes?.(i?.operator))
                                ?.map?.(({ id: value, taskName: label, id }) => ({
                                    label,
                                    value,
                                    muted: id === _.get(data, `operatorConfigData.joinTaskIdSource`),
                                })) ?? []
                        }
                        isRequired
                    />
                    <Control.Select
                        name={`operatorConfigData.joinTaskIdSource`}
                        label={`Источник для соединения (название задачи)`}
                        options={
                            tasks
                                ?.filter?.((i) => [OPERATORS.JOIN, OPERATORS.SQL_EXTRACT, OPERATORS.CALCULATED]?.includes?.(i?.operator))
                                ?.map?.(({ id: value, taskName: label, id }) => ({
                                    label,
                                    value,
                                    muted: id === _.get(data, `operatorConfigData.taskIdSource`),
                                })) ?? []
                        }
                        isRequired
                    />
                </Control.Row>
            </>
        ),
        [`Настройки соединения`]: (
            <>
                <Control.Row>
                    <Control.Select
                        name={`operatorConfigData.joinSettings.joinType`}
                        label={`Тип соединения`}
                        options={Object.entries(JOIN_TYPE).map(([value, label], index) => ({ label, value }))}
                        extra={`flex: 0.5; margin-right: 16px !important;`}
                        isRequired
                    />
                </Control.Row>
                <Control.Row>
                    <Control.Label extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`} required>
                        Поле в основном источнике
                    </Control.Label>
                    <MappingArrow extra={`visibility: hidden;`} />
                    <Control.Label extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`} required>
                        Поле в источнике для соединения
                    </Control.Label>
                    {mode !== `view` && <Frame extra={`width: 38px;`} />}
                </Control.Row>
                {_.get(data, `operatorConfigData.joinSettings.conditions`)?.map?.((item, index) => (
                    <Control.Row key={index} extra={`align-items: flex-start;`}>
                        <Control.Select
                            name={`operatorConfigData.joinSettings.conditions.[${index}].leftJoinField`}
                            options={
                                TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.taskIdSource`))?.map?.((i) => ({
                                    value: i,
                                    label: i,
                                    muted: _.get(data, `operatorConfigData.joinSettings.conditions`)
                                        ?.map?.((i) => i?.leftJoinField)
                                        ?.includes?.(i),
                                })) ?? []
                            }
                            allowSearch
                        />
                        <Frame extra={({ theme }) => `flex: unset; width: 16px; height: 16px; margin-top: 20px; color: ${theme.text.secondary};`}>
                            =
                        </Frame>
                        <Control.Select
                            name={`operatorConfigData.joinSettings.conditions.[${index}].rightJoinField`}
                            options={
                                TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.joinTaskIdSource`))?.map?.((i) => ({
                                    value: i,
                                    label: i,
                                    muted: _.get(data, `operatorConfigData.joinSettings.conditions`)
                                        ?.map?.((i) => i?.rightJoinField)
                                        ?.includes?.(i),
                                })) ?? []
                            }
                            allowSearch
                        />
                        <RemoveRowButton
                            mode={mode}
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
                {_.get(data, `operatorConfigData.joinSettings.conditions`)?.length > 1 && (
                    <Control.Row>
                        <Control.Select
                            name={`operatorConfigData.joinSettings.logicOperator`}
                            label={`Логический оператор`}
                            options={Object.values(LOGIC_OPERATOR).map(({ value, label }, index) => ({ label, value }))}
                            extra={`flex: 0.5; margin-right: 16px !important;`}
                            isRequired
                        />
                    </Control.Row>
                )}
                {mode !== `view` && (
                    <Button
                        background={`orange`}
                        extra={`margin-bottom: 10px;`}
                        onClick={() => {
                            setValue(`operatorConfigData.joinSettings.conditions`, [
                                ...(_.get(data, `operatorConfigData.joinSettings.conditions`) ?? []),
                                { leftJoinField: "", rightJoinField: "" },
                            ]);
                        }}
                    >
                        Добавить строку
                    </Button>
                )}
            </>
        ),
        [`Фильтры`]: (
            <>
                {_.get(data, `operatorConfigData.joinFilters`)?.map?.((item, index) => (
                    <>
                        <Control.Row>
                            <Control.Select
                                name={`operatorConfigData.joinFilters.[${index}].field`}
                                label={`Поле для фильтрации`}
                                placeholder={`Поле для фильтрации`}
                                options={[
                                    { subheading: `Основной источник` },
                                    ...(TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.taskIdSource`))?.map?.((i) => ({
                                        value: i,
                                        label: i,
                                        muted: _.get(data, `operatorConfigData.joinFilters`)
                                            ?.map?.((i) => i?.field)
                                            ?.includes?.(i),
                                    })) ?? []),
                                    { subheading: `Источник для соединения` },
                                    ...(TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.joinTaskIdSource`))?.map?.((i) => ({
                                        value: i,
                                        label: i,
                                        muted: _.get(data, `operatorConfigData.joinFilters`)
                                            ?.map?.((i) => i?.field)
                                            ?.includes?.(i),
                                    })) ?? []),
                                ]}
                            />
                            <Control.Select
                                name={`operatorConfigData.joinFilters.[${index}].operator`}
                                label={`Оператор сравнения`}
                                placeholder={`Оператор сравнения`}
                                options={Object.entries(EComparisonOperators).map(([_, i]) => ({ value: i, label: i }))}
                            />
                            <RemoveRowButton
                                mode={mode}
                                onClick={() => {
                                    setValue(
                                        `operatorConfigData.joinFilters`,
                                        _.get(data, `operatorConfigData.joinFilters`)?.filter((i, j) => j !== index)
                                    );
                                }}
                            />
                        </Control.Row>
                        <Control.Row>
                            {[
                                EComparisonOperators.EQUAL,
                                EComparisonOperators.NOT_EQUAL,
                                EComparisonOperators.GREATER_THEN,
                                EComparisonOperators.LESS_THEN,
                                EComparisonOperators.GREATER_EQUEAL,
                                EComparisonOperators.LESS_EQUAL,
                                EComparisonOperators.LIKE,
                            ].includes(_.get(data, `operatorConfigData.joinFilters.[${index}].operator`)) && (
                                <Control.Input name={`operatorConfigData.joinFilters.[${index}].value`} label={`Значение`} placeholder={`Значение`} />
                            )}
                            {[EComparisonOperators.IN, EComparisonOperators.NOT_IN].includes(
                                _.get(data, `operatorConfigData.joinFilters.[${index}].operator`)
                            ) && (
                                <Control.Input name={`operatorConfigData.joinFilters.[${index}].value`} label={`Значение`} placeholder={`Значение`} />
                            )}
                        </Control.Row>
                    </>
                ))}
                {mode !== `view` && (
                    <Button
                        background={`orange`}
                        extra={`margin-bottom: 10px;`}
                        onClick={() => {
                            setValue(`operatorConfigData.joinFilters`, [
                                ...(_.get(data, `operatorConfigData.joinFilters`) ?? []),
                                { field: "", operator: "", value: "" },
                            ]);
                        }}
                    >
                        Добавить фильтр
                    </Button>
                )}
            </>
        ),
        [`Структура выходных данных`]: (
            <>
                <Control.Row>
                    <Control.Label extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`} required>
                        Поле в основном источнике
                    </Control.Label>
                    <MappingArrow extra={`visibility: hidden;`} />
                    <Control.Label extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`} required>
                        Поле во вспомогательном хранилище
                    </Control.Label>
                    {mode !== `view` && <Frame extra={`width: 38px;`} />}
                </Control.Row>
                {_.get(data, `operatorConfigData.storageStructure.leftSourceFields`)?.map?.((item, index) => (
                    <Control.Row key={index} extra={`align-items: flex-start;`}>
                        <Control.Select
                            name={`operatorConfigData.storageStructure.leftSourceFields.[${index}].sourceFieldName`}
                            options={
                                TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.taskIdSource`))?.map?.((i) => ({
                                    value: i,
                                    label: i,
                                    muted: _.get(data, `operatorConfigData.storageStructure.leftSourceFields`)
                                        ?.map?.((i) => i?.sourceFieldName)
                                        ?.includes?.(i),
                                })) ?? []
                            }
                            allowSearch
                        />
                        <Frame extra={({ theme }) => `flex: unset; width: 16px; height: 16px; margin-top: 20px; color: ${theme.text.secondary};`}>
                            =
                        </Frame>
                        <Control.Input name={`operatorConfigData.storageStructure.leftSourceFields.[${index}].storageFieldName`} />
                        <RemoveRowButton
                            mode={mode}
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
                {mode !== `view` && (
                    <Button
                        background={`orange`}
                        extra={`margin-bottom: 10px;`}
                        onClick={() => {
                            setValue(`operatorConfigData.storageStructure.leftSourceFields`, [
                                ...(_.get(data, `operatorConfigData.storageStructure.leftSourceFields`) ?? []),
                                { sourceFieldName: "", storageFieldName: "" },
                            ]);
                        }}
                    >
                        Добавить строку
                    </Button>
                )}
                <Br />
                <Control.Row>
                    <Control.Label extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`} required>
                        Поле в источнике для соединения
                    </Control.Label>
                    <Control.Label extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`} required>
                        Поле во вспомогательном хранилище
                    </Control.Label>
                </Control.Row>
                {_.get(data, `operatorConfigData.storageStructure.rightSourceFields`)?.map?.((item, index) => (
                    <Control.Row key={index} extra={`align-items: flex-start;`}>
                        <Control.Select
                            name={`operatorConfigData.storageStructure.rightSourceFields.[${index}].sourceFieldName`}
                            options={
                                TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.joinTaskIdSource`))?.map?.((i) => ({
                                    value: i,
                                    label: i,
                                    muted: _.get(data, `operatorConfigData.storageStructure.rightSourceFields`)
                                        ?.map?.((i) => i?.sourceFieldName)
                                        ?.includes?.(i),
                                })) ?? []
                            }
                            allowSearch
                        />
                        <Frame extra={({ theme }) => `flex: unset; width: 16px; height: 16px; margin-top: 20px; color: ${theme.text.secondary};`}>
                            =
                        </Frame>
                        <Control.Input name={`operatorConfigData.storageStructure.rightSourceFields.[${index}].storageFieldName`} />
                        <RemoveRowButton
                            mode={mode}
                            extra={`margin-top: 9px;`}
                            onClick={() => {
                                setValue(
                                    `operatorConfigData.storageStructure.rightSourceFields`,
                                    _.get(data, `operatorConfigData.storageStructure.rightSourceFields`)?.filter((i, j) => j !== index)
                                );
                            }}
                        />
                    </Control.Row>
                ))}
                {mode !== `view` && (
                    <Button
                        background={`orange`}
                        extra={`margin-bottom: 10px;`}
                        onClick={() => {
                            setValue(`operatorConfigData.storageStructure.rightSourceFields`, [
                                ...(_.get(data, `operatorConfigData.storageStructure.rightSourceFields`) ?? []),
                                { sourceFieldName: "", storageFieldName: "" },
                            ]);
                        }}
                    >
                        Добавить строку
                    </Button>
                )}
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

export default SQLJoin;
/*eslint-enable*/
