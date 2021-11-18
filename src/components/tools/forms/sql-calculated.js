/*eslint-disable*/
import React from "react";
import _ from "lodash";
import styled from "styled-components";

import { Br, Frame, H1, H2, H3, MappingArrow, Button, RemoveRowButton } from "../../ui-kit/styled-templates";
import { Control } from "../../ui-kit/control";

import { FORMS, TABLES, OPERATORS, FIELD_TYPES, CALCULATION_FUNCTION_TYPES } from "../../../constants/config";

import DatasourceAPI from "../../../api/datasource-api";

import useFormControl from "../../../hooks/useFormControl";
import { getStorage, useStorageListener } from "../../../hooks/useStorage";
import TasksHelper from "../../../utils/tasks-helper";

const SQLCalculated = ({ tasks = [], mode = `view` }) => {
    const { data, removeValue, setValue } = useFormControl({ name: FORMS.CREATE_TASK });
    const datasources = useStorageListener((state) => state?.tables?.[TABLES.DATASOURCE_LIST]?.rows ?? []);
    const params = useStorageListener((state) => ({}));
    return (
        <>
            <Br />
            <Control.Row>
                <H1 extra={`margin-bottom: 24px;`}>Конфигурация оператора</H1>
            </Control.Row>
            <Control.Row>
                <H2 extra={`margin-bottom: 20px;`}>Источник данных</H2>
            </Control.Row>
            <Control.Row>
                <Control.Select
                    name={`operatorConfigData.taskIdSource`}
                    label={`Наименование задачи`}
                    options={
                        tasks
                            ?.filter?.((i) => [OPERATORS.JOIN, OPERATORS.SQL_EXTRACT, OPERATORS.CALCULATED]?.includes?.(i?.operator))
                            ?.map?.(({ id: value, taskName: label, id }) => ({
                                label,
                                value,
                                muted: id === _.get(data, `operatorConfigData.joinTaskIdSource`),
                            })) ?? []
                    }
                    extra={`flex: 0.5; margin-right: 16px !important;`}
                />
            </Control.Row>
            <Control.Row>
                <H2 extra={`margin-bottom: 20px;`}>Расчетные элементы</H2>
            </Control.Row>
            <Control.Row>
                <H3 extra={`margin-bottom: 20px;`}>Элемент 1</H3>
            </Control.Row>
            {_.get(data, `operatorConfigData.calculationSettings`)?.map?.((item, index) => (
                <Control.Row key={index}>
                    <Frame>
                        <Control.Row>
                            <Control.Input
                                name={`operatorConfigData.calculationSettings.[${index}].newFieldName`}
                                label={`Наименование`}
                                onChange={(e) => {
                                    setValue(`operatorConfigData.storageStructure.[${index}].sourceFieldName`, e.target.value);
                                }}
                            />
                            <Control.Select
                                name={`operatorConfigData.calculationSettings.[${index}].newFieldType`}
                                label={`Тип поля`}
                                options={Object.values(FIELD_TYPES)?.map?.((item) => ({ label: item, value: item }))}
                            />
                            <Control.Select
                                name={`operatorConfigData.calculationSettings.[${index}].mathFunction`}
                                label={`Функция`}
                                options={Object.values(CALCULATION_FUNCTION_TYPES)}
                                onChange={(e) => {
                                    if (
                                        Object?.values?.(CALCULATION_FUNCTION_TYPES)
                                            ?.filter?.((i) => i?.twoArguments)
                                            ?.map?.((i) => i?.value)
                                            ?.includes?.(e.target.value)
                                    ) {
                                        removeValue(`operatorConfigData.calculationSettings.[${index}].attr2`);
                                    }
                                }}
                            />
                        </Control.Row>
                        <Control.Row>
                            <Control.Select
                                name={`operatorConfigData.calculationSettings.[${index}].attr1`}
                                label={`Аргумент 1`}
                                options={
                                    TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.taskIdSource`))?.map?.((i) => ({
                                        value: i,
                                        label: i,
                                    })) ?? []
                                }
                                readOnly={!_.get(data, `operatorConfigData.taskIdSource`)}
                            />
                            <Control.Select
                                name={`operatorConfigData.calculationSettings.[${index}].attr2`}
                                label={`Аргумент 2`}
                                options={
                                    TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.taskIdSource`))?.map?.((i) => ({
                                        value: i,
                                        label: i,
                                    })) ?? []
                                }
                                readOnly={
                                    !_.get(data, `operatorConfigData.taskIdSource`) ||
                                    Object?.values?.(CALCULATION_FUNCTION_TYPES)
                                        ?.filter?.((i) => i?.twoArguments)
                                        ?.map?.(({ value }) => value)
                                        ?.includes?.(_.get(data, `operatorConfigData.calculationSettings.[${index}].mathFunction`))
                                }
                            />
                        </Control.Row>
                    </Frame>
                    {mode !== `view` && (
                        <RemoveRowButton
                            extra={`height: 130px; margin-top: 3px;`}
                            onClick={() => {
                                setValue(
                                    `operatorConfigData.calculationSettings`,
                                    _.get(data, `operatorConfigData.calculationSettings`)?.filter((i, j) => j !== index)
                                );
                                setValue(
                                    `operatorConfigData.storageStructure`,
                                    _.get(data, `operatorConfigData.storageStructure`)?.filter((i, j) => j !== index)
                                );
                            }}
                        />
                    )}
                </Control.Row>
            ))}
            {mode !== `view` && (
                <Control.Row extra={`margin-bottom: 20px;`}>
                    <Button
                        extra={`width: 100%;`}
                        leftIcon={`plus-white`}
                        onClick={() => {
                            setValue(`operatorConfigData.calculationSettings`, [
                                ..._.get(data, `operatorConfigData.calculationSettings`, []),
                                { newFieldName: "", newFieldType: "", mathFunction: "", attr1: "", attr2: "" },
                            ]);
                        }}
                    >
                        Добавить элемент
                    </Button>
                </Control.Row>
            )}
            <Control.Row>
                <H2 extra={`margin-bottom: 20px;`}>Структура выходных данных</H2>
            </Control.Row>
            <Control.Row>
                <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start; `}>Имя поля в источнике</Control.Label>
                <MappingArrow extra={`visibility: hidden;`} />
                <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start; `}>Имя поля во вспомогательном хранилище</Control.Label>
            </Control.Row>
            {_.get(data, `operatorConfigData.storageStructure`)?.map?.((item, index) => (
                <Control.Row
                    extra={`align-items: flex-start; ${
                        _.get(data, `operatorConfigData.calculationSettings`)
                            ?.map?.((i) => i?.newFieldName)
                            ?.filter?.((i) => !!i)
                            ?.includes?.(item.sourceFieldName) && `padding-right: 54px; box-sizing: border-box;`
                    }`}
                >
                    {_.get(data, `operatorConfigData.calculationSettings`)
                        ?.map?.((i) => i?.newFieldName)
                        ?.filter?.((i) => !!i)
                        ?.includes?.(item.sourceFieldName) ? (
                        <Control.Input
                            name={`operatorConfigData.storageStructure.[${index}].sourceFieldName`}
                            label={``}
                            extra={`flex: 1;`}
                            readOnly
                        />
                    ) : (
                        <Control.Select
                            name={`operatorConfigData.storageStructure.[${index}].sourceFieldName`}
                            label={``}
                            extra={`flex: 1;`}
                            options={
                                TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.taskIdSource`))?.map?.((i) => ({
                                    value: i,
                                    label: i,
                                    muted: _.get(data, `operatorConfigData.storageStructure`)
                                        ?.map?.((i) => i?.sourceFieldName)
                                        ?.includes?.(i),
                                })) ?? []
                            }
                            readOnly={!_.get(data, `operatorConfigData.taskIdSource`)}
                        />
                    )}
                    <MappingArrow />
                    <Control.Input name={`operatorConfigData.storageStructure.[${index}].storageFieldName`} label={``} extra={`flex: 1;`} />
                    {!_.get(data, `operatorConfigData.calculationSettings`)
                        ?.map?.((i) => i?.newFieldName)
                        ?.filter?.((i) => !!i)
                        ?.includes?.(item.sourceFieldName) && (
                        <RemoveRowButton
                            extra={`margin-top: 9px;`}
                            onClick={() => {
                                setValue(
                                    `operatorConfigData.storageStructure`,
                                    _.get(data, `operatorConfigData.storageStructure`)?.filter((i, j) => j !== index)
                                );
                            }}
                        />
                    )}
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
    );
};

export default SQLCalculated;
/*eslint-enable*/
