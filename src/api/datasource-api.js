/*eslint-disable*/
import axios from "axios";
import _ from "lodash";
import moment from "moment-timezone";

import {
    convertPaginatedResponse,
    convertPaginatedResponse2,
    GETOptions,
    GETOptionsForPreview,
    handleError,
    handleSuccess,
    loadingCounterWrapper,
    POSTOptions,
} from "../utils/api-helper";
import CaseHalper from "../utils/case-helper";

import { API_URL, base_url, TABLES } from "../constants/config";
import { getStorage, mergeStorage, putStorage } from "../hooks/useStorage";
import { objectPut, downloadURI, sleep, objectToQS } from "../utils/common-helper";

const DatasourceAPI = {
    getDatasources: async () => {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`/api/v1/datasource`)).data;
                putStorage(`tables.${TABLES.DATASOURCE_LIST}`, {
                    rows: _.orderBy(response, [`updated`], [`desc`]),
                    pagination: response?._meta ?? {},
                });
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

    getDatasourcesSourceOnly: async () => {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`/api/v1/datasource`)).data;
                putStorage(`tables.${TABLES.DATASOURCE_LIST}`, {
                    rows: _.filter(_.orderBy(response, [`id`], [`asc`]), { type: `SOURCE` }),
                    pagination: response?._meta ?? {},
                });
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

    createDatasource: async (data) => {
        return loadingCounterWrapper(async () => {
            try {
                const response = (
                    await axios.post(
                        `${base_url}/api/v1/datasource`,
                        _.omit(
                            {
                                ...data,
                                url: `jdbc:postgresql://${data?.host}:${data?.port}/${data?.base}`,
                                type: data?.type ?? "SOURCE",
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

    updateDatasource: async (data) => {
        const dataWithNewUrl = { ...data, url: `jdbc:postgresql://${data?.host}:${data?.port}/${data?.url}` };
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.put(`/api/v1/datasource`, dataWithNewUrl)).data;
                await DatasourceAPI.getDatasources();
                handleSuccess({ message: `???????????????? ?? id ${data?.id} ???????????????? ??????????????` });
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

    getDatasourceTables: async (datasourceId, schemaName) => {
        return loadingCounterWrapper(async () => {
            try {
                // const response = (await axios.get(`/api/v1/datasource/meta/${id}/tables`)).data;
                const { tables } = (await axios.get(`/api/v1/tables`, { params: { datasourceId, schemaName } })).data;
                putStorage(`datasources.tables.${datasourceId}.${schemaName}`, tables);
                return tables;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

    getDatasourceTableStructure: async (id) => {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`/api/v1/datasource/meta/${id}`)).data;
                putStorage(
                    `datasources.structures`,
                    [{ id, data: response }, ...getStorage((state) => state?.datasources?.data ?? [])].filter(
                        (i, j, self) => self?.map?.((i) => i?.id)?.indexOf(i?.id) === j
                    )
                );
                putStorage(`pages.datasourcesPage.schemaName`, response?.schema);
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

    getDatasourceTablePreview: async (datasourceId, tableName, schema) => {
        if (!schema) return;
        return loadingCounterWrapper(async () => {
            try {
                const response = (
                    await axios.get(`/api/v1/query/${datasourceId}/${tableName}`, GETOptionsForPreview(TABLES.DATASOURCE_TABLE_PREVIEW, schema))
                ).data;
                const data = convertPaginatedResponse(response);
                putStorage(`datasources.preview.${datasourceId}.${tableName}`, data);
                putStorage(`tables.${TABLES.DATASOURCE_TABLE_PREVIEW}`, data);
                return response;
            } catch (error) {
                if (error?.response?.status == 500) {
                    handleError({ message: `???????????? ?????????????????? ????????????` });
                } else {
                    throw handleError(error);
                }
            }
        });
    },

    getTableColumns: async (datasourceId, tableName) => {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`/api/v1/datasource/meta/${datasourceId}/${tableName}/columns`)).data;
                putStorage(`datasources.columns.${datasourceId}.${tableName}`, response);
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

    getProcessesHistory: async () => {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`/process-instances`, GETOptions(`PROCESSES_HISTORY`))).data;
                mergeStorage(`tables.${TABLES.PROCESSES_HISTORY}`, convertPaginatedResponse2(response));
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

    getTasksHistory: async () => {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.get(`/api/v1/task-instances`, POSTOptions(`TASKS_HISTORY`))).data;
                mergeStorage(`tables.${TABLES.TASKS_HISTORY}`, convertPaginatedResponse2(response));
                return response;
            } catch (error) {
                throw handleError(error);
            }
        });
    },

    adHocQuery: async ({ datasourceId, schemaName, query }) => {
        return loadingCounterWrapper(async () => {
            try {
                if (datasourceId && schemaName && query) {
                    const table = getStorage((state) => state?.tables?.[name] ?? {});
                    const { pagination = {} } = table;
                    const { currentPage = 0, perPage = 10 } = pagination;
                    const { result: response } = (
                        await axios.post(`/api/v1/ad-hoc-query`, {
                            datasourceId,
                            schemaName,
                            query,
                            page: currentPage,
                            pageSize: perPage,
                        })
                    ).data;
                    if (!response) {
                        throw { response: { data: { message: `???? ?????????????? ?????????????????? ????????????` } } };
                    }
                    putStorage(`tables.${TABLES.DATASOURCE_TABLE_PREVIEW}`, convertPaginatedResponse(response));
                    handleSuccess({ message: `Success` });
                    return response;
                }
            } catch (error) {
                throw error;
            }
        });
    },

    deleteDatasource: async (id) => {
        return loadingCounterWrapper(async () => {
            try {
                const response = (await axios.delete(`/api/v1/datasource/${id}`)).data;
                await DatasourceAPI.getDatasources();
                handleSuccess({ message: `???????????????? c ID ${id} ?????????????? ????????????` });
                return response;
            } catch (error) {
                throw error;
            }
        });
    },
};

export default DatasourceAPI;

/*eslint-enable*/
