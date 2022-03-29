/*eslint-disable*/
import _ from "lodash";
import { useParams, matchPath } from "react-router-dom";

import { OPERATORS, TABLES } from "../constants/config";

import { getStorage } from "../hooks/useStorage";

const TasksHelper = {
    getMappingStructure: (taskId) => {
        const { process_id } =
            matchPath(window.location.hash.split(`#`)[1].split(`?`)[0], { path: `/processes/configuration/:process_id` }).params ?? {};
        const { tasks = [] } = getStorage((state) => state?.processes ?? [])?.[+process_id] ?? {};
        const task = tasks?.find?.((i) => i?.id === taskId) ?? {};
        const structure = _.get(task, `operatorConfigData.storageStructure`);
        const { operator } = task;
        return (
            ([OPERATORS.JOIN, OPERATORS.SQL_EXTRACT, OPERATORS.CALCULATED]?.includes?.(operator)
                ? Object.values(structure ?? {})?.flat?.()
                : structure
            )?.map?.(({ storageFieldName: i }) => i) ?? []
        );
    },
    getSourcesNames: (task) => {
        let { process_id } = useParams();
        process_id = process_id?.split?.(`&`)?.[0];
        const sources = [
            getStorage(
                (state) => state?.tables?.[TABLES.DATASOURCE_LIST]?.rows?.find(({ id }) => id === task?.operatorConfigData?.source?.sourceId)?.name
            ),
            getStorage(
                (state) => _.get(state, `processes.${process_id}.tasks`)?.find?.((i) => i?.id === task?.operatorConfigData?.taskIdSource)?.taskName
            ),
            getStorage(
                (state) =>
                    _.get(state, `processes.${process_id}.tasks`)?.find?.((i) => i?.id === task?.operatorConfigData?.joinTaskIdSource)?.taskName
            ),
        ]?.filter?.((i) => i);
        return sources?.join?.(`, `);
    },
    syncMappingStructure: (sourceFields, mappingStructure) => {
        return [
            ...(mappingStructure?.filter?.((i) => sourceFields?.includes?.(i?.sourceFieldName)) ?? []),
            ...(sourceFields?.filter?.((sourceFieldName) => !_.find(mappingStructure, { sourceFieldName })) ?? []),
        ];
    },
};

export default TasksHelper;
/*eslint-enable*/
