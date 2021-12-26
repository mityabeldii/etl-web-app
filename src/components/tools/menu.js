/*eslint-disable*/
import { useKeycloak } from "@react-keycloak/web";
import { Fragment } from "react";
import { useLocation, Link } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";
import { useStorageListener } from "../../hooks/useStorage";
import { objectToQS } from "../../utils/common-helper";

import { Button, Frame, RowWrapper } from "../ui-kit/styled-templates";

const menuSections = [
    { label: `Источники данных`, icon: `menu-data-source`, items: [{ label: `Список источников данных`, link: `/datasources` }] },
    {
        label: `Структура хранилища`,
        icon: `menu-storage-structure`,
        items: [
            { label: `Хранилище`, link: `/storage/intermediate${objectToQS({ type: `STAGING` })}` },
            // { label: `Хранилище`, link: `/storage` },
        ],
    },
    { label: `ETL-процессы`, icon: `menu-etl-processes`, items: [{ label: `Список ETL-процессов`, link: `/processes` }] },
    {
        label: `Мониторинг ETL-процессов`,
        icon: `menu-monitoring`,
        items: [
            { label: `История запуска ETL-процессов`, link: `/history/processes` },
            { label: `История запуска задач`, link: `/history/tasks` },
            // { label: `Журнал событий`, link: `/events-log` },
            { label: `Отчеты и дашборды`, link: `/bi` },
        ],
    },
];

const Menu = () => {
    const { pathname } = useLocation();
    const { keycloak = { logout } } = useKeycloak();
    return (
        <Wrapper>
            <Link to={`/`}>
                <Title>
                    <Frame extra={`width: 140px; align-items: flex-start;`}>
                        <CompanyName>Цифровая платформа исследователя</CompanyName>
                        <CompenyDescription>Федеральный портал</CompenyDescription>
                    </Frame>
                </Title>
            </Link>
            {menuSections?.map?.((section, index) => (
                <Fragment key={index}>
                    <MenuSection {...section} />
                    {section?.items?.map?.((item, index) => (
                        <MenuItem key={item?.link} to={item?.link} selected={pathname?.startsWith?.(item?.link)}>
                            {item?.label}
                        </MenuItem>
                    ))}
                </Fragment>
            ))}
            <Button background={`red`} extra={`width: calc(100% - 30px); margin-top: 10px;`} variant={`outlined`} onClick={keycloak?.logout}>
                Выйти
            </Button>
        </Wrapper>
    );
};

const MenuItem = styled(Link)`
    width: 100%;
    align-items: flex-start;
    padding: 12px 20px;
    box-sizing: border-box;
    background: ${({ theme, selected = false }) => (selected ? theme.orange : `transparent`)};
    color: ${({ theme, selected = false }) => (selected ? `white` : theme.text.primary)};
    cursor: pointer;
    transition: 0.2s;

    font-size: 14px;
    line-height: 20px;

    &:hover {
        ${({ selected = false }) =>
            !selected &&
            css`
                transform: translate(2px, 0);
            `}
    }
`;

const MenuSection = styled(Frame)`
    font-weight: 600;
    font-size: 12px;
    line-height: 20px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.text.secondary};
    flex-direction: row;
    padding: 20px;
    box-sizing: border-box;
    justify-content: flex-start;
    width: 100%;

    &:before {
        content: "";
        width: 16px;
        height: 16px;
        margin-right: 8px;
        background: url("${({ icon = `menu-data-source` }) => require(`../../assets/icons/${icon}.svg`).default}") no-repeat center center / contain;
    }

    &:after {
        content: "${({ label = `` }) => label}";
    }
`;

const Title = styled(RowWrapper)`
    flex-direction: row;
    margin-bottom: 50px;

    &:before {
        content: "";
        width: 50px;
        height: 50px;
        margin-right: 20px;
        background: url("${require(`../../assets/images/etl-logo.png`).default}") no-repeat center center / contain;
    }
`;

const CompenyDescription = styled(Frame)`
    font-size: 10px;
    margin-top: 4px;
    color: #464646;
`;

const CompanyName = styled(Frame)`
    font-size: 12px;
    font-weight: bold;
    color: ${({ theme }) => theme.darkblue};
`;

const Wrapper = styled(Frame)`
    background: ${({ theme }) => theme.background.primary};
    width: 270px;
    min-width: 270px;
    height: 100vh;
    justify-content: flex-start;
    padding-top: 28px;
    box-sizing: border-box;
`;

export default Menu;
/*eslint-enable*/
