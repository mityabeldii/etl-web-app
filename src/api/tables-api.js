/*eslint-disable*/
import axios from "axios";
import _ from "lodash";

import { GETOptions, handleError, handleSuccess, loadingCounterWrapper, POSTOptions } from "../utils/api-helper";
import CaseHalper from "../utils/case-helper";

import { API_URL, base_url, TABLES } from "../constants/config";
import { getStorage, mergeStorage, putStorage } from "../hooks/useStorage";
import { objectPut, downloadURI, sleep, objectToQS } from "../utils/common-helper";
import DatasourceAPI from "./datasource-api";

const TablesAPI = {
    createTable: ({ datasourceId, fields, schemaName, tableName }) => {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.post(`/api/v1/tables`, { datasourceId, fields, schemaName, tableName }))
                    .data;
                await DatasourceAPI.getDatasourceTables(datasourceId, schemaName);
                handleSuccess({ message: `Таблица ${tableName} успешно создана` });
                return response;
            } catch (error) {
                handleError(error);
                throw error;
            }
        });
    },
    updateTable: ({ datasourceId, newTableName, oldTableName, schemaName }) => {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.put(`/api/v1/tables`, { datasourceId, newTableName, oldTableName, schemaName }))
                    .data;
                await DatasourceAPI.getDatasourceTables(datasourceId, schemaName);
                handleSuccess({ message: `Таблица ${newTableName} успешно обновлена` });
                return response;
            } catch (error) {
                handleError(error);
                throw error;
            }
        });
    },
};

export default TablesAPI;
/*eslint-enable*/
