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
        emptyOptionLabel = `Данные отсутствуют`,
    } = props;
    const [dropdownId, setDropdownId] = useState(createId());
    const [search, setSearch] = useState(``);
    const selectedLabel = multiselect ? `` : options?.find?.((i) => i?.value === value)?.label ?? ``;
    const readOnlyInput = readOnly || !allowSearch;
    useEffect(() => {
        if (allowSearch || multiselect) {
            setSearch(selectedLabel);
        }
    }, [selectedLabel]);
    useEffect(() => {
        if (search !== selectedLabel && !multiselect) {
            onChange({ target: { name, value: undefined } });
        }
    }, [search]);
    useEffect(() => allowSearch && setSearch(selectedLabel), [name]);
    return (
        <Dropdown
            id={dropdownId}
            callable={!multiselect}
            wrapperStyles={extra}
            closeOnToggleClick={false}
            closeOnChildrenClick={!multiselect}
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
                    max-height: 200px;
                `,
            }}
            scrollWrapperStyles={`max-height: 200px;`}
            callable={!readOnly}
            toggle={
                ToggleComponent ? (
                    <ToggleComponent options={options} label={value} />
                ) : (
                    <Input
                        name={name}
                        value={allowSearch ? search : selectedLabel}
                        onChange={(e) => setSearch(e.target.value)}
                        readOnly={readOnlyInput}
                        leftContent={
                            <>
                                {multiselect &&
                                    value?.map?.((_value, index) => (
                                        <SelectedOption key={index}>
                                            {_.find(options, { value: _value })?.label}
                                            <Cros onClick={() => onChange({ target: { value: togglePush(value, _value) } })} />
                                        </SelectedOption>
                                    ))}
                            </>
                        }
                        inputExtra={css`
                            /* min-width: 100px; */
                        `}
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
                                    background: ${convertHex(selectedLabel === search ? theme.green : theme.yellow, 0.05)} !important;
                                `}
                        `}
                        rightIcon={`select-arrow`}
                        placeholder={placeholder}
                    />
                )
            }
            menu={
                <>
                    {options?.filter?.((i) => !allowSearch || stringImposition(i?.label, search) || selectedLabel === search)?.length === 0 && (
                        <EmptyPlaceholder>{emptyOptionLabel}</EmptyPlaceholder>
                    )}
                    {options
                        ?.filter?.((i) => !allowSearch || stringImposition(i?.label, search) || selectedLabel === search)
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
                                            setSearch(``);
                                            document.querySelector(`input[name="${name}"]`)?.focus?.();
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

const Cros = styled(Frame)`
    width: 16px;
    height: 16px;
    background: url("${require(`../../assets/icons/cross-white.svg`).default}") no-repeat center center / contain;
    margin-left: 10px;
`;

const SelectedOption = styled(Frame)`
    padding: 4px 12px;
    background: ${({ theme }) => theme.blue};
    border-radius: 4px;
    color: white;
    font-weight: 600;
    font-size: 14px;
    line-height: 19px;
    margin: 8px 2px 8px 8px;
    flex-direction: row;
`;

const EmptyPlaceholder = styled(Frame)`
    width: 100%;
    padding: 8px;
    align-items: flex-start;
    color: ${({ theme }) => theme.grey};
    cursor: default;
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
