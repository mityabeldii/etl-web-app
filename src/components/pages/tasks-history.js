/*eslint-disable*/
import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useLocation } from "react-router";
import _ from "lodash";
import moment from "moment-timezone";

import { Button, H1, RowWrapper, Input, Checkbox, Frame, Dropdown } from "../ui-kit/styled-templates";
import Table from "../ui-kit/table";
import Select from "../ui-kit/select";
import FiltersToolBar from "../tools/filters-tool-bar";
import DateRangePicker from "../tools/date-range-picker";

import { MODALS, PROCESS_STATUSES, TABLES } from "../../constants/config";
import tablesColumns from "../../constants/tables-columns";
import { linkTo, objectToQS, QSToObject } from "../../utils/common-helper";
import DatasourceAPI from "../../api/datasource-api";

import { eventDispatch } from "../../hooks/useEventListener";
import { putStorage, useStorageListener } from "../../hooks/useStorage";
import useQueryParams, { etlOnlyParams } from "../../hooks/useQueryParams";
import { convertHex } from "../../utils/colors-helper";

const TasksHistoryPage = () => {
    const { params, setParams } = useQueryParams();
    useEffect(() => {
        putStorage(`tables.${TABLES.TASKS_HISTORY}.filters`, etlOnlyParams(params));
    }, [params]);
    return (
        <>
            <RowWrapper extra={`margin-bottom: 28px;`}>
                <Heading>История запуска задач в ETL-процессах</Heading>
            </RowWrapper>
            <RowWrapper>
                <FiltersToolBar filters={params} onChange={setParams} tableName={`TASKS_HISTORY`} wrapperExtra={`margin-bottom: 28px;`} />
            </RowWrapper>
            <Table
                name={TABLES.TASKS_HISTORY}
                fetchFunction={DatasourceAPI.getTasksHistory}
                {...tablesColumns[TABLES.TASKS_HISTORY]}
                extraHeader={<SearchBar />}
                filters={params}
            />
        </>
    );
};

const Heading = styled(H1)`
    line-height: 36px;

    span {
        margin-left: 5px;
        color: ${({ theme }) => theme.blue};
    }
`;

const SearchBar = () => {
    const { params, setParams, setByKey } = useQueryParams();
    const tasks = useStorageListener((state) => _.get(state, `tables.${TABLES.TASKS_HISTORY}.rows`, []));
    return (
        <RowWrapper extra={`border-bottom: 1px solid #dadada; height: 60px;`}>
            <Search
                value={params?.id ?? ``}
                onChange={(e) => {
                    setByKey(`id`, e.target.value ?? ``);
                }}
            />
            <DateRangePicker
                toggleComponent={() => (
                    <RowWrapper
                        extra={css`
                            width: 240px;
                            border: 0px;
                            padding: 20px 30px;
                            border-left: 1px solid #dadada;
                            border-radius: 0px;
                            background: transparent;
                            cursor: pointer;
                            box-sizing: border-box;
                        `}
                    >
                        <Frame extra={({ theme }) => `font-size: 14px; color: ${theme.grey};`}>Дата и время запуска</Frame>
                        <CalendarIcon />
                    </RowWrapper>
                )}
                value={{
                    from: params?.taskStartDate?.from?.toString() ?? ``,
                    to: params?.taskEndDate?.to?.toString() ?? ``,
                }}
                onChange={(value) => {
                    setParams({
                        ...params,
                        taskStartDate: moment(value.from).format(`YYYY-MM-DDThh:mm:ss`),
                        taskEndDate: moment(value.to).format(`YYYY-MM-DDThh:mm:ss`),
                    });
                }}
            />
            <Select
                toggleComponent={() => (
                    <RowWrapper
                        extra={css`
                            width: 150px;
                            border: 0px;
                            padding: 20px 30px;
                            border-left: 1px solid #dadada;
                            border-radius: 0px;
                            background: transparent;
                            cursor: pointer;
                            box-sizing: border-box;

                            &:after {
                                content: "";
                                width: 24px;
                                height: 24px;
                                transform: rotate(90deg);
                                background: url("${require(`../../assets/icons/arrow-right-grey.svg`).default}") no-repeat center center / contain;
                            }
                        `}
                    >
                        <Frame extra={({ theme }) => `font-size: 14px; color: ${theme.grey};`}>Процесс</Frame>
                    </RowWrapper>
                )}
                menuProps={{ extra: `width: max-content;` }}
                value={params?.processId}
                onChange={(e) => {
                    setByKey(`processId`, params?.processId == e.target.value ? undefined : e.target.value);
                }}
                options={tasks
                    ?.map?.(({ processId: value, processName: label }) => ({ label, value }))
                    ?.filter?.((i, j, self) => _.map(self, `value`)?.indexOf?.(i?.value) === j)}
            />
            <Select
                toggleComponent={() => (
                    <RowWrapper
                        extra={css`
                            width: 136px;
                            border: 0px;
                            padding: 20px 30px;
                            border-left: 1px solid #dadada;
                            border-radius: 0px;
                            background: transparent;
                            cursor: pointer;
                            box-sizing: border-box;

                            &:after {
                                content: "";
                                width: 24px;
                                height: 24px;
                                transform: rotate(90deg);
                                background: url("${require(`../../assets/icons/arrow-right-grey.svg`).default}") no-repeat center center / contain;
                            }
                        `}
                    >
                        <Frame extra={({ theme }) => `font-size: 14px; color: ${theme.grey};`}>Статус</Frame>
                    </RowWrapper>
                )}
                menuProps={{ extra: `width: max-content;` }}
                value={params?.state}
                onChange={(e) => {
                    setByKey(`state`, params?.state === e.target.value ? undefined : e.target.value);
                }}
                options={Object.keys(PROCESS_STATUSES)?.map?.((key) => ({
                    label: PROCESS_STATUSES[key]?.label,
                    value: key,
                }))}
            />
        </RowWrapper>
    );
};

const CalendarIcon = styled(Frame)`
    width: 16px;
    height: 16px;
    background: url("${require(`../../assets/icons/calendar.svg`).default}") no-repeat center center / contain;
`;

const Search = styled(Input).attrs((props) => {
    return {
        ...props,
        placeholder: `ID запуска задачи`,
        leftIcon: `search`,
        leftIconStyles: `left: 20px;`,
        extra: css`
            width: 100%;
            border: 0px;
            padding: 20px 30px 20px calc(30px + 20px + 12px);
            border-radius: 0px;
            background: transparent;
        `,
    };
})``;

export default TasksHistoryPage;
/*eslint-enable*/
