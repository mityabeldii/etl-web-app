/*eslint-disable*/
const sqlCloneSchema = (yup, data) => {
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
        target: yup
            .object()
            .default({})
            .shape({
                targetId: yup.string().required(`Это поле обязательно`),
                targetId: yup.string().required(`Это поле обязательно`),
                targetSchemaName: yup.string().required(`Это поле обязательно`),
                targetTableName: yup.string().required(`Это поле обязательно`),
            }),
        mappingStucture: yup
            .array()
            .default([])
            .of(
                yup.object().shape({
                    sourceFieldName: yup.string().required(`Это поле обязательно`),
                    targetFieldName: yup.string().required(`Это поле обязательно`),
                })
            )
            .required(`Это поле обязательно`),
        updateSettings: yup
            .object()
            .default({})
            .shape({
                updateType: yup.string().required(`Это поле обязательно`),
                ...({
                    REPLACE: {},
                    INCREMENT_UPSERT: {
                        lastUpdatedFieldSource: yup.string().required(`Это поле обязательно`),
                        lastUpdatedFieldTarget: yup.string().required(`Это поле обязательно`),
                        primaryKey: yup.string().required(`Это поле обязательно`),
                    },
                    INCREMENT_INSERT: {
                        lastCreatedFieldSource: yup.string().required(`Это поле обязательно`),
                        lastCreatedFieldTarget: yup.string().required(`Это поле обязательно`),
                    },
                    INCREMENT_LOAD: {
                        lastUpdatedFieldSource: yup.string().required(`Это поле обязательно`),
                        lastUpdatedFieldTarget: yup.string().required(`Это поле обязательно`),
                    },
                }?.[data?.operatorConfigData?.updateSettings?.updateType] ?? {}),
            }),
    };
};

export default sqlCloneSchema;
/*eslint-enable*/
