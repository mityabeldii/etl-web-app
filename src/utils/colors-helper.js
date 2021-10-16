/*eslint-disable*/
export const colorToChanels = (color = `#000000`) => {
    if (color.indexOf(`#`) > -1) {
        const hex = color.replace("#", "");
        return [parseInt(hex.substring(0, 2), 16), parseInt(hex.substring(2, 4), 16), parseInt(hex.substring(4, 6), 16)];
    }
    return color
        .replace(`rgba`, ``)
        .replace(`rgb`, ``)
        .replace(` `, ``)
        .replace(`(`, ``)
        .replace(`)`, ``)
        .split(`,`)
        .map((i) => +i)
        .slice(0, 3);
};

export const hexToRGB = (hex = `#000000`) => {
    const [r, g, b] = colorToChanels(hex);
    return "rgb(" + r + "," + g + "," + b + ")";
};

export const convertHex = (hex = `#000000`, opacity = 1) => {
    const [r, g, b] = colorToChanels(hex);
    return "rgba(" + r + "," + g + "," + b + "," + opacity + ")";
};

const componentToHex = (c) => (c.toString(16).length == 1 ? "0" + c.toString(16) : c.toString(16));
export const rgbToHex = (r, g, b) => (`#` + componentToHex(r) + componentToHex(g) + componentToHex(b)).toUpperCase();

export const darkerHex = (hex, reverseOpacity = 0.1) => {
    let [r, g, b] = colorToChanels(hex).map((i) => Math.round(i * (1 - reverseOpacity)));
    return rgbToHex(r, g, b);
};
/*eslint-enable*/
