/*eslint-disable*/
import React, { useState } from 'react'
import styled, { css } from 'styled-components'

import { Frame } from '../ui-kit/styled-templates';

import { useStorageListener } from '../../hooks/useStorage'

const LoadingModal = (props) => {
    const visible = useStorageListener(state => state?.loading_counter > 0);
    return (
        <Wrapper visible={visible} >
            Loading...
        </Wrapper>
    )
}

const Wrapper = styled(Frame)`
    padding: 10px 20px;
    border-radius: 50px;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid ${props => props.theme.grey};
    color: ${props => props.theme.grey};
    position: absolute;
    top: ${props => props.visible ? `10px` : `-10vh`};
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
`;

export default LoadingModal;
/*eslint-enable*/