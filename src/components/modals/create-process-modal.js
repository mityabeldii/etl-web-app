/*eslint-disable*/
import styled, { css } from "styled-components";
import { MODALS, FORMS } from "../../constants/config";

import { Frame, Button, Input, Dropdown, H1, P, Link, Form } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import PopUpWrapper from "./pop-up-wrapper";

import useFormControl from "../../hooks/useFormControl";

import ProcessesAPI from "../../api/processes-api";

import { eventDispatch } from "../../hooks/useEventListener";
import ModalsHelper from "../../utils/modals-helper";

const schema = (yup) =>
    yup.object().shape({
        processName: yup.string().required(`Это поле обязательно`),
        active: yup.bool().required(`Это поле обязательно`),
    });

const CreateProcessModal = () => {
    const { onSubmit, clearForm } = useFormControl({ name: FORMS.CREATE_PROCESS_MODAL, schema });
    const handleSubmit = async (data) => {
        try {
            await ProcessesAPI.createProcess(data);
            closeModal();
        } catch (error) {}
    };
    const closeModal = () => {
        ModalsHelper.hideModal(MODALS.CREATE_PROCESS_MODAL);
    };
    return (
        <PopUpWrapper name={MODALS.CREATE_PROCESS_MODAL} onClickOutside={clearForm}>
            <Form name={FORMS.CREATE_PROCESS_MODAL} onSubmit={onSubmit(handleSubmit)}>
                <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px;`}>Добавить ETL-процесс</H1>
                <Control.Row>
                    <Control.Input name={`processName`} label={`Имя`} placeholder={`Имя процесса`} isRequired />
                </Control.Row>
                <Control.Row>
                    <Control.Textarea
                        name={`processDescription`}
                        label={`Описание`}
                        placeholder={`Краткое описание процесса`}
                        controlStyles={`flex: 1;`}
                    />
                </Control.Row>
                <Control.Row>
                    <Control.Input name={`cron`} label={`Расписание запуска`} placeholder={`Время и дата по Cron`} />
                    <Control.Select
                        name={`active`}
                        label={`Признак активности`}
                        options={[
                            { label: `Активен`, value: true },
                            { label: `Неактивен`, value: false },
                        ]}
                        isRequired
                    />
                </Control.Row>
                <Control.Row>
                    <Button background={`grey`} variant={`outlined`} extra={`margin-left: calc(50% + 8px);`} formNoValidate onClick={closeModal}>
                        Отменить
                    </Button>
                    <Button background={`orange`} type={`submit`}>
                        Добавить
                    </Button>
                </Control.Row>
            </Form>
        </PopUpWrapper>
    );
};

export default CreateProcessModal;
/*eslint-enable*/
