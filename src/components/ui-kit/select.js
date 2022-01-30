/*eslint-disable*/
import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import _ from "lodash";

import Input from "./input";
import { Dropdown, Frame } from "./styled-templates";

import { convertHex } from "../../utils/colors-helper";
import { createId, stringImposition, togglePush } from "../../utils/common-helper";

import { eventDispatch } from "../../hooks/useEventListener";

const Select = (props) => {
    const {
        name,
        options = [],
        extra = ``,
        value,
        onChange = () => {},
        multiselect = false,
        placeholder = `Выберите из списка`,
        readOnly = false,
        toggleComponent: ToggleComponent,
        allowSearch = false,
    } = props;
    const [dropdownId, setDropdownId] = useState(createId());
    const [search, setSearch] = useState(``);
    const selectedLabel = multiselect
        ? options
              //   .filter((i) => value?.includes(i?.value))
              .filter((i) => value?.find?.((j) => _.isEqual(j, i.value)))
              .map((i) => i?.label)
              ?.join?.(`, `)
        : options?.find?.((i) => i?.value === value)?.label ?? ``;
    const readOnlyInput = readOnly || !(allowSearch && !multiselect);
    useEffect(() => {
        if ((allowSearch && !_.isEmpty(selectedLabel)) || multiselect) {
            setSearch(selectedLabel);
        }
    }, [selectedLabel]);
    useEffect(() => {
        if (search !== selectedLabel) {
            onChange({ target: { name, value: undefined } });
        }
    }, [search]);
    return (
        <Dropdown
            id={dropdownId}
            wrapperStyles={extra}
            toggleProps={{
                extra: css`
                    width: 100%;
                    * {
                        ${!readOnly &&
                        css`
                            cursor: pointer;
                        `}
                    }
                `,
            }}
            menuProps={{
                extra: css`
                    /* width: calc(100% - 20px); */
                    width: 100%;
                    min-width: max-content;
                `,
            }}
            callable={!readOnly}
            toggle={
                ToggleComponent ? (
                    <ToggleComponent options={options} label={value} />
                ) : (
                    <Input
                        value={allowSearch ? search : selectedLabel}
                        onChange={(e) => setSearch(e.target.value)}
                        readOnly={readOnlyInput}
                        extra={css`
                            width: 100%;
                            /* background: ${({ theme }) => theme.background.secondary}; */
                            /* border: 1px solid ${({ theme }) => theme.grey}; */
                            cursor: default;
                            ${!readOnly &&
                            css`
                                border: 1px solid #dadada;
                                background: ${({ theme }) => theme.background.secondary};
                                color: ${({ theme }) => theme.text.primary};
                                cursor: pointer;
                            `}
                            ${({ theme }) =>
                                !readOnlyInput &&
                                search !== `` &&
                                css`
                                    border: 1px solid ${selectedLabel === search ? theme.green : theme.yellow};
                                `}
                        `}
                        rightIcon={`select-arrow`}
                        placeholder={placeholder}
                    />
                )
            }
            menu={
                <>
                    {options?.filter?.((i) => stringImposition(i?.label, search) || multiselect)?.length === 0 && <EmptyPlaceholder />}
                    {options
                        ?.filter?.((i) => stringImposition(i?.label, search) || multiselect)
                        ?.map?.((option, index, self) => {
                            const selected = _.isEqual(value, option.value);
                            const muted = option?.muted && option.value !== value;
                            return (
                                <Option
                                    key={index}
                                    muted={muted}
                                    onClick={() => {
                                        if (muted) {
                                            return;
                                        }
                                        let newValue = value;
                                        if (multiselect) {
                                            if (!Array.isArray(newValue)) {
                                                newValue = [];
                                            }
                                            onChange({ target: { value: togglePush(newValue, option.value) } });
                                        } else {
                                            onChange({ target: { value: selected ? undefined : option.value } });
                                            eventDispatch(`CLOSE_DROPDOWN`, dropdownId);
                                        }
                                        if (selected) {
                                            setSearch(``);
                                        }
                                    }}
                                >
                                    {option.label}
                                    {(_.isEqual(value, option.value) ||
                                        (!self?.map?.((i) => _.isEqual(i?.value, option.value))?.find?.((i) => !!i) &&
                                            value?.includes?.(option.value)) ||
                                        value?.find?.((j) => _.isEqual(j, option?.value))) && <Check />}
                                </Option>
                            );
                        })}
                </>
            }
        />
    );
};

const EmptyPlaceholder = styled(Frame)`
    width: 100%;
    padding: 8px;
    align-items: flex-start;
    &:after {
        content: "Данные отсутствуют";
        color: ${({ theme }) => theme.grey};
    }
`;

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

    ${({ muted }) =>
        !muted &&
        css`
            &:hover {
                background: ${({ theme }) => convertHex(theme.grey, 0.2)};
            }
        `}

    ${({ muted }) =>
        muted &&
        css`
            opacity: 0.5;
            cursor: default;
        `}
`;

export default Select;
/*eslint-enable*/
