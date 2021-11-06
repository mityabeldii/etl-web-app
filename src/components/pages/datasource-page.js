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
    const { pathname } = useLocation();
    const { selectedSourceId } = useParams();
    const selectedSource = useStorageListener(
        (state) => state?.tables?.[TABLES.DATASOURCE_LIST]?.rows?.find?.((i) => i?.id == selectedSourceId) ?? {}
    );
    const tables = useStorageListener(`state.datasources.tables.${selectedSourceId}`) ?? [];
    const [selectedTable, setSelectedTable] = useState();
    const structure =
        useStorageListener((state) => state?.datasources?.structures ?? [])
            ?.find?.((i) => i?.id === selectedSourceId)
            ?.data?.tables?.find?.((i) => i?.name === selectedTable)?.columns ?? [];
    const preview =
        useStorageListener((state) => state?.datasources?.preview ?? [])
            ?.find?.((i) => i?.id === selectedSourceId)
            ?.[selectedTable]?.rows?.map?.((i) => Object.fromEntries(i?.cells?.map?.((i) => [i?.column, i?.value]))) ?? [];

    useEffect(() => {
        DatasourceAPI.getDatasources();
    }, []);

    useEffect(() => {
        DatasourceAPI.getDatasourceTables(selectedSourceId);
        DatasourceAPI.getDatasourceTableStructure(selectedSourceId);
    }, [selectedSourceId]);

    useEffect(() => {
        if (selectedSourceId && selectedTable) {
            DatasourceAPI.getDatasourceTablePreview(selectedSourceId, selectedTable);
        }
    }, [selectedSourceId, selectedTable]);

    useEffect(() => {
        if (!selectedTable || (tables?.indexOf?.(selectedTable) < 0 && tables?.length > 0)) {
            setSelectedTable(tables[0]);
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
                        <SchemaName
                            key={index}
                            selected={selectedTable === item}
                            onClick={() => {
                                setSelectedTable(item);
                            }}
                        >
                            {item}
                        </SchemaName>
                    ))}
                    <Button
                        background={`blue`}
                        extra={`margin-top: 24px; width: 190px;`}
                        onClick={() => {
                            eventDispatch(`OPEN_${MODALS.DATASOURCE_AD_HOC_QUERY_MODAL}_MODAL`);
                        }}
                    >
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
                    <Table
                        name={TABLES.DATASOURCE_TABLE_PREVIEW}
                        columns={Object.keys(preview?.[0] ?? {})?.map?.((i) => ({ name: i, label: i }))}
                        rows={preview}
                    />
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

const SchemaName = styled(Button).attrs((props) => {
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

    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: left;

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
