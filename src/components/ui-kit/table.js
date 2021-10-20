/*eslint-disable*/
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import _ from "lodash";

import { Frame, Checkbox, Input, Button, RowWrapper, Switch } from "./styled-templates";
import Select from "./select";

import { convertHex } from "../../utils/colors-helper";
import { createId, togglePush } from "../../utils/common-helper";

import { getStorage, mergeStorage, putStorage, useStorageListener } from "../../hooks/useStorage";
import useDebounce from "../../hooks/useDebounde";

import { EVENTS, SORT_ORDERS } from "../../constants/config";
import useEventListener from "../../hooks/useEventListener";

const Table = (props) => {
    const {
        extra = ``,
        selectable = false,
        name,
        sortable = false,
        columns = [],
        selectionLimit = Infinity,
        withPagination = true,
        withHeader = true,
        paginationOptions = [10, 25, 50, 100, 500],
        defaultSort,
        idColumnName = `id`,
        fetchFunction = () => {
            // console.log(`> > > FETCH < < <`);
        },
        dependencies = {},
        tableStyles = ``,
        paginationStyles = ``,
        extraHeader,
        useBackendProcessing = true,
        rows: propRows = [],
    } = props;
    if (!name) {
        throw new Error(`[table.js] - name is not  defined`);
    }
    const tables = useStorageListener((state) => state?.tables ?? {});
    const tableState = tables?.[name] ?? {};

    const { rows = [] } = tableState;

    const { selectedRows = [] } = tableState;
    const setSelectedRows = (newValue = []) => {
        putStorage(`tables.${name}.selectedRows`, newValue.slice(0, selectionLimit));
    };
    const { filters = {} } = tableState;
    const setFilter = (filter, newValue) => {
        putStorage(`tables.${name}.filters.${filter}`, newValue);
    };
    const sort = tableState?.sort?.[0] ?? defaultSort;
    const setSort = (field, order) => {
        putStorage(`tables.${name}.sort`, [{ field, order }]);
    };
    const { pagination = {} } = tableState;
    const { currentPage = 0, perPage = paginationOptions?.[0] ?? 1, pageCount = 1, totalCount = 1 } = pagination;
    const maxPageNumber = Math.ceil(totalCount / perPage);
    const debouncedParams = useDebounce(JSON.stringify({ filters }), 300);
    useEffect(async () => {
        if (!tableState?.sort) {
            putStorage(`tables.${name}.sort`, [defaultSort], { silent: true });
        }
        if (!tableState?.pagination) {
            putStorage(`tables.${name}.pagination`, { currentPage, perPage }, { silent: true });
        }
        if (useBackendProcessing) {
            const newData = await fetchFunction();
        }
    }, [JSON.stringify({ debouncedParams, sort, name, currentPage, perPage, dependencies })]);

    useEffect(async () => {
        if (!useBackendProcessing) {
            const newData = await fetchFunction();
        }
    }, []);

    return (
        <TableWrapper>
            {extraHeader}
            <STable extra={tableStyles}>
                {withHeader && (
                    <STr extra={({ theme }) => `border-bottom: 1px solid #DADADA; padding: 20px; box-sizing: border-box;`}>
                        {selectable && <STh extra={`flex: unset; width: 40px;`}></STh>}
                        {columns.map((column, index) => {
                            return (
                                <STh key={index} extra={column?.extra ?? ``}>
                                    <Frame
                                        extra={`flex-direction: row; cursor: pointer;`}
                                        onClick={() => {
                                            setSort(
                                                column?.name,
                                                column?.name === sort?.field
                                                    ? { [SORT_ORDERS.ASC]: SORT_ORDERS.DESC, [SORT_ORDERS.DESC]: SORT_ORDERS.ASC }?.[sort?.order] ??
                                                          SORT_ORDERS.DESC
                                                    : SORT_ORDERS.DESC
                                            );
                                        }}
                                    >
                                        {column.label}
                                        {sortable && column.sortable !== false && (
                                            <Frame extra={`margin-left: 10px; cursor: pointer;`}>
                                                <SortArrow
                                                    extra={`opacity: ${
                                                        sort?.field === column.name && sort?.order === SORT_ORDERS.ASC ? 1 : 0.2
                                                    }; transform: rotate(180deg);`}
                                                />
                                                <SortArrow
                                                    extra={`opacity: ${sort?.field === column.name && sort?.order === SORT_ORDERS.DESC ? 1 : 0.2};`}
                                                />
                                            </Frame>
                                        )}
                                    </Frame>
                                </STh>
                            );
                        })}
                    </STr>
                )}
                {/* <STr>
                    {selectable && (
                        <STh extra={`flex: unset; width: 40px;`} title={`Select all`}>
                            <Checkbox
                                checked={selectedRows.length === rows.length}
                                onChange={(e) => {
                                    setSelectedRows(
                                        selectedRows.length === rows.length || selectedRows.length === selectionLimit
                                            ? []
                                            : rows.map((i) => i?.[idColumnName])
                                    );
                                }}
                            />
                        </STh>
                    )}
                    {columns.map((column, index) => {
                        return (
                            <STh key={index} extra={column?.extra ?? ``}>
                                {
                                    {
                                        input: (
                                            <Input
                                                value={filters?.[column?.name] ?? ``}
                                                onChange={(e) => {
                                                    setFilter(column?.name, e.target.value);
                                                }}
                                                extra={`width: 100%`}
                                            />
                                        ),
                                        select: (
                                            <Select
                                                value={filters?.[column?.name]}
                                                onChange={(e) => {
                                                    setFilter(column?.name, e.target.value);
                                                }}
                                                extra={`width: 100%`}
                                                options={[].map((i) => ({ label: i, value: i }))}
                                                {...column?.filter}
                                            />
                                        ),
                                    }?.[column?.filter?.type]
                                }
                            </STh>
                        );
                    })}
                </STr> */}
                {(rows.length === 0 && propRows ? propRows : rows)
                    ?.filter?.((i) => useBackendProcessing || true)
                    ?.map?.((row, row_index) => (
                        <STr key={row_index}>
                            {selectable && (
                                <STd extra={`flex: unset; width: 40px;`}>
                                    <Checkbox
                                        disabled={!selectedRows.includes(row?.[idColumnName]) && selectedRows.length === selectionLimit}
                                        checked={selectedRows.includes(row?.[idColumnName])}
                                        onChange={(e) => {
                                            setSelectedRows(togglePush(selectedRows, row?.[idColumnName]));
                                        }}
                                    />
                                </STd>
                            )}
                            {columns.map((column, column_index) => {
                                return (
                                    <STd
                                        key={column_index}
                                        extra={column?.extra ?? ``}
                                        clickable={column?.onCellClick}
                                        onClick={() => {
                                            column?.onCellClick?.({ row, column: column?.name, value: row?.[column?.name] });
                                        }}
                                    >
                                        {
                                            {
                                                text: column?.transform?.(row?.[column?.name]) ?? row?.[column?.name],
                                                button: (
                                                    <Button
                                                        {...(column?.cell ?? {})}
                                                        onClick={(e) => {
                                                            column?.cell?.onClick?.(row);
                                                        }}
                                                    >
                                                        {column?.cell?.children}
                                                    </Button>
                                                ),
                                                link: (
                                                    <Link to={column?.cell?.to?.({ row, column: column?.name, value: row?.[column?.name] }) ?? `/`}>
                                                        {column?.transform?.(row?.[column?.name]) ?? row?.[column?.name]}
                                                    </Link>
                                                ),
                                                switch: (
                                                    <Switch
                                                        checked={column?.transform?.(row?.[column?.name]) ?? row?.[column?.name]}
                                                        onChange={() => {}}
                                                        {...column?.cell}
                                                    />
                                                ),
                                            }?.[column?.cell?.type ?? `text`]
                                        }
                                    </STd>
                                );
                            })}
                        </STr>
                    ))}
            </STable>
            {withPagination && (
                <PaginationWrapper extra={paginationStyles}>
                    <Frame extra={`width: 350px;`} />
                    <Frame extra={`flex-direction: row; justify-content: center;`}>
                        {new Array(6)
                            .fill(0)
                            .map((item, index) => currentPage - 3 + index)
                            .filter((i) => i >= 0 && i >= currentPage - 1 && i < maxPageNumber)
                            .slice(0, 3)
                            .map((item, index) => (
                                <PageNumberWrapper
                                    key={index}
                                    selected={currentPage === item}
                                    onClick={() => {
                                        putStorage(`tables.${name}.pagination.currentPage`, item);
                                    }}
                                >
                                    {item + 1}
                                </PageNumberWrapper>
                            ))}
                    </Frame>
                    <Frame extra={`flex-direction: row; width: 350px; justify-content: flex-end;`}>
                        <Frame
                            extra={({ theme }) => css`
                                font-size: 14px;
                                line-height: 20px;
                                text-align: right;
                                margin-right: 16px;
                                color: ${theme.text.secondary};
                            `}
                        >
                            Показывать строк:
                        </Frame>
                        <Select
                            options={paginationOptions.map((i) => ({ value: i, label: i }))}
                            extra={`width: 76px;`}
                            value={perPage ?? paginationOptions?.[0] ?? 0}
                            onChange={(e) => {
                                putStorage(`tables.${name}.pagination.perPage`, e.target.value);
                            }}
                        />
                    </Frame>
                </PaginationWrapper>
            )}
        </TableWrapper>
    );
};

