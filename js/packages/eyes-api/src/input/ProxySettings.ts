import * as utils from '@applitools/utils'

export type ProxySettings = {
  url: string
  username?: string
  password?: string
}

export class ProxySettingsData implements Required<ProxySettings> {
  private _proxy: ProxySettings = {} as any

  constructor(proxy: ProxySettings)
  constructor(url: string, username?: string, password?: string, deprecatedIsHttpOnly?: boolean)
  constructor(proxyOrUrl: ProxySettings | string, username?: string, password?: string) {
    utils.guard.notNull(proxyOrUrl, {name: 'proxyOrUrl'})
    if (utils.types.isString(proxyOrUrl)) {
      return new ProxySettingsData({url: proxyOrUrl, username, password})
    }
    this._proxy = proxyOrUrl
  }

  get url(): string {
    return this._proxy.url
  }
  getUri(): string {
    return this.url
  }
  getUrl(): string {
    return this.url
  }

  get username(): string {
    return this._proxy.username!
  }
  getUsername(): string {
    return this.username
  }

  get password(): string {
    return this.password
  }
  getPassword(): string {
    return this.password
  }

  get isHttpOnly(): boolean {
    return undefined as never
  }
  getIsHttpOnly(): boolean {
    return this.isHttpOnly
  }

  /** @internal */
  toObject(): ProxySettings {
    return this._proxy
  }

  /** @internal */
  toJSON(): ProxySettings {
    return utils.general.toJSON(this._proxy)
  }

  /** @internal */
  toString() {
    return utils.general.toString(this)
  }
}
