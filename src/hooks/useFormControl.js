/*eslint-disable*/
import {} from "react";
import _ from "lodash";
import * as yup from "yup";

import { getStorage, putStorage, omitStorage, useStorageListener } from "./useStorage";
import { useEffect } from "react/cjs/react.development";

const useFormControl = ({ name, schema, readOnly: defaultReadOnly = false }) => {
    // READ ONLY
    const readOnly = useStorageListener((state) => _.get(state, `forms.${name}.readOnly`)) ?? defaultReadOnly ?? false;
    const setReadOnly = (newValue) => {
        putStorage(`forms.${name}.readOnly`, newValue);
    };
    // useEffect(() => {
    //     setReadOnly(defaultReadOnly);
    // }, [defaultReadOnly]);

    // DATA
    const data = useStorageListener((state) => _.get(state, `forms.${name}.values`)) ?? ``;
    const setValue = (path, value) => {
        putStorage(`forms.${name}.values.${path}`, value);
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
                await schema(yup).validate(data, { abortEarly: false });
                setErrors({});
            }
            handleSubmit(data);
        } catch (error) {
            console.error(`Form validation error`, Object.fromEntries(error?.inner?.map?.((e) => [e?.path, { message: e?.message }]) ?? []));
            setErrors(Object.fromEntries(error?.inner?.map?.((e) => [e?.path, { message: e?.message }]) ?? []));
        }
    };

    return {
        data,
        setValue,
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
