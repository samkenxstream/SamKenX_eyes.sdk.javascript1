"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOf = exports.has = exports.isEnumValue = exports.isObject = exports.isArray = exports.isInteger = exports.isNumber = exports.isString = exports.isBoolean = exports.isNull = void 0;
function isNull(value) {
    return value == null;
}
exports.isNull = isNull;
function isBoolean(value) {
    return typeof value === 'boolean' || value instanceof Boolean;
}
exports.isBoolean = isBoolean;
function isString(value) {
    return Object.prototype.toString.call(value) === '[object String]';
}
exports.isString = isString;
function isNumber(value) {
    return typeof value === 'number' || value instanceof Number;
}
exports.isNumber = isNumber;
function isInteger(value) {
    return isNumber(value) && Number.isInteger(value);
}
exports.isInteger = isInteger;
function isArray(value) {
    return Array.isArray(value);
}
exports.isArray = isArray;
function isObject(value) {
    return typeof value === 'object' && value !== null;
}
exports.isObject = isObject;
function isEnumValue(value, enumeration) {
    const values = new Set(Object.values(enumeration));
    return values.has(value);
}
exports.isEnumValue = isEnumValue;
function has(value, keys) {
    if (!isObject(value))
        return false;
    if (!isArray(keys))
        keys = [keys];
    for (const key of keys) {
        if (!Object.prototype.hasOwnProperty.call(value, key)) {
            return false;
        }
    }
    return true;
}
exports.has = has;
function instanceOf(value, ctor) {
    return value instanceof ctor;
}
exports.instanceOf = instanceOf;
//# sourceMappingURL=TypeUtils.js.map