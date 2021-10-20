/*eslint-disable*/
import { SORT_ORDERS, TABLES, STATUSES, ROLES, MODALS, FORMS } from "./config";
import { putStorage, mergeStorage } from "../hooks/useStorage";
import { createId, linkTo } from "../utils/common-helper";
import { eventDispatch } from "../hooks/useEventListener";

const DatasourceList = {
    useBackendProcessing: false,
    idColumnName: `id`,
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
                    putStorage(`forms.${FORMS.EDIT_DATA_SOURCE_MODAL}`, row);
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
            name: `name`,
            label: `Активность`,
            cell: {
                type: `switch`,
                onChange: ({ row }) => {
                    console.log(row);
                },
            },
        },
        { name: `type`, label: `Имя процесса`, cell: { type: `process_name` } },
        { name: `type`, label: `Расписание`, cell: { type: `crontab` } },
        { name: `123`, label: `Расписание`, transform: (d) => d },
        { name: `processEndDate`, label: `Посл. запуск` },
        { name: `processStartDate`, label: `След. запуск` },
        { name: `234`, label: `Статистика`, cell: { type: `statistics` } },
        { name: `morebutton`, label: ``, cell: { type: `process_more_button`, } },
    ],
};

const tablesColumns = {
    [TABLES.DATASOURCE_LIST]: DatasourceList,
    [TABLES.DATASOURCE_TABLE_STRUCTURE]: DatasourceTableStructure,
    [TABLES.DATASOURCE_TABLE_PREVIEW]: DatasourceTablePreview,
    [TABLES.PROCESSES_LIST]: ProcessesList,
};

export default tablesColumns;
/*eslint-enable*/
