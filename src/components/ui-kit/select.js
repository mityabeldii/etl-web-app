/*eslint-disable*/
import { useState } from "react";
import styled, { css } from "styled-components";

import Input from "./input";
import { Dropdown, Frame } from "./styled-templates";

import { convertHex } from "../../utils/colors-helper";
import { createId, togglePush } from "../../utils/common-helper";

import { eventDispatch } from "../../hooks/useEventListener";

const Select = (props) => {
    const { options = [], extra = ``, value, onChange = () => {}, multiselect = false, placeholder = `Select` } = props;
    const [dropdownId, setDropdownId] = useState(createId());
    return (
        <Dropdown
            id={dropdownId}
            wrapperStyles={extra}
            toggleStyles={css`
                width: 100%;
                * {
                    cursor: pointer;
                }
            `}
            menuStyles={css`
                width: calc(100% - 20px);
            `}
            toggle={
                <Input
                    value={value ?? ``}
                    readOnly
                    extra={css`
                        width: 100%;
                        background: ${({ theme }) => theme.background.secondary};
                        border: 1px solid ${({ theme }) => theme.grey};
                    `}
                    rightIcon={`select-arrow`}
                    placeholder={placeholder}
                />
            }
            menu={
                <>
                    {options.map((option, index) => {
                        return (
                            <Option
                                key={index}
                                onClick={() => {
                                    let newValue = value;
                                    if (multiselect) {
                                        if (!Array.isArray(newValue)) {
                                            newValue = [];
                                        }
                                        onChange({ target: { value: togglePush(newValue, option.value) } });
                                    } else {
                                        onChange({ target: { value: option.value } });
                                        eventDispatch(`CLOSE_DROPDOWN`, dropdownId);
                                    }
                                }}
                            >
                                {option.label}
                                {(value === option.value || value?.includes?.(option.value)) && <Check />}
                            </Option>
                        );
                    })}
                </>
            }
        />
    );
};

const Check = styled(Frame)`
    width: 15px;
    height: 15px;
    background: url("${require(`../../assets/icons/check.svg`).default}") no-repeat center center / contain;
`;

const Option = styled(Frame)`
    padding: 8px;
    box-sizing: border-box;
    width: 100%;
    border-radius: 4px;
    flex-direction: row;
    justify-content: space-between;
    cursor: pointer;

    > * {
        &:nth-child(2) {
            width: calc(100% - 15px);
        }
        &:nth-child(2) {
            width: calc(100% - 15px);
        }
    }

    &:hover {
        background: ${({ theme }) => convertHex(theme.grey, 0.2)};
    }
`;

export default Select;
/*eslint-enable*/
