/*eslint-disable*/
import TasksHelper from "utils/tasks-helper";

const sqlDeleteSchema = (yup, data) => {
    return {
        source: yup
            .object()
            .default({})
            .shape({
                sourceId: yup.string().required(`Это поле обязательно`),
                sourceSchemaName: yup.string().required(`Это поле обязательно`),
                sourceTableName: yup.string().required(`Это поле обязательно`),
                sourceTableFields: yup
                    .array()
                    .min(1, `Это поле обязательно`)
                    .of(
                        yup.object().shape({
                            sourceFieldName: yup.string().required(`Это поле обязательно`),
                        })
                    )
                    .required(`Это поле обязательно`),
            }),
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
    };
};

export default sqlDeleteSchema;
/*eslint-enable*/
