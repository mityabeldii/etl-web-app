/*eslint-disable*/
import React, { Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";

import Menu from "../tools/menu";
import { RowWrapper, Container, Frame } from "../ui-kit/styled-templates";

import DatasourcesListPage from "../pages/datasources-list-page";
import DatasourcePage from "../pages/datasource-page";
import ETLProcessesListPage from "../pages/processes-list-page";
import ProcessesConfigurationPage from "../pages/processes-configuration-page";
import ProcessesHistory from "../pages/processes-history";
import TasksHistory from "../pages/tasks-history";
import IntermidiateStoragePage from "../pages/intermidiate-storage-page";

import Alerts from "../modals/alerts";
import CreateDataSourceModal from "../modals/create-datasource-modal";
import EditDataSourceModal from "../modals/edit-datasource-modal";
import CreateProcessModal from "../modals/create-process-modal";
import EditProcessAttributesModal from "../modals/edit-process-attributes-modal";

const RouterApp = () => {
    return (
        <>
            <Alerts />
            <CreateDataSourceModal />
            <EditDataSourceModal />
            <CreateProcessModal />
            <EditProcessAttributesModal />

            <RowWrapper>
                <Menu />
                <Wrapper>
                    <Container>
                        <Switch>
                            <Route exact path={`/datasources`} component={DatasourcesListPage} />
                            <Route exact path={`/datasources/:selectedSourceId`} component={DatasourcePage} />
                            <Route exact path={`/processes`} component={ETLProcessesListPage} />
                            <Route exact path={`/processes/configuration/:process_id`} component={ProcessesConfigurationPage} />
                            <Route exact path={`/history/processes`} component={ProcessesHistory} />
                            <Route exact path={`/history/tasks`} component={TasksHistory} />
                            <Route exact path={`/storage/intermediate`} component={IntermidiateStoragePage} />
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

const Wrapper = styled(Frame).attrs((props) => {
    return { ...props, id: "scrollWrapper" };
})`
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
