/*eslint-disable*/
import { useState } from "react";
import styled, { css } from "styled-components";
import { useLocation } from "react-router";

import { Frame, Button, H1, H2, RowWrapper, Input, Form } from "../ui-kit/styled-templates";
import Select from "../ui-kit/select";
import Table from "../ui-kit/table";
import { Control } from "../ui-kit/control";

import { MODALS, TABLES } from "../../constants/config";
import tablesColumns from "../../constants/tables-columns";
import { eventDispatch } from "../../hooks/useEventListener";

import DatasourceAPI from "../../api/datasource-api";

import { useStorageListener } from "../../hooks/useStorage";
import EditAccessCredentialsModal from "../modals/edit-access-credentials-modal";
import CreateScheaInStorageModal from "../modals/create-schema-in-storage-modal";
import EditSchemaNameModal from "../modals/edit-schema-name-modal";

const StructureTable = () => {
    const rows = [
        { column_name: `city_id`, type: `integer` },
        { column_name: `city_name`, type: `string` },
        { column_name: `region_id`, type: `integer` },
    ];
    return (
        <Table
            name={`intermidiate-storage-structure`}
            withPagination={false}
            withHeader={false}
            columns={[
                { name: `column_name`, extra: `font-weight: bold;` },
                { name: `type`, extra: `flex: 2;` },
            ]}
            rows={rows}
        />
    );
};

const PreviewTable = () => {
    const rows = [
        { city_id: `1`, city_name: `clinton`, region_id: `03` },
        { city_id: `2`, city_name: `yellowknife`, region_id: `46` },
        { city_id: `3`, city_name: `waterloo`, region_id: `90` },
        { city_id: `4`, city_name: `regina`, region_id: `62` },
        { city_id: `5`, city_name: `quebek`, region_id: `12` },
    ];
    const columns = [
        { name: `city_id`, label: `city_id` },
        { name: `city_name`, label: `city_name` },
        { name: `region_id`, label: `region_id` },
    ];
    return <Table name={`intermidiate-storage-structure`} withPagination={false} columns={columns} rows={rows} />;
};

const IntermidiateStoragePage = () => {
    const handlers = {
        openCreateDatasourceModal: () => {
            eventDispatch(`OPEN_${MODALS.CREATE_DATA_SOURCE_MODAL}_MODAL`);
        },
        openEditAccessCredentialsModal: () => {
            eventDispatch(`OPEN_${MODALS.EDIT_ACCESS_CREDENTIALS}_MODAL`);
        },
        openCreateSchemaInStorageModal: () => {
            eventDispatch(`OPEN_${MODALS.CREATE_SCHEMA_IN_STORAGE}_MODAL`);
        },
        openEditSchemaNameModal: () => {
            eventDispatch(`OPEN_${MODALS.EDIT_SCHEMA_NAME}_MODAL`);
        },
        openDeleteSchemeModal: () => {
            eventDispatch(`OPEN_${MODALS.MODALITY}_MODAL`, {
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
    };
    return (
        <>
            <EditAccessCredentialsModal />
            <CreateScheaInStorageModal />
            <EditSchemaNameModal />

            <RowWrapper extra={`margin-bottom: 28px;`}>
                <Heading>
                    Структура хранилища <span>Staging</span>
                </Heading>
                <Button leftIcon={`plus-in-circle-white`} background={`orange`} onClick={handlers.openCreateDatasourceModal}>
                    Добавить источник
                </Button>
            </RowWrapper>
            <RowWrapper extra={`margin-bottom: 28px;`}>
                <H2>Реквизиты доступа</H2>
                <Button background={`blue`} onClick={handlers.openEditAccessCredentialsModal}>
                    Редактировать реквизиты
                </Button>
            </RowWrapper>
            <Form>
                <Card extra={`> * { margin-right: 30px; &:last-child { margin-right: 0px; }; };`}>
                    <Control.Input placeholder={`Хост`} label={`Хост`} />
                    <Control.Input placeholder={`Порт`} label={`Порт`} />
                    <Control.Input placeholder={`База`} label={`База`} />
                </Card>
            </Form>
            <RowWrapper extra={`margin-top: 35px; align-items: flex-start;`}>
                <Frame extra={`width: 190px; align-items: flex-start;`}>
                    <H2 extra={`margin-bottom: 16px; height: 38px;`}>Схема</H2>
                    <Select />
                    <RowWrapper extra={`margin-top: 4px;`}>
                        <Button extra={`width: 100%; flex: 1; min-width: unset; margin-right: 4px;`} onClick={handlers.openEditSchemaNameModal} >
                            <Icon src={`edit-white`} />
                        </Button>
                        <Button extra={`width: 100%; flex: 1; min-width: unset;`} background={`red`} onClick={handlers.openDeleteSchemeModal} >
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
                    <Button
                        extra={`margin-top: 12px; background: transparent; color: black; box-shadow: unset; width: 100%; border: 1px solid #DADADA; justify-content: flex-start;`}
                    >
                        efficitur
                    </Button>
                    <Button
                        extra={`margin-top: 12px; background: transparent; color: black; box-shadow: unset; width: 100%; border: 1px solid #DADADA; justify-content: flex-start;`}
                    >
                        lorem
                    </Button>
                    <Button
                        extra={`margin-top: 12px; background: transparent; color: black; box-shadow: unset; width: 100%; border: 1px solid #DADADA; justify-content: flex-start;`}
                    >
                        vulputate
                    </Button>
                    <RowWrapper extra={`margin-top: 4px;`}>
                        <Button extra={`width: 100%; flex: 1; min-width: unset; margin-right: 4px;`}>
                            <Icon src={`edit-white`} />
                        </Button>
                        <Button extra={`width: 100%; flex: 1; min-width: unset;`} background={`red`}>
                            <Icon src={`cross-white`} />
                        </Button>
                    </RowWrapper>
                    <Button
                        extra={`margin-top: 12px; background: transparent; color: black; box-shadow: unset; width: 100%; border: 1px solid #DADADA; justify-content: flex-start;`}
                    >
                        scelerisque
                    </Button>
                    <Button
                        extra={`margin-top: 12px; background: transparent; color: black; box-shadow: unset; width: 100%; border: 1px solid #DADADA; justify-content: flex-start;`}
                    >
                        nibh
                    </Button>
                    <Button
                        extra={`margin-top: 12px; background: transparent; color: black; box-shadow: unset; width: 100%; border: 1px solid #DADADA; justify-content: flex-start;`}
                    >
                        urna
                    </Button>
                    <Button
                        extra={`width: 100%; margin-top: 12px; padding: 8px 15px; font-size: 13px;`}
                        background={`orange`}
                        leftIcon={`plus-in-circle-white`}
                    >
                        Добавить таблицу
                    </Button>
                    <Button extra={`width: 100%; margin-top: 36px;`} background={`blue`}>
                        Ad-Hoc запрос
                    </Button>
                </Frame>
                <Frame extra={`width: 100%; flex: 1; margin-left: 30px;`}>
                    <RowWrapper extra={`margin-bottom: 16px;`}>
                        <H2>Структура таблицы vulputate</H2>
                        <Button>Редактировать структуру</Button>
                    </RowWrapper>
                    <StructureTable />
                    <RowWrapper extra={`margin-bottom: 16px; margin-top: 40px;`}>
                        <H2>Предпросмотр таблицы vulputate</H2>
                        <Frame>Показывать строк:</Frame>
                    </RowWrapper>
                    <PreviewTable />
                </Frame>
            </RowWrapper>
        </>
    );
};

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
