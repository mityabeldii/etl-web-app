/*eslint-disable*/
import { SORT_ORDERS, TABLES, STATUSES, ROLES, MODALS, FORMS } from "./config";
import { putStorage, mergeStorage } from "../hooks/useStorage";
import { createId, linkTo } from "../utils/common-helper";
import { eventDispatch } from "../hooks/useEventListener";
import _ from "lodash";

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
            name: `active`,
            label: `Активность`,
            tooltip: { label: `Активировать процесс` },
            cell: {
                type: `switch`,
                onChange: ({ row }) => {
                    console.log(row);
                },
            },
        },
        { name: `name`, label: `Имя процесса`, cell: { type: `process_name`, extra: `* { line-height: 8px; };` } },
        { name: `crontab`, label: `Расписание`, cell: { type: `crontab`, extra: `margin-bottom: 24px;` } },
        {
            name: `lastDate`,
            label: `Посл. запуск`,
            tooltip: { label: `В 14:15 1 числа каждого месяца\n\n**Следующий запуск:**\n\n 2021-01-11 14:15` },
            transform: ({ row }) => `${row.lastDate}\n\n${row.lastStatus}`,
            cell: {
                extra: `* { line-height: 8px; };`,
            },
        },
        { name: `startDate`, label: `След. запуск`, transform: ({ row }) => `${row.lastDate}`, cell: { extra: `margin-bottom: 24px;` } },
        { name: `statistics`, label: `Статистика`, cell: { type: `statistics` } },
        { name: `morebutton`, label: ``, cell: { type: `process_more_button`, extra: `justify-content: flex-end;` } },
    ],
    rows: new Array(5).fill(0).map((i) => ({
        active: Math.random() > 0.5,
        in_progress: Math.random() > 0.5,
        name: `mi_eget_mauris`,
        description: `Quam`,
        crontab: `15  14  1  *  *`,
        lastDate: `2021-10-10 13:00`,
        startDate: `2021-10-11 13:00`,
        lastStatus: [`В процессе`, `Успешно`]?.[_.random(0, 1)],
        statistics: {
            success: _.random(0, 10),
            in_progress: _.random(0, 10),
            error: _.random(0, 10),
            force_completed: _.random(0, 10),
        },
    })),
};

const tablesColumns = {
    [TABLES.DATASOURCE_LIST]: DatasourceList,
    [TABLES.DATASOURCE_TABLE_STRUCTURE]: DatasourceTableStructure,
    [TABLES.DATASOURCE_TABLE_PREVIEW]: DatasourceTablePreview,
    [TABLES.PROCESSES_LIST]: ProcessesList,
};

export default tablesColumns;
/*eslint-enable*/
