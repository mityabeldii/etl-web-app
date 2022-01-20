/*eslint-disable*/
import React, { useEffect } from "react";
import _ from "lodash";
import styled from "styled-components";

import { Br, Frame, H1, H2, MappingArrow } from "../../ui-kit/styled-templates";
import { Control } from "../../ui-kit/control";

import { FORMS, TABLES, UPDATE_TYPES } from "../../../constants/config";

import DatasourceAPI from "../../../api/datasource-api";
import SchemasAPI from "../../../api/schemas-api";

import useFormControl from "../../../hooks/useFormControl";
import { getStorage, useStorageListener } from "../../../hooks/useStorage";

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
    useEffect(() => {
        if (_.get(data, `operatorConfigData.source.sourceTableName`)) {
            DatasourceAPI.getDatasourceTableStructure(_.get(data, `operatorConfigData.source.sourceId`));
        }
    }, [_.get(data, `operatorConfigData.source.sourceTableName`)]);
    useEffect(() => {
        const sourceId = _.get(data, `operatorConfigData.source.sourceId`);
        if (sourceId) {
            SchemasAPI.getSchemas(sourceId);
            DatasourceAPI.getDatasourceTables(sourceId);
        }
    }, [_.get(data, `operatorConfigData.source.sourceId`)]);
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
                />
            </Control.Row>
            <Control.Row>
                <Control.Select
                    name={`operatorConfigData.source.sourceSchemaName`}
                    label={`Имя схемы в источнике`}
                    options={params?.source?.schemas?.map?.((item) => ({ label: item, value: item }))}
                    readOnly={!params.source?.schemas?.length}
                />
                <Control.Select
                    name={`operatorConfigData.source.sourceTableName`}
                    label={`Имя таблицы в источнике`}
                    options={params?.source?.tables?.map?.((item) => ({ label: item, value: item }))}
                    readOnly={!params?.source?.tables?.length}
                />
            </Control.Row>
            <Control.Row>
                <Control.Select
                    name={`operatorConfigData.source.sourceTableFields`}
                    label={`Поля для извлечения`}
                    multiselect
                    options={params.source?.columns?.map?.((item) => ({ label: item?.sourceFieldName, value: item }))}
                    readOnly={!params.source?.columns?.length}
                />
            </Control.Row>
            <Br />
            <Control.Row>
                <H2 extra={`margin-bottom: 20px;`}>Структура выходных данных</H2>
            </Control.Row>
            <Control.Row>
                <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start;`}>Поле в источнике</Control.Label>
                <Control.Label extra={`width: 100%; flex: 1; justify-content: flex-start; margin-left: 32px;`}>
                    Поле на в промежуточном хранилище
                </Control.Label>
            </Control.Row>
            {_.get(data, `operatorConfigData.source.sourceTableFields`)?.map?.(({ sourceFieldName: item }, index) => {
                return (
                    <Control.Row key={index} extra={`align-items: flex-start;`}>
                        <Control.Input extra={`flex: 1;`} value={item} readOnly />
                        <MappingArrow />
                        <Control.Input
                            name={`operatorConfigData.storageStructure.${index}.storageFieldName`}
                            extra={`flex: 1;`}
                            readOnly={!params?.source?.columns?.length}
                            onChange={(e) => {
                                setValue(`operatorConfigData.storageStructure.${index}.sourceFieldName`, item);
                            }}
                        />
                    </Control.Row>
                );
            })}
        </>
    );
};

export default SQLExtract;
/*eslint-enable*/
