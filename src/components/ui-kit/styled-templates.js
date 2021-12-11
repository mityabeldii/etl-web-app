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
    font-weight: bold;
    font-size: 24px;
    line-height: 24px;
    color: ${({ theme }) => theme.text.primary};

    ${({ extra }) => extra}
`;

export const H2 = styled(Frame)`
    color: ${({ theme }) => theme.text.primary};
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;

    ${({ extra }) => extra}
`;

export const H3 = styled(Frame)`
    color: ${({ theme }) => theme.text.primary};
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;

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
    width: 20px;
    height: 20px;
    background: ${({ theme }) => theme.background.secondary};
    border: 1px solid #c0c0c0;
    border-radius: 4px;
    cursor: pointer;
`;

/* SWITCH */

// const SwitchWrapper = styled(Frame)`
//     position: relative;
//     * {
//         cursor: pointer;
//     }

//     ${({ disabled = false }) =>
//         disabled &&
//         css`
//             * {
//                 cursor: default;
//             }
//         `}

//     ${({ extra }) => extra}
// `;

// const SwitchKnob = styled.label`
//     position: absolute;
//     left: 0;
//     width: 2.25em;
//     height: 1.25em;
//     border-radius: 15px;
//     background: ${({ theme }) => theme.background.primary};
//     border: 1px solid ${({ theme }) => theme.grey};
//     cursor: pointer;
//     transition: 0.2s;
//     background: ${({ theme }) => theme.grey};

//     &::after {
//         content: "";
//         display: block;
//         border-radius: 50%;
//         width: 1em;
//         height: 1em;
//         transition: 0.2s;
//         position: absolute;
//         top: 50%;
//         transform: translate(2px, -50%);
//         background: white;
//     }
// `;

// const SwitchBox = styled.input`
//     opacity: 0;
//     z-index: 1;
//     border-radius: 15px;
//     width: 2.25em;
//     height: 1em;
//     &:checked + ${SwitchKnob} {
//         background: ${({ theme }) => theme.blue};
//         border: 1px solid ${({ theme }) => theme.blue};
//         &::after {
//             content: "";
//             display: block;
//             border-radius: 50%;
//             width: 1em;
//             height: 1em;
//             transform: translate(calc(2.25em - 1em - 2px), -50%);
//             transition: 0.2s;
//             background: white;
//         }
//     }
// `;

// export const Switch = (props) => {
//     const { name = `checkbox`, extra = `` } = props;
//     console.log(props);
//     return (
//         <SwitchWrapper extra={extra}>
//             <SwitchBox id={name} type={`checkbox`} {...props} />
//             <SwitchKnob htmlFor={name} />
//         </SwitchWrapper>
//     );
// };

const SwitchWrapper = styled(Frame)`
    position: relative;
    width: 2.25em;
    height: 1.25em;
    border-radius: 1em;
    background: ${({ theme, checked = false }) => (checked ? theme.blue : theme.grey)};
    cursor: ${({ disabled = false }) => (disabled ? `default` : `pointer`)};
    &:after {
        content: "";
        transition: 0.2s;
        width: 1em;
        height: 1em;
        background: white;
        border-radius: 1em;
        position: absolute;
        ${({ checked = false }) => (checked ? `right` : `left`)}: 0.125em;
    }
`;

export const Switch = (props) => {
    const { name = `checkbox`, extra = ``, checked = false, onChange = () => {} } = props;
    return <SwitchWrapper onClick={onChange} checked={checked} />;
};

/* FORM */

export const Form = styled.form`
    width: 100%;
    align-items: flex-start;

    ${({ extra }) => extra}
`;

/* SPINNER */

export const Spinner = styled(Frame)`
    width: 18px;
    height: 18px;
    background: url("${require("../../assets/images/spinner.svg").default}") no-repeat center center / contain;

    ${({ extra }) => extra}
`;

/* BUTTON */

const ASYNC_STATUSES = {
    REGULAR: `REGULAR`,
    PENDING: `PENDING`,
    SUCCESS: `SUCCESS`,
    ERROR: `ERROR`,
};

