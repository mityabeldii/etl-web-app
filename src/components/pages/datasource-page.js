/*eslint-disable*/
import { useEffect, useState, Fragment, useMemo } from "react";
import styled, { css } from "styled-components";
import { useParams, Link } from "react-router-dom";
import _, { get } from "lodash";

import {
    Frame,
    Button,
    H1,
    H2,
    RowWrapper,
    Input,
    Form,
    Dropdown,
    ScrollWrapper,
    Scrollable,
} from "../ui-kit/styled-templates";
import Select from "../ui-kit/select";
import Table from "../ui-kit/table";
import { Control } from "../ui-kit/control";
import Tooltip from "../ui-kit/tooltip";

import EditAccessCredentialsModal from "../modals/edit-access-credentials-modal";
import CreateScheaInStorageModal from "../modals/create-schema-in-storage-modal";
import EditSchemaNameModal from "../modals/edit-schema-name-modal";
import CreateTableInSchemaModal from "../modals/create-table-in-schema-modal";
import EditTableNameModal from "../modals/edit-table-name-modal";
import DatasourceAdHocQueryModal from "../modals/datasource-ad-hoc-query-modal";
import EditTableStructureModal from "../modals/edit-table-structure-modal";
import TablePreviewModal from "../modals/table-preview-modal";

import { FORMS, MODALS, TABLES } from "../../constants/config";
import tablesColumns from "../../constants/tables-columns";

import DatasourceAPI from "../../api/datasource-api";
import SchemasAPI from "../../api/schemas-api";
import TablesAPI from "../../api/tables-api";

import { copyToClipboard, stringImposition } from "../../utils/common-helper";
import ModalsHelper from "../../utils/modals-helper";

import { eventDispatch } from "../../hooks/useEventListener";
import { putStorage, useStorageListener, useStorageValue } from "../../hooks/useStorage";
import useQueryParams from "../../hooks/useQueryParams";

const StructureTable = ({ rows = [], wrapperExtra = ``, innerExtrra = `` }) => {
    return useMemo(
        () => (
            <Scrollable outerExtra={`max-height: 710px;`}>
                <Table
                    name={`DATASOURCE_TABLE_STRUCTURE`}
                    withPagination={false}
                    withHeader={false}
                    columns={[
                        { name: `fieldName`, extra: `font-weight: bold;` },
                        { name: `fieldType`, extra: `flex: 2;` },
                    ]}
                    rows={rows}
                />
            </Scrollable>
        ),
        [rows]
    );
};

