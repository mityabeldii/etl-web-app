/*eslint-disable*/
import _ from 'lodash';

const toSentance = (s) => _.capitalize(_.toLower(_.startCase(s)));

const upperFirst = (s) => _.upperFirst(s);

const toCamel = (s) => _.camelCase(toSentance(s));

const toKebab = (s) => _.kebabCase(toSentance(s));

const toSnake = (s) => _.snakeCase(toSentance(s));

const toPascal = (s) => _.upperFirst(_.camelCase(toSentance(s)));

export default {
    toSentance,
    upperFirst,
    toCamel,
    toKebab,
    toSnake,
    toPascal,
};
/*eslint-enable*/
