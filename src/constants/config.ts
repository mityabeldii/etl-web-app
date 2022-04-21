import { EOperators } from "./types";

export const base_url = process.env.REACT_APP_BASE_URL;

export const EVENTS = {
    UPDATE_STORAGE: "UPDATE_STORAGE",
    CLOSE_DROPDOWN: "CLOSE_DROPDOWN",
};

export const SORT_ORDERS = {
    ASC: "ASC",
    DESC: "DESC",
};

export const TABLES = {
    DATASOURCE_LIST: "DATASOURCE_LIST",
    DATASOURCE_TABLE_STRUCTURE: "DATASOURCE_TABLE_STRUCTURE",
    DATASOURCE_TABLE_PREVIEW: "DATASOURCE_TABLE_PREVIEW",
    PROCESSES_LIST: "PROCESSES_LIST",
    TASKS_TABLE: "TASKS_TABLE",
    PROCESSES_HISTORY: "PROCESSES_HISTORY",
    TASKS_HISTORY: "TASKS_HISTORY",
    EVENT_LOG: "EVENT_LOG",
    REFERENCE_INFO_TABLE: "REFERENCE_INFO_TABLE",
};

export const MODALS = {
    CREATE_DATASOURCE_MODAL: "CREATE_DATASOURCE_MODAL",
    EDIT_DATASOURCE_MODAL: "EDIT_DATASOURCE_MODAL",
    DATASOURCE_AD_HOC_QUERY_MODAL: "DATASOURCE_AD_HOC_QUERY_MODAL",
    CREATE_PROCESS_MODAL: "CREATE_PROCESS_MODAL",
    EDIT_PROCESS_ATTRIBUTES: "EDIT_PROCESS_ATTRIBUTES",
    CREATE_TASK: "CREATE_TASK",
    EDIT_PROCESS: "EDIT_PROCESS",
    EDIT_ACCESS_CREDENTIALS: "EDIT_ACCESS_CREDENTIALS",
    CREATE_SCHEMA_IN_STORAGE: "CREATE_SCHEMA_IN_STORAGE",
    EDIT_SCHEMA_NAME: "EDIT_SCHEMA_NAME",
    MODALITY: "MODALITY",
    CREATE_TABLE_IN_SCHEMA: "CREATE_TABLE_IN_SCHEMA",
    EDIT_TABLE_NAME: "EDIT_TABLE_NAME",
    EDIT_TABLE_STRUCTURE: "EDIT_TABLE_STRUCTURE",
    TABLE_PREVIEW: "TABLE_PREVIEW",
    REFERENCE_MODAL: "REFERENCE_MODAL",
    REFERENCE_INFO_MODAL: "REFERENCE_INFO_MODAL",
};

export const FORMS = {
    CREATE_DATASOURCE: "CREATE_DATASOURCE",
    EDIT_DATASOURCE_MODAL: "EDIT_DATASOURCE_FORM",
    DATASOURCE_AD_HOC_FORM: "DATASOURCE_AD_HOC_FORM",
    CREATE_PROCESS_MODAL: "CREATE_PROCESS_MODAL",
    EDIT_PROCESS_ATTRIBUTES: "EDIT_PROCESS_ATTRIBUTES",
    CREATE_TASK: "CREATE_TASK",
    EDIT_PROCESS: "EDIT_PROCESS",
    EDIT_ACCESS_CREDENTIALS: "EDIT_ACCESS_CREDENTIALS",
    CREATE_SCHEMA_IN_STORAGE: "CREATE_SCHEMA_IN_STORAGE",
    EDIT_SCHEMA_NAME: "EDIT_SCHEMA_NAME",
    CREATE_TABLE_IN_SCHEMA: "CREATE_TABLE_IN_SCHEMA",
    EDIT_TABLE_NAME: "EDIT_TABLE_NAME",
    LOGIN: "LOGIN",
    EDIT_TABLE_STRUCTURE: "EDIT_TABLE_STRUCTURE",
};

export const PROCESS_STATUS = {
    success: "Успешно",
    running: "В процессе",
    failed: "Ошибка",
    shutdown: "Завершен принудительно",
};

export const OPERATORS = {
    SQL_CLONE: EOperators.SQL_CLONE,
    SQL_EXTRACT: EOperators.SQL_EXTRACT,
    SQL_LOAD: EOperators.SQL_LOAD,
    // MAPPING: `MAPPING `,
    JOIN: EOperators.JOIN,
    CALCULATED: EOperators.CALCULATED,
    UNION: EOperators.UNION,
    // TEST: `TEST`,
    // TEST_ERROR: `TEST_ERROR`,
};

export const UPDATE_TYPES = {
    REPLACE: `Полная замена`,
    INCREMENT_UPSERT: `Инкрементальное обновление`,
    INCREMENT_INSERT: `Инкрементальное добавление`,
    INCREMENT_LOAD: `Загрузка инкремента`,
    UPSERT: `Обновление`,
    INSERT: `Добавление`,
};

export const LOGIC_OPERATOR = {
    AND: { value: `AND`, label: `AND` },
    OR: { value: `OR`, label: `OR` },
    // null: { value: null, label: `Нет` },
};

export const JOIN_TYPE = {
    INNER: `INNER`,
    LEFT: `LEFT`,
    RIGHT: `RIGHT`,
    FULL: `FULL`,
};

export const FIELD_TYPES = {
    integer: `integer`,
    numeric: `numeric`,
    text: `text`,
    date: `date`,
    timestamp: `timestamp`,
    boolean: `boolean`,
    uuid: `uuid`,
    jsonb: `jsonb`,
    bigint: `bigint`,
    varchar: `varchar`,
    int4: `int4`,
    int8: `int8`,
    bigserial: `bigserial`,
    smallint: `smallint`,
    doublePrecision: `double precision`,
};

export const CALCULATION_FUNCTION_TYPES = {
    sum: { value: `sum`, label: `Сумма`, twoArguments: true },
    multiplication: { value: `multiplication`, label: `Произведение`, twoArguments: true },
    integerDivision: { value: `integerDivision`, label: `Целочисленное деление`, twoArguments: true },
    nonIntegerDivision: { value: `nonIntegerDivision`, label: `Деление`, twoArguments: true },
    subtraction: { value: `subtraction`, label: `Вычитание`, twoArguments: true },
    arrayElementsCount: { value: `arrayElementsCount`, label: `Количество элементов массива` },
    extractYear: { value: `extractYear`, label: `Извлечь год` },
    extractQuarter: { value: `extractQuarter`, label: `Извлечь квартал` },
    extractMonth: { value: `extractMonth`, label: `Извлечь месяц` },
    extractDay: { value: `extractDay`, label: `Извлечь день` },
};

export const PROCESS_STATUSES = {
    SUCCESS: {
        label: "Успешно",
        name: "success",
        color: "green",
    },
    RUNNING: {
        label: "Запущен",
        name: "running",
        color: "yellow",
    },
    FAILED: {
        label: "Ошибка",
        name: "failed",
        color: "red",
    },
    FORCED_COMPLETION: {
        label: "Завершен принудительно",
        name: "forced completion",
        color: "grey",
    },
    UPSTREAM_FAILED: {
        label: "Не дошла очередь",
        name: "upstream failed",
        color: "grey",
    },
    UP_FOR_RETRY: {
        label: "Ожидает перезапуска",
        name: "up for retry",
        color: "grey",
    },
};

export enum EEventTypes {
    message = `Сообщение`,
    error = `Ошибка`,
}
