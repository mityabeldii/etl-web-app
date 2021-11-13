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
                            <Control.Input name={`operatorConfigData.calculationSettings.[${index}].newFieldName`} label={`Наименование`} />
                            <Control.Select
                                name={`operatorConfigData.calculationSettings.[${index}].newFieldType`}
                                label={`Тип поля`}
                                options={Object.values(FIELD_TYPES)?.map?.((item) => ({ label: item, value: item }))}
                            />
                            <Control.Select
                                name={`operatorConfigData.calculationSettings.[${index}].mathFunction`}
                                label={`Функция`}
                                options={Object.values(CALCULATION_FUNCTION_TYPES)}
                            />
                        </Control.Row>
                        <Control.Row>
                            <Control.Select name={`operatorConfigData.calculationSettings.[${index}].attr1`} label={`Аргумент 1`} />
                            <Control.Select name={`operatorConfigData.calculationSettings.[${index}].attr2`} label={`Аргумент 2`} />
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
            <Control.Row extra={`align-items: flex-start;`}>
                <Control.Input name={``} label={``} extra={`flex: 1;`} readOnly />
                <MappingArrow />
                <Control.Input name={``} label={``} extra={`flex: 1;`} />
            </Control.Row>
            <Control.Row extra={`align-items: flex-start;`}>
                <Control.Input name={``} label={``} extra={`flex: 1;`} readOnly />
                <MappingArrow />
                <Control.Input name={``} label={``} extra={`flex: 1;`} />
            </Control.Row>
            <Control.Row extra={`align-items: flex-start;`}>
                <Control.Select name={``} label={``} extra={`flex: 1;`} />
                <MappingArrow />
                <Control.Select name={``} label={``} extra={`flex: 1;`} />
            </Control.Row>
        </>
    );
};

export default SQLCalculated;
/*eslint-enable*/
