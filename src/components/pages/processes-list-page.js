/*eslint-disable*/
import { useState } from "react";
import styled, { css } from "styled-components";
import { useLocation } from "react-router";

import { Button, H1, RowWrapper, Input, Frame, Checkbox } from "../ui-kit/styled-templates";
import Table from "../ui-kit/table";

import { MODALS, TABLES } from "../../constants/config";
import tablesColumns from "../../constants/tables-columns";
import { eventDispatch } from "../../hooks/useEventListener";

import ProcessesAPI from "../../api/processes-api";

import { putStorage, useStorageListener } from "../../hooks/useStorage";

const ProcessesListPage = () => {
    const openCreateProcessModal = () => {
        eventDispatch(`OPEN_${MODALS.CREATE_PROCESS_MODAL}_MODAL`);
    };
    const [filters, setFilters] = useState({});
    return (
        <>
            <RowWrapper extra={`margin-bottom: 28px;`}>
                <Heading>ETL-процессы</Heading>
                <Button leftIcon={`plus-in-circle-white`} background={`orange`} onClick={openCreateProcessModal}>
                    Добавить процесс
                </Button>
            </RowWrapper>
            <Table
                name={TABLES.PROCESSES_LIST}
                fetchFunction={ProcessesAPI.getProcesses}
                {...tablesColumns[TABLES.PROCESSES_LIST]}
                // filters={filters}
                // booleanOperation={`disjunction`}
                extraHeader={
                    <SearchBar
                        value={filters}
                        onChange={setFilters}
                    />
                }
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

const SearchBar = ({ value = {}, onChange = () => {} }) => {
    const checked = value?.active === true;
    const toggleCheck = () => {
        onChange({ ...value, active: !(checked === true) });
    };
    return (
        <RowWrapper extra={`border-bottom: 1px solid #dadada;`}>
            <Search
                value={value?.host ?? ``}
                onChange={(e) => {
                    onChange({ ...value, host: e.target.value, port: e.target.value });
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
        placeholder: `Название или хост источника`,
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
