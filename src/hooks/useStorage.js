/*eslint-disable*/
import { useState, useEffect } from "react";
import _ from "lodash";

import useEventListener, { eventDispatch } from "./useEventListener";

import { objectPut, objectMerge, objectCopy, objectCompare, createId, isna, path } from "../utils/common-helper";
import { EVENTS } from "../constants/config";

export const useStorageListener = (getPathContent) => {
    if (typeof getPathContent === `string`) {
        getPathContent = path(getPathContent);
    }
    const [state, setState] = useState(objectCopy(getPathContent(window.storage)));
    useEventListener(EVENTS.UPDATE_STORAGE, (d) => {
        if (!objectCompare(getPathContent(window.storage), state)) {
            setState(objectCopy(getPathContent(window.storage)));
        }
    });
    return state;
};

export const putStorage = (path, value, options = {}) => {
    const { silent = false } = options;
    if (!window?.storage) {
        window.storage = {};
    }
    objectPut(window.storage, path, value);
    if (!silent) {
        eventDispatch(EVENTS.UPDATE_STORAGE);
    }
};

export const mergeStorage = (path, value) => {
    objectMerge(window.storage, path, value);
    eventDispatch(EVENTS.UPDATE_STORAGE);
};

export const getStorage = (path = (state) => state) => {
    if (typeof path !== `function`) {
        throw new Error(`useStorage (getStorage): path is not a function`);
    }
    return path(window.storage);
};

export const clearStorage = () => {
    window.storage = {};
    eventDispatch(EVENTS.UPDATE_STORAGE);
    return;
};

export const omitStorage = (path) => {
    (Array.isArray(path) ? path : [path]).forEach((path) => {
        window.storage = _.omit(window?.storage ?? {}, path);
    });
    eventDispatch(EVENTS.UPDATE_STORAGE);
    return;
};

const getNested = (obj, ...args) => {
    return args.reduce((obj, level) => obj && obj[level], obj);
};

export const useStorageValue = (initValue, path) => {
    path = path || `temp.` + createId();

    if (isna(getNested(window.storage, ...path.split(`.`)))) {
        objectPut(window.storage, path, initValue);
    }

    const value = useStorageListener((state) => getNested(state, ...path.split(`.`)));

    const setMethod = (value) => {
        putStorage(path, value);
    };

    return [value, setMethod, path];
};

export const StorageProvider = ({ children, defaultStorage = {} }) => {
    useEffect(() => {
        window.storage = defaultStorage;
    }, [defaultStorage]);
    return children;
};

/*eslint-enable*/
