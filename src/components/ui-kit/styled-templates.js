/*eslint-disable*/
import React, { Fragment, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import _ from "lodash";

import { createId, getElementClassPath, getElementParrentsPath, sleep } from "../../utils/common-helper";
import CaseHelper from "../../utils/case-helper";

import ImportInput from "./input";
import ImportTextarea from "./textarea";

import { EVENTS } from "../../constants/config";

import useOnClickOutside from "../../hooks/useOnClickOutside";
import useComponentSize from "../../hooks/useComponentSize";
import useEventListener from "../../hooks/useEventListener";
import { useStorageListener } from "../../hooks/useStorage";

export const Input = (props) => <ImportInput {...props} />;
export const Textarea = (props) => <ImportTextarea {...props} />;

export const Frame = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    transition: 0.2s;

    ${({ extra }) => extra}
`;

export const RowWrapper = styled(Frame)`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;

    ${({ extra }) => extra}
`;

export const H1 = styled(Frame)`
    width: auto !important;
    font-weight: bold;
    font-size: 24px;
    line-height: 24px;
    color: ${({ theme }) => theme.text.primary};

    ${({ extra }) => extra}
`;

export const Container = styled(Frame)`
    width: 100%;
    max-width: 1170px;
    min-width: 700px;

    min-height: min-content;
`;

/* CHECKBOX */

export const Checkbox = styled.input.attrs((props) => {
    return {
        ...props,
        type: `checkbox`,
    };
})`
    width: 16px;
    height: 16px;
    cursor: pointer;
`;

/* SWITCH */

const SwitchWrapper = styled(Frame)`
    position: relative;

    ${({ extra }) => extra}
`;

const SwitchKnob = styled.label`
    position: absolute;
    left: 0;
    width: 2.25em;
    height: 1.25em;
    border-radius: 15px;
    background: ${({ theme }) => theme.background.primary};
    border: 1px solid ${({ theme }) => theme.grey};
    cursor: pointer;
    transition: 0.2s;

    &::after {
        content: "";
        display: block;
        border-radius: 50%;
        width: 1em;
        height: 1em;
        background: ${({ theme }) => theme.grey};
        transition: 0.2s;
        position: absolute;
        top: 50%;
        transform: translate(2px, -50%);
    }
`;

const SwitchBox = styled.input`
    opacity: 0;
    z-index: 1;
    border-radius: 15px;
    width: 2.25em;
    height: 1em;
    &:checked + ${SwitchKnob} {
        background: ${({ theme }) => theme.green};
        border: 1px solid ${({ theme }) => theme.green};
        &::after {
            content: "";
            display: block;
            border-radius: 50%;
            width: 1em;
            height: 1em;
            transform: translate(calc(2.25em - 1em - 2px), -50%);
            transition: 0.2s;
            background: white;
        }
    }
`;

export const Switch = (props) => {
    const { name = `checkbox`, extra = `` } = props;
    return (
        <SwitchWrapper extra={extra}>
            <SwitchBox id={name} type={`checkbox`} {...props} />
            <SwitchKnob htmlFor={name} />
        </SwitchWrapper>
    );
};

/* FORM */

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 30%;
    min-width: 300px;
    align-items: flex-start;

    > * {
        /* width: 100%; */
        /* margin-bottom: 15px; */

        &:last-child {
            margin-bottom: 0;
        }
    }

    ${({ extra }) => extra}
`;

/* SPINNER */

export const Spinner = styled(Frame)`
    width: 18px;
    height: 18px;
    background: url("${require("../../assets/images/spinner.svg").default}") no-repeat center center / contain;

    ${({ extra }) => extra}
`;

/* CONTROL */

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
    const message = useStorageListener((state) => state?.formsErrors ?? {})?.[formName]?.[name]?.message;
    const value = useStorageListener((state) => state?.forms ?? {})?.[formName]?.[name] ?? ``;

    const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { value, formName, onChange: () => {} });
        }
        return child;
    });

    return (
        <Frame {...props} ref={controllerRef} extra={`align-items: flex-start;` + controlStyles}>
            <ControlLabel required={isRequired}>
                {label} {label ? `:` : ``}
            </ControlLabel>
            {childrenWithProps}
            <ErrorLabel>{CaseHelper.toSentance(message)}</ErrorLabel>
        </Frame>
    );
};