const PageNumberWrapper = styled(Frame)`
    width: 34px;
    height: 34px;
    background: ${({ theme, selected = false }) => (selected ? theme.darkblue : theme.background.secondary)};
    margin-right: 16px;
    border-radius: 4px;
    font-size: 14px;
    line-height: 20px;
    color: ${({ theme, selected = false }) => (selected ? `#FFFFFF` : theme.text.primary)};
    font-weight: ${({ selected = false }) => (selected ? `bold` : `regular`)};
    cursor: pointer;
`;

const TableWrapper = styled(Frame)`
    width: 100%;
    /* height: 100%; */
    background: ${({ theme }) => theme.background.primary};
    border: 1px solid #dadada;
    border-radius: 4px;
`;

const PaginationWrapper = styled(RowWrapper)`
    /* margin-top: 20px; */
    justify-content: space-between;
    padding: 20px 20px 20px 120px;
    box-sizing: border-box;
    /* border-top: 1px solid #dadada; */

    > * {
        margin-right: 10px;
    }
`;

const PaginationArrow = styled(Frame).attrs((props) => {
    return {
        ...props,
        onClick: props?.disabled ? () => {} : props?.onClick,
    };
})`
    width: 20px;
    height: 20px;
    background: url("${require(`../../assets/icons/arrow-right.svg`).default}") no-repeat center center / contain;
    margin-bottom: -5px;
    cursor: pointer;

    ${({ disabled = false }) =>
        disabled
            ? css`
                  cursor: default;
                  opacity: 0.2;
              `
            : css`
                  &:hover {
                      opacity: 0.5;
                  }
              `}

    ${({ extra }) => extra}
`;

const SortArrow = styled(Frame)`
    width: 15px;
    height: 15px;
    background: url("${require(`../../assets/icons/arrow-down.svg`).default}") no-repeat center center / contain;
    margin-bottom: -5px;

    ${({ extra }) => extra}
`;

const STd = styled(Frame)`
    padding: 4px;
    justify-content: flex-start;
    width: 100%;
    flex: 1;
    flex-direction: row;

    overflow: hidden;
    white-space: nowrap;

    ${({ clickable }) =>
        clickable &&
        css`
            cursor: pointer;

            &:hover {
                opacity: 0.5;
            }
        `}

    ${({ extra }) => extra}
`;

const STh = styled(Frame)`
    padding: 4px;
    justify-content: flex-start;
    width: 100%;
    flex: 1;
    flex-direction: row;
    font-weight: bold;
    font-size: 14px;
    line-height: 20px;

    ${({ extra }) => extra}
`;

const STr = styled(Frame)`
    height: max-content;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    padding: 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #dadada;

    ${({ extra }) => extra}
`;

const STable = styled(Frame)`
    width: 100%;
    border-collapse: collapse;

    ${({ extra }) => extra}
`;

export default Table;
/*eslint-enable*/
