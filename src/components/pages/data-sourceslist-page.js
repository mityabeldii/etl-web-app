/*eslint-disable*/
import styled, { css } from "styled-components";

import { Button, H1, RowWrapper, Input } from "../ui-kit/styled-templates";
import Table from "../ui-kit/table";

import { TABLES } from "../../constants/config";
import tablesColumns from "../../constants/tables-columns";

const DataSourceslistPage = () => {
    return (
        <>
            <RowWrapper extra={`margin-bottom: 28px;`}>
                <H1>Источники данных</H1>
                <Button leftIcon={`plus-in-circle-white`} variant={`orange`}>
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
        `,
    };
})``;

export default DataSourceslistPage;
/*eslint-enable*/
