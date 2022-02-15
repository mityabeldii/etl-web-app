/*eslint-disable*/
import styled, { css } from "styled-components";
import { MODALS, FORMS } from "../../constants/config";

import { Frame, Button, Input, Dropdown, H1, P, Link, Form } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import PopUpWrapper from "./pop-up-wrapper";

import SchemasAPI from "../../api/schemas-api";
import DatasourceAPI from "../../api/datasource-api";

import ModalsHelper from "../../utils/modals-helper";

import useFormControl from "../../hooks/useFormControl";
import { eventDispatch } from "../../hooks/useEventListener";
import useModal from "../../hooks/useModal";
import { useLocation } from "react-router-dom";

const schema = (yup) =>
    yup.object().shape({
        name: yup.string().required(`Это поле обязательно`),
        host: yup.string().required(`Это поле обязательно`),
        port: yup.string().required(`Это поле обязательно`),
        url: yup.string().required(`Это поле обязательно`),
        user: yup.string().required(`Это поле обязательно`),
        password: yup.string().required(`Это поле обязательно`),
    });

const EditDataSourceModal = () => {
    const { onSubmit, clearForm, setValues } = useFormControl({ name: FORMS.EDIT_DATASOURCE_MODAL, schema });
    const { close: closeModal } = useModal(MODALS.EDIT_DATASOURCE_MODAL, { onOpen: setValues, onClose: clearForm });
    const { pathname } = useLocation();
    const handleSubmit = async (data) => {
        await DatasourceAPI.updateDatasource(data);
        closeModal();
    };
    return (
        <PopUpWrapper name={MODALS.EDIT_DATASOURCE_MODAL} onClickOutside={closeModal}>
            <Form name={FORMS.EDIT_DATASOURCE_MODAL} onSubmit={onSubmit(handleSubmit)}>
                <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px;`}>Редактировать источник данных</H1>
                <Control.Row>
                    <Control.Input name={`name`} label={`Имя`} placeholder={`Имя источника данных`} isRequired />
                    <Control.Input name={`host`} label={`Хост`} placeholder={`IP-адрес хоста`} isRequired />
                </Control.Row>
                <Control.Textarea name={`description`} label={`Описание`} placeholder={`Краткое описание источника`} controlStyles={`flex: 1;`} />
                <Control.Row>
                    <Control.Input name={`port`} label={`Порт`} placeholder={`Номер программного порта`} isRequired />
                    <Control.Input name={`url`} label={`База`} placeholder={`Название базы данных`} isRequired />
                </Control.Row>
                {!pathname?.startsWith?.(`/storage`) && (
                    <Control.Row>
                        <Control.Input name={`schema`} label={`Cхемы`} placeholder={`Название схемы`} extra={`margin-right: calc(50% + 8px);`} />
                    </Control.Row>
                )}
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

export default EditDataSourceModal;
/*eslint-enable*/
