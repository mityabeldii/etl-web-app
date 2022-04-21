/*eslint-disable*/
import React, { useState, useEffect } from "react";
import _ from "lodash";
import styled from "styled-components";

import { Br, Frame, H1, H2, MappingArrow, Button, RemoveRowButton, RowWrapper, Tab, H3 } from "../../ui-kit/styled-templates";
import { Control } from "../../ui-kit/control";

import { FORMS, TABLES, OPERATORS, FIELD_TYPES, CALCULATION_FUNCTION_TYPES } from "../../../constants/config";

import DatasourceAPI from "../../../api/datasource-api";

import useFormControl from "../../../hooks/useFormControl";
import { getStorage, useStorageListener } from "../../../hooks/useStorage";
import TasksHelper from "../../../utils/tasks-helper";

const useDeepEffect = (effect, dependencies) => {
    useEffect(effect, [JSON.stringify(dependencies)]);
};

const SQLCalculated = ({ tasks = [], mode = `view` }) => {
    const { data, removeValue, setValue } = useFormControl({ name: FORMS.CREATE_TASK });
    // const datasources = useStorageListener((state) => state?.tables?.[TABLES.DATASOURCE_LIST]?.rows ?? []);
    // const params = useStorageListener((state) => ({}));
    useDeepEffect(() => {
        if (mode === `create`) {
            const newKeys = TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.taskIdSource`));
            const newCalculatedKeys = _.get(data, `operatorConfigData.calculationSettings`, []).map((i) => i?.newFieldName);
            const newMappingStructure = [...newCalculatedKeys, ...newKeys].map((i) => ({
                sourceFieldName: i,
                storageFieldName:
                    _.chain(data)
                        .get(`operatorConfigData.storageStructure.leftSourceFields`)
                        .find({ sourceFieldName: i })
                        .get(`storageFieldName`)
                        .value() ?? i,
            }));
            setValue(`operatorConfigData.storageStructure`, newMappingStructure);
        }
    }, [_.get(data, `operatorConfigData.taskIdSource`), _.get(data, `operatorConfigData.calculationSettings`)]);
    const tabs = {
        "Источник данных": (
            <>
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
            </>
        ),
        "Расчетные элементы": (
            <>
                <Control.Row>
                    <H3 extra={`margin-bottom: 20px;`}>Элемент 1</H3>
                </Control.Row>
                {_.get(data, `operatorConfigData.calculationSettings`)?.map?.((item, index) => {
                    console.log()
                    return (
                        <Control.Row key={index}>
                            <Frame>
                                <Control.Row>
                                    <Control.Input
                                        name={`operatorConfigData.calculationSettings.[${index}].newFieldName`}
                                        label={`Наименование`}
                                        isRequired
                                    />
                                    <Control.Select
                                        name={`operatorConfigData.calculationSettings.[${index}].newFieldType`}
                                        label={`Тип поля`}
                                        options={Object.values(FIELD_TYPES)?.map?.((item) => ({ label: item, value: item }))}
                                        isRequired
                                    />
                                    <Control.Select
                                        name={`operatorConfigData.calculationSettings.[${index}].mathFunction`}
                                        label={`Функция`}
                                        options={Object.values(CALCULATION_FUNCTION_TYPES)}
                                        onChange={(e) => {
                                            if (!CALCULATION_FUNCTION_TYPES?.[e.target.value]?.twoArguments === true) {
                                                removeValue(`operatorConfigData.calculationSettings.[${index}].attr2`);
                                            }
                                        }}
                                        isRequired
                                    />
                                </Control.Row>
                                {_.get(data, `operatorConfigData.calculationSettings.[${index}].mathFunction`) === `defaultValue` ? (
                                    <Control.Row>
                                        <Control.Input
                                            name={`operatorConfigData.calculationSettings.[${index}].value`}
                                            label={`Значение по умолчанию`}
                                            isRequired
                                        />
                                    </Control.Row>
                                ) : (
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
                                            isRequired={_.get(data, `operatorConfigData.taskIdSource`)}
                                            allowSearch
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
                                                !_.get(data, `operatorConfigData.calculationSettings.[${index}].mathFunction`) ||
                                                !Object?.values?.(CALCULATION_FUNCTION_TYPES)
                                                    ?.filter?.((i) => i?.twoArguments)
                                                    ?.map?.(({ value }) => value)
                                                    ?.includes?.(_.get(data, `operatorConfigData.calculationSettings.[${index}].mathFunction`))
                                            }
                                            isRequired={
                                                !!_.get(data, `operatorConfigData.calculationSettings.[${index}].mathFunction`) &&
                                                Object?.values?.(CALCULATION_FUNCTION_TYPES)
                                                    ?.filter?.((i) => i?.twoArguments)
                                                    ?.map?.(({ value }) => value)
                                                    ?.includes?.(_.get(data, `operatorConfigData.calculationSettings.[${index}].mathFunction`))
                                            }
                                            allowSearch
                                        />
                                    </Control.Row>
                                )}
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
                    );
                })}
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
            </>
        ),
        "Структура выходных данных": (
            <>
                <Control.Row>
                    <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start; `} required>
                        Поле в источнике
                    </Control.Label>
                    <MappingArrow extra={`visibility: hidden;`} />
                    <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start; `} required>
                        Поле во вспомогательном хранилище
                    </Control.Label>
                    {mode !== `view` && <Frame extra={`width: 38px;`} />}
                </Control.Row>
                {_.get(data, `operatorConfigData.storageStructure`, [])?.map?.((item, index) => (
                    <Control.Row
                        key={index}
                        extra={`align-items: flex-start; ${
                            _.get(data, `operatorConfigData.calculationSettings`, [])
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
                                allowSearch
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
                                allowSearch
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
                                ..._.get(data, `operatorConfigData.storageStructure`, []),
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

export default SQLCalculated;
/*eslint-enable*/
