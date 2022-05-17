/*eslint-disable*/
const sqlLoadSchema = (yup, data) => ({
    taskIdSource: yup.number().required(`Это поле обязательно`),
    unionTaskIdSource: yup.number().required(`Это поле обязательно`),
    unionType: yup.string().required(`Это поле обязательно`),
    fields: yup.array().of(yup.string().required(`Это поле обязательно`)).required(`Это поле обязательно`),
    unionFields: yup.array().of(yup.string().required(`Это поле обязательно`)).required(`Это поле обязательно`),
    storageStructure: yup.array().of(
        yup.object().shape({
            sourceFieldName: yup.string().required(`Это поле обязательно`),
            storageFieldName: yup.string().required(`Это поле обязательно`),
        })
    ),
});
export default sqlLoadSchema;
/*eslint-enable*/
