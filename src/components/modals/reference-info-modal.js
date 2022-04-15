/*eslint-disable*/
import styled, { css } from "styled-components";
import { MODALS, FORMS, FIELD_TYPES, TABLES } from "../../constants/config";

import { Frame, Button, Input, Dropdown, H1, H2, P, Link, Form, RemoveRowButton } from "../ui-kit/styled-templates";
import { Control } from "../ui-kit/control";
import PopUpWrapper from "./pop-up-wrapper";
import Table from "components/ui-kit/table";

import DatasourceAPI from "../../api/datasource-api";

import { eventDispatch } from "../../hooks/useEventListener";
import useFormControl from "../../hooks/useFormControl";
import ModalsHelper from "../../utils/modals-helper";
import useModal from "../../hooks/useModal";
import _ from "lodash";
import TablesAPI from "../../api/tables-api";
import TableFieldsAPI from "../../api/table-fields-api";

const schema = (yup) =>
    yup.object().shape({
        datasourceId: yup.string().required(`Это поле обязательно`),
        schemaName: yup
            .string()
            .matches(/[a-zA-Z0-9_]/g, `Латиница, цифры и «_»`)
            .required(`Это поле обязательно`),
        tableName: yup.string().required(`Это поле обязательно`),
        fields: yup.array().of(
            yup.object().shape({
                fieldName: yup
                    .string()
                    .matches(/[a-zA-Z0-9_]/g, `Латиница, цифры и «_»`)
                    .required(`Это поле обязательно`),
                fieldType: yup.string().required(`Это поле обязательно`),
            })
        ),
    });

const ReferenceInfoModal = () => {
    const { close: closeModal, state } = useModal(MODALS.REFERENCE_INFO_MODAL, {});
    const handlers = {};
    return (
        <PopUpWrapper name={MODALS.REFERENCE_INFO_MODAL} extra="max-width: 90vw; padding: 0; align-items: flex-start;" onClickOutside={closeModal}>
            <H1 extra="margin: 24px;">Справка: список доступных операторов и их описание</H1>
            <Table
                name={TABLES.REFERENCE_INFO_TABLE}
                withPagination={false}
                columns={[
                    { name: `operator`, label: `Оператор`, extra: "flex: unset; width: 120px;" },
                    { name: `description`, label: `Описание`, extra: "flex: 2;" },
                    { name: `source`, label: `Источник входных данных для оператора` },
                    { name: `target`, label: `Куда помещаются выходные данные оператора` },
                ]}
                rows={[
                    {
                        operator: `SQL_CLONE`,
                        description: `Оператор предназначен для клонирования данных из внешнего источника в целевую базу данных. Также есть возможность настройки инкрементального обновления данных. Подходит для синхронизации различных справочников, реестров в хранилище.`,
                        source: `Внешний источник`,
                        target: `Хранилище данных`,
                    },
                    {
                        operator: `SQL_EXTRACT`,
                        description: `Оператор предназначен для извлечение данных из внешнего источника во вспомогательное хранилище (контекст процесса) для их дальнейшей обработки перед загрузкой в хранилище данных`,
                        source: `Внешний источник`,
                        target: `Вспомогательное хранилище`,
                    },
                    {
                        operator: `JOIN`,
                        description: `Оператор предназначен для соединения двух наборов данных по ключу. Наборы данных перед этим должны быть загружены во вспомогательное хранилище`,
                        source: `Вспомогательное хранилище (выбор двух задач из списка предыдущих задач процесса, которые на выходе загружают данные во вспомогательное хранилище)`,
                        target: `Вспомогательное хранилище`,
                    },
                    {
                        operator: `CALСULATED`,
                        description: `Оператор предназначен для создания нового поля в наборе данных -  расчетного элемента. Набор данных перед этим должен быть загружен во вспомогательное хранилище`,
                        source: `Вспомогательное хранилище (выбор задачи из списка предыдущих задач процесса, которые на выходе загружают данные во вспомогательное хранилище)`,
                        target: `Вспомогательное хранилище`,
                    },
                    {
                        operator: `SQL_LOAD`,
                        description: `Оператор предназначен для загрузки итогового набора данных из вспомогательного хранилища в хранилище данных`,
                        source: `Вспомогательное хранилище (выбор задачи из списка предыдущих задач процесса, которые на выходе загружают данные во вспомогательное хранилище)`,
                        target: `Хранилище данных`,
                    },
                ]}
            />
        </PopUpWrapper>
    );
};

export default ReferenceInfoModal;
/*eslint-enable*/
