/*eslint-disable*/
import styled, { css } from "styled-components";
import { MODALS, FORMS } from "../../constants/config";

import { Frame, Button, Input, Dropdown, H1, P, Link } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import PopUpWrapper from "./pop-up-wrapper";

import useForm from "../../hooks/useForm";
import { eventDispatch } from "../../hooks/useEventListener";

const schema = (yup) =>
    yup.object().shape({
        name: yup.string().required(`Это поле обязательно`),
        activity_sign: yup.string().required(`Это поле обязательно`),
    });

const CreateProcessModal = () => {
    const { Form, onSubmit, setValue, clearForm } = useForm({ name: FORMS.CREATE_PROCESS_MODAL, schema });
    const handleSubmit = (data) => {
        console.log(data);
    };
    const closeModal = () => {
        clearForm();
        eventDispatch(`CLOSE_${MODALS.CREATE_PROCESS_MODAL}_MODAL`);
    };
    return (
        <PopUpWrapper name={MODALS.CREATE_PROCESS_MODAL} onClickOutside={closeModal}>
            <Form onSubmit={onSubmit(handleSubmit)} extra={`width: 100%; flex-wrap: wrap; flex-direction: row; justify-content: flex-start;`}>
                <H1 extra={`width: 100%; margin-bottom: 24px;`}>Добавить ETL-процесс</H1>
                <Control.Row>
                    <Control.Input name={`name`} label={`Имя`} placeholder={`Имя источника данных`} isRequired />
                </Control.Row>
                <Control.Row>
                    <Control.Textarea name={`description`} label={`Описание`} placeholder={`Краткое описание источника`} controlStyles={`flex: 1;`} />
                </Control.Row>
                <Control.Row>
                    <Control.Input name={`cron`} label={`Расписание запуска`} placeholder={`Время и дата по Cron`} />
                    <Control.Select
                        name={`activity_sign`}
                        label={`Признак активности`}
                        options={[`Неактивен`].map((item, index) => ({ label: item, value: item }))}
                        isRequired
                    />
                </Control.Row>
                <Control.Row>
                    <Button background={`grey`} variant={`outlined`} extra={`margin-left: calc(50% + 8px);`} type={`cancel`} onClick={closeModal}>
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
