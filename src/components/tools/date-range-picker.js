/*eslint-disable*/
import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";
import _ from "lodash";
import moment from "moment-timezone";

import { Button, Dropdown, Frame, RowWrapper } from "../ui-kit/styled-templates";

import Input from "../ui-kit/input";
import FormatedInput from "../ui-kit/formated-input";

const daysOfWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

const Calendar = ({ monthStart = moment(), onDateClick = () => {}, selectedRange = [], showOnlyCurrentMonth = false }) => {
    return (
        <Frame extra={`width: calc(32px * 7); flex-direction: row; flex-wrap: wrap;`}>
            {_.times(7, (i) => (
                <Day key={i} extra={({ theme }) => `color: ${theme.text.light};`}>
                    {daysOfWeek[i]}
                </Day>
            ))}
            {_.times(35, (i) => {
                const date = monthStart.clone().startOf("month").startOf("week").add(i, "days");
                const isCurrentMonth = date.month() === monthStart.month();
                const isFirstSelected = date.isSame(selectedRange[0], "day");
                const isLastSelected = date.isSame(selectedRange[1], "day");
                const isInSelectedRange = date.isBetween(selectedRange[0], selectedRange[1], "day", "[]");
                return (
                    <Day
                        key={i}
                        {...{ isCurrentMonth, isFirstSelected, isLastSelected, isInSelectedRange, date, showOnlyCurrentMonth }}
                        onClick={() => onDateClick(date)}
                    >
                        {date.format("D")}
                    </Day>
                );
            })}
        </Frame>
    );
};

const DateRangePicker = (props) => {
    const { onChange, value, toggleComponent: ToggleComponent } = props;
    const [monthStart, setMonthStart] = useState(moment().startOf("month"));
    const [selectFrom, setSelectFrom] = useState(null);
    const [selectTo, setSelectTo] = useState(null);
    const [timeFrom, setTimeFrom] = useState(`00:00`);
    const [timeTo, setTimeTo] = useState(`00:00`);
    const handlers = {
        prevMonth: () => {
            setMonthStart(monthStart.clone().subtract(1, "month"));
        },
        nextMonth: () => {
            setMonthStart(monthStart.clone().add(1, "month"));
        },
        dateClick: (date) => {
            if (!selectFrom) {
                setSelectFrom(date);
            } else if (!selectTo) {
                setSelectTo(date);
            } else {
                setSelectFrom(date);
                setSelectTo(null);
            }
        },
        cancelClick: () => {
            setSelectFrom(null);
            setSelectTo(null);
            setTimeFrom(`00:00`);
            setTimeTo(`00:00`);
        },
        saveClick: () => {
            onChange({
                from: +selectFrom.clone().set({ hour: timeFrom.split(":")[0], minute: timeFrom.split(":")[1] }),
                to: +selectTo.clone().set({ hour: timeTo.split(":")[0], minute: timeTo.split(":")[1] }),
            });
        },
    };
    useEffect(() => {
        const { from, to } = value;
        if (from) {
            setSelectFrom(moment(from));
            setTimeFrom(moment(from).format("HH:mm"));
        }
        if (to) {
            setSelectTo(moment(to));
            setTimeTo(moment(to).format("HH:mm"));
        }
    }, [value]);
    return (
        <Dropdown
            closeOnChildrenClick={false}
            toggle={ToggleComponent ? <ToggleComponent /> : <CalendarIcon />}
            menuProps={{ extra: `padding: 0;` }}
            menu={
                <Frame extra={({ theme }) => `background: ${theme.background.secondary}; border: 1px solid ${theme.grey}; border-radius: 8px;`}>
                    <Frame extra={({ theme }) => `flex-direction: row; border-bottom: 1px solid ${theme.grey};`}>
                        <Frame extra={({ theme }) => `padding: 19px; border-right: 1px solid ${theme.grey};`}>
                            <Frame extra={`width: 100%; flex-direction: row; justify-content: space-between;`}>
                                <Chevron direction="left" onClick={handlers.prevMonth} />
                                <Frame extra={`font-size: 13px; line-height: 18px;`}>{months[monthStart.month()]}</Frame>
                                <Frame extra={`width: 28px;`} />
                            </Frame>
                            <Calendar
                                monthStart={monthStart}
                                onDateClick={handlers.dateClick}
                                selectedRange={[selectFrom, selectTo]}
                                showOnlyCurrentMonth={true}
                            />
                        </Frame>
                        <Frame extra={`padding: 19px;`}>
                            <Frame extra={`width: 100%; flex-direction: row; justify-content: space-between;`}>
                                <Frame extra={`width: 28px;`} />
                                <Frame extra={`font-size: 13px; line-height: 18px;`}>{months[(monthStart.month() + 1) % 12]}</Frame>
                                <Chevron direction="right" onClick={handlers.nextMonth} />
                            </Frame>
                            <Calendar
                                monthStart={monthStart.clone().add(1, "month")}
                                onDateClick={handlers.dateClick}
                                selectedRange={[selectFrom, selectTo]}
                                showOnlyCurrentMonth={true}
                            />
                        </Frame>
                    </Frame>
                    <RowWrapper extra={`padding: 19px; box-sizing: border-box;`}>
                        <Frame extra={`flex-direction: row;`}>
                            <Input type="time" value={timeFrom} onChange={(e) => setTimeFrom(e.target.value)} />
                            <Input type="time" value={timeTo} onChange={(e) => setTimeTo(e.target.value)} />
                        </Frame>
                        <Frame extra={`flex-direction: row;`}>
                            <Button
                                background="white"
                                extra={({ theme }) =>
                                    `margin-right: 1em; min-width: unset; font-size: 12px; line-height: 16px; border: 1px solid ${theme.grey}; color: ${theme.grey}; box-shadow: none;`
                                }
                                onClick={handlers.cancelClick}
                            >
                                Отменить
                            </Button>
                            <Button
                                disabled={!selectFrom || !selectTo}
                                background="green"
                                extra={`min-width: unset; font-size: 12px; line-height: 16px; box-shadow: none;`}
                                onClick={handlers.saveClick}
                            >
                                Сохранить
                            </Button>
                        </Frame>
                    </RowWrapper>
                </Frame>
            }
        />
    );
};

