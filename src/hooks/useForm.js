/*eslint-disable*/
import React, { useRef, useState } from "react";
import * as yup from 'yup';

import { isna, createId } from "../utils/common-helper";
import { Form } from "../components/ui-kit/styled-templates";

// TODO: Move validation to joi

const useForm = (options) => {

    const { schema, name } = options;

    if (isna(name)) {
        throw new Error(`useForm: name is undefined`);
    }

    const [errors, setErrors] = useState({});

    const onSubmit = (handleSubmit) => async (e) => {
        e.preventDefault();
        try {
            const data = Object.fromEntries(Object.values(e.target).filter((i) => !isna(i?.name)).map((i) => [i?.name, i?.value]));
            await schema(yup).validate(data, { abortEarly: false });
            setErrors({});
            handleSubmit(data);
        } catch (error) {
            setErrors(Object.fromEntries(error?.inner?.map?.(e => [e.path, { message: e.message }]) ?? []));
        }
    };

    return {
        errors,
        onSubmit,
        Form: (props) => {
            const { name = createId(), onSubmit: handleSubmit = () => { }, onChange: handleChange = () => { } } = props;
            return (
                <Form name={name} {...props} onSubmit={onSubmit(handleSubmit)} >
                    {props.children}
                </Form>
            )
        },
    }
};

export default useForm;
/*eslint-enable*/