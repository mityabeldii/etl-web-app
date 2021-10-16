/*eslint-disable*/
import React, { useState, useEffect, useRef, Children } from "react";
import styled from "styled-components";

import { Frame, ExportButton, RowWrapper } from "../ui-kit/styled-templates";

import { convertHex } from "../../utils/colors-helper";

import useEventListener, { eventDispatch } from "../../hooks/useEventListener";
import useOnClickOutside from "../../hooks/useOnClickOutside";

const PopUpWrapper = (props) => {
    const { name = ``, disableDarkOverlay = false, extra = ``, preventClosing = false, withCross = true, onClickOutside = () => {} } = props;

    const [visible, setVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(visible);
    const ref = useRef();

    useEventListener(`OPEN_${name}_MODAL`, () => {
        setShouldRender(true);
        setVisible(true);
    });
    useEventListener(`CLOSE_${name}_MODAL`, () => {
        if (!preventClosing) {
            setVisible(false);
            setTimeout(() => {
                setShouldRender(false);
            }, 200);
        }
    });

    useEffect(() => {
        document.getElementsByTagName(`body`)[0].style.overflowY = visible ? `hidden` : `auto`;
    }, [visible]);

    const onClose = () => {
        onClickOutside?.();
        window.dispatchEvent(new CustomEvent(`CLOSE_${name}_MODAL`));
    };
    useOnClickOutside(ref, onClose);

    // if (!shouldRender) {
    //     return null
    // }

    return (
        <>
            {!disableDarkOverlay ? <DarkOverlay visible={visible} /> : null}
            <OpenProjectTab visible={visible} extra={extra} ref={ref}>
                {withCross ? <Cross onClick={onClose} /> : null}
                {/* <ChildrenWrapper> */}
                {props.children}
                {/* </ChildrenWrapper> */}
            </OpenProjectTab>
        </>
    );
};

const ChildrenWrapper = styled(Frame)`
    display: block !important;
    max-height: calc(90vh - 120px);
    /* overflow-y: scroll; */
    overflow: visible;

    // mobile devices only
    @media (min-width: 320px) and (max-width: 480px) {
        width: 100%;
    }
`;

const Cross = styled.img.attrs(() => {
    let img;
    try {
        img = require(`../../assets/icons/close.svg`).default;
    } catch (error) {}
    return { src: img };
})`
    width: 24px;
    height: 24px;
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 4;
    cursor: pointer;
    transition: 0.2s;
    &:hover {
        transform: rotate(90deg);
    }
`;

const OpenProjectTab = styled(Frame)`
    min-width: 700px;
    height: auto;
    padding: 30px 30px;
    padding: 35px 30px;
    border-radius: 4px;
    background: ${(props) => (props.theme.name === `light` ? props.theme.background.primary : props.theme.background.primary)};
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, ${(props) => (props.visible ? `-50%` : `100vh`)});
    z-index: 3;
    box-sizing: border-box;
    overflow: visible;

    @media only screen and (max-width: 600px) {
        min-width: auto;
        width: 90vw;
        padding: 8vw 5vw;
        transition: 0.2s;
    }

    ${(props) => props.extra}
`;

const DarkOverlay = styled(Frame)`
    width: 100vw;
    height: 100vh;
    background: ${(props) => convertHex(props.theme.text.dark, props.visible * 0.2)};
    visibility: ${(props) => (props.visible ? `visible` : `hidden`)};
    /* backdrop-filter: blur(${(props) => props.visible * props.blur * 24}px); */
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3;
    /* backdrop-filter: blur(24px); */
`;

export default PopUpWrapper;
/*eslint-enable*/
