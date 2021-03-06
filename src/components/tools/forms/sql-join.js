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
    const params = useStorageListener((state) => ({
        leftFields:
            _.get(state, `datasources.columns.${data?.operatorConfigData?.taskIdSource}.${data?.operatorConfigData?.left?.targetTableName}`) ?? [],
    }));
    useEffect(() => {
        if (mode === `create`) {
            setValue(`operatorConfigData.joinSettings.conditions`, [{ leftJoinField: "", rightJoinField: "" }]);
        }
    }, [mode]);

    useEffect(() => {
        if (mode === `create`) {
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
        }
    }, [mode, _.get(data, `operatorConfigData.taskIdSource`)]);

    useEffect(() => {
        if (mode === `create`) {
            const newKeys = TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.joinTaskIdSource`));
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
        }
    }, [mode, _.get(data, `operatorConfigData.joinTaskIdSource`)]);

    const tabs = {
        [`???????????????? ????????????`]: (
            <>
                <Control.Row>
                    <Control.Select
                        name={`operatorConfigData.taskIdSource`}
                        label={`???????????????? ???????????????? (???????????????? ????????????)`}
                        options={
                            tasks
                                ?.filter?.((i) => TasksHelper.allowedToImportTypes?.includes?.(i?.operator))
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
                        label={`???????????????? ?????? ???????????????????? (???????????????? ????????????)`}
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
        [`?????????????????? ????????????????????`]: (
            <>
                <Control.Row>
                    <Control.Select
                        name={`operatorConfigData.joinSettings.joinType`}
                        label={`?????? ????????????????????`}
                        options={Object.entries(JOIN_TYPE).map(([value, label], index) => ({ label, value }))}
                        extra={`flex: 0.5; margin-right: 16px !important;`}
                        isRequired
                    />
                </Control.Row>
                <Control.Row>
                    <Control.Label extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`} required>
                        ???????? ?? ???????????????? ??????????????????
                    </Control.Label>
                    <MappingArrow extra={`visibility: hidden;`} />
                    <Control.Label extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`} required>
                        ???????? ?? ?????????????????? ?????? ????????????????????
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
                            label={`???????????????????? ????????????????`}
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
                        ???????????????? ????????????
                    </Button>
                )}
            </>
        ),
        [`??????????????`]: (
            <>
                {_.get(data, `operatorConfigData.joinFilters`)?.map?.((item, index) => (
                    <Fragment key={index}>
                        <Control.Row>
                            <Control.Select
                                name={`operatorConfigData.joinFilters.[${index}].field`}
                                label={`???????? ?????? ????????????????????`}
                                placeholder={`???????? ?????? ????????????????????`}
                                options={[
                                    { subheading: `???????????????? ????????????????` },
                                    ...(TasksHelper.getMappingStructure(_.get(data, `operatorConfigData.taskIdSource`))?.map?.((i) => ({
                                        value: i,
                                        label: i,
                                        muted: _.get(data, `operatorConfigData.joinFilters`)
                                            ?.map?.((i) => i?.field)
                                            ?.includes?.(i),
                                    })) ?? []),
                                    { subheading: `???????????????? ?????? ????????????????????` },
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
                                label={`???????????????? ??????????????????`}
                                placeholder={`???????????????? ??????????????????`}
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
                            {TasksHelper.comparisonOperatorsWithRequiredValue.includes(_.get(data, `operatorConfigData.joinFilters.[${index}].operator`)) && (
                                <Control.Input name={`operatorConfigData.joinFilters.[${index}].value`} label={`????????????????`} placeholder={`????????????????`} />
                            )}
                            {[EComparisonOperators.IN, EComparisonOperators.NOT_IN].includes(
                                _.get(data, `operatorConfigData.joinFilters.[${index}].operator`)
                            ) && (
                                <Control.Input name={`operatorConfigData.joinFilters.[${index}].value`} label={`????????????????`} placeholder={`????????????????`} />
                            )}
                        </Control.Row>
                    </Fragment>
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
                        ???????????????? ????????????
                    </Button>
                )}
            </>
        ),
        [`?????????????????? ???????????????? ????????????`]: (
            <>
                <Control.Row>
                    <Control.Label extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`} required>
                        ???????? ?? ???????????????? ??????????????????
                    </Control.Label>
                    <MappingArrow extra={`visibility: hidden;`} />
                    <Control.Label extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`} required>
                        ???????? ???? ?????????????????????????????? ??????????????????
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
                        ???????????????? ????????????
                    </Button>
                )}
                <Br />
                <Control.Row>
                    <Control.Label extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`} required>
                        ???????? ?? ?????????????????? ?????? ????????????????????
                    </Control.Label>
                    <Control.Label extra={`flex: 1; justify-content: flex-start; margin-right: 0px !important;`} required>
                        ???????? ???? ?????????????????????????????? ??????????????????
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
                        ???????????????? ????????????
                    </Button>
                )}
            </>
        ),
    };
    const [selectedTab, setSelectedTab] = useState(_.keys(tabs)?.[0]);
    return (
        <>
            <Control.Row>
                <H1 extra={`margin-bottom: 24px;`}>???????????????????????? ??????????????????</H1>
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
