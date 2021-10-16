/*eslint-disable*/
import { isna } from './common-helper';

const MaskHelper = {
    mask: (value = ``, pattern = ``, options = {}) => {
        let { placeholderSymbol = ``, placeholderWord = `` } = options;
        let result = [];
        let shift = 0;
        pattern.split(``).forEach((i, j) => {
            if (i === `#`) {
                result.push(value?.[j - shift] ?? placeholderWord?.[j] ?? placeholderSymbol);
            } else {
                if (!value?.[j - shift] && isna(placeholderWord)) {
                    return result.join(``);
                }
                shift += 1;
                result.push(i);
            }
        });
        return result.join(``);
    },

    unmask: (value = ``, pattern = ``, placeholderSymbol = ``) =>
        pattern
            .split(``)
            .map((i, j) => (i === `#` ? value?.[j] ?? placeholderSymbol : ``))
            .join(``),

    isFullFilled: (masked = ``, pattern = ``) => {
        return masked?.length === pattern?.length;
    },

    create: (format) => format.replaceAll(/[A-Za-z]/g, `#`),
};

export default MaskHelper;

/*eslint-enable*/
