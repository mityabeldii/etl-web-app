/*eslint-disable*/
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import _ from "lodash";

import { Frame, Checkbox, Input, Button, RowWrapper } from "./styled-templates";
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
        selectable = true,
        name,
        sortable = true,
        columns = [],
        selectionLimit = Infinity,
        widthPagination = true,
        paginationOptions = [10, 25, 50, 100, 500],
        defaultSort,
        idColumnName = `id`,
        fetchFunction = () => {
            console.log(`> > > FETCH < < <`);
        },
        dependencies = {},
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
    const { currentPage = 0, perPage = paginationOptions?.[0] ?? 1, pageCount = 1 } = pagination;
    const debouncedParams = useDebounce(JSON.stringify({ filters }), 300);
    useEffect(async () => {
        if (!tableState?.sort) {
            putStorage(`tables.${name}.sort`, [defaultSort], { silent: true });
        }
        if (!tableState?.pagination) {
            putStorage(`tables.${name}.pagination`, { currentPage, perPage }, { silent: true });
        }
        const newData = await fetchFunction();
    }, [JSON.stringify({ debouncedParams, sort, name, currentPage, perPage, dependencies })]);

    return (
        <>
            <STable extra={extra}>
                <STr>
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
                <STr>
                    {/* {selectable && <STh extra={`flex: unset; width: 40px;`}><Checkbox onChange={(e) => {}} /></STh>} */}
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
                </STr>
                {rows.map((row, row_index) => (
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
                                        column?.onCellClick?.(row?.[column?.name]);
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
                                        }?.[column?.cell?.type]
                                    }
                                </STd>
                            );
                        })}
                    </STr>
                ))}
            </STable>
            {widthPagination && (
                <RowWrapper extra={`margin-top: 20px; justify-content: flex-start; > * { margin-right: 10px; };`}>
                    <Frame>Rows per page:</Frame>
                    <Select
                        options={paginationOptions.map((i) => ({ value: i, label: i }))}
                        extra={`width: 100px;`}
                        value={perPage ?? paginationOptions?.[0] ?? 0}
                        onChange={(e) => {
                            putStorage(`tables.${name}.pagination.perPage`, e.target.value);
                        }}
                    />
                    <Frame>
                        Page: {currentPage + 1} of {pageCount}
                    </Frame>
                    <PaginationArrow
                        extra={`transform: rotate(180deg);`}
                        onClick={() => {
                            putStorage(`tables.${name}.pagination.currentPage`, Math.max(currentPage - 1, 0));
                        }}
                        disabled={currentPage + 1 <= 1}
                    />
                    <PaginationArrow
                        onClick={() => {
                            putStorage(`tables.${name}.pagination.currentPage`, Math.min(currentPage + 1, pageCount - 1));
                        }}
                        disabled={currentPage + 1 >= pageCount}
                    />
                </RowWrapper>
            )}
        </>
    );
};

const AuthPageImage = styled(Frame)`
    width: 70%;
    height: 50%;
    min-width: 691px;
    background: url("${require(`../../assets/images/loginpicture_.png`).default}") no-repeat center left / contain;
`;

const PaginationArrow = styled(Frame).attrs((props) => ({
    ...props,
    onClick: props?.disabled ? () => {} : props?.onClick,
}))`
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

    ${({ extra }) => extra}
`;

const STr = styled(Frame)`
    height: max-content;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;

    ${({ extra }) => extra}
`;

const STable = styled(Frame)`
    width: 100%;
    border-collapse: collapse;

    > * {
        &:nth-child(2n) {
            background: ${({ theme }) => theme.background.support};
        }
        &:nth-child(2) {
            background: transparent;
        }
    }

    ${({ extra }) => extra}
`;

export default Table;
/*eslint-enable*/
