/*eslint-disable*/
import React, { Fragment, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

import { createId, getElementClassPath, sleep } from "../../utils/common-helper";

import ImportInput from "./input";

import useOnClickOutside from "../../hooks/useOnClickOutside";
import useComponentSize from "../../hooks/useComponentSize";
import useEventListener from "../../hooks/useEventListener";
import { EVENTS } from "../../constants/config";

export const Input = (props) => <ImportInput {...props} />;

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
    font-size: 28px;
    font-weight: 500;
    margin-bottom: 15px;
    color: ${(props) => props.theme.blue};
    width: auto !important;

    ${({ extra }) => extra}
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
        width: 100%;
        margin-bottom: 15px;

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

export const ControlWrapper = (props) => {
    const { error, extra = `` } = props;
    return (
        <Frame {...props} extra={`margin-bottom: 15px; align-items: flex-start; > * { width: 100%; };` + extra}>
            {props.children}
            <ErrorLabel>{error}</ErrorLabel>
        </Frame>
    );
};

export const ErrorLabel = styled(Frame)`
    color: ${(props) => props.theme.red};
    width: auto !important;
`;

export const Control = {
    Input: (props) => {
        const { errors, name } = props;
        return (
            <ControlWrapper error={errors?.[name]?.message}>
                <Input {...props} />
            </ControlWrapper>
        );
    },
    Password: (props) => {
        const { errors, name } = props;
        return (
            <ControlWrapper error={errors?.[name]?.message}>
                <Input type={`password`} {...props} />
            </ControlWrapper>
        );
    },
    Checkbox: (props) => {
        const { errors, name, onClick = () => {}, checked, label = `Check me`, extra = `` } = props;
        return (
            <ControlWrapper
                error={errors?.[name]?.message}
                extra={`flex-direction: row; align-items: center; > * { width: auto; };` + extra}
                onClick={onClick}
            >
                <Checkbox checked={checked} onChange={() => {}} {...props} />
                <Frame extra={`margin-left: 5px;`}>{label}</Frame>
            </ControlWrapper>
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
            [ASYNC_STATUSES.PENDING]: ({theme}) => `background: ${theme.grey} !important;`,
            [ASYNC_STATUSES.SUCCESS]: ({theme}) => `background: ${theme.green} !important;`,
            [ASYNC_STATUSES.ERROR]: ({theme}) => `background: ${theme.red} !important;`,
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
    padding: 8px 8px;
    min-width: 164px;
    border-radius: 4px;
    border: 0px;
    box-sizing: border-box;
    transition: 0.2s;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        opacity: 0.8;
    }

    ${({ leftIcon }) =>
        leftIcon &&
        css`
            &:before {
                content: "";
                width: 20px;
                height: 20px;
                background: url("${require(`../../assets/icons/${leftIcon}.svg`).default}") no-repeat center center / contain;
            }
        `}

    ${(props) =>
        (() => {
            const { background = props.theme.blue, theme = {}, variant = `primary` } = props;
            return (
                {
                    contained: css`
                        background: ${background};
                    `,
                    outlined: css`
                        background: transparent;
                        border: 1px solid ${background};
                        color: ${background};
                    `,
                    plain: css`
                        background: ${theme.background.support};
                        color: ${background};
                    `,
                }?.[variant ?? `primary`] ??
                css`
                    background: ${background};
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
