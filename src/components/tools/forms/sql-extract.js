/*eslint-disable*/
import React, { useState, useEffect } from "react";
import _ from "lodash";
import styled from "styled-components";

import { Br, Frame, H1, H2, MappingArrow, Button, RemoveRowButton, RowWrapper, Tab } from "../../ui-kit/styled-templates";
import { Control } from "../../ui-kit/control";

import { FORMS, TABLES, UPDATE_TYPES } from "../../../constants/config";

import DatasourceAPI from "../../../api/datasource-api";
import SchemasAPI from "../../../api/schemas-api";

import useFormControl from "../../../hooks/useFormControl";
import { getStorage, useStorageListener } from "../../../hooks/useStorage";

const useDeepEffect = (effect, dependencies) => {
    useEffect(effect, [JSON.stringify(dependencies)]);
};

const SQLExtract = () => {
    const { data, removeValue, setValue } = useFormControl({ name: FORMS.CREATE_TASK });
    const datasources = useStorageListener((state) => state?.tables?.[TABLES.DATASOURCE_LIST]?.rows ?? []);
    const params = useStorageListener((state) => ({
        source: {
            schemas: _.get(state, `datasources.schemas.${_.get(data, `operatorConfigData.source.sourceId`)}`) ?? [],
            tables: _.get(state, `datasources.tables.${_.get(data, `operatorConfigData.source.sourceId`)}`) ?? [],
            columns:
                _.get(state, `datasources.structures`)
                    ?.find?.((i) => i.id == _.get(data, `operatorConfigData.source.sourceId`))
                    ?.data?.tables?.find?.((i) => i?.name === _.get(data, `operatorConfigData.source.sourceTableName`))
                    ?.columns?.map?.(({ name: sourceFieldName, type: sourceFieldType }) => ({ sourceFieldName, sourceFieldType })) ?? [],
        },
    }));
    useDeepEffect(() => {
        if (_.get(data, `operatorConfigData.source.sourceTableName`)) {
            DatasourceAPI.getDatasourceTableStructure(_.get(data, `operatorConfigData.source.sourceId`));
        }
    }, [_.get(data, `operatorConfigData.source.sourceTableName`)]);
    useDeepEffect(() => {
        const sourceId = _.get(data, `operatorConfigData.source.sourceId`);
        if (sourceId) {
            SchemasAPI.getSchemas(sourceId);
            DatasourceAPI.getDatasourceTables(sourceId);
        }
    }, [_.get(data, `operatorConfigData.source.sourceId`)]);
    const tabs = {
        [`Конфигурация оператора`]: (
            <>
                <Control.Row>
                    <H2 extra={`align-items: flex-start; margin-bottom: 20px;`}>Источник данных</H2>
                </Control.Row>
                <Control.Row>
                    <Control.Select
                        name={`operatorConfigData.source.sourceId`}
                        label={`Источник данных`}
                        options={datasources?.map?.(({ id, name }) => ({ label: name, value: id }))}
                        isRequired
                        onChange={(e) => {
                            removeValue([
                                `operatorConfigData.source.sourceSchemaName`,
                                `operatorConfigData.source.sourceTableName`,
                                `operatorConfigData.source.sourceTableFields`,
                            ]);
                        }}
                        extra={`flex: 0.5; margin-right: 16px !important;`}
                        allowSearch
                    />
                </Control.Row>
                <Control.Row>
                    <Control.Select
                        name={`operatorConfigData.source.sourceSchemaName`}
                        label={`Имя схемы в источнике`}
                        options={params?.source?.schemas?.map?.((item) => ({ label: item, value: item }))}
                        readOnly={!params.source?.schemas?.length}
                        isRequired
                        allowSearch
                    />
                    <Control.Select
                        name={`operatorConfigData.source.sourceTableName`}
                        label={`Имя таблицы в источнике`}
                        options={params?.source?.tables?.map?.((item) => ({ label: item, value: item }))}
                        readOnly={!params?.source?.tables?.length}
                        isRequired
                        allowSearch
                    />
                </Control.Row>
                <Control.Row>
                    <Control.Select
                        name={`operatorConfigData.source.sourceTableFields`}
                        label={`Поля для извлечения`}
                        multiselect
                        options={params.source?.columns?.map?.((item) => ({ label: item?.sourceFieldName, value: item }))}
                        readOnly={!params.source?.columns?.length}
                        isRequired
                        allowSearch
                    />
                </Control.Row>
            </>
        ),
        ["Структура выходных данных"]: (
            <>
                <Control.Row>
                    <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start;`}>Поле в источнике</Control.Label>
                    <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start; margin-left: 32px;`}>
                        Поле во вспомогательном хранилище
                    </Control.Label>
                </Control.Row>
                {_.get(data, `operatorConfigData.source.sourceTableFields`)?.map?.(({ sourceFieldName: item }, index) => {
                    return (
                        <Control.Row key={index} extra={`align-items: flex-start;`}>
                            <Control.Input
                                name={`operatorConfigData.storageStructure.${index}.sourceFieldName`}
                                extra={`flex: 1;`}
                                value={item}
                                readOnly
                            />
                            <MappingArrow />
                            <Control.Input
                                name={`operatorConfigData.storageStructure.${index}.storageFieldName`}
                                extra={`flex: 1;`}
                                readOnly={!params?.source?.columns?.length}
                                onChange={(e) => {
                                    setValue(`operatorConfigData.storageStructure.${index}.sourceFieldName`, item);
                                }}
                                isRequired
                            />
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

export default SQLExtract;
/*eslint-enable*/