export const ControlLabel = styled(Frame)`
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
`;

export const ErrorLabel = styled(Frame)`
    color: ${(props) => props.theme.red};
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    height: 20px;
    margin-top: 5px;
    width: auto !important;
`;

export const Control = {
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
    Checkbox: (props) => {
        const { errors, name, onClick = () => {}, checked, label = `Check me`, extra = ``, controlStyles = `` } = props;
        return (
            <ControlWrapper {...props} extra={`flex-direction: row; align-items: center; > * { width: auto; };` + controlStyles}>
                <Checkbox checked={checked} onChange={() => {}} {...props} />
                <Frame extra={`margin-left: 5px;`}>{label}</Frame>
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

/* BUTTON */

const ASYNC_STATUSES = {
    REGULAR: `REGULAR`,
    PENDING: `PENDING`,
    SUCCESS: `SUCCESS`,
    ERROR: `ERROR`,
};

export const Button = (props) => {
    const { extendedIndicators = false, onClick, disabled = false, successLabel, errorLabel, extra = `` } = props;
    const [status, setStatus] = useState(ASYNC_STATUSES.REGULAR);

    const newExtra =
        ({
            [ASYNC_STATUSES.PENDING]: ({ theme }) => `background: ${theme.grey} !important;`,
            [ASYNC_STATUSES.SUCCESS]: ({ theme }) => `background: ${theme.green} !important;`,
            [ASYNC_STATUSES.ERROR]: ({ theme }) => `background: ${theme.red} !important;`,
        }?.[status] ?? ``) + extra;

    const newOnClick = async (e) => {
        if (!onClick) {
            return;
        }
        try {
            setStatus(`pending`);
            await onClick(e);
            setStatus(extendedIndicators ? ASYNC_STATUSES.SUCCESS : ASYNC_STATUSES.REGULAR);
        } catch (error) {
            setStatus(extendedIndicators ? ASYNC_STATUSES.ERROR : ASYNC_STATUSES.REGULAR);
        } finally {
            if (extendedIndicators) {
                await sleep(1000);
                setStatus(`retular`);
            }
        }
    };

    const newDisabled = disabled === true || [ASYNC_STATUSES.PENDING, ASYNC_STATUSES.SUCCESS, ASYNC_STATUSES.ERROR].includes(status);

    return (
        <ButtonWrapper {...props} extra={newExtra} onClick={newOnClick} disabled={newDisabled}>
            {{
                pending: <Spinner />,
                success: successLabel ?? `Success`,
                error: errorLabel ?? `Error`,
            }[status] ?? props?.children}
        </ButtonWrapper>
    );
};

export const ButtonWrapper = styled.button`
    color: white;
    font-weight: bold;
    font-size: inherit;
    padding: 8px 24px;
    min-width: 164px;
    border-radius: 4px;
    border: 0px;
    box-sizing: border-box;
    transition: 0.2s;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    ${({ variant, disabled }) =>
        (variant !== `outlined`) & !disabled &&
        css`
            box-shadow: 0px 4px 12px rgba(237, 105, 75, 0.15);
        `}

    &:hover {
        opacity: 0.8;
    }

    ${({ leftIcon, leftIconStyles = `` }) =>
        leftIcon &&
        css`
            &:before {
                content: "";
                width: 20px;
                height: 20px;
                margin-right: 8px;
                background: url("${require(`../../assets/icons/${leftIcon}.svg`).default}") no-repeat center center / contain;
                ${leftIconStyles}
            }
        `}

    ${(props) =>
        (() => {
            const { background = props.theme.blue, theme = {}, variant = `primary` } = props;
            return (
                {
                    contained: css`
                        background: ${_.get(theme, background) ?? background};
                    `,
                    outlined: css`
                        background: transparent;
                        border: 1px solid ${_.get(theme, background) ?? background};
                        color: ${_.get(theme, background) ?? background};
                    `,
                    plain: css`
                        background: transparent;
                        color: ${_.get(theme, background) ?? background};

                        &:hover {
                            background: ${({ theme }) => theme.background.secondary};
                        }
                    `,
                }?.[variant ?? `primary`] ??
                css`
                    background: ${_.get(theme, background) ?? background};
                `
            );
        })()}

    ${({ disabled }) =>
        disabled &&
        css`
            cursor: default;
            opacity: 0.5;
            &:hover {
                opacity: 0.5;
            }
        `}

    ${({ extra }) => extra}
`;

/* DROPDOWN */

const DropdownStyles = {
    Wrapper: styled(Frame)`
        position: relative;

        ${({ extra }) => extra}
    `,
    Toggle: styled(Frame).attrs((props) => {
        return {
            ...props,
            className: `dropdown-toggle`,
        };
    })``,
    Menu: styled(Frame).attrs((props) => {
        return {
            ...props,
            className: `dropdown-menu`,
        };
    })`
        padding: 10px;
        border-radius: 8px;
        background: ${({ theme }) => theme.background.primary};
        border: 1px solid ${({ theme }) => theme.background.secondary};

        position: absolute;
        top: ${({ toggleSize }) => toggleSize.height}px;
        right: 0;
        z-index: 2;
        visibility: ${({ visible }) => (visible ? `visible` : `hidden`)};
        opacity: ${({ visible }) => (visible ? 1 : 0)};
        transform: translate(0, ${({ visible }) => (visible ? 5 : -15)}px);

        ${({ extra }) => extra}
    `,
};

export const Dropdown = (props) => {
    const { toggle, menu, toggleStyles = ``, menuStyles = ``, wrapperStyles = ``, id, closeOnChildrenClick = true } = props;
    const [opened, setOpened] = useState(false);
    const menuRef = useRef();
    const toggleRef = useRef();
    const uniqueId = useRef(createId());
    useOnClickOutside(menuRef, (e) => {
        const isCurrentDropdown = e.path.map((i) => i.className?.includes?.(uniqueId.current)).filter((i) => i).length === 0;
        if (isCurrentDropdown) {
            setOpened(false);
        }
    });
    useEventListener(EVENTS.CLOSE_DROPDOWN, (d) => {
        if (!!id && id === d?.detail) {
            setOpened(false);
        }
    });
    const toggleSize = useComponentSize(toggleRef);
    const handleMenuItemClick = (e) => {
        if (
            getElementClassPath(e?.target)
                .filter((i, j) => j > 1)
                .find((i) => i?.includes(`dropdown-menu`)) &&
            closeOnChildrenClick
        ) {
            setOpened(false);
        }
    };
    const handleToggleClick = () => {
        setOpened(!opened);
    };
    return (
        <DropdownStyles.Wrapper extra={wrapperStyles} className={uniqueId.current}>
            <DropdownStyles.Toggle ref={toggleRef} extra={toggleStyles} onClick={handleToggleClick}>
                {toggle}
            </DropdownStyles.Toggle>
            <DropdownStyles.Menu ref={menuRef} visible={opened} extra={menuStyles} toggleSize={toggleSize} onClick={handleMenuItemClick}>
                {menu}
            </DropdownStyles.Menu>
        </DropdownStyles.Wrapper>
    );
};

/* BREADCRUMB */

const BreadcrumbWrapper = styled(RowWrapper)`
    flex-direction: row;
    justify-content: flex-start;
    padding: 20px 0;
    box-sizing: border-box;
`;

const BreadcrumbSeparator = styled(RowWrapper)`
    width: 15px;
    height: 15px;
    background: url("${require(`../../assets/icons/arrow-right.svg`).default}") no-repeat center center / contain;
    margin: 0 8px;
`;

export const Breadcrumb = {
    Wrapper: (props) => {
        return (
            <BreadcrumbWrapper>
                {(Array.isArray(props.children) ? Array.from(props.children ?? []) : [props.children])?.map?.((child, index, self) => (
                    <Fragment key={index}>
                        {child}
                        {index < self.length - 1 && <BreadcrumbSeparator />}
                    </Fragment>
                ))}
            </BreadcrumbWrapper>
        );
    },
    Item: styled(Link).attrs((props) => ({
        to: (location) => location.pathname,
        ...props,
    }))`
        ${({ theme, selected }) => selected && `color: ${theme.blue}; font-weight: 600;`}
    `,
};

/*eslint-enable*/
