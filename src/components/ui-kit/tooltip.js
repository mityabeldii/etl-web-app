/*eslint-disable*/
import React, { useState } from "react";
import styled, { css } from "styled-components";
import Markdown from "markdown-to-jsx";

import { Frame } from "../ui-kit/styled-templates";

const Tooltip = (props = {}) => {
    const { children, label = `` } = props;
    return (
        <TooltipCard>
            <TooltipText>
                {children}
            </TooltipText>
            <TooltipBox><Markdown>{label}</Markdown></TooltipBox>
        </TooltipCard>
    );
};

const TooltipText = styled.div`
    cursor: pointer;
`;

const TooltipBox = styled(Frame)`
    background-color: rgba(0, 0, 0, 0.8);
    padding: 8px 12px;
    border-radius: 4px;
    color: #fff;
    visibility: hidden;
    opacity: 0;
    position: absolute;
    top: -11px;
    left: 50%;
    transform: translate(-50%, calc(-100% - 3px));
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;

    * {
        color: #FFFFFF;
    };

    &:after {
        content: "";
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid #222222;
        opacity: 0.85;
        transform: rotate(180deg) translate(0, -0.5px);
        position: absolute;
        top: 100%;
    }
`;

const TooltipCard = styled.div`
    position: relative;
    & ${TooltipText}:hover + ${TooltipBox} {
        visibility: visible;
        opacity: 1;
        transform: translate(-50%, -100%);
    }
`;

export default Tooltip;
/*eslint-enable*/
