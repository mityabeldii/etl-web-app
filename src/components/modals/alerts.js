/*eslint-disable*/
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { Frame } from "../ui-kit/styled-templates";

import { createId, sleep } from "../../utils/common-helper";

import useEventListener, { eventDispatch } from "../../hooks/useEventListener";

const Alerts = (props) => {
    const notificationsRef = useRef([]);
    const [notifications, setNotifications] = useState(notificationsRef.current);

    useEffect(() => {
        notificationsRef.current = notifications;
    }, [notifications]);

    const addItem = (item, type) => {
        const id = createId();
        if (![`success`, `error`].includes(type)) {
            throw new Error(`Alerts: type is not in ["success", "error"]`);
        }
        setNotifications([...notifications, { id: id, message: item, visible: false, status: type }]);
        return id;
    };

    const openItem = (item_id) => {
        setNotifications(notificationsRef.current.map((i) => (i.id === item_id ? { ...i, visible: true } : i)));
    };

    const closeItem = (item_id) => {
        setNotifications(notificationsRef.current.map((i) => (i.id === item_id ? { ...i, visible: false } : i)));
    };

    useEventListener(`THROW_ERROR`, async (d) => {
        const id = addItem(d.detail, `error`);
        await sleep(0);
        openItem(id);
        await sleep(5000);
        closeItem(id);
    });

    useEventListener(`THROW_SUCCESS`, async (d) => {
        const id = addItem(d.detail, `success`);
        await sleep(0);
        openItem(id);
        await sleep(5000);
        closeItem(id);
    });

    return (
        <>
            {notifications.map((item, index, self) => (
                <Bar
                    key={index}
                    onClick={() => {}}
                    status={item.status}
                    visible={item.visible}
                    index={notifications
                        .filter((i) => i.visible || i.id === item.id)
                        .map((i) => i.id)
                        .indexOf(item.id)}
                >
                    <Frame extra={`align-items: flex-start;`}>
                        {item.message.split(`\\n`).map((item, index) => {
                            return <span key={index}>{item}</span>;
                        })}
                    </Frame>
                    {/* <Cros onClick={() => closeItem(item.id)} /> */}
                </Bar>
            ))}
        </>
    );
};

const Cros = styled(Frame)`
    width: 18px;
    height: 18px;
    background: url("${require(`../../assets/icons/cross.svg`).default}") no-repeat center center / contain;
    margin-left: 9px;
    cursor: pointer;
`;

const Bar = styled(Frame)`
    padding: 9px 15px;
    box-sizing: border-box;
    flex-direction: row;
    justify-content: center;
    /* margin-top: 10px; */
    min-width: 220px;

    /* background: ${({ theme = {}, status = `error` }) => theme?.[status === `success` ? `green` : `red`]}; */
    background: ${({ theme = {}, status = `error` }) => theme?.[{ success: `green`, warning: `yellow`, error: `red` }?.[status]]};
    /* box-shadow: 0px 10px 20px rgba(0, 155, 232, 0.1); */
    border-radius: 4px;

    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    color: #ffffff;

    transition: 0.5s;
    /* transform: translate(${({ visible }) => (visible ? 0 : 100)}%, ${({ index }) => `calc(${index * 100}% + ${index * 10}px)`}); */
    transform: translate(50%, ${({ index, visible = false }) => `calc(${index * 100}% + ${index * 10}px + ${visible ? 0 : 10}px)`})
        scale(${({ visible }) => (visible ? 1 : 0.5)});
    visibility: ${({ visible }) => (visible ? `visible` : `hidden`)};
    opacity: ${({ visible }) => (visible ? 1 : 0)};

    z-index: 4;
    position: fixed;
    bottom: 50px;
    right: 50%;

    span {
        color: #ffffff;
    }

    /* &:before {
        content: "";
        width: 43px;
        height: 43px;
        background: url("${({ status = `error` }) => require(`../../assets/icons/alert-${status}.svg`).default}") no-repeat center center / contain;
        margin-right: 9px;
    } */
`;

export default Alerts;
/*eslint-enable*/
