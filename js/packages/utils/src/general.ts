import * as types from './types'

export function getEnvValue<T extends 'boolean' | 'number' | 'string' = 'string'>(
  name: string,
  type?: T,
): T extends 'boolean' ? boolean : T extends 'number' ? number : T extends 'string' ? string : string | undefined {
  if (!process) return undefined as any
  const value = process.env[`APPLITOOLS_${name}`]
  if (value === undefined || value === 'null') return undefined as any
  if (type === 'boolean') return ['true', true, '1', 1].includes(value) as any
  if (type === 'number') return Number(value) as any
  return value as any
}

export function guid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0

    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function jwtDecode(token: string): Record<string, any> {
  let payloadSeg = token.split('.')[1]
  payloadSeg += new Array(5 - (payloadSeg.length % 4)).join('=')
  payloadSeg = payloadSeg.replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(Buffer.from(payloadSeg, 'base64').toString())
}

export function sleep(ms: number) {
  if (types.isNumber(ms)) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export function toJSON<TObject extends Record<PropertyKey, any>, TKey extends string, TProps extends Readonly<TKey[]>>(
  object: TObject,
  props: TProps,
): {
  [key in TProps[number]]: TObject[key] extends {toJSON(): any} ? ReturnType<TObject[key]['toJSON']> : TObject[key]
}
export function toJSON<
  TObject extends Record<PropertyKey, any>,
  TKey extends string,
  TProps extends Readonly<Record<TKey, PropertyKey>>,
>(
  object: TObject,
  props: TProps,
): {
  [key in keyof TProps]: TObject[TProps[key]] extends {toJSON(): any}
    ? ReturnType<TObject[TProps[key]]['toJSON']>
    : TObject[TProps[key]]
}
export function toJSON<TObject extends Record<PropertyKey, any>>(
  object: TObject,
): {
  [key in keyof Omit<TObject, symbol>]: TObject[key] extends {toJSON(): any}
    ? ReturnType<TObject[key]['toJSON']>
    : TObject[key]
}
export function toJSON(object: Record<PropertyKey, any>, props?: string[] | Record<string, PropertyKey>) {
  if (!types.isObject(object)) return object
  if (types.isArray(object)) {
    return object.map(value => (value && types.isFunction(value.toJSON) ? value.toJSON() : toJSON(value)))
  }
  const original = props ? Object.values(props) : Object.keys(object)
  const keys = !props || types.isArray(props) ? original : Object.keys(props)
  return keys.reduce((plain: any, key, index) => {
    const value = object[original[index] as string]
    plain[key] = value && types.isFunction(value.toJSON) ? value.toJSON() : toJSON(value)
    return plain
  }, {})
}

export function toString(object: Record<PropertyKey, any>): string {
  return `${object.constructor.name} ${JSON.stringify(object, null, 2)}`
}

export function toUnAnchoredUri(url: string): string {
  const [, result = url] = url.match(/(^[^#]*)/) ?? []
  return result?.replace(/\?\s*$/, '?')
}

export function toUriEncoding(url: string): string {
  return url.replace(/(\\[0-9a-fA-F]{1,6}\s?)/g, s => {
    return String.fromCodePoint(Number.parseInt(s.substring(1).trim(), 16))
  })
}

export function removeUndefinedProps<TObject extends Record<string, any>>(object: TObject): TObject {
  return Object.entries(object).reduce(
    (object, [key, value]) => (value !== undefined ? Object.assign(object, {[key]: value}) : object),
    {} as any,
  )
}

export function absolutizeUrl(url: string, baseUrl: string): string {
  return new URL(url, baseUrl).href
}

export function cachify<TFunc extends (...args: any[]) => any>(
  func: TFunc,
  getKey?: (args: Parameters<TFunc>) => any,
): TFunc & {
  getCachedValues(): ReturnType<TFunc>[]
  setCachedValue(key: any, value: ReturnType<TFunc>): void
  clearCache(): void
} {
  const cache = new Map<string, ReturnType<TFunc>>()
  const funcWithCache = ((...args: Parameters<TFunc>) => {
    const key = stringifyKey(getKey?.(args) ?? args)
    let value = cache.get(key)!
    if (!value) {
      value = func(...args)
      cache.set(key, value)
    }
    return value
  }) as TFunc & {
    getCachedValues(): ReturnType<TFunc>[]
    setCachedValue(key: any, value: Awaited<ReturnType<TFunc>>): void
    clearCache(): void
  }
  funcWithCache.clearCache = () => cache.clear()
  funcWithCache.getCachedValues = () => Array.from(cache.values())
  funcWithCache.setCachedValue = (key, value) => cache.set(stringifyKey(key), value)
  return funcWithCache

  function stringifyKey(key: any): string {
    key = types.isPlainObject(key)
      ? Object.fromEntries(Object.entries(key).sort(([key1], [key2]) => (key1 > key2 ? 1 : -1)))
      : key
    return JSON.stringify(key, (_key, value) => (typeof value === 'function' ? value.toString() : value))
  }
}

export function batchify<
  TFunc extends (batch: [TInput, {resolve(result?: TResult): void; reject(reason?: any): void}][]) => Promise<void>,
  TInput = Parameters<TFunc>[0][number][0],
  TResult = Parameters<Parameters<TFunc>[0][number][1]['resolve']>[0],
>(func: TFunc, {timeout}: {timeout: number}): (input: Parameters<TFunc>[0][number][0]) => Promise<TResult> {
  let pendingInputs = new Map<TInput, {resolve(result: TResult): void; reject(reason?: any): void}>()
  let throttleTimer = false
  return function (input: TInput): Promise<TResult> {
    return new Promise<TResult>(async (resolve, reject) => {
      pendingInputs.set(input, {resolve, reject})
      if (!throttleTimer) {
        throttleTimer = true
        setTimeout(() => {
          func(Array.from(pendingInputs.entries()))
          pendingInputs = new Map()
          throttleTimer = false
        }, timeout)
      }
    })
  }
}

export function wrap<TFunc extends (...args: any[]) => any>(
  func: TFunc,
  wrapper: (func: TFunc, ...args: Parameters<TFunc>) => ReturnType<TFunc>,
): TFunc {
  return new Proxy(func, {
    apply: (func, _this, args: Parameters<TFunc>) => wrapper(func, ...args),
  })
}

export function extend<TTarget extends Record<PropertyKey, any>, TExtension extends Record<PropertyKey, any>>(
  target: TTarget,
  extension: TExtension | ((result: any) => TExtension),
): TTarget & TExtension {
  const result = {} as any
  return Object.defineProperties(result, {
    ...Object.getOwnPropertyDescriptors(target),
    ...Object.getOwnPropertyDescriptors(types.isFunction(extension) ? extension(result) : extension),
  })
}

export function pluralize(object: [] | number, config?: [manyCase: string, singleCase: string]): string {
  const count = types.isArray(object) ? object.length : object
  const isMany = count > 1
  let res = isMany ? 's' : ''
  if (config) {
    res = isMany ? config[0] : config[1]
  }
  return res
}
