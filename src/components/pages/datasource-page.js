/*eslint-disable*/
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useHistory, useLocation, useParams, Link } from "react-router-dom";

import { Button, H1, RowWrapper, Input, Frame } from "../ui-kit/styled-templates";
import Table from "../ui-kit/table";

import { MODALS, TABLES } from "../../constants/config";
import tablesColumns from "../../constants/tables-columns";
import { eventDispatch } from "../../hooks/useEventListener";

import DatasourceAPI from "../../api/datasource-api";
import { useStorageListener } from "../../hooks/useStorage";
import { linkTo, objectToQS, QSToObject } from "../../utils/common-helper";

const DatasourcePage = () => {
    const { pathname, search } = useLocation();
    const { selectedSourceId } = useParams();
    const selectedSource = useStorageListener(
        (state) => state?.tables?.[TABLES.DATASOURCE_LIST]?.rows?.find?.((i) => i?.id == selectedSourceId) ?? {}
    );
    const tables = useStorageListener((state) => state?.datasources?.tables?.find?.((i) => i?.id === selectedSourceId)?.tables ?? []);
    const { table: selectedTable } = QSToObject(search);
    const structure =
        useStorageListener((state) => state?.datasources?.structures ?? [])
            ?.find?.((i) => i?.id === selectedSourceId)
            ?.data?.tables?.find?.((i) => i?.name === selectedTable)?.columns ?? [];

    useEffect(() => {
        DatasourceAPI.getDatasources();
    }, []);

    useEffect(() => {
        DatasourceAPI.getDatasourceTables(selectedSourceId);
        DatasourceAPI.getDatasourceTableStructure(selectedSourceId);
    }, [selectedSourceId]);

    useEffect(() => {
        if (!selectedTable || (tables?.indexOf?.(selectedTable) < 0 && tables?.length > 0)) {
            linkTo(`${pathname}${objectToQS({ table: tables[0] })}`);
        }
    }, [JSON.stringify({ selectedTable, tables })]);
    return (
        <>
            <RowWrapper extra={`margin-bottom: 28px;`}>
                <Heading>
                    <Link to={`/datasources`}>
                        <ArrowBack />
                    </Link>
                    Просмотр источника <span>{selectedSource?.name}</span>
                </Heading>
            </RowWrapper>
            <RowWrapper extra={`align-items: flex-start;`}>
                <Frame>
                    <H1 extra={`font-size: 18px; margin-bottom: 16px; width: 100% !important; align-items: flex-start;`}>Таблицы</H1>
                    {tables.map((item, index) => (
                        <Link key={index} to={`${pathname}${objectToQS({ table: item })}`}>
                            <ShemaName selected={selectedTable === item}>{item}</ShemaName>
                        </Link>
                    ))}
                    <Button background={`blue`} extra={`margin-top: 24px; width: 190px;`}>
                        Ad-Hoc запрос
                    </Button>
                </Frame>
                <Frame extra={`width: 100%; margin-left: 30px; align-items: flex-start;`}>
                    <TableStructureHeadeing>
                        Структура таблицы <span>{selectedTable}</span>
                    </TableStructureHeadeing>
                    <Table name={TABLES.DATASOURCE_TABLE_STRUCTURE} {...tablesColumns[TABLES.DATASOURCE_TABLE_STRUCTURE]} rows={structure} />
                    <TableStructureHeadeing extra={`margin-top: 40px;`}>
                        Предпросмотр таблицы <span>{selectedTable}</span>
                    </TableStructureHeadeing>
                    <Table name={TABLES.DATASOURCE_TABLE_PREVIEW} {...tablesColumns[TABLES.DATASOURCE_TABLE_PREVIEW]} />
                </Frame>
            </RowWrapper>
        </>
    );
};

const TableStructureHeadeing = styled(Frame)`
    font-weight: 600;
    font-size: 18px;
    line-height: 25px;
    color: ${({ theme }) => theme.grey};
    flex-direction: row;

    margin-bottom: 16px;

    span {
        margin-left: 5px;
        color: ${({ theme }) => theme.text.primary};
    }

    ${({ extra }) => extra}
`;

const ShemaName = styled(Button).attrs((props) => {
    return {
        ...props,
        variant: `outlined`,
        background: `grey`,
    };
})`
    width: 190px;
    margin-bottom: 12px;
    justify-content: flex-start;
    color: ${({ theme }) => theme.text.primary};

    ${({ selected = false, theme = {} }) => selected && `background: ${theme.background.primary};`}

    &:hover {
        opacity: 0.5;
    }
`;

const ArrowBack = styled(Frame)`
    width: 24px;
    height: 24px;
    margin-right: 16px;
    cursor: pointer;
    background: url("${require(`../../assets/icons/keyboard-backspace.svg`).default}") no-repeat center center / contain;

    &:hover {
        transform: translate(-2px, 0);
    }
`;

const Heading = styled(H1)`
    line-height: 36px;
    flex-direction: row;

    span {
        margin-left: 5px;
        color: ${({ theme }) => theme.blue};
    }
`;

export default DatasourcePage;
/*eslint-enable*/
