/*eslint-disable*/
import React, { useState } from "react";
import styled, { css } from "styled-components";

import { Frame, Button, Input, Dropdown, H1, P, Link } from "../ui-kit/styled-templates";
import Tooltip from "../ui-kit/tooltip";

import ProcessesAPI from "../../api/processes-api";

import { eventDispatch } from "../../hooks/useEventListener";
import { MODALS } from "../../constants/config";

const ProcessDropdown = ({ cellState = {} }) => {
    const { row = {} } = cellState;
    return (
        <Dropdown
            toggle={<MoreButton />}
            menu={
                <>
                    {[
                        {
                            label: `Редактировать атрибуты`,
                            src: `processes-more-edit-attributes`,
                            onClick: ({ row }) => {
                                eventDispatch(`OPEN_${MODALS.EDIT_PROCESS_ATTRIBUTES}_MODAL`, row);
                            },
                        },
                        {
                            label: `Удалить процесс`,
                            src: `processes-more-delete`,
                            muted: false,
                            onClick: ({ row }) => {
                                ProcessesAPI.deleteProcess(row?.id);
                            },
                        },
                        { label: `Просмотреть конфигурацию`, src: `processes-more-config-preview` },
                        { label: `Редактировать конфигурацию`, src: `processes-more-config-edit` },
                        { label: `История запусков процесса`, src: `processes-more-launches-history` },
                        { label: `История запусков задач`, src: `processes-more-tasks-history` },
                        {
                            label: `Ручной запуск`,
                            src: `processes-more-manual-start`,
                            tooltip: { label: `Невозможно запустить активный процесс`, side: `left` },
                        },
                    ].map((item, index) => {
                        const children = (
                            <StatisticsMoreOption
                                key={index}
                                {...item}
                                onClick={() => {
                                    item?.onClick?.(cellState);
                                }}
                            />
                        );
                        return item?.tooltip ? <Tooltip key={index} {...item?.tooltip} children={children} /> : children;
                    })}
                </>
            }
            menuStyles={({ theme }) =>
                css`
                    padding: 0;
                    background: ${theme.background.secondary};
                    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.05));
                    border: 1px solid #d1d1d1;
                    > * {
                        border-bottom: 1px solid #d1d1d1;
                        &:last-child {
                            border-bottom: 0px;
                        }
                    }
                `
            }
        />
    );
};

const MoreButton = styled(Frame)`
    width: 20px;
    height: 20px;
    background: url("${require(`../../assets/icons/more-vert.svg`).default}") no-repeat center center / contain;
    cursor: pointer;
`;

const StatisticsMoreOption = styled(Frame)`
    width: 275px;
    padding: 15px 18px;
    flex-direction: row;
    justify-content: flex-start;
    cursor: default;
    opacity: 0.5;

    ${({ muted = false }) =>
        !muted &&
        css`
            cursor: pointer;
            opacity: 1;
        `}

    ${({ muted = false }) =>
        !muted &&
        css`
            &:hover {
                &:after {
                    transform: translate(2px, 0);
                }
            }
        `}

    &:before {
        content: "";
        width: 16px;
        height: 16px;
        background: url("${({ src }) => require(`../../assets/icons/${src}.svg`).default}") no-repeat center center / contain;
        margin-right: 8px;
    }

    &:after {
        content: "${({ label = `` }) => label}";
        transition: 0.2s;
    }
`;

export default ProcessDropdown;
/*eslint-enable*/
