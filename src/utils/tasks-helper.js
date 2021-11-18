/*eslint-disable*/
import _ from "lodash";
import { useParams } from "react-router";

import { OPERATORS } from "../constants/config";

import { getStorage } from "../hooks/useStorage";

const TasksHelper = {
    getMappingStructure: (taskId) => {
        const { process_id } = useParams();
        const { tasks = [] } = getStorage((state) => state?.processes ?? [])?.[process_id] ?? {};
        const task = tasks?.find?.((i) => i?.id === taskId) ?? {};
        const structure = _.get(task, `operatorConfigData.storageStructure`);
        const { operator } = task;
        return (operator === OPERATORS.JOIN ? Object.values(structure ?? {})?.flat?.() : structure)?.map?.(({ storageFieldName: i }) => i) ?? [];
    },
};

export default TasksHelper;
/*eslint-enable*/
