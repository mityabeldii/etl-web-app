/*eslint-disable*/
import styled, { css } from "styled-components";
import { MODALS, FORMS } from "../../constants/config";

import { Frame, Button, Input, Dropdown, H1, P, Link, RowWrapper, Form } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import PopUpWrapper from "./pop-up-wrapper";

import ProcessesAPI from "../../api/processes-api";

import useFormControl from "../../hooks/useFormControl";
import useEventListener, { eventDispatch } from "../../hooks/useEventListener";

const schema = (yup) =>
    yup.object().shape({
        processName: yup.string().required(`Это поле обязательно`),
        active: yup.bool().required(`Это поле обязательно`),
        // scheduleInterval: yup.object().required(`Это поле обязательно`),
    });

const EditProcessAttributesModal = () => {
    const { onSubmit, setValue, clearForm } = useFormControl({ name: FORMS.EDIT_PROCESS_ATTRIBUTES, schema });
    const handleSubmit = async (data) => {
        try {
            await ProcessesAPI.updateProcess(data);
            closeModal();
        } catch (error) {}
    };
    const closeModal = () => {
        clearForm();
        eventDispatch(`CLOSE_${MODALS.EDIT_PROCESS_ATTRIBUTES}_MODAL`);
    };
    useEventListener(`OPEN_${MODALS.EDIT_PROCESS_ATTRIBUTES}_MODAL`, (d) => {
        Object.entries(d?.detail).forEach(([key, value], index) => {
            setValue(key, value ?? ``);
        });
    });
    return (
        <PopUpWrapper name={MODALS.EDIT_PROCESS_ATTRIBUTES} onClickOutside={closeModal}>
            <Form
                name={FORMS.EDIT_PROCESS_ATTRIBUTES}
                onSubmit={onSubmit(handleSubmit)}
                extra={`width: 100%; flex-wrap: wrap; flex-direction: row; justify-content: flex-start;`}
            >
                <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px;`}>Атрибуты процесса</H1>
                <Control.Row>
                    <Control.Input name={`processName`} label={`Имя`} placeholder={`Имя источника данных`} isRequired />
                </Control.Row>
                <Control.Row>
                    <Control.Input name={`time_of_creation`} label={`Время создания`} />
                    <Control.Input name={`last_editing_time`} label={`Время последнего редактирования:`} />
                </Control.Row>
                <Control.Row>
                    <Control.Input name={`id`} label={`ID`} readOnly />
                </Control.Row>
                <Control.Row>
                    <Control.Textarea
                        name={`processDescription`}
                        label={`Описание`}
                        placeholder={`Краткое описание источника`}
                        controlStyles={`flex: 1;`}
                    />
                </Control.Row>
                <Control.Row>
                    <Control.Cron name={`scheduleInterval`} label={`Расписание запуска`} placeholder={`Время и дата по Cron`} rightIcon={`info`} />
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
                    <Control.Input name={`last_launch_time`} label={`Время последнего запуска`} readOnly />
                    <Control.Input name={`next_launch_status`} label={`Статус последнего запуска`} readOnly />
                </Control.Row>
                <Control.Row>
                    <Control.Input name={`next_launch_time`} label={`Время следующего запуска`} readOnly />
                </Control.Row>
                <RowWrapper extra={`justify-content: flex-end;`}>
                    <Button
                        background={`grey`}
                        variant={`outlined`}
                        extra={`width: 100%; flex: 1; margin-left: calc(50% + 8px);`}
                        type={`cancel`}
                        onClick={closeModal}
                    >
                        Отменить
                    </Button>
                    <Button background={`green`} type={`submit`} extra={`width: 100%; flex: 1; margin-left: 12px;`}>
                        Сохранить
                    </Button>
                </RowWrapper>
            </Form>
        </PopUpWrapper>
    );
};

export default EditProcessAttributesModal;
/*eslint-enable*/
