export const base_url = `http://65.108.61.88:8087/etl`;

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
};

export const MODALS = {
    CREATE_DATA_SOURCE_MODAL: "CREATE_DATA_SOURCE_MODAL",
    EDIT_DATA_SOURCE_MODAL: "EDIT_DATA_SOURCE_MODAL",
    DATASOURCE_AD_HOC_QUERY_MODAL: "DATASOURCE_AD_HOC_QUERY_MODAL",
    CREATE_PROCESS_MODAL: "CREATE_PROCESS_MODAL",
    EDIT_PROCESS_ATTRIBUTES: "EDIT_PROCESS_ATTRIBUTES",
    CREATE_TASK: "CREATE_TASK",
    EDIT_PROCESS: "EDIT_PROCESS",
};

export const FORMS = {
    CREATE_DATA_SOURCE_MODAL: "CREATE_DATA_SOURCE_FORM",
    EDIT_DATA_SOURCE_MODAL: "EDIT_DATA_SOURCE_FORM",
    DATASOURCE_AD_HOC_FORM: "DATASOURCE_AD_HOC_FORM",
    CREATE_PROCESS_MODAL: "CREATE_PROCESS_MODAL",
    EDIT_PROCESS_ATTRIBUTES: "EDIT_PROCESS_ATTRIBUTES",
    CREATE_TASK: "CREATE_TASK",
    EDIT_PROCESS: "EDIT_PROCESS",
};

export const PROCESS_STATUS = {
    success: "Успешно",
    in_progress: "В процессе",
    error: "Ошибка",
    force_completed: "Завершен принудительно",
};

export const OPERATORS = {
    SQL_CLONE: `SQL_CLONE`,
    SQL_EXTRACT: `SQL_EXTRACT`,
    SQL_LOAD: `SQL_LOAD`,
    MAPPING: `MAPPING `,
    JOIN: `JOIN`,
    CALCULATED: `CALCULATED`,
    TEST: `TEST`,
    TEST_ERROR: `TEST_ERROR`,
};

export const UPDATE_TYPES = {
    full: `Полное`,
    increment: `Итерационное`,
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
    arrayElementsCount: { value: `arrayElementsCount`, label: `Количество элементов массива` },
    extractYear: { value: `extractYear`, label: `Извлечь год` },
    extractQuarter: { value: `extractQuarter`, label: `Извлечь квартал` },
    extractMonth: { value: `extractMonth`, label: `Извлечь месяц` },
    extractDay: { value: `extractDay`, label: `Извлечь день` },
};
