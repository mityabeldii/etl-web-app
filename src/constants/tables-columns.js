/*eslint-disable*/
import _ from "lodash";
import moment from "moment-timezone";

import { SORT_ORDERS, TABLES, STATUSES, ROLES, MODALS, FORMS, OPERATORS } from "./config";
import { createId, linkTo } from "../utils/common-helper";

import ProcessesAPI from "../api/processes-api";

import { putStorage, getStorage, mergeStorage } from "../hooks/useStorage";
import { eventDispatch } from "../hooks/useEventListener";
import TasksHelper from "../utils/tasks-helper";
import ModalsHelper from "../utils/modals-helper";
import DatasourceAPI from "../api/datasource-api";

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
                    putStorage(`forms.${FORMS.EDIT_DATASOURCE_MODAL}.values`, { ...row, url: row?.url?.split?.(`/`)?.at?.(-1) ?? `` });
                    ModalsHelper.showModal(MODALS.EDIT_DATASOURCE_MODAL);
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
                onClick: (row) => {
                    ModalsHelper.showModal(MODALS.MODALITY, {
                        title: `Удаление источника данных`,
                        description: `Вы действительно хотите удалить источник данных ${row?.name}?`,
                        confirmButton: {
                            children: `Удалить`,
                            background: `red`,
                            onClick: async () => {
                                DatasourceAPI.deleteDatasource(row?.id);
                            },
                        },
                        cancelButton: {
                            background: `grey`,
                            children: `Отмена`,
                        },
                    });
                },
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
    withPagination: true,
    booleanOperation: `disjunction`,
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
        // {
        //     name: `lastDate`,
        //     label: `Посл. запуск`,
        //     tooltip: { label: `В 14:15 1 числа каждого месяца\n\n**Следующий запуск:**\n\n 2021-01-11 14:15` },
        //     transform: ({ row }) => `${row.lastDate ?? `-`}\n\n${row.lastStatus ?? `-`}`,
        //     cell: {
        //         extra: `* { line-height: 8px; }; * { line-height: 19px !important; margin: 0; }; > * { > * { &:first-child { margin-bottom: 8px; }; }; };`,
        //     },
        // },
        { name: `startDate`, label: `След. запуск`, transform: ({ row }) => `${row.lastDate ?? `-`}` },
        { name: `processStat`, label: `Статистика`, cell: { type: `statistics` } },
        { name: `morebutton`, label: ``, cell: { type: `process_more_button`, extra: `justify-content: flex-end;` } },
    ],
};

const ETLProcessesConfigurationTable = {
    useBackendProcessing: false,
    withPagination: false,
    columns: [
        { name: `taskName`, label: `Имя задачи` },
        {
            name: `operator`,
            label: `Имя оператора`,
            onCellClick: ({ row }) => {
                ModalsHelper.showModal(MODALS.CREATE_TASK, { mode: `view` });
                putStorage(`forms.${FORMS.CREATE_TASK}.values`, row);
            },
            cell: { type: `operator` },
        },
        { name: `taskQueue`, label: `Порядок` },
        { name: `taskDescription`, label: `Описание задачи` },
        {
            name: `datasource`,
            label: `Источники данных`,
            transform: ({ row: task }) => {
                return TasksHelper.getSourcesNames(task);
            },
        },
        // { name: `active`, label: `Статистика` },
        {
            name: `editbutton`,
            label: ``,
            extra: `flex: unset; width: 20px;`,
            cell: {
                type: `icon`,
                src: `edit`,
                extra: `justify-content: flex-end;`,
            },
            onCellClick: ({ row }) => {
                ModalsHelper.showModal(MODALS.CREATE_TASK, { mode: `edit` });
                putStorage(`forms.${FORMS.CREATE_TASK}.values`, row);
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
            cell: { type: `icon`, src: `arrow-right-grey` },
        },
    ],
};

const ProcessesHistoryTable = {
    useBackendProcessing: false,
    withPagination: true,
    booleanOperation: `disjunction`,
    columns: [
        {
            name: `processName`,
            label: `Процесс`,
            extra: `> * > * { &:nth-child(1) { margin: 0; }; &:nth-child(2) { color: #AEAEAE; margin: 0; margin-top: 4px; };};`,
            transform: ({ row }) => `**${row?.processName}**`,
        },
        { name: `processRunId`, label: `ID запуска`, extra: `flex: 2;` },
        { name: `processId`, label: `ID процесса`, extra: `flex: 2;` },
        {
            name: `startAndStop`,
            label: `Старт/Завершение`,
            extra: `flex: 2; > * > * { &:nth-child(1) { margin: 0; }; &:nth-child(2) { color: #AEAEAE; margin: 0; margin-top: 4px; };};`,
            transform: ({ row }) =>
                `${row?.processStartDate ? moment(row?.processStartDate).format(`YYYY-MM-DD hh:mm:ss`) : `-`}\n\n${
                    row?.processEndDate ? moment(row?.processEndDate).format(`YYYY-MM-DD hh:mm:ss`) : `-`
                }`,
        },
        { name: `state`, label: `Статус`, extra: `flex: unset; width: 200px;`, cell: { type: `processstatus` } },
        // { name: ``, label: ``, extra: `flex: unset; width: 100px;`, cell: { type: `eventlogbutton` } },
    ],
};

const TasksHistoryTable = {
    useBackendProcessing: true,
    withPagination: true,
    booleanOperation: `disjunction`,
    columns: [
        {
            name: `taskName`,
            label: `Задача`,
        },
        {
            name: `id`,
            label: `ID запуска задачи`,
        },
        {
            name: `processId`,
            label: `ID процесса`,
        },
        // {
        //     name: `processName`,
        //     label: `Процесс`,
        //     extra: `> * > * { &:nth-child(1) { margin: 0; }; &:nth-child(2) { color: #AEAEAE; margin: 0; margin-top: 4px; };};`,
        //     transform: ({ row }) => `**${row?.processName}**`,
        // },
        // { name: `processRunId`, label: `ID запуска`, extra: `flex: 2;` },
        // { name: `processId`, label: `ID процесса`, extra: `flex: 2;` },
        {
            name: `startAndStop`,
            label: `Старт/Завершение`,
            extra: `flex: 2; > * > * { &:nth-child(1) { margin: 0; }; &:nth-child(2) { color: #AEAEAE; margin: 0; margin-top: 4px; };};`,
            transform: ({ row }) =>
                `${row?.startDate ? moment(row?.startDate).format(`YYYY-MM-DD hh:mm:ss`) : `-`}\n\n${
                    row?.endDate ? moment(row?.endDate).format(`YYYY-MM-DD hh:mm:ss`) : `-`
                }`,
        },
        { name: `state`, label: `Статус`, extra: `flex: unset; width: 200px;`, cell: { type: `processstatus` } },
        // { name: ``, label: ``, extra: `flex: unset; width: 100px;`, cell: { type: `eventlogbutton` } },
    ],
};

const tablesColumns = {
    [TABLES.DATASOURCE_LIST]: DatasourceList,
    [TABLES.DATASOURCE_TABLE_STRUCTURE]: DatasourceTableStructure,
    [TABLES.DATASOURCE_TABLE_PREVIEW]: DatasourceTablePreview,
    [TABLES.PROCESSES_LIST]: ProcessesList,
    [TABLES.TASKS_TABLE]: ETLProcessesConfigurationTable,
    [TABLES.PROCESSES_HISTORY]: ProcessesHistoryTable,
    [TABLES.TASKS_HISTORY]: TasksHistoryTable,
};

export default tablesColumns;
/*eslint-enable*/
