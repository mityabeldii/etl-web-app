/*eslint-disable*/
import { SORT_ORDERS, TABLES, STATUSES, ROLES, MODALS, FORMS } from "./config";
import { putStorage, mergeStorage } from "../hooks/useStorage";
import { linkTo } from "../utils/common-helper";
import { eventDispatch } from "../hooks/useEventListener";

const PropertyOwnerTable = {
    defaultSort: {
        field: `clientID`,
        order: SORT_ORDERS.DESC,
    },
    idColumnName: `clientID`,
    columns: [
        { name: `name`, label: `Имя` },
        { name: `description`, label: `Описание` },
        { name: `host`, label: `Хост` },
        { name: `port`, label: `Порт` },
        { name: `base`, label: `База` },
        { name: `schema`, label: `Схема` },
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
    rows: new Array(10).fill({
        name: `suspendisse`,
        description: `Id diam maecenas ultricies mi eget mauris pharetra`,
        host: `207.208.244.194`,
        port: `8679`,
        base: `suspendisse`,
        schema: `ipsum`,
    }),
};

const tablesColumns = {
    [TABLES.DATA_SOURSE_LIST]: PropertyOwnerTable,
};

export default tablesColumns;
/*eslint-enable*/
