export declare function isNull(value: any): value is null | undefined;
export declare function isBoolean(value: any): value is boolean;
export declare function isString(value: any): value is string;
export declare function isNumber(value: any): value is number;
export declare function isInteger(value: any): value is number;
export declare function isArray(value: any): value is any[];
export declare function isObject(value: any): value is Record<PropertyKey, any>;
export declare function isEnumValue<TEnum extends Record<string, string | number>, TValues extends TEnum[keyof TEnum]>(value: any, enumeration: TEnum): value is TValues;
export declare function has<TKey extends PropertyKey>(value: any, keys: TKey | readonly TKey[]): value is Record<TKey, unknown>;
export declare function instanceOf<TCtor extends new (...args: any) => any>(value: any, ctor: TCtor): value is InstanceType<TCtor>;
