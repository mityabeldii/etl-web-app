/*eslint-disable*/
import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useLocation, useParams } from "react-router-dom";
import _ from "lodash";
import * as yup from "yup";

import { Frame, Button, H1, H2, Br, Form, RemoveRowButton, MappingArrow } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import Select from "../ui-kit/select";
import PopUpWrapper from "./pop-up-wrapper";

import Forms from "../tools/forms";

import ProcessesAPI from "../../api/processes-api";
import DatasourceAPI from "../../api/datasource-api";

import { MODALS, FORMS, OPERATORS, TABLES, UPDATE_TYPES, JOIN_TYPE, LOGIC_OPERATOR } from "../../constants/config";

import useEventListener, { eventDispatch } from "../../hooks/useEventListener";
import { useStorageListener } from "../../hooks/useStorage";
import useFormControl from "../../hooks/useFormControl";

const schema = (yup) =>
    yup.object().shape({
        taskName: yup.string().required(`Это поле обязательно`),
        operator: yup.string().required(`Это поле обязательно`),
        taskQueue: yup.number().required(`Это поле обязательно`),
    });

const CrateTaskModal = () => {
    const [mode, setMode] = useState(`view`);
    const { data, onSubmit, clearForm, readOnly } = useFormControl({
        name: FORMS.CREATE_TASK,
        schema,
        readOnly: mode === `view`,
    });

    const { process_id } = useParams();
    const process = useStorageListener((state) => state?.processes ?? [])?.[process_id] ?? {};
    const { tasks = [] } = process;
    useEffect(DatasourceAPI.getDatasources, []);

    // console.log(data);

    useEventListener(`OPEN_${MODALS.CREATE_TASK}_MODAL`, (e) => {
        const { mode } = e.detail;
        setMode(mode);
    });

    const closeModal = () => {
        eventDispatch(`CLOSE_${MODALS.CREATE_TASK}_MODAL`);
    };
    const handleSubmit = async (data) => {
        try {
            if (mode === `edit`) {
                await ProcessesAPI.updateTask(process_id, data);
            }
            if (mode === `create`) {
                await ProcessesAPI.createTask(process_id, { ...data, processId: process_id });
            }
            closeModal();
        } catch (error) {}
    };
    return (
        <PopUpWrapper name={MODALS.CREATE_TASK} onClickOutside={clearForm}>
            <Form name={FORMS.CREATE_TASK} onSubmit={onSubmit(handleSubmit)}>
                <Control.Row>
                    <H1 extra={`margin-bottom: 20px;`}>
                        {
                            {
                                edit: (
                                    <Frame extra={({ theme }) => `flex-direction: row; span { margin: 0 5px; color: ${theme.blue}; };`}>
                                        Редактировать задачу <span>{data?.taskName}</span>
                                    </Frame>
                                ),
                                create: `Добавить задачу`,
                                view: (
                                    <Frame extra={({ theme }) => `flex-direction: row; span { margin: 0 5px; color: ${theme.blue}; };`}>
                                        Конфигурация оператора <span>{data?.operator}</span> задачи <span>{data?.taskName}</span>
                                    </Frame>
                                ),
                            }?.[mode]
                        }
                    </H1>
                </Control.Row>
                <Control.Row>
                    <Control.Input name={`taskName`} label={`Имя`} placeholder={`Имя задачи`} isRequired />
                </Control.Row>
                <Control.Row>
                    <Control.Textarea name={`taskDescription`} label={`Описание`} placeholder={`Краткое описание процесса`} />
                </Control.Row>
                <Control.Row>
                    <Control.Select
                        name={`operator`}
                        label={`Имя оператора`}
                        placeholder={`Выберите оператор для задачи`}
                        options={Object.keys(OPERATORS).map((item) => ({ label: item, value: item }))}
                        extra={`flex: 0.5; margin-right: 16px !important;`}
                        required
                    />
                </Control.Row>
                {
                    {
                        [OPERATORS.SQL_CLONE]: <Forms.SQLClone />,
                        [OPERATORS.SQL_EXTRACT]: <Forms.SQLExtract />,
                        [OPERATORS.SQL_LOAD]: <Forms.SQLLoad tasks={tasks} mode={mode} />,
                        [OPERATORS.JOIN]: <Forms.SQLJoin tasks={tasks} mode={mode} />,
                        [OPERATORS.CALCULATED]: <Forms.SQLCalculated tasks={tasks} mode={mode} />,
                    }?.[data?.operator]
                }
                <Control.Row>
                    <Control.Input name={`taskQueue`} label={`Порядок запуска`} placeholder={``} isRequired />
                    <Control.Select
                        multiselect={true}
                        name={`downstreamTaskIds`}
                        label={`Следующие задачи`}
                        options={tasks.map(({ taskName, id }) => ({ label: taskName, value: id }))}
                    />
                </Control.Row>
                {mode !== `view` && (
                    <Control.Row>
                        <Button background={`grey`} variant={`outlined`} extra={`margin-left: calc(50% + 8px);`} type={`cancel`} onClick={closeModal}>
                            Отменить
                        </Button>
                        <Button background={mode === `edit` ? `green` : `orange`} type={`submit`}>
                            {mode === `edit` ? `Сохранить` : `Добавить`}
                        </Button>
                    </Control.Row>
                )}
            </Form>
        </PopUpWrapper>
    );
};

export default CrateTaskModal;
/*eslint-enable*/
