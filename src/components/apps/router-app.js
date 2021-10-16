/*eslint-disable*/
import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";

import Menu from "../tools/menu";
import { RowWrapper, Container, Frame } from "../ui-kit/styled-templates";

import DataSourceslistPage from "../pages/data-sourceslist-page";

// import UpdateStatusModal from "../modals/update-status-modal";

const RouterApp = () => {
    return (
        <>
            {/* <UpdateStatusModal /> */}
            <RowWrapper>
                <Menu />
                <Wrapper>
                    <Container>
                        <Switch>
                            <Route exact path={`/data-sources`} component={DataSourceslistPage} />
                            <Route path={`/`}>
                                <Redirect to={`/`} />
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
    padding: 36px 0;
    box-sizing: border-box;
`;

export default RouterApp;
/*eslint-enable*/
