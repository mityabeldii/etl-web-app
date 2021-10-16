/*eslint-disable*/
import { Button, H1, RowWrapper } from "../ui-kit/styled-templates";
import Table from "../ui-kit/table";

import { TABLES } from "../../constants/config";

const DataSourceslistPage = () => {
    return (
        <>
            <RowWrapper extra={`margin-bottom: 28px;`}>
                <H1>Источники данных</H1>
                <Button leftIcon={`plus-in-circle-white`} variant={`orange`}>
                    Добавить источник
                </Button>
            </RowWrapper>
            <Table name={TABLES.DATA_SOURSE_LIST} />
        </>
    );
};

export default DataSourceslistPage;
/*eslint-enable*/
