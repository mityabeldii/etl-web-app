/*eslint-disable*/
import { OPERATORS } from "../constants/config";
import sqlCloneSchema from "./sql-clone-schema";
import sqlLoadSchema from "./sql-load-schema";
import sqlExtractSchema from "./sql-extract-schema";
import sqlJoinSchema from "./sql-join-schema";
import sqlCalculatedSchema from "./sql-calculated-schema";
import sqlUnionSchema from "./sql-union-schema";

const createTaskSchema =
    ({ tasks }) =>
    (yup, values) =>
        yup
            .object()
            .transform((d) => d ?? {})
            .shape({
                taskName: yup.string().max(40, `Не более 40 символов`).required(`Это поле обязательно`),
                operator: yup.string().required(`Это поле обязательно`),
                taskQueue: yup
                    .number()
                    .typeError(`Это поле должно быть числом`)
                    .integer(`Это поле должно быть целым числом`)
                    .positive(`Это поле должно быть положительным числом`)
                    .notOneOf(
                        _.map(
                            tasks?.filter?.((i) => i?.id !== values?.id),
                            `taskQueue`
                        ),
                        `Процесс с таким порядковым номером уже существует`
                    )
                    .required(`Это поле обязательно`),
                operatorConfigData: yup.object().shape({
                    ...{
                        [OPERATORS.SQL_CLONE]: sqlCloneSchema(yup, values),
                        [OPERATORS.SQL_LOAD]: sqlLoadSchema(yup, values),
                        [OPERATORS.SQL_EXTRACT]: sqlExtractSchema(yup, values),
                        [OPERATORS.JOIN]: sqlJoinSchema(yup, values),
                        [OPERATORS.CALCULATED]: sqlCalculatedSchema(yup, values),
                        [OPERATORS.UNION]: sqlUnionSchema(yup, values),
                    }[values?.operator],
                }),
            });

export default createTaskSchema;
/*eslint-enable*/
