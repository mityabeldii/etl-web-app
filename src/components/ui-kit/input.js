/*eslint-disable*/
import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import _ from "lodash";

const Input = (props) => {
    const { type = `text`, extra = ``, leftIcon, leftIconStyles = ``, rightIcon = {}, leftContent = null, name, value } = props;
    const [passwordVisible, setPasswordVisible] = useState(false);
    return (
        <Span type={type} extra={extra}>
            {leftIcon && <Icon src={leftIcon} extra={`right: unset; left: 5px;` + leftIconStyles} />}
            {leftContent}
            <StyledInput {..._.omit(props, `extra`)} type={type === `password` && passwordVisible ? `text` : type} />
            {type === `password` ? (
                <Eye opened={passwordVisible} onClick={() => setPasswordVisible(!passwordVisible)} />
            ) : rightIcon?.src ? (
                <Icon {...rightIcon} />
            ) : null}
        </Span>
    );
};

const Icon = styled.div`
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background: url("${({ src }) => require(`../../assets/icons/${src}.svg`).default}") no-repeat center center / contain;
    cursor: inherit;

    ${({ extra }) => extra}
`;

const Eye = styled.div`
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background: url("${(props) => require(`../../assets/icons/eye-${props.opened ? `on` : `off`}.svg`).default}") no-repeat center center / contain;
    cursor: pointer;
`;

const Span = styled.span`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    position: relative;

    ${(props) => props.extra}

    border: unset;
    padding: unset;

    border-radius: 4px;
    border: 1px solid #dadada;
    background: ${({ theme }) => theme.background.secondary};

    box-sizing: border-box;

    ${({ rightIcon }) => rightIcon && `padding-right: 30px;`}

    ${({ extra }) => extra}
`;

export const StyledInput = styled.input`
    &:focus {
        outline: none;
    }

    width: 100%;
    height: 100%;
    /* padding: 7px 20px; */
    /* border-radius: 4px; */
    /* border: 1px solid #dadada; */
    /* background: ${({ theme }) => theme.background.secondary}; */
    color: ${({ theme }) => theme.text.primary};
    display: flex;
    flex: 1;
    margin: 0;
    font-size: inherit;

    border: unset;
    background: transparent;
    padding: 7px 20px;

    ::-webkit-input-placeholder {
        color: ${({ theme }) => theme.text.secondary};
    }
    :-ms-input-placeholder {
        color: ${({ theme }) => theme.text.secondary};
    }

    ${({ readOnly }) =>
        readOnly &&
        css`
            cursor: default;
            background: #ebebeb;
            color: #67686d;
        `}

    ${({ inputExtra }) => inputExtra}
`;

export default Input;
/*eslint-enable*/
