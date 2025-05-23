export function strValToNumber(str) {
    if (str === "0") {
        return 0;
    }
    else if (typeof str === "string") {
        return parseFloat(str);
    }
    return undefined;
}
export function rgbToHex(rgb) {
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    return ("#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b));
}
export function getUniqueId() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return "_" + Math.random().toString(36).substr(2, 9);
}
export function isIPAddress(str) {
    if (!str) {
        return false;
    }
    return str.search(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/g) > -1;
}
export function getIPConfigObject(str) {
    if (!str || !isIPAddress(str)) {
        return null;
    }
    const segment = str.split(".");
    return {
        a: parseInt(segment[0]),
        b: parseInt(segment[1]),
        c: parseInt(segment[2]),
        d: parseInt(segment[3]),
    };
}
export function getIPStringFromValues(ip1, ip2, ip3, ip4) {
    if (ip1 !== undefined &&
        ip2 !== undefined &&
        ip3 !== undefined &&
        ip4 !== undefined) {
        return `${ip1}.${ip2}.${ip3}.${ip4}`;
    }
    return null;
}
