/*eslint-disable*/
import styled, { css } from "styled-components";
import { useLocation } from "react-router";

import { Button, H1, RowWrapper, Input, Frame, Checkbox } from "../ui-kit/styled-templates";
import Table from "../ui-kit/table";

import { MODALS, TABLES } from "../../constants/config";
import tablesColumns from "../../constants/tables-columns";
import { eventDispatch } from "../../hooks/useEventListener";

import DatasourceAPI from "../../api/datasource-api";
import { putStorage, useStorageListener } from "../../hooks/useStorage";

const ETLProcessesListPage = () => {
    const openCreateDataSourceModal = () => {
        eventDispatch(`OPEN_${MODALS.CREATE_DATA_SOURCE_MODAL}_MODAL`);
    };
    return (
        <>
            <RowWrapper extra={`margin-bottom: 28px;`}>
                <Heading>ETL-процессы</Heading>
                <Button leftIcon={`plus-in-circle-white`} background={`orange`} onClick={openCreateDataSourceModal}>
                    Добавить процесс
                </Button>
            </RowWrapper>
            <Table
                name={TABLES.PROCESSES_LIST}
                // fetchFunction={DatasourceAPI.getDatasources}
                {...tablesColumns[TABLES.PROCESSES_LIST]}
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
    const checked = useStorageListener((state) => state?.temp?.startedProcessesChecked ?? false);
    const toggleCheck = () => {
        putStorage(`temp.startedProcessesChecked`, !(checked === true));
    };
    return (
        <RowWrapper extra={`border-bottom: 1px solid #dadada;`}>
            <Search />
            <RowWrapper
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
            </RowWrapper>
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

export default ETLProcessesListPage;
/*eslint-enable*/
