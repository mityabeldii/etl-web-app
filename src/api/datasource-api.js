/*eslint-disable*/
import axios from "axios";
import _ from "lodash";

import { GETOptions, handleError, handleSuccess, loadingCounterWrapper, POSTOptions } from "../utils/api-helper";
import CaseHalper from "../utils/case-helper";

import { API_URL, base_url, TABLES } from "../constants/config";
import { getStorage, mergeStorage, putStorage } from "../hooks/useStorage";
import { objectPut, downloadURI, sleep, objectToQS } from "../utils/common-helper";

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

    async createDatasource(data) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (
                    await axios.post(
                        `${base_url}/api/v1/datasource`,
                        _.omit(
                            {
                                ...data,
                                url: `jdbc:postgresql://${data?.host}:${data?.port}/${data?.base}`,
                                type: "SOURCE",
                            },
                            [`base`]
                        )
                    )
                ).data;
                await DatasourceAPI.getDatasources();
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
                const response = (await axios.get(`${base_url}/api/v1/query/${id}/${tableName}`, GETOptions(TABLES.DATASOURCE_TABLE_PREVIEW))).data;
                const data = {
                    rows: _.map(response?.rows, `cells`)?.map?.((i) => Object.fromEntries(i?.map?.((i) => [i?.column, i?.value]))),
                    pagination: {
                        perPage: response?.rowCount,
                        currentPage: response?.page,
                        totalCount: response?.totalRowCount,
                    },
                };
                putStorage(`datasources.preview.${id}.${tableName}`, data);
                putStorage(`tables.${TABLES.DATASOURCE_TABLE_PREVIEW}`, data);
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

    async getProcessesHistory() {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`${base_url}/process-instances`)).data;
                putStorage(`tables.${TABLES.PROCESSES_HISTORY}`, {
                    rows: response?.sort?.((a, b) => b?.processStartDate - a?.processStartDate) ?? [],
                    pagination: response?._meta ?? {},
                });
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

    async getTasksHistory(options) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`${base_url}/api/v1/task-instances${objectToQS(options)}`)).data;
                putStorage(`tables.${TABLES.TASKS_HISTORY}`, {
                    rows: response ?? [],
                    pagination: response?._meta ?? {},
                });
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

    adHocQuery({ datasourceId, schemaName, query }) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.post(`${base_url}/api/v1/ad-hoc-query`, { datasourceId, schemaName, query })).data;
                handleSuccess({ message: `Success` });
                return response;
            } catch (error) {
                throw error;
            }
        });
    },

    updateDatasourceSchema(datasourceId, schemaName) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.post(`${base_url}/api/v1/schemes`, { datasourceId, schemaName })).data;
                await DatasourceAPI.getDatasources();
                handleSuccess({ message: `Источник c ID ${id} успешно удален` });
                return response;
            } catch (error) {
                handleError(error);
                throw error;
            }
        });
    },

    renameSchema(datasourceId, oldSchemaName, newSchemaName) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.put(`${base_url}/api/v1/schemes`, { datasourceId, oldSchemaName, newSchemaName })).data;
                await DatasourceAPI.getDatasources();
                handleSuccess({ message: `Источник c ID ${id} успешно удален` });
                return response;
            } catch (error) {
                handleError(error);
                throw error;
            }
        });
    },

    deleteDatasource(id) {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.delete(`${base_url}/api/v1/datasource/${id}`)).data;
                await DatasourceAPI.getDatasources();
                handleSuccess({ message: `Источник c ID ${id} успешно удален` });
                return response;
            } catch (error) {
                throw error;
            }
        });
    },
};

export default DatasourceAPI;

/*eslint-enable*/
