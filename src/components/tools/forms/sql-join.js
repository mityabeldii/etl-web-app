/*eslint-disable*/
import React from "react";
import _ from "lodash";
import styled from "styled-components";

import { Br, Frame, H1, H2, MappingArrow, Button, RemoveRowButton } from "../../ui-kit/styled-templates";
import { Control } from "../../ui-kit/control";

import { FORMS, TABLES, UPDATE_TYPES, OPERATORS, JOIN_TYPE, LOGIC_OPERATOR } from "../../../constants/config";

import DatasourceAPI from "../../../api/datasource-api";

import useFormControl from "../../../hooks/useFormControl";
import { getStorage, useStorageListener } from "../../../hooks/useStorage";
import TasksHelper from "../../../utils/tasks-helper";

const SQLJoin = ({ tasks = [], mode = `view` }) => {
    const { data, removeValue, setValue } = useFormControl({ name: FORMS.CREATE_TASK });
    const datasources = useStorageListener((state) => state?.tables?.[TABLES.DATASOURCE_LIST]?.rows ?? []);
    const params = useStorageListener((state) => ({
        leftFields:
            _.get(state, `datasources.columns.${data?.operatorConfigData?.taskIdSource}.${data?.operatorConfigData?.left?.targetTableName}`) ?? [],
    }));
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
                    name={`operatorConfigData.joinSettings.logicOperator`}
                    label={`Логический оператор`}
                    options={Object.values(LOGIC_OPERATOR).map(({ value, label }, index) => ({ label, value }))}
                    extra={`flex: 0.5; margin-right: 16px !important;`}
                />
            </Control.Row>
            <Control.Row>
                <Control.Label extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`}>
                    Имя поля в основном источнике
                </Control.Label>
                <Control.Label extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`}>
                    Имя поля в источнике для соединения
                </Control.Label>
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
            <Br />
            <Control.Row>
                <H2 extra={`margin-bottom: 20px;`}>Структура выходных данных</H2>
            </Control.Row>
            <Control.Row>
                <Control.Label extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`}>
                    Имя поля в основном источнике
                </Control.Label>
                <Control.Label extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`}>
                    Имя поля в источнике для соединения
                </Control.Label>
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
                <Control.Label extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`}>
                    Имя поля в источнике для соединения
                </Control.Label>
                <Control.Label extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`}>
                    Имя поля во вспомогательном хранилище
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
    );
};

export default SQLJoin;
/*eslint-enable*/
