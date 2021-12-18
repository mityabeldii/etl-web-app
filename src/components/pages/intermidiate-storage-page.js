/*eslint-disable*/
import { useEffect, useState, Fragment, useMemo } from "react";
import styled, { css } from "styled-components";
import { useLocation } from "react-router";
import _ from "lodash";

import { Frame, Button, H1, H2, RowWrapper, Input, Form, Dropdown } from "../ui-kit/styled-templates";
import Select from "../ui-kit/select";
import Table from "../ui-kit/table";
import { Control } from "../ui-kit/control";

import EditAccessCredentialsModal from "../modals/edit-access-credentials-modal";
import CreateScheaInStorageModal from "../modals/create-schema-in-storage-modal";
import EditSchemaNameModal from "../modals/edit-schema-name-modal";
import CreateTableInSchemaModal from "../modals/create-table-in-schema-modal";
import EditTableNameModal from "../modals/edit-table-name-modal";
import DatasourceAdHocQueryModal from "../modals/datasource-ad-hoc-query-modal";

import { MODALS, TABLES } from "../../constants/config";
import tablesColumns from "../../constants/tables-columns";

import DatasourceAPI from "../../api/datasource-api";

import { eventDispatch } from "../../hooks/useEventListener";
import { putStorage, useStorageListener } from "../../hooks/useStorage";
import useQueryParams from "../../hooks/useQueryParams";
import { copyToClipboard } from "../../utils/common-helper";
import ModalsHelper from "../../utils/modals-helper";

const StructureTable = ({ rows }) => {
    return useMemo(
        () => (
            <Table
                name={`DATASOURCE_TABLE_STRUCTURE`}
                withPagination={false}
                withHeader={false}
                columns={[
                    { name: `name`, extra: `font-weight: bold;` },
                    { name: `type`, extra: `flex: 2;` },
                ]}
                rows={rows}
            />
        ),
        [rows]
    );
};

const PreviewTable = ({ rows, columns }) => {
    return useMemo(
        () => (
            <Table
                name={`DATASOURCE_TABLE_PREVIE`}
                withPagination={false}
                columns={_.map(columns, `name`)?.map?.((i) => ({ label: i, name: i }))}
                rows={rows}
                useBackendProcessing={true}
                fetchFunction={(options) => {
                    console.log(options);
                    // DatasourceAPI.getDatasourceTablePreview(selectedDatasource?.id, selectedTableName)
                }}
            />
        ),
        [rows]
    );
};