const DatasourcePage = () => {
    const { selectedSourceId: dirtySelectedSourceId } = useParams();
    const selectedSourceId = +dirtySelectedSourceId?.split?.(`&`)?.[0];
    const { params = { type: selectedDatasourceType }, setByKey, removeParam } = useQueryParams();
    const { type: selectedDatasourceType, table: selectedTableName } = params;

    const datasources = useStorageListener((state) => state?.tables?.DATASOURCE_LIST?.rows ?? []);
    const selectedDatasource = _.find(datasources, { id: selectedSourceId });
    // const structure = useStorageListener(
    //     (state) => _.find(get(state, `datasources.structures`), { id: selectedDatasource?.id })?.data ?? {}
    // );
    const schemas = useStorageListener(
        (state) =>
            get(state, `datasources.schemas[${selectedDatasource?.id}]`)?.filter?.(
                (i) => ![`information_schema`, `pg_catalog`]?.includes?.(i)
            ) ?? []
    );
    const selectedSchema = `public`;
    const setSelectedSchema = (newSchema) => putStorage(`pages.INTERMIDIATE_STRAGE.selectedSchema`, newSchema);
    const tables = useStorageListener(
        (state) => state?.datasources?.tables?.[selectedDatasource?.id]?.[selectedSchema] ?? []
    );
    const selectedTable = _.find(tables, { tableName: selectedTableName });
    const [tableSearch, setTableSearch] = useState(``);

    const handlers = {
        openCreateDatasourceModal: () => {
            ModalsHelper.showModal(MODALS.CREATE_DATASOURCE_MODAL, { type: selectedDatasourceType });
        },
        openEditDatasourceModal: () => {
            ModalsHelper.showModal(MODALS.EDIT_DATASOURCE_MODAL, selectedDatasource);
        },
        openCreateSchemaInStorageModal: () => {
            ModalsHelper.showModal(MODALS.CREATE_SCHEMA_IN_STORAGE, selectedDatasource);
        },
        openRenameSchemaModal: () => {
            ModalsHelper.showModal(MODALS.EDIT_SCHEMA_NAME, {
                datasourceId: selectedDatasource?.id,
                name: selectedSchema,
            });
        },
        openDeleteSchemeModal: async () => {
            const { tables } = await DatasourceAPI.getDatasourceTableStructure(selectedDatasource?.id);
            if (tables?.length > 0) {
                ModalsHelper.showModal(MODALS.MODALITY, {
                    title: `Удаление схемы, содержащей данные`,
                    description: `Схема, которую вы хотите удалить, содержит данные. Удаление схемы приведет к их потере.`,
                    cancelButton: {
                        background: `#DADADA`,
                        children: `Отмена`,
                    },
                    confirmButton: {
                        background: `red`,
                        children: `Удалить`,
                        onClick: async () => {
                            await SchemasAPI.deleteSchema(selectedDatasource?.id, selectedSchema);
                        },
                    },
                });
            } else {
                ModalsHelper.showModal(MODALS.MODALITY, {
                    title: `Вы действительно хотите удалить схему?`,
                    cancelButton: {
                        background: `#DADADA`,
                        children: `Отмена`,
                    },
                    confirmButton: {
                        background: `red`,
                        children: `Удалить`,
                        onClick: async () => {
                            await SchemasAPI.deleteSchema(selectedDatasource?.id, selectedSchema);
                        },
                    },
                });
            }
        },
        openCreateTableInSchemaModal: () => {
            ModalsHelper.showModal(MODALS.CREATE_TABLE_IN_SCHEMA, {
                datasourceId: selectedDatasource?.id,
                schema: selectedSchema,
            });
        },
        openEditTableNameModal: () => {
            ModalsHelper.showModal(MODALS.EDIT_TABLE_NAME, {
                datasourceId: selectedDatasource?.id,
                schemaName: selectedSchema,
                tableName: selectedTable?.tableName,
            });
        },
        openDeleteTableModal: () => {
            ModalsHelper.showModal(MODALS.MODALITY, {
                // title: `Удаление таблицы, содержащей данные`,
                description: `Вы действительно хотите удалить таблицу?`,
                cancelButton: {
                    background: `#DADADA`,
                    children: `Отмена`,
                },
                confirmButton: {
                    background: `red`,
                    children: `Удалить`,
                    onClick: async () => {
                        await TablesAPI.deleteTable({
                            datasourceId: selectedDatasource?.id,
                            schemaName: selectedSchema,
                            tableName: selectedTable?.tableName,
                        });
                    },
                },
            });
        },
        openAdHocModal: () => {
            ModalsHelper.showModal(MODALS.DATASOURCE_AD_HOC_QUERY_MODAL, {
                datasourceId: selectedDatasource?.id,
                schemaName: selectedSchema,
            });
        },
        setSelectedDatasourceType: (e) => {
            setByKey(`type`, e.target.value);
        },
        setSelectedTableName: (table) => () => {
            setByKey(`table`, table);
        },
        changeSchema: async (e) => {
            setSelectedSchema(e.target.value);
        },
        fetchPreviewFunction: async () => {
            if (selectedDatasource?.id && selectedTableName) {
                const response = await DatasourceAPI.getDatasourceTablePreview(
                    selectedDatasource?.id,
                    selectedTableName
                );
                return response;
            }
        },
        fetchTables: async () => {
            if (selectedDatasource?.id && selectedSchema) {
                await TablesAPI.getTable({ datasourceId: selectedDatasource?.id, schemaName: selectedSchema });
            }
        },
        openEditScructurreModal: () => {
            ModalsHelper.showModal(MODALS.EDIT_TABLE_STRUCTURE, {
                datasourceId: selectedDatasource?.id,
                schemaName: selectedSchema,
                table: selectedTable,
            });
        },
        openTablePreviewModal: () => {
            ModalsHelper.showModal(MODALS.TABLE_PREVIEW, {
                datasourceId: selectedDatasource?.id,
                table: selectedTable,
            });
        },
    };

    useEffect(handlers.fetchPreviewFunction, [selectedDatasource?.id, selectedDatasource?.schema, selectedTableName]);
    useEffect(handlers.fetchTables, [selectedDatasource?.id, selectedSchema]);

    useEffect(DatasourceAPI.getDatasources, []);
    useEffect(() => {
        if (selectedDatasource?.id) {
            DatasourceAPI.getDatasourceTableStructure(selectedDatasource?.id);
            SchemasAPI.getSchemas(selectedDatasource?.id);
        }
    }, [selectedDatasource?.id]);

    useEffect(() => {
        if (!selectedSchema) {
            setSelectedSchema(schemas?.includes?.(`public`) ? `public` : schemas?.[0]);
        }
    }, [schemas]);

    return (
        <>
            <EditAccessCredentialsModal />
            <CreateScheaInStorageModal />
            <EditSchemaNameModal />
            <CreateTableInSchemaModal />
            <EditTableNameModal />
            <DatasourceAdHocQueryModal />
            <EditTableStructureModal />
            <TablePreviewModal />

            <RowWrapper extra={`margin-bottom: 28px;`}>
                <Heading>
                    <Link to={`/datasources`}>
                        <ArrowBack />
                    </Link>
                    Просмотр источника <span>{selectedDatasource?.name}</span>
                </Heading>
            </RowWrapper>
            {selectedDatasource && (
                <>
                    <RowWrapper extra={`margin-top: 35px; align-items: flex-start;`}>
                        <Frame extra={`width: 270px; align-items: flex-start;`}>
                            <H2 extra={`height: 35px;`}>Таблицы</H2>
                            {/* <Input
                                value={tableSearch}
                                onChange={(e) => setTableSearch(e.target.value)}
                                placeholder="Поиск по названию таблицы"
                                extra={`width: inherit;`}
                            /> */}
                            <Scrollable outerExtra={`max-height: 530px;`}>
                                {tables?.filter?.((i) => stringImposition(i?.tableName, tableSearch))?.length === 0 && (
                                    <Frame>Таблицы в выбранной схеме отсутствуют</Frame>
                                )}
                                {tables
                                    ?.filter?.((i) => stringImposition(i?.tableName, tableSearch))
                                    ?.map?.((table, index) => (
                                        <Fragment key={index}>
                                            <Button
                                                onClick={handlers.setSelectedTableName(table.tableName)}
                                                extra={`margin-top: 12px; background: ${
                                                    selectedTable?.tableName === table?.tableName
                                                        ? `#FFFFFF`
                                                        : `transparent`
                                                }; color: black; box-shadow: unset; width: 100%; border: 1px solid #DADADA; justify-content: flex-start; word-break: break-all; text-align: left;`}
                                            >
                                                {table.tableName}
                                            </Button>
                                        </Fragment>
                                    ))}
                            </Scrollable>
                            <Button
                                extra={`width: 100%; margin-top: 12px;`}
                                background={`blue`}
                                onClick={handlers.openAdHocModal}
                                disabled={!selectedSchema}
                            >
                                Ad-Hoc запрос
                            </Button>
                        </Frame>
                        <Frame extra={`width: 100%; flex: 1; margin-left: 30px; max-width: calc(100% - 164px - 30px);`}>
                            {selectedTable && (
                                <>
                                    <RowWrapper extra={`margin-bottom: 16px;`}>
                                        <RightSectionHeader>
                                            Структура таблицы <span>{selectedTable?.tableName}</span>
                                        </RightSectionHeader>
                                        <Frame extra={`flex-direction: row;`}>
                                            <Button
                                                extra={`margin-right: 5px;`}
                                                onClick={handlers.openTablePreviewModal}
                                            >
                                                Посмотреть данные
                                            </Button>
                                            {/* <Button onClick={handlers.openEditScructurreModal}>
                                                Редактировать структуру
                                            </Button> */}
                                        </Frame>
                                    </RowWrapper>
                                    <StructureTable rows={selectedTable?.fields ?? []} />
                                </>
                            )}
                        </Frame>
                    </RowWrapper>
                </>
            )}
        </>
    );
};

