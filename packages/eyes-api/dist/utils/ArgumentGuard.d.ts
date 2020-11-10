declare type NamedParam = {
    name: string;
};
declare type StrictParam = NamedParam & {
    strict?: boolean;
};
declare type NumberParam = StrictParam & {
    lt?: number;
    lte?: number;
    gt?: number;
    gte?: number;
};
declare type StringParam = StrictParam & {
    alpha?: boolean;
    numeric?: boolean;
};
declare type CustomParam = StrictParam & {
    message?: string;
};
export declare function notNull(value: any, { name }: NamedParam): void;
export declare function isBoolean(value: boolean, { name, strict }: StrictParam): void;
export declare function isNumber(value: any, { name, strict, lt, lte, gt, gte }: NumberParam): void;
export declare function isInteger(value: any, { name, strict, lt, lte, gt, gte }: NumberParam): void;
export declare function isLessThen(value: any, limit: number, { name }: NamedParam): void;
export declare function isLessThenOrEqual(value: any, limit: number, { name }: NamedParam): void;
export declare function isGreaterThen(value: any, limit: number, { name }: NamedParam): void;
export declare function isGreaterThenOrEqual(value: any, limit: number, { name }: NamedParam): void;
export declare function isString(value: any, { name, strict, alpha, numeric }: StringParam): void;
export declare function isAlphanumeric(value: any, { name }: NamedParam): void;
export declare function isAlpha(value: any, { name }: NamedParam): void;
export declare function isNumeric(value: any, { name }: NamedParam): void;
export declare function isArray(value: any, { name, strict }: StrictParam): void;
export declare function isObject(value: any, { name, strict }: StrictParam): void;
export declare function isEnumValue(value: any, enumeration: {
    [key: string]: any;
}, { name, strict }: StrictParam): void;
export declare function instanceOf(value: any, ctor: new (...args: any) => any, { name, strict }: StrictParam): void;
export declare function custom(value: any, check: (value: any) => boolean, { name, strict, message }: CustomParam): void;
export {};
