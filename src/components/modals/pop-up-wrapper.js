/*eslint-disable*/
import React, { useState, useEffect, useRef, Children } from "react";
import styled, { css } from "styled-components";

import { Frame, ExportButton, RowWrapper } from "../ui-kit/styled-templates";

import { convertHex } from "../../utils/colors-helper";

import useOnClickOutside from "../../hooks/useOnClickOutside";
import useComponentSize from "../../hooks/useComponentSize";
import useModal from "../../hooks/useModal";

const PopUpWrapper = (props) => {
    const {
        name = ``,
        disableDarkOverlay = false,
        extra = ``,
        preventClosing = false,
        withCros = true,
        whiteCros = false,
        onClickOutside = () => {},
        onOpen = () => {},
        onClose = () => {},
        modalStyles = ``,
    } = props;

    const { isOpened, shouldMount, open, close, setPreventClosing } = useModal(name, { onOpen, onClose });
    const ref = useRef();

    useEffect(() => setPreventClosing(preventClosing), [preventClosing]);

    const handleClose = (e) => {
        if (!(window.innerWidth - e.x < 7)) {
            onClickOutside?.();
            close();
        }
    };
    useOnClickOutside(ref, handleClose);

    const { height } = useComponentSize(ref, props.children);

    useEffect(() => {
        document.getElementsByTagName(`body`)[0].style.overflowY = isOpened ? `hidden` : `auto`;
    }, [isOpened]);

    if (!shouldMount) {
        return null;
    }

    return (
        <>
            {!disableDarkOverlay ? <DarkOverlay isOpened={isOpened} /> : null}
            <Frame
                isOpened={isOpened}
                extra={css`
                    visibility: ${({ isOpened }) => (isOpened ? `visible` : `hidden`)};
                    opacity: ${({ isOpened }) => (isOpened ? 1 : 0)};
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 3;
                    flex: 1;
                    display: flex;
                    overflow: auto;
                    justify-content: ${height > window.innerHeight ? `flex-start` : `center`};
                `}
            >
                <Frame
                    isOpened={isOpened}
                    extra={css`
                        visibility: ${({ isOpened }) => (isOpened ? `visible` : `hidden`)};
                        opacity: ${({ isOpened }) => (isOpened ? 1 : 0)};
                        display: flex;
                        width: 100%;
                        min-height: min-content;
                        ${modalStyles}
                    `}
                >
                    <OpenProjectTab isOpened={isOpened} extra={extra} ref={ref}>
                        {withCros ? <Cross onClick={close} /> : null}
                        {props.children}
                    </OpenProjectTab>
                </Frame>
            </Frame>
        </>
    );

    return (
        <>
            {!disableDarkOverlay ? <DarkOverlay isOpened={isOpened} /> : null}
            {/* <Frame extra={`flex: 1; display: flex; overflow: auto;`}> */}
            {/* <Frame extra={`display: flex; min-height: min-content;`}> */}
            <OpenProjectTab isOpened={isOpened} extra={extra} ref={ref}>
                {withCros ? <Cross onClick={onClose} /> : null}
                {props.children}
            </OpenProjectTab>
            {/* </Frame> */}
            {/* </Frame> */}
        </>
    );
};

const FullSizeFlex = styled(Frame)`
    width: 100%;
    height: auto;
    background: red;
`;

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
    padding: 30px 30px;
    padding: 35px 30px;
    /* margin: 50px 0; */
    border-radius: 4px;
    background: ${({ theme }) => theme.background.primary};
    box-sizing: border-box;
    width: 100%;
    max-width: 800px;
    position: relative;

    transform: translate(0, ${({ isOpened }) => (isOpened ? `0` : `50px`)});

    visibility: ${(props) => (props.isOpened ? `visible` : `hidden`)};
    opacity: ${(props) => (props.isOpened ? 1 : 0)};

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
    background: ${(props) => convertHex(props.theme.text.dark, props.isOpened * 0.2)};
    visibility: ${(props) => (props.isOpened ? `visible` : `hidden`)};
    /* backdrop-filter: blur(${(props) => props.isOpened * props.blur * 24}px); */
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3;
    /* backdrop-filter: blur(24px); */
`;

export default PopUpWrapper;
/*eslint-enable*/
