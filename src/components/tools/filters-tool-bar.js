/*eslint-disable*/
import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import _ from "lodash";
import Markdown from "markdown-to-jsx";

import { Frame } from "../ui-kit/styled-templates";

import tablesColumns from "../../constants/tables-columns";
import { TABLES } from "../../constants/config";

const checkRequiredProps = (props, requiredProps) =>
    requiredProps.forEach((prop) => {
        if (!props[prop]) throw new Error(`${prop} is required`);
    });

const FiltersToolBar = ({ filters, onChange, tableName, wrapperExtra = `` }) => {
    checkRequiredProps({ filters, onChange, tableName }, ["filters", "onChange", "tableName"]);
    const { columns } = tablesColumns?.[TABLES?.[tableName]];
    return (
        <Wrapper extra={wrapperExtra}>
            <FiltersIcon onClick={() => onChange({})} />
            {!_.keys(filters)?.length && <EmptyPlaceholder>Нет фильтров</EmptyPlaceholder>}
            {_.keys(filters)?.map?.((key, index) => (
                <Item key={index}>
                    <Markdown>{`${_.find(columns, { name: key })?.label ?? key}: **${filters?.[key]}**`}</Markdown>
                    <Cros onClick={() => onChange(_.omit(filters, key))} />
                </Item>
            ))}
        </Wrapper>
    );
};

const EmptyPlaceholder = styled(Frame)`
    padding: 4px;
    color: ${({ theme }) => theme.grey};
    font-weight: 600;
    font-size: 16px;
    cursor: default;
`;

const Item = styled(Frame)`
    background: ${({ theme }) => theme.blue};
    border-radius: 4px;
    padding: 4px 12px;
    flex-direction: row;
    cursor: default;

    * {
        color: white;
    }

    ${({ extra }) => extra}
`;

const FiltersIcon = styled(Frame)`
    width: 16px;
    height: 16px;
    background: url("${require(`../../assets/icons/filters.svg`).default}") no-repeat center center / contain;
    margin-left: 10px;
    cursor: pointer;

    &:hover {
        opacity: 0.5;
    }
`;

const Cros = styled(Frame)`
    width: 16px;
    height: 16px;
    background: url("${require(`../../assets/icons/cross-white.svg`).default}") no-repeat center center / contain;
    margin-left: 10px;
    cursor: pointer;
`;

const Wrapper = styled(Frame)`
    padding: 4px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.grey};
    background: ${({ theme }) => theme.background.support};
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 4px 8px;
`;

export default FiltersToolBar;
/*eslint-enable*/
