/*eslint-disable*/
import React, { useState, useEffect, useMemo, useCallback } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import moment from "moment-timezone";

import { Frame, H1, P, Input, Button, Checkbox, ExportButton, RowWrapper } from "../ui-kit/styled-templates";
import PopUpWrapper from "./pop-up-wrapper";

import useEventListener, { eventDispatch } from "../../hooks/useEventListener";
import ModalsHelper from "../../utils/modals-helper";

const TemplatePopUp = (props) => {
    const popUpName = `TEMPLATE`;

    return (
        <PopUpWrapper name={popUpName} extra={`width: 430px;`}>
            <H1 extra={`margin-bottom: 14px;`}>Template</H1>

            <Frame row extra={`width: 100%;`}>
                <Button
                    extra={(props) =>
                        `width: 180px; @media (max-width: 600px) { width: 50%; }; border: 0px !important; color: ${props.theme.text.primary} !important;`
                    }
                    onClick={() => {
                        ModalsHelper.hideModal(popUpName);
                    }}
                    shaped
                >
                    Cancel
                </Button>
                <Button
                    extra={`width: 180px; @media (max-width: 600px) { width: 50%; };`}
                    onClick={() => {
                        ModalsHelper.hideModal(popUpName);
                    }}
                >
                    Save
                </Button>
            </Frame>
        </PopUpWrapper>
    );
};

export default TemplatePopUp;
/*eslint-enable*/
