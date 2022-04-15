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
import EventLogPage from "../pages/event-log-page";

import CreateDataSourceModal from "../modals/create-datasource-modal";
import EditDataSourceModal from "../modals/edit-datasource-modal";
import CreateProcessModal from "../modals/create-process-modal";
import EditProcessAttributesModal from "../modals/edit-process-attributes-modal";
import ReferenceInfoModal from "../modals/reference-info-modal";

const UserApp = () => {
    return (
        <>
            <CreateDataSourceModal />
            <EditDataSourceModal />
            <CreateProcessModal />
            <EditProcessAttributesModal />
            <ReferenceInfoModal />

            <RowWrapper>
                <Menu />
                <Wrapper>
                    <Container>
                        <Switch>
                            <Route exact path={[`/datasources`, `/datasources:keycloack`]} component={DatasourcesListPage} />
                            <Route exact path={[`/datasources/:selectedSourceId`, `/datasources/:selectedSourceId:keycloack`]} component={DatasourcePage} />
                            <Route exact path={[`/processes`, `/processes:keycloack`]} component={ETLProcessesListPage} />
                            <Route exact path={[`/processes/configuration/:process_id`, `/processes/configuration/:process_id:keycloack`]} component={ProcessesConfigurationPage} />
                            <Route exact path={[`/history/processes`, `/history/processes:keycloack`]} component={ProcessesHistory} />
                            <Route exact path={[`/history/tasks`, `/history/tasks:keycloack`]} component={TasksHistory} />
                            <Route exact path={[`/storage`, `/storage:keycloack`]} component={IntermidiateStoragePage} />
                            <Route exact path={[`/event-log`, `/event-log:keycloack`]} component={EventLogPage} />
                            <Route path={`/`}>
                                <Redirect to={`/processes`} />
                            </Route>
                        </Switch>
                    </Container>
                </Wrapper>
            </RowWrapper>
        </>
    );
};

export const Wrapper = styled(Frame).attrs((props) => {
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

export default UserApp;
/*eslint-enable*/