const IntermidiateStoragePage = () => {
    const { params = { type: selectedDatasourceType }, setByKey } = useQueryParams();
    const { type: selectedDatasourceType, table: selectedTableName } = params;

    const handlers = {
        openCreateDatasourceModal: () => {
            ModalsHelper.showModal(MODALS.CREATE_DATA_SOURCE_MODAL);
        },
        openEditAccessCredentialsModal: () => {
            ModalsHelper.showModal(MODALS.EDIT_ACCESS_CREDENTIALS);
        },
        openCreateSchemaInStorageModal: () => {
            ModalsHelper.showModal(MODALS.CREATE_SCHEMA_IN_STORAGE);
        },
        openEditSchemaNameModal: () => {
            ModalsHelper.showModal(MODALS.EDIT_SCHEMA_NAME);
        },
        openDeleteSchemeModal: () => {
            ModalsHelper.showModal(MODALS.MODALITY, {
                title: `Удаление схемы, содержащей данные`,
                description: `Схема, которую вы хотите удалить, содержит данные. Удаление схемы приведет к их утрате.`,
                cancelButton: {
                    background: `#DADADA`,
                    children: `Отмена`,
                },
                confirmButton: {
                    background: `red`,
                    children: `Удалить`,
                },
            });
        },
        openCreateTableInSchemaModal: () => {
            ModalsHelper.showModal(MODALS.CREATE_TABLE_IN_SCHEMA);
        },
        openEditTableNameModal: () => {
            ModalsHelper.showModal(MODALS.EDIT_TABLE_NAME);
        },
        openDeleteTableModal: () => {
            ModalsHelper.showModal(MODALS.MODALITY, {
                title: `Удаление таблицы, содержащей данные`,
                description: `Таблица, которую вы хотите удалить, содержит данные. Удаление таблицы приведет к их утрате.`,
                cancelButton: {
                    background: `#DADADA`,
                    children: `Отмена`,
                },
                confirmButton: {
                    background: `red`,
                    children: `Удалить`,
                },
            });
        },
        openAdHocModal: () => {
            ModalsHelper.showModal(MODALS.DATASOURCE_AD_HOC_QUERY_MODAL);
        },
        setSelectedDatasourceType: (e) => {
            setByKey(`type`, e.target.value);
        },
        setSelectedTableName: (table) => () => {
            setByKey(`table`, table);
        },
        changeSchema: async (e) => {
            await DatasourceAPI.updateDatasourceSchema(selectedDatasource.id, selectedDatasource.schema, e.target.value);
        },
    };

    useEffect(DatasourceAPI.getDatasources, []);
    const datasources = useStorageListener((state) => state?.tables?.DATASOURCE_LIST?.rows ?? []);
    const datasourcesNames = [`STAGING`, `DWH`];
    const selectedDatasource = _.find(datasources, { type: selectedDatasourceType });
    useEffect(() => {
        if (selectedDatasource?.id) {
            DatasourceAPI.getDatasourceTableStructure(selectedDatasource?.id);
            DatasourceAPI.getSchemas(selectedDatasource?.id);
        }
    }, [selectedDatasource?.id]);
    useEffect(() => {
        if (selectedDatasource?.id && selectedTableName) {
            DatasourceAPI.getDatasourceTablePreview(selectedDatasource?.id, selectedTableName);
        }
    }, [selectedDatasource?.id, selectedTableName]);
    const structure = useStorageListener((state) => _.find(_.get(state, `datasources.structures`), { id: selectedDatasource?.id })?.data ?? {});
    const schemas = useStorageListener((state) => _.get(state, `datasources.schemas[${selectedDatasource?.id}]`) ?? []);
    const preview = useStorageListener((state) => _.get(state, `datasources.preview.${selectedDatasource?.id}.${selectedTableName}`) ?? []);
    const { tables } = structure;
    const selectedTable = _.find(tables, { name: selectedTableName });
    return (
        <>
            <EditAccessCredentialsModal />
            <CreateScheaInStorageModal />
            <EditSchemaNameModal />
            <CreateTableInSchemaModal />
            <EditTableNameModal />
            <DatasourceAdHocQueryModal />

            <RowWrapper extra={`margin-bottom: 28px;`}>
                <Frame extra={`flex-direction: row;`}>
                    <Heading>Структура хранилища </Heading>
                    <Select
                        value={selectedDatasourceType}
                        onChange={handlers.setSelectedDatasourceType}
                        options={datasourcesNames?.map?.((i) => ({ label: i, value: i }))}
                        toggleComponent={(d) => <ToggleComponent>{d?.label}</ToggleComponent>}
                    />
                </Frame>
                {!selectedDatasource && (
                    <Button leftIcon={`plus-in-circle-white`} background={`orange`} onClick={handlers.openCreateDatasourceModal}>
                        Добавить источник
                    </Button>
                )}
            </RowWrapper>
            {selectedDatasource && (
                <>
                    <RowWrapper extra={`margin-bottom: 28px;`}>
                        <H2>Реквизиты доступа</H2>
                        <Button background={`blue`} onClick={handlers.openEditAccessCredentialsModal}>
                            Редактировать реквизиты
                        </Button>
                    </RowWrapper>
                    <Form>
                        <Card extra={`> * { margin-right: 30px; &:last-child { margin-right: 0px; }; };`}>
                            <Control.Input
                                placeholder={`Хост`}
                                label={`Хост`}
                                readOnly
                                value={selectedDatasource?.host}
                                rightIcon={{
                                    src: `copy`,
                                    onClick: () => {
                                        copyToClipboard(selectedDatasource?.host);
                                        eventDispatch(`THROW_SUCCESS`, `Хост скопирован в буфер обмена`);
                                    },
                                }}
                            />
                            <Control.Input
                                placeholder={`Порт`}
                                label={`Порт`}
                                readOnly
                                value={selectedDatasource?.port}
                                rightIcon={{
                                    src: `copy`,
                                    onClick: () => {
                                        copyToClipboard(selectedDatasource?.port);
                                        eventDispatch(`THROW_SUCCESS`, `Порт скопирован в буфер обмена`);
                                    },
                                }}
                            />
                            <Control.Input
                                placeholder={`База`}
                                label={`База`}
                                readOnly
                                value={selectedDatasource?.url}
                                rightIcon={{
                                    src: `copy`,
                                    onClick: () => {
                                        copyToClipboard(selectedDatasource?.url);
                                        eventDispatch(`THROW_SUCCESS`, `База скопирована в буфер обмена`);
                                    },
                                }}
                            />
                        </Card>
                    </Form>
                    <RowWrapper extra={`margin-top: 35px; align-items: flex-start;`}>
                        <Frame extra={`width: 190px; align-items: flex-start;`}>
                            <H2 extra={`margin-bottom: 16px; height: 38px;`}>Схема</H2>
                            <Select
                                options={schemas?.map?.((i) => ({ label: i, value: i }))}
                                value={selectedDatasource?.schema}
                                onChange={handlers.changeSchema}
                            />
                            <RowWrapper extra={`margin-top: 4px;`}>
                                <Button
                                    extra={`width: 100%; flex: 1; min-width: unset; margin-right: 4px;`}
                                    onClick={handlers.openEditSchemaNameModal}
                                >
                                    <Icon src={`edit-white`} />
                                </Button>
                                <Button extra={`width: 100%; flex: 1; min-width: unset;`} background={`red`} onClick={handlers.openDeleteSchemeModal}>
                                    <Icon src={`cross-white`} />
                                </Button>
                            </RowWrapper>
                            <Button
                                extra={`width: 100%; margin-top: 12px; padding: 8px 11px;`}
                                leftIcon={`plus-in-circle-white`}
                                background={`orange`}
                                onClick={handlers.openCreateSchemaInStorageModal}
                            >
                                Добавить схему
                            </Button>
                            <H2 extra={`margin-top: 35px; height: 35px;`}>Таблицы</H2>
                            {tables?.map?.((table, index) => (
                                <Fragment key={index}>
                                    <Button
                                        onClick={handlers.setSelectedTableName(table.name)}
                                        extra={`margin-top: 12px; background: ${
                                            selectedTable?.name === table?.name ? `#FFFFFF` : `transparent`
                                        }; color: black; box-shadow: unset; width: 100%; border: 1px solid #DADADA; justify-content: flex-start; word-break: break-all; text-align: left;`}
                                    >
                                        {table.name}
                                    </Button>
                                    {selectedTable?.name === table?.name && (
                                        <RowWrapper extra={`margin-top: 4px;`}>
                                            <Button
                                                extra={`width: 100%; flex: 1; min-width: unset; margin-right: 4px;`}
                                                onClick={handlers.openEditTableNameModal}
                                            >
                                                <Icon src={`edit-white`} />
                                            </Button>
                                            <Button
                                                extra={`width: 100%; flex: 1; min-width: unset;`}
                                                background={`red`}
                                                onClick={handlers.openDeleteTableModal}
                                            >
                                                <Icon src={`cross-white`} />
                                            </Button>
                                        </RowWrapper>
                                    )}
                                </Fragment>
                            ))}

                            <Button
                                extra={`width: 100%; margin-top: 12px; padding: 8px 15px; font-size: 13px;`}
                                background={`orange`}
                                leftIcon={`plus-in-circle-white`}
                                onClick={handlers.openCreateTableInSchemaModal}
                            >
                                Добавить таблицу
                            </Button>
                            <Button extra={`width: 100%; margin-top: 36px;`} background={`blue`} onClick={handlers.openAdHocModal}>
                                Ad-Hoc запрос
                            </Button>
                        </Frame>
                        <Frame extra={`width: 100%; flex: 1; margin-left: 30px;`}>
                            {selectedTable && (
                                <>
                                    <RowWrapper extra={`margin-bottom: 16px;`}>
                                        <RightSectionHeader>
                                            Структура таблицы <span>{selectedTable?.name}</span>
                                        </RightSectionHeader>
                                        <Button>Редактировать структуру</Button>
                                    </RowWrapper>
                                    <StructureTable rows={selectedTable?.columns ?? []} />
                                    <RowWrapper extra={`margin-bottom: 16px; margin-top: 40px;`}>
                                        <RightSectionHeader>
                                            Предпросмотр таблицы <span>{selectedTable?.name}</span>
                                        </RightSectionHeader>
                                        <Frame extra={`flex-direction: row;`}>
                                            <Frame>Показывать строк:</Frame>
                                            <Select
                                                extra={`margin-left: 5px; width: 50px;`}
                                                value={preview?.pagination?.perPage}
                                                options={[5, 10, 15].map?.((i) => ({ label: i, value: i }))}
                                                onChange={(e) => {
                                                    putStorage(
                                                        `datasources.preview.${selectedDatasource?.id}.${selectedTableName}.pagination.perPage`,
                                                        e.target.value
                                                    );
                                                }}
                                            />
                                        </Frame>
                                    </RowWrapper>
                                    <PreviewTable columns={selectedTable?.columns} rows={preview?.rows} />
                                </>
                            )}
                        </Frame>
                    </RowWrapper>
                </>
            )}
        </>
    );
};

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
        background: url("${require(`../../assets/icons/arrow-right-blue.svg`).default}") no-repeat center center / contain;
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

export default IntermidiateStoragePage;
/*eslint-enable*/
