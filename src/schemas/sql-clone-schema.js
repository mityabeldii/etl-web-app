/*eslint-disable*/
const sqlCloneSchema = (yup, data) => ({
    operatorConfigData: yup
        .object()
        .transform((d) => d ?? {})
        .shape({
            source: yup
                .object()
                .transform((d) => d ?? {})
                .shape({
                    sourceId: yup.string().required(`Это поле обязательно`),
                }),
            target: yup
                .object()
                .transform((d) => d ?? {})
                .shape({
                    targetId: yup.string().required(`Это поле обязательно`),
                }),
        }),
});
export default sqlCloneSchema;
/*eslint-enable*/
