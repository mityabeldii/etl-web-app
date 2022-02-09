/*eslint-disable*/
import React, { useState } from "react";
import styled, { css } from "styled-components";
import Markdown from "markdown-to-jsx";

import { Frame } from "../ui-kit/styled-templates";

const Tooltip = (props = {}) => {
    const { children, label = ``, side = `top`, wrapperProps = {}, tooltipProps = {} } = props;
    return (
        <TooltipCard side={side} {...wrapperProps}>
            <TooltipText>{children}</TooltipText>
            <TooltipBox side={side} {...tooltipProps}>
                <Markdown>{label ?? ``}</Markdown>
            </TooltipBox>
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
    font-weight: normal;
    font-size: 12px;
    line-height: 16px;
    white-space: nowrap;

    ${({ side = `top` }) =>
        ({
            top: css`
                top: -11px;
                left: 50%;
                transform: translate(-50%, calc(-100% - 3px));
            `,
            right: css`
                right: -50%;
                top: 50%;
                transform: translate(calc(50% + 3px), -50%);
            `,
            bottom: css`
                bottom: -11px;
                left: 50%;
                transform: translate(-50%, calc(100% + 3px));
            `,
            left: css`
                left: -50%;
                top: 50%;
                transform: translate(calc(-50% - 3px), -50%);
            `,
        }?.[side])}

    * {
        color: #ffffff;
    }

    &:after {
        content: "";
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid #222222;
        opacity: 0.85;
        position: absolute;
        ${({ side = `top` }) =>
            ({
                top: css`
                    top: 100%;
                    transform: rotate(-180deg) translate(0, 0px);
                `,
                right: css`
                    right: 100%;
                    transform: rotate(-90deg) translate(0, 2.5px);
                `,
                bottom: css`
                    bottom: 100%;
                    transform: rotate(0deg) translate(0, 0.5px);
                `,
                left: css`
                    left: 100%;
                    transform: rotate(90deg) translate(0, 2.5px);
                `,
            }?.[side])}
    }

    ${({ extra }) => extra}
`;

const TooltipCard = styled.div`
    position: relative;
    & ${TooltipText}:hover + ${TooltipBox} {
        visibility: visible;
        opacity: 1;
        ${({ side = `top` }) =>
            ({
                top: css`
                    top: -11px;
                    left: 50%;
                    transform: translate(-50%, calc(-100% - 0px));
                `,
                right: css`
                    right: -50%;
                    top: 50%;
                    transform: translate(calc(50% - 0px), -50%);
                `,
                bottom: css`
                    bottom: -11px;
                    left: 50%;
                    transform: translate(-50%, calc(100% + 0px));
                `,
                left: css`
                    left: -50%;
                    top: 50%;
                    transform: translate(calc(-50% + 0px), -50%);
                `,
            }?.[side])}
    }

    ${({ extra }) => extra}
`;

export default Tooltip;
/*eslint-enable*/