const ArrowBack = styled(Frame)`
    width: 24px;
    height: 24px;
    margin-right: 16px;
    cursor: pointer;
    background: url("${require(`../../assets/icons/keyboard-backspace.svg`).default}") no-repeat center center / contain;

    &:hover {
        transform: translate(-2px, 0);
    }
`;

const RightSectionHeader = styled(H2)`
    color: ${({ theme }) => theme.grey};
    flex-direction: row;
    span {
        color: #000000;
        margin-left: 7px;
    }
`;

const ToggleComponent = styled(Frame)`
    font-size: 24px;
    line-height: 24px;
    font-weight: bold;
    color: ${({ theme }) => theme.blue};
    margin-left: 10px;
    padding: 5px 0;
    border-bottom: 1px solid ${({ theme }) => theme.blue};
    flex-direction: row;

    &:after {
        content: "";
        width: 24px;
        height: 24px;
        background: url("${require(`../../assets/icons/arrow-right-blue.svg`).default}") no-repeat center center /
            contain;
    }
`;

const Icon = styled(Frame)`
    width: 16px;
    height: 16px;
    background: url(${({ src }) => require(`../../assets/icons/${src}.svg`).default}) no-repeat center center / contain;
    margin: 3px;
`;

const Card = styled(Frame)`
    padding: 24px 30px;
    flex-direction: row;
    background: #ffffff;
    border: 1px solid #dadada;
    border-radius: 4px;

    ${({ extra }) => extra}
`;

const Heading = styled(H1)`
    line-height: 36px;
    flex-direction: row;

    span {
        margin-left: 5px;
        color: ${({ theme }) => theme.blue};
    }
`;

export default DatasourcePage;
/*eslint-enable*/
