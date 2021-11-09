/*eslint-disable*/
import {} from "react";
import _ from "lodash";
import * as yup from "yup";

import { getStorage, putStorage, omitStorage, useStorageListener } from "./useStorage";

const useFormControl = ({ name, schema }) => {
    const data = useStorageListener((state) => _.get(state, `forms.${name}.values`)) ?? ``;
    const setErrors = (errors) => {
        putStorage(`forms.${name}.errors`, errors);
    };
    const clearErrors = () => {
        omitStorage(`forms.${name}.errors`);
    };
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
            setErrors(Object.fromEntries(error?.inner?.map?.((e) => [e?.path, { message: e?.message }]) ?? []));
        }
    };
    const clearForm = () => {
        omitStorage(`forms.${name}`);
    };
    const setValue = (path, value) => {
        putStorage(`forms.${name}.values.${path}`, value);
    };
    const removeValue = (value) => {
        (Array.isArray(value) ? value : [value]).forEach((i) => {
            omitStorage(`forms.${name}.values.${i}`);
        });
    };
    return {
        data,
        setValue,
        removeValue,
        onSubmit,
        setErrors,
        clearErrors,
        clearForm,
    };
};

export default useFormControl;
/*eslint-enable*/
