/*eslint-disable*/
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";

import Menu from "../tools/menu";
import { RowWrapper, Container, Frame } from "../ui-kit/styled-templates";

import DatasourcesListPage from "../pages/datasources-list-page";
import DatasourcePage from "../pages/datasource-page";

import CreateDataSourceModal from "../modals/create-data-source-modal";
import EditDataSourceModal from "../modals/edit-data-source-modal";

const RouterApp = () => {
    return (
        <>
            <CreateDataSourceModal />
            <EditDataSourceModal />
            
            <RowWrapper>
                <Menu />
                <Wrapper>
                    <Container>
                        <Switch>
                            <Route exact path={`/datasources`} component={DatasourcesListPage} />
                            <Route exact path={`/datasources/:selectedSourceId`} component={DatasourcePage} />
                            <Route path={`/`}>
                                <Redirect to={`/datasources`} />
                            </Route>
                        </Switch>
                    </Container>
                </Wrapper>
            </RowWrapper>
        </>
    );
};

const Wrapper = styled(Frame)`
    width: 100%;
    flex: 1;
    min-height: 100vh;
    justify-content: flex-start;
    padding: 35px 0;
    box-sizing: border-box;
    flex: 1;
    display: flex;
    overflow: auto;
    max-height: 100vh;
`;

export default RouterApp;
/*eslint-enable*/
