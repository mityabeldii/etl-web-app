/*eslint-disable*/
import { useState } from "react";
import styled, { css } from "styled-components";
import { MODALS, FORMS } from "../../constants/config";

import { Frame, Button, Input, Dropdown, H1, Link, Form, ErrorBox } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import PopUpWrapper from "./pop-up-wrapper";

import DatasourceAPI from "../../api/datasource-api";

import useEventListener, { eventDispatch } from "../../hooks/useEventListener";
import useFormControl from "../../hooks/useFormControl";
import useModal from "../../hooks/useModal";
import ModalsHelper from "../../utils/modals-helper";

const Modality = () => {
    const [data, setData] = useState({});
    useModal(MODALS.MODALITY, {
        onOpen: (d) => {
            setData(d);
        },
    });
    const closeModal = () => {
        ModalsHelper.hideModal(MODALS.MODALITY);
    };
    return (
        <PopUpWrapper name={MODALS.MODALITY} onClickOutside={closeModal}>
            <H1 extra={`width: 100%; align-items: flex-start; margin-bottom: 24px;`}>{data?.title}</H1>
            <Frame>{data?.description}</Frame>
            <Frame extra={`flex-direction: row; width: 100%; justify-content: flex-end; margin-top: 35px`}>
                <Button
                    variant={`outlined`}
                    {...data?.cancelButton}
                    extra={(data?.cancelButton?.extra ?? ``) + `margin-right: 12px;`}
                    onClick={closeModal}
                    type={`cancel`}
                />
                <Button
                    {...data?.confirmButton}
                    type={`submit`}
                    onClick={async (e) => {
                        try {
                            await data?.confirmButton?.onClick(e);
                            closeModal();
                        } catch (error) {}
                    }}
                />
            </Frame>
        </PopUpWrapper>
    );
};

export default Modality;
/*eslint-enable*/
