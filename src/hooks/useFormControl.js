/*eslint-disable*/
import { useEffect } from "react";
import _ from "lodash";
import * as yup from "yup";

import { objectNested } from "../utils/common-helper";

import { getStorage, putStorage, omitStorage, useStorageListener, mergeStorage } from "./useStorage";
import { eventDispatch } from "./useEventListener";

const useFormControl = ({ name, schema }) => {
    // READ ONLY
    const readOnly = useStorageListener((state) => _.get(state, `forms.${name}.readOnly`)) === true;
    const setReadOnly = (newValue) => {
        if (!!name) {
            putStorage(`forms.${name}.readOnly`, newValue);
        }
    };

    // DATA
    const data = useStorageListener((state) => _.get(state, `forms.${name}.values`)) ?? ``;
    const getValue = (field) => _.get(data, field);
    const setValue = (path, value) => {
        if (!!name && !!path) {
            putStorage(`forms.${name}.values.${path}`, value);
        }
    };
    const setValues = (values) => {
        if (!_.isObject(values)) {
            throw new Error(`[useFormControl] values must be an object`);
        }
        if (!!name) {
            mergeStorage(`forms.${name}.values`, values);
        }
    };
    const removeValue = (value) => {
        (Array.isArray(value) ? value : [value]).forEach((i) => {
            omitStorage(`forms.${name}.values.${i}`);
        });
    };
    const clearForm = () => {
        omitStorage(`forms.${name}`);
    };

    // ERRORS
    const setErrors = (errors) => {
        putStorage(`forms.${name}.errors`, errors);
    };
    const clearErrors = () => {
        omitStorage(`forms.${name}.errors`);
    };

    // SUBMIT
    const onSubmit = (handleSubmit) => async (e) => {
        try {
            e?.preventDefault?.();
            const data = getStorage((state) => _.get(state, `forms.${name}.values`) ?? {});
            if (schema) {
                await schema(yup, data).validate(data, { abortEarly: false });
                setErrors({});
            }
            handleSubmit(data);
        } catch (error) {
            console.warn(error);
            console.warn(`Form validation error`, Object.fromEntries(error?.inner?.map?.((e) => [e?.path, { message: e?.message }]) ?? []));
            setErrors(objectNested(Object.fromEntries(error?.inner?.map?.((e) => [e?.path, { message: e?.message }]) ?? [])));
            error?.inner?.forEach(({ path, message }) => eventDispatch(`THROW_ERROR`, `${path}: ${message}`));
        }
    };

    return {
        data,
        getValue,
        setValue,
        setValues,
        removeValue,
        onSubmit,
        setErrors,
        clearErrors,
        clearForm,
        readOnly,
        setReadOnly,
    };
};

export default useFormControl;
/*eslint-enable*/
