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
        host: yup.string().required(`Это поле обязательно`),
        port: yup.string().required(`Это поле обязательно`),
        base: yup.string().required(`Это поле обязательно`),
        username: yup.string().required(`Это поле обязательно`),
        password: yup.string().required(`Это поле обязательно`),
    });

const EditDataSourceModal = () => {
    const { Form, onSubmit, setValue, clearForm } = useForm({ name: FORMS.EDIT_DATA_SOURCE_MODAL, schema });
    const handleSubmit = (data) => {
        console.log(data);
    };
    const closeModal = () => {
        clearForm();
        eventDispatch(`CLOSE_${MODALS.EDIT_DATA_SOURCE_MODAL}_MODAL`);
    };
    return (
        <PopUpWrapper name={MODALS.EDIT_DATA_SOURCE_MODAL} onClickOutside={closeModal}>
            <Form onSubmit={onSubmit(handleSubmit)} extra={`width: 100%; flex-wrap: wrap; flex-direction: row; justify-content: flex-start;`}>
                <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px;`}>Редактировать источник данных</H1>
                <Control.Row>
                    <Control.Input name={`name`} label={`Имя`} placeholder={`Имя источника данных`} isRequired />
                    <Control.Input name={`host`} label={`Хост`} placeholder={`IP-адрес хоста`} isRequired />
                </Control.Row>
                <Control.Textarea name={`description`} label={`Описание`} placeholder={`Краткое описание источника`} controlStyles={`flex: 1;`} />
                <Control.Row>
                    <Control.Input name={`port`} label={`Порт`} placeholder={`Номер программного порта`} isRequired />
                    <Control.Input name={`base`} label={`База`} placeholder={`Название базы данных`} isRequired />
                </Control.Row>
                <Control.Row>
                    <Control.Input name={`schema`} label={`Cхемы`} placeholder={`Название схемы`} extra={`margin-right: calc(50% + 8px);`} />
                </Control.Row>
                <Control.Row>
                    <Control.Input name={`username`} label={`Пользователь`} placeholder={`Имя пользователя источника`} isRequired />
                    <Control.Password name={`password`} label={`Пароль`} placeholder={`Пароль пользователя источника`} isRequired />
                </Control.Row>
                <Control.Row>
                    <Button background={`grey`} variant={`outlined`} extra={`margin-left: calc(50% + 8px);`} type={`cancel`} onClick={closeModal}>
                        Отменить
                    </Button>
                    <Button background={`green`} type={`submit`}>
                        Сохранить
                    </Button>
                </Control.Row>
            </Form>
        </PopUpWrapper>
    );
};

export default EditDataSourceModal;
/*eslint-enable*/
