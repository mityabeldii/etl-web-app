/*eslint-disable*/
import { useEffect, useState, Fragment, useMemo } from "react";
import styled, { css } from "styled-components";
import { useHistory, useLocation, useParams, Link } from "react-router-dom";
import Markdown from "markdown-to-jsx";

import { Button, H1, RowWrapper, Input, Frame } from "../ui-kit/styled-templates";
import Table from "../ui-kit/table";
import CreateTaskModal from "../modals/create-task-modal";

import { MODALS, TABLES } from "../../constants/config";
import tablesColumns from "../../constants/tables-columns";

import DatasourceAPI from "../../api/datasource-api";
import ProcessesAPI from "../../api/processes-api";

import { eventDispatch } from "../../hooks/useEventListener";
import { putStorage, useStorageListener } from "../../hooks/useStorage";
import { linkTo, objectToQS, QSToObject } from "../../utils/common-helper";
import useQueryParams from "../../hooks/useQueryParams";

const ProcessesConfigurationPage = () => {
    const { process_id } = useParams();
    const { pathname } = useLocation();
    const { edit = false } = useQueryParams();

    const process = useStorageListener((state) => state?.processes ?? [])?.[process_id] ?? {};
    const { tasks = [] } = process;

    useEffect(async () => {
        ProcessesAPI.getProcessById(process_id);
        ProcessesAPI.getProcessTasks(process_id);
    }, [process_id]);

    const handleOpenCreateTaskModal = () => {
        eventDispatch(`OPEN_${MODALS.CREATE_TASK}_MODAL`);
    };

    return useMemo(
        () => (
            <>
                <CreateTaskModal />
                <RowWrapper extra={`margin-bottom: 28px;`}>
                    <Heading>
                        <Link to={`/processes`}>
                            <ArrowBack />
                        </Link>
                        Конфигурация процесса <span>{process?.processName}</span>
                        <ProcessIDWapper>ID: {process_id}</ProcessIDWapper>
                    </Heading>
                    {edit ? (
                        <Link to={`${pathname}${objectToQS({})}`}>
                            <Button background={`green`}>Сохранить</Button>
                        </Link>
                    ) : (
                        <Link to={`${pathname}${objectToQS({ edit: true })}`}>
                            <Button background={`blue`}>Редактировать</Button>
                        </Link>
                    )}
                </RowWrapper>
                <H1 extra={`font-size: 18px; margin-bottom: 16px; width: 100% !important; align-items: flex-start;`}>Список задач</H1>
                <Table
                    name={TABLES.TASKS_TABLE}
                    {...tablesColumns.TASKS_TABLE}
                    rows={tasks}
                    columns={tablesColumns.TASKS_TABLE?.columns?.filter?.(
                        (i) => !((edit && [`deletebutton`, `rightarrowbutton`]?.includes?.(i.name)) || (!edit && i.name === `editbutton`))
                    )}
                />
                {edit && (
                    <RowWrapper extra={`margin-top: 16px; justify-content: flex-end;`}>
                        <Button background={`orange`} onClick={handleOpenCreateTaskModal}>
                            Добавить задачу
                        </Button>
                    </RowWrapper>
                )}
                <H1 extra={`font-size: 18px; margin-bottom: 16px; margin-top: 36px; width: 100% !important; align-items: flex-start;`}>
                    Схема процесса
                </H1>
                <ProcessSchema.Wrapper>
                    <ProcessSchema.Scrollable>
                        {tasks.map((task, index, self) => (
                            <Fragment key={index}>
                                <ProcessSchema.Block key={index}>
                                    <Markdown>{`**${task?.taskName}**\n\n${task?.operator}`}</Markdown>
                                </ProcessSchema.Block>
                                {index < self?.length - 1 && <ProcessSchema.Arrow />}
                            </Fragment>
                        ))}
                    </ProcessSchema.Scrollable>
                </ProcessSchema.Wrapper>
            </>
        ),
        [process_id, JSON.stringify({ tasks, edit })]
    );
};

const ProcessSchema = {
    Arrow: styled(Frame)`
        width: 44px;
        height: 10px;
        margin: 0 4px;
        background: url("${require(`../../assets/images/block-schema-arrow.svg`).default}") no-repeat center center / contain;
    `,
    Block: styled(Frame)`
        align-items: flex-start;
        padding: 12px 20px;
        background: #ffffff;
        border: 1px solid #c5c9dc;
        box-sizing: border-box;
        border-radius: 4px;
        white-space: nowrap;
    `,
    Scrollable: styled(Frame)`
        display: flex;
        min-height: min-content;
        flex-direction: row;
    `,
    Wrapper: styled(Frame)`
        width: 100%;
        align-items: flex-start;
        padding: 65px 45px;
        box-sizing: border-box;
        background: #f2f3f5;
        border: 1px solid #d9dbe5;
        border-radius: 4px;
        background: url("${require(`../../assets/images/dotted-background.svg`).default}") repeat center center / contain;
        position: relative;
        /* overflow-x: scroll; */
        /* flex-direction: row; */

        flex: 1;
        display: flex;
        overflow: auto;
        max-height: 220px;

        &:before {
            content: "";
            width: 100%;
            height: 100%;
            position: absolute;
            background: #f2f3f5;
            z-index: -1;
        }
    `,
};

const ProcessIDWapper = styled(Frame)`
    font-size: 14px;
    line-height: 20px;
    margin-left: 12px;
    height: 28px;
    justify-content: flex-end;
    color: ${({ theme }) => theme.text.secondary};
`;

const TableStructureHeadeing = styled(Frame)`
    font-weight: 600;
    font-size: 18px;
    line-height: 25px;
    color: ${({ theme }) => theme.grey};
    flex-direction: row;

    margin-bottom: 16px;

    span {
        margin-left: 5px;
        color: ${({ theme }) => theme.text.primary};
    }

    ${({ extra }) => extra}
`;

const SchemaName = styled(Button).attrs((props) => {
    return {
        ...props,
        variant: `outlined`,
        background: `grey`,
    };
})`
    width: 190px;
    margin-bottom: 12px;
    justify-content: flex-start;
    color: ${({ theme }) => theme.text.primary};

    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: left;

    ${({ selected = false, theme = {} }) => selected && `background: ${theme.background.primary};`}

    &:hover {
        opacity: 0.5;
    }
`;

const ArrowBack = styled(Frame)`
    width: 24px;
    height: 24px;
    margin-right: 16px;
    cursor: pointer;
    background: url("${require(`../../assets/icons/keyboard-backspace.svg`).default}") no-repeat center center / contain;

    &:hover {
        transform: translate(-2px, 0);
    }
`;

const Heading = styled(H1)`
    line-height: 36px;
    flex-direction: row;

    span {
        margin-left: 5px;
        color: ${({ theme }) => theme.blue};
    }
`;

export default ProcessesConfigurationPage;
/*eslint-enable*/
