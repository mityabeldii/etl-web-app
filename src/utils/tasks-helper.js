/*eslint-disable*/
import _ from "lodash";
import { useParams } from "react-router";

import { OPERATORS, TABLES } from "../constants/config";

import { getStorage } from "../hooks/useStorage";

const TasksHelper = {
    getMappingStructure: (taskId) => {
        const { process_id } = useParams();
        const { tasks = [] } = getStorage((state) => state?.processes ?? [])?.[process_id] ?? {};
        const task = tasks?.find?.((i) => i?.id === taskId) ?? {};
        const structure = _.get(task, `operatorConfigData.storageStructure`);
        const { operator } = task;
        return ([OPERATORS.JOIN, OPERATORS.SQL_EXTRACT, OPERATORS.CALCULATED]?.includes?.(operator) ? Object.values(structure ?? {})?.flat?.() : structure)?.map?.(({ storageFieldName: i }) => i) ?? [];
    },
    getSourcesNames: (task) => {
        const { process_id } = useParams();
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
};

export default TasksHelper;
/*eslint-enable*/
