/*eslint-disable*/
import TasksHelper from "utils/tasks-helper";

const sqlFilterSchema = (yup, data) => {
    return {
        taskIdSource: yup.string().required(`Это поле обязательно`),
        filter: yup
            .array()
            .default([])
            .of(
                yup.object().shape({
                    field: yup.string().required(`Это поле обязательно`),
                    operator: yup.string().required(`Это поле обязательно`),
                    value: yup
                        .string()
                        .test(
                            `Operator is required`,
                            `Это поле обязательно`,
                            (value, { parent }) => value || !TasksHelper.comparisonOperatorsWithRequiredValue?.includes?.(parent?.operator)
                        ),
                })
            ),
        storageStructure: yup.array().of(
            yup.object().shape({
                sourceFieldName: yup.string().required(`Это поле обязательно`),
                storageFieldName: yup.string().required(`Это поле обязательно`),
            })
        ),
    };
};

export default sqlFilterSchema;
/*eslint-enable*/
