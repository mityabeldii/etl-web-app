/*eslint-disable*/
import axios from "axios";
import _ from "lodash";

import { GETOptions, handleError, handleSuccess, loadingCounterWrapper, POSTOptions } from "../utils/api-helper";
import CaseHalper from "../utils/case-helper";

import { API_URL, base_url, TABLES } from "../constants/config";
import { getStorage, mergeStorage, putStorage } from "../hooks/useStorage";
import { objectPut, downloadURI, sleep, objectToQS } from "../utils/common-helper";
import DatasourceAPI from "./datasource-api";
import TablesAPI from "./tables-api";

const TableFieldsAPI = {
    updateTableFields: ({ datasourceId, schemaName, tableName, tableFields = [] }) => {
        return loadingCounterWrapper(async () => {
            try {
                const response = (
                    await axios.put(`/api/v1/table-fields`, { datasourceId, tableName, schemaName, tableFields })
                ).data;
                await TablesAPI.getTable({ datasourceId, schemaName });
                handleSuccess({ message: `Структура таблицы ${tableName} успешно обновлена` });
                return response;
            } catch (error) {
                handleError(error);
                throw error;
            }
        });
    },
};

export default TableFieldsAPI;
/*eslint-enable*/
