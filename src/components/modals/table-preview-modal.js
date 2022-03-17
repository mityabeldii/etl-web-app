/*eslint-disable*/
import styled, { css } from "styled-components";
import _ from "lodash";

import { Scrollable } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import Table from "../ui-kit/table";
import PopUpWrapper from "./pop-up-wrapper";

import DatasourceAPI from "../../api/datasource-api";
import TablesAPI from "../../api/tables-api";
import TableFieldsAPI from "../../api/table-fields-api";

import { MODALS, FORMS, FIELD_TYPES, TABLES } from "../../constants/config";
import ModalsHelper from "../../utils/modals-helper";

import { eventDispatch } from "../../hooks/useEventListener";
import useFormControl from "../../hooks/useFormControl";
import useModal from "../../hooks/useModal";

const TablePreviewModal = () => {
    const { close: closeModal, state = {} } = useModal(MODALS.TABLE_PREVIEW);
    const { datasourceId, table = {}, schemaName } = state;
    const handlers = {
        fetchPreviewFunction: async () => {
            if (datasourceId && table?.tableName) {
                const response = await DatasourceAPI.getDatasourceTablePreview(datasourceId, table.tableName, schemaName);
                return response;
            }
        },
    };
    return (
        <PopUpWrapper name={MODALS.TABLE_PREVIEW} onClickOutside={closeModal} extra={`max-width: 90vw; padding: 0; backgorund: transparent;`}>
            <Scrollable outerExtra={`max-width: 90vw; max-height: 90vh;`}>
                <Table
                    name={TABLES.DATASOURCE_TABLE_PREVIEW}
                    columns={_.map(table?.fields, `fieldName`)?.map?.((i) => ({
                        label: i,
                        name: i,
                    }))}
                    fetchFunction={handlers.fetchPreviewFunction}
                />
            </Scrollable>
        </PopUpWrapper>
    );
};

export default TablePreviewModal;
/*eslint-enable*/
