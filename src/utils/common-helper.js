/*eslint-disable*/
import _ from "lodash";

const CommonHelper = {
    linkTo(patientUrl, withScroll = true) {
        const url = window.location.origin + window.location.pathname + "#" + patientUrl;
        // let url = window.location.origin + window.location.pathname + patientUrl;
        window.location.href = url;
        if (withScroll) {
            try {
                document.getElementById(`scrollWrapper`).scrollTo({ top: 0, behavior: "smooth" });
            } catch (error) {}
            try {
                window.scrollTo({ top: 0, behavior: "smooth" });
            } catch (error) {}
        }
    },

    downloadFile(filename, text) {
        let element = document.createElement("a");
        element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
        element.setAttribute("download", filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },

    downloadURI(uri, name) {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    async copyToClipboard(text) {
        if (window?.clipboardData?.setData) {
            return window?.clipboardData?.setData?.("Text", text);
        }
        if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    },

    objectStringToPath: (path) => {
        return (
            path
                ?.replaceAll?.(`[`, `.`)
                ?.replaceAll?.(/[\?\]\"\'\`]/g, ``)
                ?.replaceAll?.(`..`, `.`)
                ?.split?.(`.`)
                ?.filter?.((i) => i?.length) ?? []
        );
    },

    objectPut: (obj, stringPath, val) => {
        _.set(obj, stringPath, val);
    },

    objectMerge: (obj, path, val) => {
        // Source: https://vanillajstoolkit.com/helpers/put/
        path = CommonHelper.objectStringToPath(path);
        let length = path.length;
        let current = obj;
        path.forEach((key, index) => {
            let isArray = key.slice(-2) === "[]";
            key = isArray ? key.slice(0, -2) : key;
            if (isArray && !Array.isArray(current[key])) {
                current[key] = [];
            }
            if (index === length - 1) {
                if (isArray) {
                    current[key] = [...current[key], ...val];
                } else {
                    current[key] = { ...current[key], ...val };
                }
            } else {
                if (!current[key]) {
                    current[key] = {};
                }
                current = current[key];
            }
        });
    },

    objectGet: (obj, path) => {
        return _.get(obj, path);
    },

    objectCopy: (obj) => _.cloneDeep(obj),

    objectCompare: (o1, o2) => _.isEqual(o1, o2),

    format: (value, pattern) => {
        let i = 0,
            v = value?.toString();
        return pattern?.replace(/#/g, (_) => v?.[i++] ?? ``);
    },

    QSToObject: (search) => {
        return JSON.parse(
            ('{"' + decodeURI(search.replace(/^\?/, "")).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}').replace(/""/g, "")
        );
    },

    objectToQS: (obj = {}) => `?` + new URLSearchParams(obj).toString(),

    debounce: (f, ms = 150) => {
        let isCooldown = false;
        return () => {
            if (isCooldown) return;
            f.apply(this, arguments);
            isCooldown = true;
            setTimeout(() => (isCooldown = false), ms);
        };
    },

    getElementClassPath: (element) => {
        let path = [];
        path.push(element?.className);
        const goToParent = (element) => {
            path.push(element?.className);
            if (element?.parentNode) {
                goToParent(element?.parentNode);
            }
        };
        goToParent(element);
        return path;
    },
};

export default CommonHelper;

export const {
    objectToQS,
    QSToObject,
    copyToClipboard,
    objectPut,
    objectMerge,
    objectGet,
    objectCopy,
    format,
    linkTo,
    debounce,
    downloadURI,
    objectCompare,
    getElementClassPath,
} = CommonHelper;

export const isna = (item) => [undefined, null, ``].includes(item);

export const path = (s) => {
    if (Array.isArray(s)) {
        s = s[0];
    }
    if (typeof s !== `string`) {
        throw new Error(`path should be a string`);
    }
    let [stringPath, exeption] = s.split(` ?? `);
    return (ref) => CommonHelper.objectGet(ref, CommonHelper.objectStringToPath(stringPath).slice(1).join(`.`)) ?? exeption;
};

export let getType = (obj) =>
    ({}?.toString
        ?.call?.(obj)
        ?.match?.(/\s([a-zA-Z]+)/)?.[1]
        ?.toLowerCase?.());

export let createId = () =>
    Math.random()
        .toString(36)
        .substring(3)
        .split(``)
        .map((i) => i[Math.random() > 0.5 ? `toLowerCase` : `toUpperCase`]())
        .join(``);

export let sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export let validateOnlyDigits = (s) => /^\d+$/.test(s || `0`);

export let togglePush = (array = [], value) => [...array, value].filter((i) => (array?.includes?.(value) ? i !== value : true));

/*eslint-enable*/
