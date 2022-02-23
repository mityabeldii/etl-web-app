/*eslint-disable*/
const sqlLoadSchema = (yup, data) => ({
    taskIdSource: yup.string().required(`Это поле обязательно`),
    target: yup.object().shape({
        targetId: yup.string().required(`Это поле обязательно`),
        targetSchemaName: yup.string().required(`Это поле обязательно`),
        targetTableName: yup.string().required(`Это поле обязательно`),
        mappingStructure: yup.array().of(
            yup.object().shape({
                sourceFieldName: yup.string().required(`Это поле обязательно`),
                targetFieldName: yup.string().required(`Это поле обязательно`),
            })
        ),
    }),
    updateSettings: yup.object().shape({
        updateType: yup.string().required(`Это поле обязательно`),
        // primaryKey: yup.string().required(`Это поле обязательно`),
        // lastUpdatedField: yup.string().required(`Это поле обязательно`),
    }),
});
export default sqlLoadSchema;
/*eslint-enable*/
