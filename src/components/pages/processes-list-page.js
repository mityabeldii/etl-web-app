/*eslint-disable*/
import { useState } from "react";
import styled, { css } from "styled-components";
import { useLocation } from "react-router";

import { Button, H1, RowWrapper, Input, Frame, Checkbox } from "../ui-kit/styled-templates";
import Table from "../ui-kit/table";

import { MODALS, TABLES } from "../../constants/config";
import tablesColumns from "../../constants/tables-columns";
import ModalsHelper from "../../utils/modals-helper";

import ProcessesAPI from "../../api/processes-api";

import { putStorage, useStorageListener } from "../../hooks/useStorage";
import useQueryParams from "../../hooks/useQueryParams";
import { eventDispatch } from "../../hooks/useEventListener";

const ProcessesListPage = () => {
    const { params: filters } = useQueryParams();
    const rowsCount = useStorageListener(state => state?.tables?.PROCESSES_LIST?.rows?.length ?? 0)
    
    const openCreateProcessModal = () => {
        ModalsHelper.showModal(MODALS.CREATE_PROCESS_MODAL);
    };
    return (
        <>
            <RowWrapper extra={`margin-bottom: 28px;`}>
                <Heading>ETL-процессы ({rowsCount})</Heading>
                <Button leftIcon={`plus-in-circle-white`} background={`orange`} onClick={openCreateProcessModal}>
                    Добавить процесс
                </Button>
            </RowWrapper>
            <Table
                name={TABLES.PROCESSES_LIST}
                fetchFunction={ProcessesAPI.getProcesses}
                {...tablesColumns[TABLES.PROCESSES_LIST]}
                filters={filters}
                // booleanOperation={`disjunction`}
                extraHeader={<SearchBar />}
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
    const checked = params?.active === `true`;
    const toggleCheck = () => {
        setByKey(`active`, !(checked === true));
    };
    return (
        <RowWrapper extra={`border-bottom: 1px solid #dadada;`}>
            <Search
                value={params?.processName ?? ``}
                onChange={(e) => {
                    setParams({ ...params, processName: e.target.value, id: e.target.value });
                }}
            />
            {/* <RowWrapper
                onClick={toggleCheck}
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
                <Checkbox checked={checked} onChange={() => {}} />
                <Frame extra={({ theme }) => `font-size: 14px; color: ${theme.grey};`}>Запущены сейчас</Frame>
            </RowWrapper> */}
        </RowWrapper>
    );
};

const Search = styled(Input).attrs((props) => {
    return {
        ...props,
        placeholder: `Название или ID процесса`,
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

export default ProcessesListPage;
/*eslint-enable*/
