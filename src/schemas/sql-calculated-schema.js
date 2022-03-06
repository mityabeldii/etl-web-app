/*eslint-disable*/
const sqlLoadSchema = (yup, data) => ({
    taskIdSource: yup.string().required(`Это поле обязательно`),
    calculationSettings: yup.array().of(
        yup.object().shape({
            newFieldName: yup.string().required(`Это поле обязательно`),
            newFieldType: yup.string().required(`Это поле обязательно`),
            mathFunction: yup.string().required(`Это поле обязательно`),
            attr1: yup.string().required(`Это поле обязательно`),
            attr2: yup.string().required(`Это поле обязательно`),
        })
    ),
    storageStructure: yup.array().of(
        yup.object().shape({
            sourceFieldName: yup.string().required(`Это поле обязательно`),
            storageFieldName: yup.string().required(`Это поле обязательно`),
        })
    ),
});
export default sqlLoadSchema;
/*eslint-enable*/
