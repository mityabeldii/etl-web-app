/*eslint-disable*/
import { useState, useEffect, useRef, useMemo, useCallback, Children, isValidElement, cloneElement, useImperativeHandle } from "react";
import styled, { css } from "styled-components";
import _ from "lodash";

import { Checkbox, Frame, RowWrapper } from "./styled-templates";
import Input from "./input";
import Textarea from "./textarea";
import Select from "./select";

import { getElementParrentsPath } from "../../utils/common-helper";
import caseHelper from "../../utils/case-helper";

import { getStorage, putStorage, useStorageListener } from "../../hooks/useStorage";
import useFormControl from "../../hooks/useFormControl";

const useFormName = () => {
    const ref = useRef();
    const [attributes, setAttributes] = useState();
    useEffect(() => {
        setAttributes(getElementParrentsPath(ref.current)?.find?.((i) => i?.nodeName === `FORM`)?.attributes ?? {});
    }, [ref]);
    return { controlRef: ref, formName: attributes?.name?.value, readOnly: attributes?.readonly?.value === ``, attributes };
};

export const Control = {
    Row: styled(Frame)`
        width: 100%;
        flex-direction: row;
        justify-content: flex-start;

        > * {
            margin-right: 16px;
            &:last-child {
                margin-right: unset;
            }
        }
    `,
    Wrapper: ({ children, name, label, isRequired: required = false, extra = `` }) => {
        const { controlRef, formName } = useFormName();
        const { readOnly } = useFormControl({ name: formName });
        const value = useStorageListener((state) => _.get(state, `forms.${formName}.values.${name}`));
        const error = useStorageListener((state) => _.get(state, `forms.${formName}.errors.${name}`));
        const onChange = (e) => {
            putStorage(`forms.${formName}.values.${name}`, e.target.value);
        };
        return (
            <Frame ref={controlRef} extra={`width: 100%; align-items: flex-start;` + extra}>
                <Control.Label required={required}>{label}</Control.Label>
                {Children.map(children, (child) => {
                    return isValidElement(child)
                        ? cloneElement(child, {
                              value: child?.props?.value ?? getStorage((state) => _.get(state, `forms.${formName}.values.${name}`)) ?? ``,
                              onChange: (e) => {
                                  child?.props?.onChange?.(e);
                                  onChange(e);
                              },
                              readOnly: readOnly || child?.props?.readOnly,
                              extra: `width: 100%; flex: 1;` + (child?.props.extra ?? ``),
                          })
                        : child;
                })}
                <Control.Error>{error?.message}</Control.Error>
            </Frame>
        );
    },
    Input: (props) => {
        return (
            <Control.Wrapper {...props}>
                <Input {...props} />
            </Control.Wrapper>
        );
    },
    Textarea: (props) => {
        return (
            <Control.Wrapper {...props}>
                <Textarea {...props} />
            </Control.Wrapper>
        );
    },
    Password: (props) => {
        return (
            <Control.Wrapper {...props}>
                <Input type={`password`} {...props} />
            </Control.Wrapper>
        );
    },
    Cron: (props) => {
        return (
            <Control.Wrapper {...props}>
                <Input {...props} />
            </Control.Wrapper>
        );
    },
    Select: (props) => {
        return (
            <Control.Wrapper {...props}>
                <Select {...props} />
            </Control.Wrapper>
        );
    },
    Checkbox: (props) => {
        const { checked, label = `Check me` } = props;
        return (
            <Control.Wrapper {...props}>
                <Frame extra={`flex-direction: row; justify-content: flex-start; > * { width: auto; };`}>
                    <Checkbox checked={checked} onChange={() => {}} {...props} />
                    <Frame extra={`margin-left: 5px;`}>{label}</Frame>
                </Frame>
            </Control.Wrapper>
        );
    },
    Label: styled(Frame)`
        color: ${({ theme }) => theme.text.primary};
        margin-bottom: 8px;
        width: auto !important;
        flex-direction: row;
        font-size: 14px;
        line-height: 20px;

        ${({ theme, required = false }) =>
            required &&
            css`
                &:after {
                    content: "*";
                    margin-left: 5px;
                    color: ${theme.red};
                }
            `}
    `,
    Error: styled(Frame)`
        color: ${(props) => props.theme.red};
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        height: 20px;
        margin-top: 5px;
        width: auto !important;
    `,
};
/*eslint-enable*/
