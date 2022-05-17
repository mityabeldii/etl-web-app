/*eslint-disable*/
import React, { useState, useEffect, Fragment } from "react";
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
    const params = useStorageListener((state) => ({}));

    // useEffect(() => {
    //     if (mode === `create`) {
    //         setValue(`operatorConfigData.joinSettings.conditions`, [{ leftJoinField: "", rightJoinField: "" }]);
    //     }
    // }, [mode]);

    useEffect(() => {
        if (mode === `create`) {
            const newKeys = TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.taskIdSource`));
            const newMappingStructure = newKeys.map((i) => ({
                sourceFieldName: i,
                storageFieldName:
                    _.chain(data)
                        .get(`operatorConfigData.storageStructure`)
                        .find({ sourceFieldName: i })
                        .get(`storageFieldName`)
                        .value() ?? i,
            }));
            setValue(`operatorConfigData.storageStructure`, newMappingStructure);
        }
    }, [mode, _.get(data, `operatorConfigData.taskIdSource`)]);

    // useEffect(() => {
    //     if (mode === `create`) {
    //         const newKeys = TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.taskIdSource`));
    //         const newMappingStructure = newKeys.map((i) => ({
    //             sourceFieldName: i,
    //             storageFieldName:
    //                 _.chain(data)
    //                     .get(`operatorConfigData.storageStructure.rightSourceFields`)
    //                     .find({ sourceFieldName: i })
    //                     .get(`storageFieldName`)
    //                     .value() ?? i,
    //         }));
    //         setValue(`operatorConfigData.storageStructure.rightSourceFields`, newMappingStructure);
    //     }
    // }, [mode, _.get(data, `operatorConfigData.taskIdSource`)]);

    const tabs = {
        [`Источник`]: (
            <>
                <Control.Row>
                    <Control.Select
                        name={`operatorConfigData.taskIdSource`}
                        label={`Источник (наименование задачи)`}
                        options={
                            tasks
                                ?.filter?.((i) => TasksHelper.allowedToImportTypes?.includes?.(i?.operator))
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
        [`Фильтры`]: (
            <>
                {_.get(data, `operatorConfigData.filter`)?.map?.((item, index) => (
                    <Fragment key={index}>
                        <Control.Row>
                            <Control.Select
                                name={`operatorConfigData.filter.[${index}].field`}
                                label={`Поле для фильтрации`}
                                placeholder={`Поле для фильтрации`}
                                options={
                                    TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.taskIdSource`))?.map?.((i) => ({
                                        value: i,
                                        label: i,
                                        // muted: _.get(data, `operatorConfigData.storageStructure.rightSourceFields`)
                                        //     ?.map?.((i) => i?.sourceFieldName)
                                        //     ?.includes?.(i),
                                    })) ?? []
                                }
                            />
                            <Control.Select
                                name={`operatorConfigData.filter.[${index}].operator`}
                                label={`Оператор сравнения`}
                                placeholder={`Оператор сравнения`}
                                options={Object.entries(EComparisonOperators).map(([_, i]) => ({ value: i, label: i }))}
                            />
                            <RemoveRowButton
                                mode={mode}
                                onClick={() => {
                                    setValue(
                                        `operatorConfigData.filter`,
                                        _.get(data, `operatorConfigData.filter`)?.filter((i, j) => j !== index)
                                    );
                                }}
                            />
                        </Control.Row>
                        <Control.Row>
                            {TasksHelper.comparisonOperatorsWithRequiredValue.includes(_.get(data, `operatorConfigData.filter.[${index}].operator`)) && (
                                <Control.Input name={`operatorConfigData.filter.[${index}].value`} label={`Значение`} placeholder={`Значение`} />
                            )}
                            {[EComparisonOperators.IN, EComparisonOperators.NOT_IN].includes(
                                _.get(data, `operatorConfigData.filter.[${index}].operator`)
                            ) && <Control.Input name={`operatorConfigData.filter.[${index}].value`} label={`Значение`} placeholder={`Значение`} />}
                        </Control.Row>
                    </Fragment>
                ))}
                {mode !== `view` && (
                    <Button
                        background={`orange`}
                        extra={`margin-bottom: 10px;`}
                        onClick={() => {
                            setValue(`operatorConfigData.filter`, [
                                ..._.get(data, `operatorConfigData.filter`, []),
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
                {_.get(data, `operatorConfigData.storageStructure`)?.map?.((item, index) => (
                    <Control.Row key={index} extra={`align-items: flex-start;`}>
                        <Control.Select
                            name={`operatorConfigData.storageStructure.[${index}].sourceFieldName`}
                            options={
                                TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.taskIdSource`))?.map?.((i) => ({
                                    value: i,
                                    label: i,
                                    muted: _.get(data, `operatorConfigData.storageStructure`)
                                        ?.map?.((i) => i?.sourceFieldName)
                                        ?.includes?.(i),
                                })) ?? []
                            }
                            allowSearch
                        />
                        <Frame extra={({ theme }) => `flex: unset; width: 16px; height: 16px; margin-top: 20px; color: ${theme.text.secondary};`}>
                            =
                        </Frame>
                        <Control.Input name={`operatorConfigData.storageStructure.[${index}].storageFieldName`} />
                        <RemoveRowButton
                            mode={mode}
                            extra={`margin-top: 9px;`}
                            onClick={() => {
                                setValue(
                                    `operatorConfigData.storageStructure`,
                                    _.get(data, `operatorConfigData.storageStructure`)?.filter((i, j) => j !== index)
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
                            setValue(`operatorConfigData.storageStructure`, [
                                ...(_.get(data, `operatorConfigData.storageStructure`) ?? []),
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
