/*eslint-disable*/
const sqlJoinSchema = (yup, data) => ({
    taskIdSource: yup.string().required(`Это поле обязательно`),
    joinTaskIdSource: yup.string().required(`Это поле обязательно`),
    joinSettings: yup.object().shape({
        // logicOperator: yup.string().required(`Это поле обязательно`),
        // conditions: yup.array().of(
        //     yup.object().shape({
        //         // leftJoinField: yup.string().required(`Это поле обязательно`),
        //         // rightJoinField: yup.string().required(`Это поле обязательно`),
        //     })
        // ),
        joinType: yup.string().required(`Это поле обязательно`),
    }),
    storageStructure: yup.object().shape({
        // leftSourceFields: yup.array().of(
        //     yup.object().shape({
        //         // sourceFieldName: yup.string().required(`Это поле обязательно`),
        //         // storageFieldName: yup.string().required(`Это поле обязательно`),
        //     })
        // ),
        // rightSourceFields: yup.array().of(
        //     yup.object().shape({
        //         // sourceFieldName: yup.string().required(`Это поле обязательно`),
        //         // storageFieldName: yup.string().required(`Это поле обязательно`),
        //     })
        // ),
    }),
});
export default sqlJoinSchema;
/*eslint-enable*/
