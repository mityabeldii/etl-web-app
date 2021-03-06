/*eslint-disable*/
import styled, { css } from "styled-components";

import { Frame, Button, Input, Dropdown, H1, P, Link, Form } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import PopUpWrapper from "./pop-up-wrapper";

import DatasourceAPI from "../../api/datasource-api";

import ModalsHelper from "../../utils/modals-helper";
import { MODALS, FORMS } from "../../constants/config";

import { eventDispatch } from "../../hooks/useEventListener";
import useFormControl from "../../hooks/useFormControl";
import useModal from "../../hooks/useModal";

const schema = () => (yup, data) =>
    yup.object().shape({
        name: yup.string().required(`Это поле обязательно`),
        host: yup.string().required(`Это поле обязательно`),
        port: yup.string().required(`Это поле обязательно`),
        base: yup.string().required(`Это поле обязательно`),
        user: yup.string().required(`Это поле обязательно`),
        password: yup.string().required(`Это поле обязательно`),
        schema: yup.string().required(`Это поле обязательно`),
    });

const CreateDataSouceModal = () => {
    const { onSubmit, clearForm, setValues } = useFormControl({ name: FORMS.CREATE_DATASOURCE, schema: schema() });
    const { close: closeModal } = useModal(MODALS.CREATE_DATASOURCE_MODAL, {
        onClose: clearForm,
        onOpen: (d) => {
            setValues(d);
        },
    });
    const handlers = {
        submit: async (data) => {
            await DatasourceAPI.createDatasource(data);
            closeModal();
        },
    };
    return (
        <PopUpWrapper name={MODALS.CREATE_DATASOURCE_MODAL} onClickOutside={closeModal}>
            <Form name={FORMS.CREATE_DATASOURCE} onSubmit={onSubmit(handlers.submit)}>
                <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px;`}>Добавить источник данных</H1>
                <Control.Row>
                    <Control.Input name={`name`} label={`Имя`} placeholder={`Имя источника данных`} isRequired maxLength={40} />
                    <Control.Input name={`host`} label={`Хост`} placeholder={`IP-адрес хоста`} isRequired />
                </Control.Row>
                <Control.Textarea name={`description`} label={`Описание`} placeholder={`Краткое описание источника`} controlStyles={`flex: 1;`} maxLength={255} />
                <Control.Row>
                    <Control.Input name={`port`} label={`Порт`} placeholder={`Номер программного порта`} isRequired />
                    <Control.Input name={`base`} label={`База`} placeholder={`Название базы данных`} isRequired />
                </Control.Row>
                <Control.Row>
                    <Control.Input name={`schema`} label={`Cхемы`} placeholder={`Название схемы`} extra={`margin-right: calc(50% + 8px);`} isRequired />
                </Control.Row>
                <Control.Row>
                    <Control.Input name={`user`} label={`Пользователь`} placeholder={`Имя пользователя источника`} isRequired />
                    <Control.Password name={`password`} label={`Пароль`} placeholder={`Пароль пользователя источника`} isRequired />
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

export default CreateDataSouceModal;
/*eslint-enable*/
