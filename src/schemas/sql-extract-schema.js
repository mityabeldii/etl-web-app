/*eslint-disable*/
const sqlLoadSchema = (yup, data) => ({
    source: yup.object().shape({
        // sourceId: yup.string().required(`Это поле обязательно`),
        sourceSchemaName: yup.string().required(`Это поле обязательно`),
        sourceTableName: yup.string().required(`Это поле обязательно`),
        sourceTableFields: yup.array().of(
            yup.object().shape({
                sourceFieldName: yup.string().required(`Это поле обязательно`),
                sourceFieldType: yup.string().required(`Это поле обязательно`),
            })
        ),
        // sqlQuery: yup.string().required(`Это поле обязательно`),
    }),
    storageStructure: yup.array().of(
        yup.object().shape({
            sourceFieldName: yup.string().required(`Это поле обязательно`),
            // storageFieldName: yup.string().required(`Это поле обязательно`),
        })
    )
});
export default sqlLoadSchema;
/*eslint-enable*/
