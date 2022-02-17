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
};

export const PROCESS_STATUS = {
    success: "Успешно",
    running: "В процессе",
    failed: "Ошибка",
    shutdown: "Завершен принудительно",
};

export const OPERATORS = {
    SQL_CLONE: `SQL_CLONE`,
    SQL_EXTRACT: `SQL_EXTRACT`,
    SQL_LOAD: `SQL_LOAD`,
    // MAPPING: `MAPPING `,
    JOIN: `JOIN`,
    CALCULATED: `CALCULATED`,
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
    null: { value: null, label: `Нет` },
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
};

export const CALCULATION_FUNCTION_TYPES = {
    sum: { value: `sum`, label: `Сумма` },
    multiplication: { value: `multiplication`, label: `Произведение` },
    integerDivision: { value: `integerDivision`, label: `Целочисленное деление` },
    nonIntegerDivision: { value: `nonIntegerDivision`, label: `Деление` },
    subtraction: { value: `subtraction`, label: `Вычитание` },
    arrayElementsCount: { value: `arrayElementsCount`, label: `Количество элементов массива`, twoArguments: true },
    extractYear: { value: `extractYear`, label: `Извлечь год`, twoArguments: true },
    extractQuarter: { value: `extractQuarter`, label: `Извлечь квартал`, twoArguments: true },
    extractMonth: { value: `extractMonth`, label: `Извлечь месяц`, twoArguments: true },
    extractDay: { value: `extractDay`, label: `Извлечь день`, twoArguments: true },
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
