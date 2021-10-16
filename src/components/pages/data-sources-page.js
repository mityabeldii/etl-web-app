/*eslint-disable*/
import styled, { css } from "styled-components";

import { Button, H1, RowWrapper, Input } from "../ui-kit/styled-templates";
import Table from "../ui-kit/table";

import { MODALS, TABLES } from "../../constants/config";
import tablesColumns from "../../constants/tables-columns";
import { eventDispatch } from "../../hooks/useEventListener";

const DataSourcesPage = () => {
    const openCreateDataSourceModal = () => {
        eventDispatch(`OPEN_${MODALS.CREATE_DATA_SOURCE_MODAL}_MODAL`);
    };
    return (
        <>
            <RowWrapper extra={`margin-bottom: 28px;`}>
                <H1>Источники данных</H1>
                <Button leftIcon={`plus-in-circle-white`} background={`orange`} onClick={openCreateDataSourceModal}>
                    Добавить источник
                </Button>
            </RowWrapper>
            <Table name={TABLES.DATA_SOURSE_LIST} {...tablesColumns[TABLES.DATA_SOURSE_LIST]} extraHeader={<Search />} />
        </>
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
            border-bottom: 1px solid #dadada;
            border-radius: 0px;
            background: transparent;
        `,
    };
})``;

export default DataSourcesPage;
/*eslint-enable*/
