/*eslint-disable*/
import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useLocation } from "react-router";
import _ from "lodash";

import { Button, H1, RowWrapper, Input, Checkbox, Frame } from "../ui-kit/styled-templates";
import Table from "../ui-kit/table";

import { MODALS, TABLES } from "../../constants/config";
import tablesColumns from "../../constants/tables-columns";
import { eventDispatch } from "../../hooks/useEventListener";
import { linkTo, objectToQS, QSToObject } from "../../utils/common-helper";

import DatasourceAPI from "../../api/datasource-api";
import { useStorageListener } from "../../hooks/useStorage";
import useQueryParams from "../../hooks/useQueryParams";

const DatasourcesListPage = () => {
    const { search } = useLocation();
    const { params } = useQueryParams();
    return (
        <>
            <RowWrapper extra={`margin-bottom: 28px;`}>
                <Heading>История запуска процессов</Heading>
            </RowWrapper>
            <Table
                name={TABLES.PROCESSES_HISTORY}
                fetchFunction={DatasourceAPI.getProcessesHistory}
                {...tablesColumns[TABLES.PROCESSES_HISTORY]}
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
    const { params, setParams } = useQueryParams();
    return (
        <RowWrapper extra={`border-bottom: 1px solid #dadada;`}>
            <Search
                value={params?.id ?? ``}
                onChange={(e) => {
                    setParams({ ...params, id: e.target.value ?? ``, processId: e.target.value ?? `` });
                }}
            />
            <RowWrapper
                extra={css`
                    width: 214px;
                    border: 0px;
                    padding: 20px 30px;
                    border-left: 1px solid #dadada;
                    border-radius: 0px;
                    background: transparent;
                    cursor: pointer;
                `}
            >
                <Checkbox />
                <Frame extra={({ theme }) => `font-size: 14px; color: ${theme.grey};`}>Запущены сейчас</Frame>
            </RowWrapper>
        </RowWrapper>
    );
};

const Search = styled(Input).attrs((props) => {
    return {
        ...props,
        placeholder: `ID процесса или его запуска`,
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

export default DatasourcesListPage;
/*eslint-enable*/
