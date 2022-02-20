/*eslint-disable*/
import { OPERATORS } from "../constants/config";
import sqlCloneSchema from "./sql-clone-schema";
import sqlLoadSchema from "./sql-load-schema";

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
                    }[values?.operator],
                }),
            });

export default createTaskSchema;
/*eslint-enable*/
