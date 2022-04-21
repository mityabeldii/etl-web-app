/*eslint-disable*/
import React, { useState, useEffect } from "react";
import _ from "lodash";
import styled from "styled-components";

import { Br, Frame, H1, H2, MappingArrow, RowWrapper, Tab } from "../../ui-kit/styled-templates";
import { Control } from "../../ui-kit/control";

import { FORMS, OPERATORS, TABLES, UPDATE_TYPES } from "../../../constants/config";
import TasksHelper from "../../../utils/tasks-helper";

import DatasourceAPI from "../../../api/datasource-api";
import SchemasAPI from "../../../api/schemas-api";

import useFormControl from "../../../hooks/useFormControl";
import { useStorageListener } from "../../../hooks/useStorage";

const useDeepEffect = (effect, dependencies) => {
    useEffect(effect, [JSON.stringify(dependencies)]);
};

const SQLUnion = (props) => {
    const { mode = `view`, tasks = [] } = props;
    const { data, removeValue, setValue } = useFormControl({ name: FORMS.CREATE_TASK });
    const datasources = useStorageListener((state) => state?.tables?.[TABLES.DATASOURCE_LIST]?.rows ?? []);
    const params = useStorageListener((state) => ({}));

    useDeepEffect(() => {
        if (mode === `create` || mode === `edit`) {
            const newMappingStructure = _.get(data, `operatorConfigData.fields`, []).map((i) => ({
                sourceFieldName: i,
                storageFieldName: _.get(data, `operatorConfigData.storageStructure`, []).find((j) => j.sourceFieldName === i)?.storageFieldName ?? i,
            }));
            setValue(`operatorConfigData.storageStructure`, newMappingStructure);
        }
    }, [_.get(data, `operatorConfigData.fields`)]);

    const tabs = {
        [`Источник`]: (
            <>
                <Control.Row>
                    <Control.Select
                        name={`operatorConfigData.taskIdSource`}
                        label={`Основной источник`}
                        options={
                            tasks
                                ?.filter?.((i) => [OPERATORS.JOIN, OPERATORS.SQL_EXTRACT, OPERATORS.CALCULATED]?.includes?.(i?.operator))
                                ?.map?.(({ id: value, taskName: label, id }) => ({
                                    label,
                                    value,
                                    muted: id === _.get(data, `operatorConfigData.joinTaskIdSource`),
                                })) ?? []
                        }
                        onChange={(e) => removeValue([])}
                        isRequired
                        allowSearch
                    />
                    <Control.Select
                        name={`operatorConfigData.unionTaskIdSource`}
                        label={`Источник для объединения`}
                        options={
                            tasks
                                ?.filter?.((i) => [OPERATORS.JOIN, OPERATORS.SQL_EXTRACT, OPERATORS.CALCULATED]?.includes?.(i?.operator))
                                ?.map?.(({ id: value, taskName: label, id }) => ({
                                    label,
                                    value,
                                    muted: id === _.get(data, `operatorConfigData.joinTaskIdSource`),
                                })) ?? []
                        }
                        onChange={(e) => removeValue([])}
                        isRequired
                        allowSearch
                    />
                </Control.Row>
            </>
        ),
        [`Настройки объединения`]: (
            <>
                <Control.Row>
                    <Control.Select
                        name="operatorConfigData.unionType"
                        label="Тип объединения"
                        options={[`UNION`, `UNION_ALL`].map((i) => ({ value: i, label: i }))}
                        extra={`flex: 0.5; margin-right: 16px !important;`}
                        isRequired
                    />
                </Control.Row>
                <Control.Select
                    name="operatorConfigData.fields"
                    label="Поля для извлечения из основного источника"
                    multiselect
                    options={
                        TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.taskIdSource`))?.map?.((i) => ({
                            value: i,
                            label: i,
                        })) ?? []
                    }
                    isRequired
                />
                <Control.Select
                    name="operatorConfigData.unionFields"
                    label="Поля для извлечения из источника для объединения"
                    multiselect
                    options={
                        TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.taskIdSource`))?.map?.((i) => ({
                            value: i,
                            label: i,
                        })) ?? []
                    }
                    isRequired
                />
            </>
        ),
        [`Структура выходных данных`]: (
            <>
                <Control.Row>
                    <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start;`}>Поле в источнике</Control.Label>
                    <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start; margin-left: 32px;`} required>
                        Поле во вспомогательном хранилище
                    </Control.Label>
                </Control.Row>
                {_.get(data, `operatorConfigData.storageStructure`)?.map?.(({ sourceFieldName: item }, index) => {
                    return (
                        <Control.Row key={index} extra={`align-items: flex-start;`}>
                            <Control.Input name={`operatorConfigData.storageStructure.${index}.sourceFieldName`} extra={`flex: 1;`} readOnly />
                            <MappingArrow />
                            <Control.Input name={`operatorConfigData.storageStructure.${index}.storageFieldName`} extra={`flex: 1;`} />
                        </Control.Row>
                    );
                })}
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

export default SQLUnion;
/*eslint-enable*/
