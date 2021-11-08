/*eslint-disable*/
import { SORT_ORDERS, TABLES, STATUSES, ROLES, MODALS, FORMS } from "./config";
import { putStorage, mergeStorage } from "../hooks/useStorage";
import { createId, linkTo } from "../utils/common-helper";
import { eventDispatch } from "../hooks/useEventListener";
import _ from "lodash";
import ProcessesAPI from "../api/processes-api";

const DatasourceList = {
    useBackendProcessing: false,
    idColumnName: `id`,
    booleanOperation: `disjunction`,
    useBackendProcessing: false,
    columns: [
        {
            name: `name`,
            extra: `flex: 2;`,
            label: `Имя`,
            cell: {
                type: `link`,
                to: ({ row }) => `/datasources/${row?.id}`,
            },
        },
        { name: `description`, extra: `flex: 2;`, label: `Описание` },
        { name: `host`, extra: `flex: 2;`, label: `Хост` },
        { name: `port`, extra: `flex: 1;`, label: `Порт` },
        { name: `url`, extra: `flex: 5;`, label: `База` },
        { name: `schema`, extra: `flex: 2;`, label: `Схема` },
        {
            name: `editbutton`,
            extra: `width: 40px; flex: unset;`,
            cell: {
                type: `button`,
                variant: `plain`,
                leftIcon: `edit`,
                extra: `box-shadow: unset; padding: 8px; min-width: unset;`,
                leftIconStyles: `margin-right: 0;`,
                onClick: (row) => {
                    putStorage(`forms.${FORMS.EDIT_DATA_SOURCE_MODAL}.values`, row);
                    eventDispatch(`OPEN_${MODALS.EDIT_DATA_SOURCE_MODAL}_MODAL`);
                },
            },
        },
        {
            name: `deletebutton`,
            extra: `width: 40px; flex: unset;`,
            cell: {
                type: `button`,
                variant: `plain`,
                leftIcon: `delete-outline`,
                extra: `box-shadow: unset; padding: 8px; min-width: unset;`,
                leftIconStyles: `margin-right: 0;`,
            },
        },
    ],
};

const DatasourceTableStructure = {
    useBackendProcessing: false,
    withPagination: false,
    withHeader: false,
    columns: [{ name: `name`, extra: `font-weight: bold;` }, { name: `type` }],
};

const DatasourceTablePreview = {
    useBackendProcessing: false,
    withPagination: false,
    columns: [{ name: `name`, extra: `font-weight: bold;` }, { name: `type` }],
};

const ProcessesList = {
    useBackendProcessing: false,
    withPagination: false,
    columns: [
        {
            name: `active`,
            label: `Активность`,
            tooltip: { label: `Активировать процесс` },
            cell: {
                type: `switch`,
                onChange: ({ row }) => {
                    ProcessesAPI.updateProcess({ ...row, active: !(row?.active === true) });
                },
            },
        },
        { name: `processName`, label: `Имя процесса`, cell: { type: `process_name`, extra: `* { line-height: 8px; };` } },
        { name: `cron`, label: `Расписание`, cell: { type: `crontab` } },
        {
            name: `lastDate`,
            label: `Посл. запуск`,
            tooltip: { label: `В 14:15 1 числа каждого месяца\n\n**Следующий запуск:**\n\n 2021-01-11 14:15` },
            transform: ({ row }) => `${row.lastDate}\n\n${row.lastStatus}`,
            cell: {
                extra: `* { line-height: 8px; }; * { line-height: 19px !important; margin: 0; }; > * { > * { &:first-child { margin-bottom: 8px; }; }; };`,
            },
        },
        { name: `startDate`, label: `След. запуск`, transform: ({ row }) => `${row.lastDate}` },
        { name: `statistics`, label: `Статистика`, cell: { type: `statistics` } },
        { name: `morebutton`, label: ``, cell: { type: `process_more_button`, extra: `justify-content: flex-end;` } },
    ],
};

const ETLProcessesConfigurationTable = {
    useBackendProcessing: false,
    withPagination: false,
    columns: [
        { name: `taskName`, label: `Имя задачи` },
        { name: `operator`, label: `Имя оператора` },
        { name: `taskQueue`, label: `Порядок` },
        { name: `downstreamTaskIds`, label: `Следующие задачи` },
        { name: `???`, label: `Источники данных` },
        // { name: `active`, label: `Статистика` },
        {
            name: `editbutton`,
            label: ``,
            extra: `flex: unset; width: 20px;`,
            cell: {
                type: `icon`,
                src: `edit`,
                extra: `justify-content: flex-end;`,
                onClick: (row) => {
                    putStorage(`forms.${FORMS.EDIT_PROCESS}.values`, row);
                    eventDispatch(`OPEN_${MODALS.EDIT_PROCESS}_MODAL`);
                },
            },
        },
        {
            name: `deletebutton`,
            label: ``,
            extra: `flex: unset; width: 20px;`,
            cell: { type: `icon`, src: `delete-outline-greyed`, extra: `justify-content: flex-end;` },
            onCellClick: ({ row }) => {
                ProcessesAPI.deleteTask(row?.processId, row?.id);
            },
        },
        {
            name: `rightarrowbutton`,
            label: ``,
            extra: `flex: unset; width: 20px;`,
            cell: { type: `icon`, src: `arrow-right-grey`, extra: `justify-content: flex-end;` },
        },
    ],
};

const tablesColumns = {
    [TABLES.DATASOURCE_LIST]: DatasourceList,
    [TABLES.DATASOURCE_TABLE_STRUCTURE]: DatasourceTableStructure,
    [TABLES.DATASOURCE_TABLE_PREVIEW]: DatasourceTablePreview,
    [TABLES.PROCESSES_LIST]: ProcessesList,
    [TABLES.TASKS_TABLE]: ETLProcessesConfigurationTable,
};

export default tablesColumns;
/*eslint-enable*/
