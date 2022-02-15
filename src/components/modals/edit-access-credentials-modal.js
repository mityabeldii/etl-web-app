/*eslint-disable*/
import styled, { css } from "styled-components";
import { MODALS, FORMS } from "../../constants/config";

import { Frame, Button, Input, Dropdown, H1, P, Link, Form } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import PopUpWrapper from "./pop-up-wrapper";

import DatasourceAPI from "../../api/datasource-api";

import { eventDispatch } from "../../hooks/useEventListener";
import useFormControl from "../../hooks/useFormControl";
import ModalsHelper from "../../utils/modals-helper";
import useModal from "../../hooks/useModal";
import { putStorage } from "../../hooks/useStorage";

const schema = (yup) =>
    yup.object().shape({
        name: yup.string().required(`Это поле обязательно`),
        host: yup.string().required(`Это поле обязательно`),
        port: yup.string().required(`Это поле обязательно`),
        url: yup.string().required(`Это поле обязательно`),
        user: yup.string().required(`Это поле обязательно`),
        password: yup.string().required(`Это поле обязательно`),
    });

const EditAccessCredentialsModal = () => {
    const { onSubmit, clearForm } = useFormControl({ name: FORMS.EDIT_ACCESS_CREDENTIALS, schema });
    const handleSubmit = async (data) => {
        await DatasourceAPI.updateDatasource(data);
        ModalsHelper.hideModal(MODALS.EDIT_ACCESS_CREDENTIALS);
    };
    const closeModal = () => {
        clearForm();
        ModalsHelper.hideModal(MODALS.EDIT_ACCESS_CREDENTIALS);
    };
    useModal(MODALS.EDIT_ACCESS_CREDENTIALS, {
        onOpen: (d) => {
            putStorage(`forms.${FORMS.EDIT_ACCESS_CREDENTIALS}.values`, d);
        },
    });
    return (
        <PopUpWrapper name={MODALS.EDIT_ACCESS_CREDENTIALS} onClickOutside={closeModal}>
            <Form name={FORMS.EDIT_ACCESS_CREDENTIALS} onSubmit={onSubmit(handleSubmit)}>
                <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px;`}>Редактировать реквизиты доступа</H1>
                <Control.Row>
                    <Control.Input name={`name`} label={`Имя`} placeholder={`Имя источника данных`} isRequired />
                    <Control.Input name={`host`} label={`Хост`} placeholder={`IP-адрес хоста`} isRequired />
                </Control.Row>
                <Control.Row>
                    <Control.Input name={`port`} label={`Порт`} placeholder={`Номер программного порта`} isRequired />
                    <Control.Input name={`url`} label={`База`} placeholder={`Название базы данных`} isRequired />
                </Control.Row>
                <Control.Row>
                    <Control.Input name={`user`} label={`Пользователь`} placeholder={`Имя пользователя источника`} isRequired />
                    <Control.Password name={`password`} label={`Пароль`} placeholder={`Пароль пользователя источника`} isRequired />
                </Control.Row>
                <Control.Row>
                    <Button background={`grey`} variant={`outlined`} extra={`margin-left: calc(50% + 8px);`} formNoValidate onClick={closeModal}>
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

export default EditAccessCredentialsModal;
/*eslint-enable*/
