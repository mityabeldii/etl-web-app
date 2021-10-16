/*eslint-disable*/
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import moment from 'moment-timezone'

import { Frame, H1, P, Input, Button, Checkbox, ExportButton, RowWrapper } from '../ui-kit/styled-templates'
import PopUpWrapper from './pop-up-wrapper'

import useEventListener, { eventDispatch } from '../../hooks/useEventListener'

let TemplatePopUp = (props) => {

    let popUpName = `TEMPLATE`

    useEventListener(`OPEN_${popUpName}_POP_UP`, (d) => { })

    return (
        <PopUpWrapper name={popUpName} extra={`width: 430px;`} >
            <H1 extra={`margin-bottom: 14px;`} >Template</H1>
            
            <Frame row extra={`width: 100%;`} >
                <Button extra={props => `width: 180px; @media (max-width: 600px) { width: 50%; }; border: 0px !important; color: ${props.theme.text.primary} !important;`} onClick={() => { eventDispatch(`CLOSE_${popUpName}_POP_UP`) }} shaped >Cancel</Button>
                <Button extra={`width: 180px; @media (max-width: 600px) { width: 50%; };`} onClick={() => { eventDispatch(`CLOSE_${popUpName}_POP_UP`) }} >Save</Button>
            </Frame>
        </PopUpWrapper>
    );
}

export default TemplatePopUp;
/*eslint-enable*/
