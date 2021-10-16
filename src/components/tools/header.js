/*eslint-disable*/
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { Button, Frame, Dropdown } from "../ui-kit/styled-templates";

import UserAPI from "../../api/user-api";

import { useStorageListener } from "../../hooks/useStorage";

const Header = () => {
    const { userName, role = `guest` } = useStorageListener((state) => state?.user ?? {});

    const { logout } = UserAPI;

    return (
        <HeaderWrapper>
            <Link to={`/`}>
                <Logo />
            </Link>
            {role !== `guest` && (
                <Frame extra={`flex-direction: row;`}>
                    <Link to={`/`}>
                        <Item>Home</Item>
                    </Link>
                    <Dropdown
                        toggle={<Item>Admin</Item>}
                        menu={
                            <>
                                <Link to={`/users`}>
                                    <DropdownItem>Users</DropdownItem>
                                </Link>
                                <Link to={`/`}>
                                    <DropdownItem>Logs</DropdownItem>
                                </Link>
                                <Link to={`/`}>
                                    <DropdownItem>Broadcast</DropdownItem>
                                </Link>
                            </>
                        }
                        menuStyles={`align-items: flex-start;`}
                    />
                    <Link to={`/account-settings`}>
                        <Item>{userName}</Item>
                    </Link>
                    <Item onClick={logout}>Log off</Item>
                </Frame>
            )}
        </HeaderWrapper>
    );
};

const Item = styled(Frame)`
    color: ${({ theme }) => theme.blue};
    font-size: 0.875rem;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 600;
    line-height: 1.75;
    letter-spacing: 0.02857em;
    text-transform: uppercase;
    padding: 6px 8px;
    cursor: pointer;
`;

const DropdownItem = styled(Item)`
    width: 100%;
    align-items: flex-start;
    margin: -4px 0;

    &:hover {
        /* background: #edf5fc; */
        transform: translate(2px, 0);
    }
`;

const Logo = styled(Frame)`
    display: flex;
    width: ${634 * 0.5}px;
    height: ${122 * 0.5}px;
    background: url("${require(`../../assets/images/logo.png`).default}") no-repeat center center / contain;
`;

const HeaderWrapper = styled(Frame)`
    width: 100%;
    background: white;
    max-width: 1200px;
    min-width: 1000px;
    padding: 12px calc((100% - 1200px) / 2);
    /* box-sizing: border-box; */
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    flex-direction: row;
    justify-content: space-between;
`;

export default Header;
/*eslint-enable*/
