/*eslint-disable*/
import { CALCULATION_FUNCTION_TYPES } from "constants/config";

const sqlLoadSchema = (yup, data) => {
    return {
        taskIdSource: yup.string().required(`Это поле обязательно`),
        calculationSettings: yup.array().of(
            yup.object().shape({
                newFieldName: yup.string().required(`Это поле обязательно`),
                newFieldType: yup.string().required(`Это поле обязательно`),
                mathFunction: yup.string().required(`Это поле обязательно`),
                attr1: yup.string().required(`Это поле обязательно`),
                attr2: yup
                    .string()
                    .test(
                        `Test attr2`,
                        `Это поле обязательно`,
                        (value, { parent }) => value || !CALCULATION_FUNCTION_TYPES?.[parent?.mathFunction]?.twoArguments
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

export default sqlLoadSchema;
/*eslint-enable*/
