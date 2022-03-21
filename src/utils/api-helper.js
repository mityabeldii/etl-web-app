/*eslint-disable*/
import axios from "axios";
import moment from "moment-timezone";

import { eventDispatch } from "../hooks/useEventListener";
import { getStorage, putStorage } from "../hooks/useStorage";
import { objectPut, sleep } from "./common-helper";

import { base_url } from "../constants/config";

export const getToken = () => {
    const token = localStorage.getItem(`auth_token_etl`);
    return token;
};

export const setUpInterceptors = () => {
    axios.interceptors.request.use(
        async (config) => {
            config.baseURL = base_url;
            const token = getToken();
            if (!!token) {
                config.headers["Authorization"] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

export const handleSuccess = (response) => {
    if (!Array.isArray(response) && typeof response.message === `string`) {
        response = [response];
    }
    (response || [])?.forEach?.((i, index) => {
        setTimeout(() => {
            eventDispatch(`THROW_SUCCESS`, i?.message ?? ``);
        }, 200 * index);
    });
    return response || [];
};

export let handleError = (error) => {
    console.error(error);
    if (typeof error === `string`) {
        error = { message: error };
    }
    if (!Array.isArray(error) && typeof error?.message === `string` && !Array.isArray(error?.response?.data)) {
        objectPut(error, `response.data`, [error?.response?.data]);
    }
    if (error?.response?.data) {
        (error?.response?.data ?? []).forEach((i, index) => {
            setTimeout(() => {
                if (i?.field) {
                    eventDispatch(`CALL_INPUT_ERROR`, { field: i?.field ?? ``, message: i?.message ?? `` });
                } else {
                    eventDispatch(`THROW_ERROR`, i?.message ?? error?.message ?? ``);
                }
            }, 200 * index);
        });
        return error?.response?.data ?? [];
    }
    if (error?.response?.data?.message) {
        eventDispatch(`THROW_ERROR`, error?.response?.data?.message);
        return error?.response?.data?.message;
    }
    return error;
};

export const loadingCounterWrapper = async (action) => {
    putStorage(`loading_counter`, (window?.storage?.loading_counter ?? 0) + 1);
    try {
        const response = await action();
        return response;
    } catch (error) {
        throw error;
    } finally {
        await sleep(100);
        putStorage(`loading_counter`, Math.max((window?.storage?.loading_counter ?? 0) - 1, 0));
    }
};

export const POSTOptions = (name) => {
    const table = getStorage((state) => state?.tables?.[name] ?? {});
    const { pagination = {}, sort = [], filters: filter = {} } = table;
    const { currentPage = 0, perPage = 10 } = pagination;
    return {
        params: {
            limit: perPage,
            offset: currentPage * perPage,
            ...filter,
        },
    };
};

export const GETOptions = (options = {}) => {
    return POSTOptions(options);
};

export const GETOptionsForPreview = (name, schema) => {
    const table = getStorage((state) => state?.tables?.[name] ?? {});
    const { pagination = {} } = table;
    const { currentPage = 0, perPage = 10 } = pagination;
    return {
        params: {
            limit: perPage,
            offset: currentPage,
            schemaName: schema
        },
    };
};

export const convertPaginatedResponse = (response) => {
    const { rows = [], page: currentPage = 0, rowCount: perPage = 10, totalRowCount: totalCount = 0 } = response;
    const data = {
        rows: rows.map((i) => Object.fromEntries(i?.cells?.map?.((j) => [j?.column, j?.value]))),
        pagination: { currentPage, perPage, totalCount },
    };
    return data;
};

export const convertPaginatedResponse2 = (response) => {
    const { data = [], offset = 0, limit = 10, totalCount = 0 } = response;
    return {
        rows: data,
        pagination: {
            currentPage: offset / limit,
            perPage: limit,
            totalCount,
        },
    };
};

/*eslint-enable*/
