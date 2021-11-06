/*eslint-disable*/
import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import _ from "lodash";

import { Checkbox, Frame, RowWrapper } from "./styled-templates";
import Input from "./input";
import Textarea from "./textarea";
import Select from "./select";

import { getElementParrentsPath } from "../../utils/common-helper";
import caseHelper from "../../utils/case-helper";

import { putStorage, useStorageListener } from "../../hooks/useStorage";

const useFormName = () => {
    const ref = useRef();
    const [formName, setFormName] = useState();
    useEffect(() => {
        setFormName(getElementParrentsPath(ref.current)?.find?.((i) => i?.nodeName === `FORM`)?.attributes?.name?.value);
    }, [ref]);
    return { controllerRef: ref, formName };
};

export const ControlWrapper = (props) => {
    const { name = ``, label = ``, isRequired = false, controlStyles = ``, children } = props;
    const { controllerRef, formName } = useFormName();
    const message = useStorageListener((state) => _.get(state, `formsErrors.${formName}.${name}.message`));
    const value = useStorageListener((state) => _.get(state, `forms.${formName}.${name}`) ?? ``);

    const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                value,
                formName,
                onChange: (e) => {
                    putStorage(`forms.${formName}.${name}`, e.target.value);
                },
            });
        }
        return child;
    });

    return (
        <Frame {...props} ref={controllerRef} extra={`align-items: flex-start;` + controlStyles}>
            <Control.Label required={isRequired}>
                {label} {label ? `:` : ``}
            </Control.Label>
            {childrenWithProps}
            <Control.Error>{caseHelper.toSentance(message)}</Control.Error>
        </Frame>
    );
};

const Cron = (props) => {
    const { value = {}, onChange = () => {} } = props;
    const { dayOfMonth = `*`, dayOfTheWeek = `*`, hours = `*`, minutes = `*`, month = `*` } = value;
    return (
        <Input
            {...props}
            value={`${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfTheWeek}`}
            onChange={(e) => {
                let newValue = e.target.value;
                while (newValue.indexOf(`  `) > 0) {
                    newValue = newValue.replace(/  /g, ` `);
                }
                if (newValue?.split(` `).length <= 5) {
                    const newEvent = {
                        target: {
                            value: Object.fromEntries(
                                newValue
                                    .split(` `)
                                    .map((value, index) => [[`minutes`, `hours`, `dayOfMonth`, `month`, `dayOfTheWeek`]?.[index], value])
                            ),
                        },
                    };
                    onChange(newEvent);
                }
            }}
        />
    );
};

export const Control = {
    Error: styled(Frame)`
        color: ${(props) => props.theme.red};
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        height: 20px;
        margin-top: 5px;
        width: auto !important;
    `,
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
    Input: (props) => {
        const { extra = `` } = props;
        return (
            <ControlWrapper {...props}>
                <Input {...props} extra={`width: 100%;` + extra} />
            </ControlWrapper>
        );
    },
    Textarea: (props) => {
        const { extra = `` } = props;
        return (
            <ControlWrapper {...props}>
                <Textarea {...props} extra={`width: 100%;` + extra} />
            </ControlWrapper>
        );
    },
    Password: (props) => {
        const { extra = `` } = props;
        return (
            <ControlWrapper {...props}>
                <Input type={`password`} {...props} extra={`width: 100%;` + extra} />
            </ControlWrapper>
        );
    },
    Select: (props) => {
        const { extra = `` } = props;
        return (
            <ControlWrapper {...props}>
                <Select {...props} extra={`width: 100%;` + extra} />
            </ControlWrapper>
        );
    },
    Cron: (props) => {
        const { extra = `` } = props;
        return (
            <ControlWrapper {...props}>
                <Input {...props} extra={`width: 100%;` + extra} />
            </ControlWrapper>
        );
    },
    Checkbox: (props) => {
        const { errors, name, onClick = () => {}, checked, label = `Check me`, extra = `` } = props;
        return (
            <ControlWrapper {...props}>
                <Frame extra={`flex-direction: row; > * { width: auto; };`}>
                    <Checkbox checked={checked} onChange={() => {}} {...props} />
                    <Frame extra={`margin-left: 5px;`}>{label}</Frame>
                </Frame>
            </ControlWrapper>
        );
    },
    Row: (props) => {
        const { children, extra } = props;
        return (
            <RowWrapper
                extra={
                    css`
                        > * {
                            width: 100%;
                            flex: 1;
                            margin-right: 16px;
                            &:last-child {
                                margin-right: unset;
                            }
                        }
                    ` + extra
                }
            >
                {children}
            </RowWrapper>
        );
    },
};
/*eslint-enable*/
