/*eslint-disable*/
import axios from "axios";

import { handleError, handleSuccess, loadingCounterWrapper, POSTOptions } from "../utils/api-helper";
import CaseHalper from "../utils/case-helper";

import { API_URL, base_url, TABLES } from "../constants/config";
import { getStorage, mergeStorage, putStorage } from "../hooks/useStorage";
import { objectPut, downloadURI, sleep } from "../utils/common-helper";

const DatasourceAPI = {
    async getDatasources() {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`${base_url}/api/v1/datasource`)).data;
                putStorage(`tables.${TABLES.DATASOURCE_LIST}`, {
                    rows: response,
                    pagination: response?._meta ?? {},
                });
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

    async getDatasourceTables(id) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`${base_url}/api/v1/datasource/meta/${id}/tables`)).data;
                putStorage(`datasources.tables.${id}`, response);
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

    async getDatasourceTableStructure(id) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`${base_url}/api/v1/datasource/meta/${id}`)).data;
                putStorage(
                    `datasources.structures`,
                    [{ id, data: response }, ...getStorage((state) => state?.datasources?.data ?? [])].filter(
                        (i, j, self) => self?.map?.((i) => i?.id)?.indexOf(i?.id) === j
                    )
                );
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

    async getDatasourceTablePreview(id, tableName) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`${base_url}/api/v1/query/${id}/${tableName}`)).data;
                putStorage(
                    `datasources.preview`,
                    Object.values(
                        Object.fromEntries(
                            [{ id, [tableName]: response }, ...getStorage((state) => state?.datasources?.data ?? [])].map((i) => [i?.id, i])
                        )
                    )
                );
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

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

    async getTableColumns(datasourceId, tableName) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`${base_url}/api/v1/datasource/meta/${datasourceId}/${tableName}/columns`)).data;
                putStorage(`datasources.columns.${datasourceId}.${tableName}`, response);
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },
};

export default DatasourceAPI;

/*eslint-enable*/
