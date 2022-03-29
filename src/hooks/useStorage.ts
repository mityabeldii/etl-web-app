/*eslint-disable*/
import { useEffect, useState } from "react";
import _ from "lodash";

import useEventListener, { eventDispatch } from "hooks/useEventListener";

import { createId, isna, objectMerge } from "utils/common-helper";

const STORAGE_KEY = "Storage";

declare global {
    interface Window {
        [STORAGE_KEY]: any;
    }
}

export const useStorageListener = (getPathContent: ((state: any) => any) | string, defaultValue?: any) => {
    let newGetPathContent: (state: any) => any;
    if (typeof getPathContent === `string`) {
        newGetPathContent = (state) => _.cloneDeep(_.get(state, getPathContent, defaultValue));
    } else {
        newGetPathContent = (state) => _.cloneDeep(getPathContent(state));
    }
    const [state, setState] = useState(newGetPathContent(window[STORAGE_KEY]));

    const checkAndUpdate = () => {
        if (!_.isEqual(newGetPathContent(window[STORAGE_KEY]), state)) {
            setState(newGetPathContent(window[STORAGE_KEY]));
        }
    };

    useEventListener(`UPDATE_STORAGE`, checkAndUpdate);

    useEffect(checkAndUpdate, [
        JSON.stringify(getPathContent, (key, val) => {
            if (typeof val === "function") {
                return JSON.stringify(val(window[STORAGE_KEY]));
            }
            return val;
        }),
    ]);
    return state;
};

interface PutStorageOptions {
    silent?: boolean;
}

export const putStorage = (path: string, value: any, options?: PutStorageOptions) => {
    const { silent = false } = options ?? {};
    if (!window?.[STORAGE_KEY]) {
        window[STORAGE_KEY] = {};
    }
    _.set(window[STORAGE_KEY], path, _.cloneDeep(value));
    if (!silent) {
        eventDispatch(`UPDATE_STORAGE`);
    }
};

export const omitStorage = (path: string | string[]) => {
    (Array.isArray(path) ? path : [path]).forEach((path) => {
        window[STORAGE_KEY] = _.omit(window?.[STORAGE_KEY] ?? {}, path);
        eventDispatch(`UPDATE_STORAGE`);
    });
    eventDispatch(`UPDATE_STORAGE`);
    return;
};

export const mergeStorage = (path: string, value: any) => {
    objectMerge(window[STORAGE_KEY], path, value);
    eventDispatch(`UPDATE_STORAGE`);
};

export const getStorage = (getPathContent?: ((state: any) => any) | string, defaultValue?: any) => {
    if (!getPathContent) {
        return window[STORAGE_KEY];
    }
    let newGetPathContent: (state: any) => any;
    if (typeof getPathContent === `string`) {
        newGetPathContent = (state) => _.get(state, getPathContent, defaultValue);
    } else {
        newGetPathContent = getPathContent;
    }
    return newGetPathContent(window[STORAGE_KEY]);
};

export const clearStorage = (fieldsToPersist?: string[]) => {
    const temp = {} as any;
    fieldsToPersist?.forEach?.((field) => {
        const value = window[STORAGE_KEY][field];
        if (value !== undefined) {
            temp[field] = value;
        }
    });
    window[STORAGE_KEY] = { ...temp };
    eventDispatch(`UPDATE_STORAGE`);
    return;
};

const getNested = (obj: any, ...args: any) => {
    return args.reduce((obj: any, level: any) => obj && obj[level], obj);
};

export const useStorageValue = (initValue: any, path: string) => {
    path = path || `temp.` + createId();

    if (isna(getNested(window[STORAGE_KEY], ...path.split(`.`)))) {
        _.set(window[STORAGE_KEY], path, initValue);
    }

    const value = useStorageListener((state) => getNested(state, ...path.split(`.`)));

    const setMethod = (value: any) => {
        putStorage(path, value);
    };

    return [value, setMethod, path];
};

interface StorageProviderProps {
    children: any;
    defalutStorage?: any;
}

export const StorageProvider = ({ children, defalutStorage = {} }: StorageProviderProps) => {
    useEffect(() => {
        window[STORAGE_KEY] = defalutStorage;
    }, [defalutStorage]);
    return children;
};

/*eslint-enable*/
