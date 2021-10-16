/*eslint-disable*/
import { SORT_ORDERS, TABLES, STATUSES, ROLES } from "./config";
import { putStorage, mergeStorage } from "../hooks/useStorage";
import { linkTo } from "../utils/common-helper";

const PropertyOwnerTable = {
    sortable: true,
    selectable: true,
    defaultSort: {
        field: `clientID`,
        order: SORT_ORDERS.DESC,
    },
    idColumnName: `clientID`,
    columns: [
        {
            name: `clientName`,
            label: `Client name`,
            cell: { type: `text` },
            extra: `flex: 2;`,
            filter: {
                type: `input`,
            },
            onCellClick: (data) => {
                putStorage(`tables.${TABLES.PROPERTY}.filters`, { clientName: data });
                linkTo(`home/${TABLES.PROPERTY}`);
            },
        },
        {
            name: `clientID`,
            label: `Client ID`,
            cell: { type: `text` },
            filter: {
                type: `input`,
            },
            onCellClick: (data) => {
                putStorage(`tables.${TABLES.PROPERTY}.filters`, { clientID: data });
                linkTo(`home/${TABLES.PROPERTY}`);
            },
        },
        {
            name: `count`,
            label: `Count`,
            cell: { type: `text` },
            filter: {
                type: `input`,
            },
        },
    ],
};

const PropertyTable = {
    sortable: true,
    selectable: true,
    defaultSort: {
        field: `clientID`,
        order: SORT_ORDERS.DESC,
    },
    idColumnName: `clientID`,
    columns: [
        {
            name: `clientName`,
            label: `Client name`,
            cell: { type: `text` },
            filter: { type: `input` },
        },
        {
            name: `clientID`,
            label: `Client ID`,
            cell: { type: `text` },
            filter: { type: `input` },
        },
        {
            name: `bbl`,
            label: `BBL`,
            cell: { type: `text` },
            filter: { type: `input` },
            onCellClick: (data) => {
                putStorage(`tables.${TABLES.TASKS}.filters`, { bbl: data });
                linkTo(`home/${TABLES.TASKS}`);
            },
        },
        {
            name: `count`,
            label: `Count`,
            cell: { type: `text` },
            filter: { type: `input` },
        },
    ],
};

const TasksTable = {
    sortable: true,
    selectable: true,
    // selectionLimit: 2,
    defaultSort: {
        field: `clientID`,
        order: SORT_ORDERS.DESC,
    },
    idColumnName: `taskId`,
    columns: [
        {
            name: `clientID`,
            label: `Client ID`,
            cell: { type: `text` },
            filter: { type: `input` },
        },
        {
            name: `bbl`,
            label: `BBL`,
            cell: { type: `text` },
            filter: { type: `input` },
        },
        {
            name: `formID`,
            label: `Form type`,
            cell: { type: `text` },
            filter: { type: `input` },
        },
        {
            name: `deadline`,
            label: `Deadline Date`,
            cell: { type: `text` },
            filter: { type: `input` },
        },
        {
            name: `status`,
            label: `Status`,
            cell: { type: `text` },
            filter: {
                type: `select`,
                multiselect: true,
                placeholder: `Select status`,
                options: STATUSES.map((i) => ({
                    value: i,
                    label: i,
                })),
            },
        },
    ],
};

const UsersTable = {
    sortable: true,
    selectable: false,
    // selectionLimit: 2,
    defaultSort: {
        field: `clientID`,
        order: SORT_ORDERS.DESC,
    },
    idColumnName: `clientID`,
    columns: [
        {
            name: `clientID`,
            label: `Client (User) ID`,
            cell: { type: `text` },
            filter: { type: `input` },
        },
        {
            name: `email`,
            label: `Email`,
            cell: { type: `text` },
            filter: { type: `input` },
        },
        {
            name: `role`,
            label: `Role`,
            transform: (d) => ROLES?.[d] ?? d,
            cell: { type: `text` },
            filter: { type: `select`, options: Object.entries(ROLES).map((i) => ({ value: i[0], label: i[1] })) },
        },
        {
            name: `editbutton`,
            label: ``,
            extra: `justify-content: center;`,
            cell: {
                type: `button`,
                children: `Edit`,
                extra: `width: 100px;`,
                onClick: (row) => {
                    console.log(row?.clientID);
                },
            },
            sortable: false,
        },
        {
            name: `deletebutton`,
            label: ``,
            extra: `justify-content: center;`,
            cell: {
                type: `button`,
                children: `Delete`,
                extra: `width: 100px;`,
                onClick: (row) => {
                    console.log(row?.clientID);
                },
            },
            sortable: false,
        },
    ],
};

const tablesColumns = {
    [TABLES.PROPERTY_OWNER]: PropertyOwnerTable,
    [TABLES.PROPERTY]: PropertyTable,
    [TABLES.TASKS]: TasksTable,
    [TABLES.USERS]: UsersTable,
};

export default tablesColumns;
/*eslint-enable*/
