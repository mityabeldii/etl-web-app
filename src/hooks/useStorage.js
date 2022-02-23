/*eslint-disable*/
import { useState, useEffect } from "react";
import _ from "lodash";

import useEventListener, { eventDispatch } from "./useEventListener";

import { objectMerge, createId, isna, path } from "../utils/common-helper";

const STORAGE_KEY = "storage";

export const useStorageListener = (getPathContent) => {
    if (typeof getPathContent === `string`) {
        getPathContent = (state) => _.get(state, getPathContent) ?? defaultValue;
    }
    const [state, setState] = useState(_.cloneDeep(getPathContent(window[STORAGE_KEY])));
    useEventListener(`UPDATE_STORAGE`, (d) => {
        if (!_.isEqual(getPathContent(window[STORAGE_KEY]), state)) {
            setState(_.cloneDeep(getPathContent(window[STORAGE_KEY])));
        }
    });
    return state;
};

export const putStorage = (path, value, options) => {
    const { silent = false } = options ?? {};
    if (!window?.[STORAGE_KEY]) {
        window[STORAGE_KEY] = {};
    }
    _.set(window[STORAGE_KEY], path, _.cloneDeep(value));
    if (!silent) {
        eventDispatch(`UPDATE_STORAGE`);
    }
};

export const omitStorage = (path) => {
    (Array.isArray(path) ? path : [path]).forEach((path) => {
        window[STORAGE_KEY] = _.omit(window?.[STORAGE_KEY] ?? {}, path);
        eventDispatch(`UPDATE_STORAGE`);
    });
    eventDispatch(`UPDATE_STORAGE`);
    return;
};

export const mergeStorage = (path, value) => {
    objectMerge(window[STORAGE_KEY], path, value);
    eventDispatch(`UPDATE_STORAGE`);
};

export const getStorage = (path = (state) => state) => {
    if (typeof path !== `function`) {
        throw new Error(`useStorage (getStorage): path is not a function`);
    }
    return path(window[STORAGE_KEY]);
};

export const clearStorage = (fieldsToPersist) => {
    const temp = {};
    (fieldsToPersist || []).forEach((field) => {
        const value = window[STORAGE_KEY][field];
        if (value !== undefined) {
            temp[field] = value;
        }
    });
    window[STORAGE_KEY] = { ...temp };
    eventDispatch(`UPDATE_STORAGE`);
    return;
};

const getNested = (obj, ...args) => {
    return args.reduce((obj, level) => obj && obj[level], obj);
};

export const useStorageValue = (initValue, path) => {
    path = path || `temp.` + createId();

    if (isna(getNested(window[STORAGE_KEY], ...path.split(`.`)))) {
        _.set(window[STORAGE_KEY], path, initValue);
    }

    const value = useStorageListener((state) => getNested(state, ...path.split(`.`)));

    const setMethod = (value) => {
        putStorage(path, value);
    };

    return [value, setMethod, path];
};

export const StorageProvider = ({ children, defalutStorage = {} }) => {
    useEffect(() => {
        window[STORAGE_KEY] = defalutStorage;
    }, [defalutStorage]);
    return children;
};

/*eslint-enable*/
