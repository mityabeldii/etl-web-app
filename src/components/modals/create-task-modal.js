/*eslint-disable*/
import { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import { useLocation, useParams } from "react-router-dom";
import _ from "lodash";

import { Frame, Button, H1, H2, Br, Form, RemoveRowButton, MappingArrow } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import Select from "../ui-kit/select";
import PopUpWrapper from "./pop-up-wrapper";

import Forms from "../tools/forms";

import ProcessesAPI from "../../api/processes-api";
import DatasourceAPI from "../../api/datasource-api";

import { MODALS, FORMS, OPERATORS, TABLES, UPDATE_TYPES, JOIN_TYPE } from "../../constants/config";
import ModalsHelper from "../../utils/modals-helper";
import Schemas from "../../schemas";

import useEventListener, { eventDispatch } from "../../hooks/useEventListener";
import { useStorageListener } from "../../hooks/useStorage";
import useFormControl from "../../hooks/useFormControl";
import useModal from "../../hooks/useModal";

const CrateTaskModal = () => {
    const [mode, setMode] = useState(`view`);

    const { process_id } = useParams();
    const process = useStorageListener((state) => state?.processes ?? [])?.[process_id] ?? {};
    const { tasks = [] } = process;

    const { data, onSubmit, clearForm, setReadOnly, setValues } = useFormControl({ name: FORMS.CREATE_TASK, schema: Schemas.createTask({ tasks }) });
    useEffect(DatasourceAPI.getDatasourcesSourceOnly, []);

    const { close: closeModal } = useModal(MODALS.CREATE_TASK, {
        onOpen: (e) => {
            const { mode, data = {} } = e;
            setValues(data);
            setMode(mode);
            setReadOnly(mode === `view`);
        },
        onClose: clearForm,
    });

    const handlers = {
        submit: async (data) => {
            try {
                if (mode === `edit`) {
                    await ProcessesAPI.updateTask(process_id, data);
                }
                if (mode === `create`) {
                    await ProcessesAPI.createTask(process_id, { ...data, processId: process_id });
                }
                closeModal();
            } catch (error) {}
        },
    };

    return (
        <PopUpWrapper name={MODALS.CREATE_TASK} onClickOutside={clearForm} modalStyles={`position: absolute; top: 0;`}>
            <Form name={FORMS.CREATE_TASK} onSubmit={onSubmit(handlers.submit)}>
                <Control.Row>
                    <H1 extra={`margin-bottom: 20px;`}>
                        {
                            {
                                edit: (
                                    <Frame extra={({ theme }) => `flex-direction: row; span { margin: 0 5px; color: ${theme.blue}; };`}>
                                        ?????????????????????????? ???????????? <span>{data?.taskName}</span>
                                    </Frame>
                                ),
                                create: `???????????????? ????????????`,
                                view: (
                                    <></>
                                    // <Frame extra={({ theme }) => `flex-direction: row; span { margin: 0 5px; color: ${theme.blue}; };`}>
                                    //     ???????????????????????? ?????????????????? <span>{data?.operator}</span> ???????????? <span>{data?.taskName}</span>
                                    // </Frame>
                                ),
                            }?.[mode]
                        }
                    </H1>
                </Control.Row>
                {mode !== `view` && (
                    <>
                        <Control.Row>
                            <Control.Input name={`taskName`} label={`??????`} placeholder={`?????? ????????????`} isRequired maxLength={40} />
                        </Control.Row>
                        <Control.Row>
                            <Control.Textarea name={`taskDescription`} label={`????????????????`} placeholder={`?????????????? ???????????????? ????????????????`} maxLength={255} />
                        </Control.Row>
                        <Control.Row>
                            <Control.Select
                                name={`operator`}
                                label={`?????? ??????????????????`}
                                placeholder={`???????????????? ???????????????? ?????? ????????????`}
                                options={Object.keys(OPERATORS).map((item) => ({ label: item, value: item }))}
                                extra={`flex: 0.5; margin-right: 16px !important;`}
                                isRequired
                            />
                        </Control.Row>
                    </>
                )}
                {
                    {
                        [OPERATORS.SQL_CLONE]: <Forms.SQLClone mode={mode} />,
                        [OPERATORS.SQL_EXTRACT]: <Forms.SQLExtract />,
                        [OPERATORS.SQL_LOAD]: <Forms.SQLLoad process={process} mode={mode} />,
                        [OPERATORS.JOIN]: <Forms.SQLJoin tasks={tasks} mode={mode} />,
                        [OPERATORS.CALCULATED]: <Forms.SQLCalculated tasks={tasks} mode={mode} />,
                        [OPERATORS.UNION]: <Forms.SQLUnion tasks={tasks} mode={mode} />,
                        [OPERATORS.SQL_DELETE]: <Forms.SQLDelete tasks={tasks} mode={mode} />,
                        [OPERATORS.FILTER]: <Forms.SQLFilter tasks={tasks} mode={mode} />,
                    }?.[data?.operator]
                }
                <Control.Row>
                    <Control.Input name={`taskQueue`} label={`?????????????? ??????????????`} placeholder={``} isRequired />
                </Control.Row>
                {mode !== `view` && (
                    <Control.Row>
                        <Button background={`grey`} variant={`outlined`} extra={`margin-left: calc(50% + 16px);`} formNoValidate onClick={closeModal}>
                            ????????????????
                        </Button>
                        <Button background={mode === `edit` ? `green` : `orange`} type={`submit`}>
                            {mode === `edit` ? `??????????????????` : `????????????????`}
                        </Button>
                    </Control.Row>
                )}
            </Form>
        </PopUpWrapper>
    );
};

export default CrateTaskModal;
/*eslint-enable*/
