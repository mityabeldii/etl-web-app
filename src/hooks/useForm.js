/*eslint-disable*/
import React, { useRef, useState } from "react";
import * as yup from "yup";

import { isna, createId } from "../utils/common-helper";
import { Form } from "../components/ui-kit/styled-templates";
import { putStorage, useStorageListener } from "./useStorage";

// TODO: Move validation to joi

const useForm = (options) => {
    const { schema, name } = options;

    if (isna(name)) {
        throw new Error(`useForm: name is undefined`);
    }

    const errors = useStorageListener((state) => state?.formsErrors ?? {})?.[name] ?? {};
    const setErrors = (newValue) => {
        putStorage(`formsErrors.${name}`, newValue);
    };

    const onSubmit = (handleSubmit) => async (e) => {
        e.preventDefault();
        try {
            const data = Object.fromEntries(
                Object.values(e.target)
                    .filter((i) => !isna(i?.name))
                    .map((i) => [i?.name, i?.value])
            );
            await schema(yup).validate(data, { abortEarly: false });
            setErrors({});
            handleSubmit(data);
        } catch (error) {
            setErrors(Object.fromEntries(error?.inner?.map?.((e) => [e.path, { message: e.message }]) ?? []));
        }
    };

    const onChange = (handleChange) => (e) => {
        if (!!e.target.name) {
            putStorage(`forms.${name}.${e.target.name}`, e.target.value);
            handleChange(e);
        }
    };

    const setValue = (path, value) => {
        putStorage(`forms.${name}.${path}`, value);
    };

    const clearForm = () => {
        putStorage(`forms.${name}`, {});
        putStorage(`formsErrors.${name}`, {});
    };

    return {
        errors,
        onSubmit,
        setValue,
        clearForm,
        Form: (props) => {
            const { onSubmit: handleSubmit = () => {}, onChange: handleChange = () => {} } = props;
            return (
                <Form {...props} name={name} onChange={onChange(handleChange)} onSubmit={onSubmit(handleSubmit)}>
                    {props.children}
                </Form>
            );
        },
    };
};

export default useForm;
/*eslint-enable*/
