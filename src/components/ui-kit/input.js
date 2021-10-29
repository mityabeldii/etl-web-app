/*eslint-disable*/
import React, { useState } from "react";
import styled, { css } from "styled-components";

const Input = (props) => {
    const { type = `text`, extra = ``, rightIcon, rightIconStyles = ``, leftIcon, leftIconStyles = `` } = props;
    const [passwordVisible, setPasswordVisible] = useState(false);
    return (
        <Span type={type} extra={extra}>
            {leftIcon && <Icon src={leftIcon} extra={`right: unset; left: 5px;` + leftIconStyles} />}
            <StyledInput {...props} type={type === `password` && passwordVisible ? `text` : type} />
            {type === `password` ? (
                <Eye
                    opened={passwordVisible}
                    onClick={() => {
                        setPasswordVisible(!passwordVisible);
                    }}
                />
            ) : rightIcon ? (
                <Icon src={rightIcon} extra={rightIconStyles} />
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
    cursor: pointer;

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
    position: relative;

    ${(props) => props.extra}

    border: unset;
    padding: unset;
`;

export const StyledInput = styled.input`
    &:focus {
        outline: none;
    }

    width: 100%;
    height: 100%;
    padding: 7px 20px;
    border-radius: 4px;
    border: 1px solid #dadada;
    background: ${({ theme }) => theme.background.secondary};
    color: ${({ theme }) => theme.text.primary};
    display: flex;
    flex: 1;
    margin: 0;
    font-size: inherit;

    ${({ readOnly }) =>
        readOnly &&
        css`
            cursor: default;
            background: #ebebeb;
            color: #67686D;
        `}

    ::-webkit-input-placeholder {
        color: ${({ theme }) => theme.text.secondary};
    }
    :-ms-input-placeholder {
        color: ${({ theme }) => theme.text.secondary};
    }

    ${({ rightIcon }) => rightIcon && `padding-right: 30px;`}

    ${({ extra }) => extra}
`;

export default Input;
/*eslint-enable*/
