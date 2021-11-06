/*eslint-disable*/
import styled, { css } from "styled-components";
import { MODALS, FORMS } from "../../constants/config";

import { Frame, Button, Input, Dropdown, H1, P, Link, RowWrapper } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import PopUpWrapper from "./pop-up-wrapper";
import Select from "../ui-kit/select";

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

const DatasourceAdHocQueryModal = () => {
    const { Form, onSubmit, setValue, clearForm } = useForm({ name: FORMS.DATASOURCE_AD_HOC_FORM, schema });
    const handleSubmit = (data) => {
        console.log(data);
    };
    const closeModal = () => {
        clearForm();
        eventDispatch(`CLOSE_${MODALS.DATASOURCE_AD_HOC_QUERY_MODAL}_MODAL`);
    };
    return (
        <PopUpWrapper name={MODALS.DATASOURCE_AD_HOC_QUERY_MODAL} onClickOutside={closeModal}>
            <Form onSubmit={onSubmit(handleSubmit)} extra={`width: 100%; flex-wrap: wrap; flex-direction: row; justify-content: flex-start;`}>
                <Control.Row>
                    <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px; align-items: flex-start;`}>Выполнить Ad-Hoc запрос</H1>
                </Control.Row>
                <Control.Textarea
                    name={`query_text`}
                    placeholder={`Enter your query here`}
                    controlStyles={`flex: 1;`}
                    extra={css`
                        font-family: IBM Plex Mono;
                        font-style: normal;
                        font-weight: normal;
                        font-size: 14px;
                        line-height: 24px;
                    `}
                />
                <RowWrapper extra={`justify-content: flex-end;`}>
                    <Frame
                        extra={({ theme }) => css`
                            font-size: 14px;
                            line-height: 20px;
                            text-align: right;
                            margin-right: 16px;
                            color: ${theme.text.secondary};
                        `}
                    >
                        Показывать строк:
                    </Frame>
                    <Select
                        name={`perPage`}
                        options={[100].map((i) => ({ value: i, label: i }))}
                        extra={`width: 100px; margin-right: 32px;`}
                        placeholder={``}
                        value={100 ?? [100]?.[0] ?? 0}
                        onChange={(e) => {
                            // putStorage(`tables.${name}.pagination.perPage`, e.target.value);
                        }}
                    />
                    <Button background={`orange`} type={`submit`}>
                        Выполнить
                    </Button>
                </RowWrapper>
            </Form>
        </PopUpWrapper>
    );
};

export default DatasourceAdHocQueryModal;
/*eslint-enable*/
