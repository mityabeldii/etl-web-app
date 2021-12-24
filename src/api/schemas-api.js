/*eslint-disable*/
import axios from "axios";
import _ from "lodash";

import { convertPaginatedResponse, GETOptions, handleError, handleSuccess, loadingCounterWrapper, POSTOptions } from "../utils/api-helper";
import CaseHalper from "../utils/case-helper";

import { API_URL, base_url, TABLES } from "../constants/config";
import { getStorage, mergeStorage, putStorage } from "../hooks/useStorage";
import { objectPut, downloadURI, sleep, objectToQS } from "../utils/common-helper";

const SchemasAPI = {
    async getSchemas(datasourceId) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`${base_url}/api/v1/schemes/${datasourceId}`)).data;
                putStorage(`datasources.schemas.${datasourceId}`, response?.schemas);
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

    createSchema({ datasourceId, schemaName }) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.post(`${base_url}/api/v1/schemes`, { datasourceId, schemaName })).data;
                await SchemasAPI.getSchemas(datasourceId);
                handleSuccess({ message: `Схема ${schemaName} успешно создана` });
                return response;
            } catch (error) {
                // handleError(error);
                throw error;
            }
        });
    },

    updateSchema({ datasourceId, oldSchemaName, newSchemaName }) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.put(`${base_url}/api/v1/schemes`, { datasourceId, oldSchemaName, newSchemaName })).data;
                await SchemasAPI.getSchemas(datasourceId);
                handleSuccess({ message: `Схема ${oldSchemaName} успешно переименована в ${newSchemaName}` });
                return response;
            } catch (error) {
                handleError(error);
                throw error;
            }
        });
    },

    deleteSchema(datasourceId, schemaName) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.delete(`${base_url}/api/v1/schemes`, { data: { datasourceId, schemaName, deleteType: `RESTRICT` } }))
                    .data;
                await SchemasAPI.getSchemas(datasourceId);
                handleSuccess({ message: `Схема ${schemaName} успешно удалена` });
                return response;
            } catch (error) {
                handleError(error);
                throw error;
            }
        });
    },
};

export default SchemasAPI;
/*eslint-enable*/
