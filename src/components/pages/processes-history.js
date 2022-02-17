/*eslint-disable*/
import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useLocation } from "react-router";
import _ from "lodash";

import { Button, H1, RowWrapper, Input, Checkbox, Frame, Dropdown } from "../ui-kit/styled-templates";
import Table from "../ui-kit/table";

import { MODALS, PROCESS_STATUSES, TABLES } from "../../constants/config";
import tablesColumns from "../../constants/tables-columns";
import { eventDispatch } from "../../hooks/useEventListener";
import { linkTo, objectToQS, QSToObject } from "../../utils/common-helper";

import DatasourceAPI from "../../api/datasource-api";
import { useStorageListener } from "../../hooks/useStorage";
import useQueryParams from "../../hooks/useQueryParams";
import Select from "../ui-kit/select";
import { convertHex } from "../../utils/colors-helper";
import FiltersToolBar from "../tools/filters-tool-bar";
import DateRangePicker from "../tools/date-range-picker";

const ProcessHistoryPage = () => {
    // const { params } = useQueryParams();
    const [params, setParams] = useState({});
    const setByKey = (key, value) => {
        setParams(_.pickBy({ ...params, [key]: value }, _.identity));
    };
    return (
        <>
            <RowWrapper extra={`margin-bottom: 28px;`}>
                <Heading>История запуска процессов</Heading>
            </RowWrapper>
            <RowWrapper>
                <FiltersToolBar
                    filters={params}
                    onChange={setParams}
                    tableName={`PROCESSES_HISTORY`}
                    wrapperExtra={`margin-bottom: 28px;`}
                />
            </RowWrapper>
            <Table
                name={TABLES.PROCESSES_HISTORY}
                fetchFunction={DatasourceAPI.getProcessesHistory}
                {...tablesColumns[TABLES.PROCESSES_HISTORY]}
                extraHeader={<SearchBar params={params} setByKey={setByKey} setParams={setParams} />}
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

const SearchBar = ({ params, setByKey, setParams }) => {
    const processes = useStorageListener((state) => _.get(state, `tables.${TABLES.PROCESSES_HISTORY}.rows`) ?? []);
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
                            width: 136px;
                            border: 0px;
                            padding: 20px 30px;
                            border-left: 1px solid #dadada;
                            border-radius: 0px;
                            background: transparent;
                            cursor: pointer;
                            box-sizing: border-box;
                        `}
                    >
                        <Frame extra={({ theme }) => `font-size: 14px; color: ${theme.grey};`}>Календарь</Frame>
                    </RowWrapper>
                )}
                value={{
                    from: params?.processEndDate?.from?.toString() ?? ``,
                    to: params?.processEndDate?.to?.toString() ?? ``,
                }}
                onChange={(value) => {
                    setParams({
                        ...params,
                        processStartDate: new Date(value.from),
                        processEndDate: new Date(value.to),
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
                                background: url("${require(`../../assets/icons/arrow-right-grey.svg`).default}")
                                    no-repeat center center / contain;
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
                options={processes
                    ?.map?.(({ processId: value, processName: label }) => ({ label, value }))
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
                                background: url("${require(`../../assets/icons/arrow-right-grey.svg`).default}")
                                    no-repeat center center / contain;
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

export default ProcessHistoryPage;
/*eslint-enable*/
