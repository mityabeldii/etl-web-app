/*eslint-disable*/
import { useState } from "react";
import styled, { css } from "styled-components";
import { useLocation } from "react-router";

import { Button, H1, RowWrapper, Input } from "../ui-kit/styled-templates";
import Table from "../ui-kit/table";

import { MODALS, TABLES } from "../../constants/config";
import tablesColumns from "../../constants/tables-columns";
import { eventDispatch } from "../../hooks/useEventListener";

import DatasourceAPI from "../../api/datasource-api";
import { useStorageListener } from "../../hooks/useStorage";

const DatasourcesListPage = () => {
    const [search, setSearch] = useState(``);
    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };
    return (
        <>
            <RowWrapper extra={`margin-bottom: 28px;`}>
                <Heading>История запуска процессов</Heading>
            </RowWrapper>
            <Table
                name={TABLES.PROCESSES_HISTORY}
                fetchFunction={DatasourceAPI.getProcessesHistory}
                {...tablesColumns[TABLES.PROCESSES_HISTORY]}
                extraHeader={<Search value={search} onChange={handleSearchChange} />}
                // filters={{ host: search, port: search }}
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
            border-bottom: 1px solid #dadada;
            border-radius: 0px;
            background: transparent;
        `,
    };
})``;

export default DatasourcesListPage;
/*eslint-enable*/
