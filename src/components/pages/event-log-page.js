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

import { EEventTypes, MODALS, PROCESS_STATUSES, TABLES } from "../../constants/config";
import tablesColumns from "../../constants/tables-columns";
import { linkTo, objectToQS, QSToObject } from "../../utils/common-helper";
import { convertHex } from "../../utils/colors-helper";

import DatasourceAPI from "../../api/datasource-api";
import EventLogAPI from "../../api/event-log-api";
import ProcessesAPI from "api/processes-api";

import { eventDispatch } from "../../hooks/useEventListener";
import { putStorage, useStorageListener } from "../../hooks/useStorage";
import useQueryParams, { etlOnlyParams } from "../../hooks/useQueryParams";

const EventLogPage = () => {
    const { params, setParams } = useQueryParams();
    useEffect(() => {
        putStorage(`tables.${TABLES.TASKS_HISTORY}.filters`, etlOnlyParams(params));
    }, [params]);
    return (
        <>
            <RowWrapper extra={`margin-bottom: 28px;`}>
                <Heading>Журнал событий</Heading>
            </RowWrapper>
            <RowWrapper>
                <FiltersToolBar filters={params} onChange={setParams} tableName={`EVENT_LOG`} wrapperExtra={`margin-bottom: 28px;`} />
            </RowWrapper>
            <Table
                name={TABLES.EVENT_LOG}
                fetchFunction={EventLogAPI.getEvents}
                {...tablesColumns[TABLES.EVENT_LOG]}
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
    const processes = useStorageListener((state) => _.get(state, `temp.processesToFilter`) ?? []);
    useEffect(ProcessesAPI.getProcessesForFilter, []);
    return (
        <RowWrapper extra={`border-bottom: 1px solid #dadada; height: 60px;`}>
            <Search
                value={params?.processRunId ?? ``}
                onChange={(e) => {
                    setByKey(`processRunId`, e.target.value ?? ``);
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
                        <Frame extra={({ theme }) => `font-size: 14px; color: ${theme.grey};`}>Дата и время события</Frame>
                        <CalendarIcon />
                    </RowWrapper>
                )}
                value={{
                    from: params?.eventDateStart?.from?.format() ?? ``,
                    to: params?.eventDateEnd?.to?.toString() ?? ``,
                }}
                onChange={(value) => {
                    setParams({
                        ...params,
                        eventDateStart: moment(value.from).format(`YYYY-MM-DDThh:mm:ss`),
                        eventDateEnd: moment(value.to).format(`YYYY-MM-DDThh:mm:ss`),
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
                value={params?.id}
                onChange={(e) => {
                    setByKey(`id`, params?.id == e.target.value ? undefined : e.target.value);
                }}
                options={processes
                    ?.map?.(({ id: value, processName: label }) => ({ label, value }))
                    .filter((item, index, self) => self.findIndex((t) => t.value === item.value) === index)}
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
                        <Frame extra={({ theme }) => `font-size: 14px; color: ${theme.grey};`}>Тип события</Frame>
                    </RowWrapper>
                )}
                menuProps={{ extra: `width: max-content;` }}
                value={params?.eventType}
                onChange={(e) => {
                    setByKey(`eventType`, params?.eventType === e.target.value ? undefined : e.target.value);
                }}
                options={Object.entries(EEventTypes).map(([key, value]) => ({ label: value, value: key }))}
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
        placeholder: `ID запуска процесса`,
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

export default EventLogPage;
/*eslint-enable*/