export const Button = (props) => {
    const { extendedIndicators = false, onClick, disabled = false, successLabel, errorLabel, extra = ``, leftIcon, type = `button` } = props;
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
        <ButtonWrapper {...props} extra={newExtra} onClick={newOnClick} disabled={newDisabled} leftIcon={leftIcon} type={type}>
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

    ${({ leftIcon }) =>
        leftIcon &&
        css`
            &:before {
                content: "";
                width: 10px;
                height: 10px;
                background: url("${require(`../../assets/icons/${leftIcon}.svg`).default}") no-repeat center center / contain;
            }
        `}

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
        flex: 1;
        overflow: auto;
        width: inherit;

        position: absolute;
        ${({ direction, toggleSize }) =>
            ({
                down: css`
                    top: ${({ toggleSize }) => toggleSize.height}px;
                `,
                up: css`
                    bottom: ${({ toggleSize }) => toggleSize.height}px;
                `,
            }?.[direction ?? `down`])}
        right: 0;
        z-index: 2;
        visibility: ${({ visible }) => (visible ? `visible` : `hidden`)};
        opacity: ${({ visible }) => (visible ? 1 : 0)};
        transform: translate(0, ${({ visible, direction = `down` }) => (visible ? { down: 5, up: -5 }?.[direction] : -15)}px);

        padding: 10px;
        border-radius: 8px;
        background: ${({ theme }) => theme.background.primary};
        border: 1px solid ${({ theme }) => theme.background.secondary};
        box-sizing: border-box;
        filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.05));

        ${({ extra }) => extra}
    `,
    ScrollWrapper: styled.div`
        width: 100%;
        display: flex;
        flex-direction: column;
        min-height: min-content;
        max-height: 400px;

        ${({ extra }) => extra}
    `,
};

export const Dropdown = (props) => {
    const {
        toggle,
        menu,
        toggleStyles = ``,
        menuStyles = ``,
        wrapperStyles = ``,
        scrollWrapperStyles = ``,
        id,
        closeOnChildrenClick = true,
        callable = true,
    } = props;
    const [opened, setOpened] = useState(false);
    const menuRef = useRef();
    const toggleRef = useRef();
    const uniqueId = useRef(createId());
    const [direction, setDirection] = useState(`down`);
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
    useEffect(() => {
        setDirection(
            window?.outerHeight - (menuRef.current.getBoundingClientRect().y + window.scrollY) - toggleRef?.current?.clientHeight >
                menuRef?.current?.clientHeight
                ? `down`
                : `up`
        );
    }, [menuRef, toggleRef]);
    const toggleSize = useComponentSize(toggleRef);
    const handleMenuItemClick = (e) => {
        if (
            getElementClassPath(e?.target)
                .filter((i, j) => j > 1)
                .find((i) => i?.includes(`dropdown-menu`)) &&
            closeOnChildrenClick
        ) {
            // setOpened(false);
        }
    };
    const handleToggleClick = (event) => {
        if (!callable) return;
        setOpened(!opened);
        setDirection(window?.outerHeight - event?.screenY - toggleRef?.current?.clientHeight > menuRef?.current?.clientHeight ? `down` : `up`);
    };
    return (
        <DropdownStyles.Wrapper extra={wrapperStyles} className={uniqueId.current}>
            <DropdownStyles.Toggle ref={toggleRef} extra={toggleStyles} onClick={handleToggleClick}>
                {toggle}
            </DropdownStyles.Toggle>
            <DropdownStyles.Menu
                ref={menuRef}
                visible={opened}
                toggleSize={toggleSize}
                onClick={handleMenuItemClick}
                direction={direction}
                extra={menuStyles}
            >
                <DropdownStyles.ScrollWrapper extra={scrollWrapperStyles}>{menu}</DropdownStyles.ScrollWrapper>
            </DropdownStyles.Menu>
        </DropdownStyles.Wrapper>
    );
};

const Div = styled.div`
    ${({ extra }) => extra}
`;

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
    Item: styled(Link).attrs((props) => {
        return {
            to: (location) => location.pathname,
            ...props,
        };
    })`
        ${({ theme, selected }) => selected && `color: ${theme.blue}; font-weight: 600;`}
    `,
};

export const Br = styled(Frame)`
    width: 100%;
    height: 1px;
    background: #ededed;
    margin: 10px 0 25px 0;
`;

export const MappingArrow = styled(Frame)`
    width: 16px;
    height: 16px;
    margin-top: 20px;
    background: url("${require(`../../assets/icons/mapping-arrow.svg`).default}") no-repeat center center / contain;
`;

export const RemoveRowButton = (props) =>
    props.mode !== `view` && (
        <Button
            background={`orange`}
            leftIcon={`cross-white`}
            {...props}
            extra={`padding: 9px; &:before { margin: 0; }; min-width: unset; width: auto; flex: unset; ${props?.extra ?? ``}`}
        />
    );

export const ErrorBox = styled(Frame)`
    width: 100%;
    padding: 18px 32px;
    box-sizing: border-box;
    background: #f6dfdf;
    border: 1px solid ${({ theme }) => theme.red};
    border-radius: 4px;
    color: ${({ theme }) => theme.red};
    margin-bottom: 25px;
    font-size: 12px;
    line-height: 16px;
`;

/*eslint-enable*/