const Day = styled(Frame)`
    width: 32px;
    height: 32px;
    font-size: 12px;
    line-height: 16px;
    color: ${({ theme, isCurrentMonth }) => (!isCurrentMonth ? theme.text.light : theme.text.primary)};
    cursor: pointer;

    ${({ isCurrentMonth }) =>
        isCurrentMonth &&
        css`
            &:hover {
                opacity: 0.5;
            }
        `}
    ${({ theme, isFirstSelected, isLastSelected, isInSelectedRange }) =>
        css`
            background: ${isFirstSelected || isLastSelected ? theme.blue : isInSelectedRange ? `rgba(84, 136, 199, 0.15)` : `transparent`};
        `}

    ${({ isFirstSelected }) =>
        isFirstSelected &&
        css`
            border-top-left-radius: 8px;
            border-bottom-left-radius: 8px;
            color: white;
            font-weight: bold;
        `}
    ${({ isLastSelected }) =>
        isLastSelected &&
        css`
            border-top-right-radius: 8px;
            border-bottom-right-radius: 8px;
            color: white;
            font-weight: bold;
        `}

    ${({ showOnlyCurrentMonth, isCurrentMonth }) => showOnlyCurrentMonth && !isCurrentMonth && `visibility: hidden;`}

    ${({ extra }) => extra}
`;

const Chevron = styled(Frame)`
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.grey};
    box-sizing: border-box;

    cursor: pointer;
    &:hover {
        opacity: 0.8;
    }

    &:after {
        content: "";
        width: 12px;
        height: 12px;
        background: url("${require(`../../assets/icons/arrow-right.svg`).default}") no-repeat center center / contain;
        ${({ direction }) =>
            direction === "left" &&
            css`
                transform: rotate(180deg);
            `}
    }
`;

const CalendarIcon = styled(Frame)`
    width: 16px;
    height: 16px;
    background: url("${require(`../../assets/icons/calendar.svg`).default}") no-repeat center center / contain;
`;

export default DateRangePicker;
/*eslint-enable*/
