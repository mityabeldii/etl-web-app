/*eslint-disable*/
import axios from "axios";
import moment from "moment-timezone";

import { eventDispatch } from "../hooks/useEventListener";
import { getStorage, putStorage } from "../hooks/useStorage";
import { objectPut, sleep } from "./common-helper";

export const getToken = () => {
    let token = localStorage.getItem(`auth_token_gnx`);
    return token;
};

export const setUpInterceptors = () => {
    axios.interceptors.request.use(
        async (config) => {
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
        let response = await action();
        return response;
    } catch (error) {
        throw error;
    } finally {
        await sleep(100)
        putStorage(`loading_counter`, Math.max((window?.storage?.loading_counter ?? 0) - 1, 0));
    }
};

export const POSTOptions = (name) => {
    const table = getStorage((state) => state?.tables?.[name] ?? {});
    const { pagination = {}, sort = [], filters: filter = {} } = table;
    const { currentPage = 0, perPage = 10 } = pagination;
    return {
        params: {
            query: {
                sort,
                pagination: { page: currentPage, perPage: perPage },
                filter,
            },
        },
    };
};

export const GETOptions = (options = {}) => {
    Object.keys(options?.filter ?? {})
        .filter((i) => [`_from`, `_to`].map((j) => i.includes(j)).includes(true))
        .forEach((i) => {
            options.filter[i] = moment(options?.filter?.[i]).format(`YYYY-MM-DD HH:mm:ss`);
        });
    return {
        params: {
            setting: JSON.stringify(POSTOptions(options)),
        },
    };
};

/*eslint-enable*/
