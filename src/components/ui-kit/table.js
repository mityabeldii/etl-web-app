/*eslint-disable*/
import React, { useEffect, useState, useMemo } from "react";
import styled, { css, keyframes } from "styled-components";
import { Link } from "react-router-dom";
import _ from "lodash";
import Markdown from "markdown-to-jsx";

import { Frame, Checkbox, Input, Button, RowWrapper, Switch, Dropdown } from "./styled-templates";
import Select from "./select";
import Tooltip from "./tooltip";
import ProcessDropdown from "../tools/process-dropdown";
import DatasourceDropdown from "../tools/datasource-dropdown";

import { convertHex } from "../../utils/colors-helper";
import { createId, togglePush } from "../../utils/common-helper";

import { getStorage, mergeStorage, putStorage, useStorageListener } from "../../hooks/useStorage";
import useDebounce from "../../hooks/useDebounde";

import { EVENTS, MODALS, PROCESS_STATUS, PROCESS_STATUSES, SORT_ORDERS, TABLES } from "../../constants/config";
import useEventListener, { eventDispatch } from "../../hooks/useEventListener";
import usePagination from "../../hooks/usePagination";

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
        filters: propsFilters = {},
        booleanOperation = `conjunction`,
    } = props;
    if (!name) {
        throw new Error(`[table.js] - name is not  defined`);
    }
    const tableState = useStorageListener((state) => _.get(state, `tables.${name}`) ?? {});

    const { rows = [] } = tableState;

    const { selectedRows = [] } = tableState;
    const setSelectedRows = (newValue = []) => {
        putStorage(`tables.${name}.selectedRows`, newValue.slice(0, selectionLimit));
    };
    const { filters } = tableState;
    const setFilter = (filter, newValue) => {
        putStorage(`tables.${name}.filters.${filter}`, newValue);
    };
    const sort = tableState?.sort?.[0] ?? defaultSort;
    const setSort = (field, order) => {
        putStorage(`tables.${name}.sort`, [{ field, order }]);
    };
    const filterRows = (rows = []) =>
        rows?.filter?.((i) => {
            return (
                useBackendProcessing ||
                Object.keys(_.pickBy(filters, _.identity)).length === 0 ||
                Object.entries(_.pickBy(filters, _.identity))
                    .map(([key, value], index) => !value || `${_.get(i, key)}`?.toLowerCase?.()?.includes?.(`${value}`?.toLowerCase?.()))
                    ?.reduce?.(
                        ...{
                            conjunction: [(a, b) => a && b, true],
                            disjunction: [(a, b) => a || b, false],
                        }?.[booleanOperation ?? `conjunction`]
                    )
            );
        });
    const frontendPagination = usePagination(filterRows(rows));
    const pagination = useBackendProcessing ? tableState?.pagination ?? {} : frontendPagination ?? {};
    const { currentPage = 0, perPage = paginationOptions?.[0] ?? 1, pagesCount = 1, totalCount = 1 } = pagination;
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
            const newData = await fetchFunction({ perPage, currentPage: currentPage + 1 });
        }
    }, [JSON.stringify({ debouncedParams, sort, name, currentPage, perPage, dependencies })]);

    useEffect(async () => {
        if (!useBackendProcessing) {
            const newData = await fetchFunction();
        }
    }, []);
    useEffect(() => useBackendProcessing && putStorage(`tables.${name}.filters`, propsFilters), [propsFilters, useBackendProcessing]);

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
                {filterRows(
                    !useBackendProcessing && withPagination ? frontendPagination.visibleItems ?? [] : rows.length === 0 && propRows ? propRows : rows
                )?.map?.((row, row_index) => (
                    <STr key={row_index} extra={name === TABLES.PROCESSES_LIST && `align-items: flex-start;`}>
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
                            const cellState = { row, column, value: row?.[column?.name] };
                            return <TableCell key={column_index} cellState={cellState} />;
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
                            .filter((i) => i >= 0 && i >= currentPage - 2 && i < maxPageNumber)
                            .slice(0, 3)
                            .map((item, index) => (
                                <PageNumberWrapper
                                    key={index}
                                    selected={currentPage === item}
                                    onClick={() => {
                                        if (useBackendProcessing) {
                                            putStorage(`tables.${name}.pagination.currentPage`, item);
                                        } else {
                                            frontendPagination.handlePageNavigation(item);
                                        }
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
                                if (useBackendProcessing) {
                                    putStorage(`tables.${name}.pagination.perPage`, e.target.value);
                                } else {
                                    frontendPagination.handlePerPageChange(e.target.value ?? perPage ?? 10);
                                }
                            }}
                        />
                    </Frame>
                </PaginationWrapper>
            )}
        </TableWrapper>
    );
};

const smartStringify = (value) => {
    return !!value && !!`${value}` ? (typeof value !== `string` ? JSON.stringify(value) : value) : `-`;
};

const TableCell = ({ cellState }) => {
    const { row, column, value } = cellState;
    const transformedValue = smartStringify(column?.transform?.(cellState) ?? value ?? row?.[column?.name]);
    const cellContent = useMemo(
        () =>
            ({
                text: <Markdown>{`${transformedValue}`}</Markdown>,
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
                link: <Link to={column?.cell?.to?.(cellState) ?? `/`}>{transformedValue}</Link>,
                switch: (
                    <Switch
                        {...column?.cell}
                        onChange={() => {
                            column?.cell?.onChange?.(cellState);
                        }}
                        checked={row?.[column?.name] === true}
                    />
                ),
                process_name: (
                    <Frame
                        extra={`flex-direction: column; align-items: flex-start; * { line-height: 19px !important; margin: 0; }; > * { > * { &:first-child { margin-bottom: 8px; }; }; };`}
                    >
                        {/* <Markdown>{`**${row?.processName ?? ``}**\n\n${row?.processDescription ?? ``}`}</Markdown> */}
                        <Frame extra={`margin-bottom: 8px; font-weight: bold;`}>{row?.processName ?? `-`}</Frame>
                        <Frame>
                            <Tooltip label={row?.processDescription ?? `-`}>
                                {row?.processDescription?.slice?.(0, 25)}
                                {row?.processDescription?.length > 25 && `...`}
                            </Tooltip>
                        </Frame>
                        {row?.in_progress && <Tooltip label={`Процесс запущен`} children={<SpinningArrows />} />}
                    </Frame>
                ),
                crontab: (
                    <Frame extra={`flex-direction: row;`}>
                        <Markdown>{transformedValue ?? `-`}</Markdown>
                        {/* <Tooltip label={`В 14:15 1 числа каждого месяца\n\n**Следующий запуск:**\n\n2021-01-11 14:15`} children={<Info />} /> */}
                    </Frame>
                ),
                statistics: (
                    <Frame extra={`flex-direction: row; > * { margin-left: 8px; &:nth-child { margin-left: 0px; }; };`}>
                        {Object.keys(PROCESS_STATUS).map((status, index) => {
                            return (
                                <Tooltip
                                    key={index}
                                    label={PROCESS_STATUS?.[status]}
                                    children={<StatisticsItem key={index} status={status} value={row?.[column?.name]?.[status] ?? `0`} />}
                                />
                            );
                        })}
                    </Frame>
                ),
                process_more_button: <ProcessDropdown cellState={cellState} />,
                datasource_more_button: <DatasourceDropdown cellState={cellState} />,
                operator: (
                    <Frame extra={`flex-direction: row;`}>
                        {transformedValue} <Icon src={`settings`} />
                    </Frame>
                ),
                eventlogbutton: <EventLogButton>Event log</EventLogButton>,
                processstatus: (
                    <ProcessStatus status={PROCESS_STATUSES?.[cellState?.value] ?? PROCESS_STATUSES?.FORCED_COMPLETION}>
                        {PROCESS_STATUSES?.[cellState?.value]?.label}
                    </ProcessStatus>
                ),
                icon: <Icon {...column?.cell} />,
            }?.[column?.cell?.type ?? `text`] ?? ``),
        [JSON.stringify(cellState)]
    );
    return (
        <STd
            extra={(column?.extra ?? ``) + (column?.cell?.extra ?? ``)}
            clickable={column?.onCellClick}
            onClick={() => {
                column?.onCellClick?.(cellState);
            }}
        >
            {column?.tooltip ? (
                <Tooltip {...(_.isFunction(column?.tooltip) ? column?.tooltip(cellState) : column?.tooltip)} children={cellContent} />
            ) : (
                cellContent
            )}
        </STd>
    );
};

const ProcessStatus = styled(Frame)`
    width: 128px;
    padding: 4px 0;
    box-sizing: border-box;
    border-radius: 4px;
    background: ${({ theme, status }) => convertHex(theme?.[status?.color] ?? `#fff`, 0.15)};
    color: ${({ theme, status }) => theme?.[status?.color] ?? `#fff`};
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
`;

const EventLogButton = styled.button`
    border: 0px;
    font-size: 14px;
    line-height: 20px;
    border-bottom: 2px solid #d4d4d4;
    padding-bottom: 2px;
    box-sizing: border-box;
    cursor: pointer;
    outline: none;
    background: unset;
    display: flex;
    color: ${({ theme }) => theme.text.primary};
`;

const Icon = styled(Frame)`
    width: 20px;
    height: 20px;
    background: url("${({ src }) => require(`../../assets/icons/${src}.svg`).default}") no-repeat center center / contain;
    cursor: pointer;
`;

const StatisticsItem = styled(Frame)`
    width: 24px;
    height: 24px;
    border: 2px solid
        ${({ theme, status = `failed` }) =>
            ({
                success: theme.green,
                running: theme.yellow,
                failed: theme.red,
                shutdown: theme.grey,
            }?.[status ?? `failed`])};
    border-radius: 50%;

    &:after {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 12px;
        line-height: 20px;
        content: "${({ value = 0 }) => value}";
    }
`;

const Info = styled(Frame)`
    width: 16px;
    height: 16px;
    background: url("${require(`../../assets/icons/info.svg`).default}") no-repeat center center / contain;
    margin-left: 8px;
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
`;

const SpinningArrows = styled(Frame)`
    margin-left: 8px;
    margin-bottom: 24px;
    width: 16px;
    height: 16px;
    background: url("${require(`../../assets/icons/spinning-arrows.svg`).default}") no-repeat center center / contain;
    animation: ${rotate} 3s linear infinite;
`;

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

    /* overflow: hidden; */
    white-space: break-spaces;

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
    align-items: flex-start;

    > * {
        word-break: break-word;
    }

    ${({ extra }) => extra}
`;

const STable = styled(Frame)`
    width: 100%;
    border-collapse: collapse;

    ${({ extra }) => extra}
`;

export default Table;
/*eslint-enable*/
