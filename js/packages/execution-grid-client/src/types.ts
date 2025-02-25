import {type Proxy} from '@applitools/req'

export interface ECClient {
  readonly url: string
  readonly port: number
  unref(): void
  close(): void
}

export interface ECClientSettings {
  serverUrl: string
  proxy?: Proxy
  capabilities?: ECCapabilities
  port?: number
  /** @internal */
  tunnel?: {
    serverUrl?: string
    groupSize?: number
    pool?: {
      maxInuse?: number
      timeout?: {idle?: number; expiration?: number}
    }
  }
}

export interface ECCapabilities {
  eyesServerUrl?: string
  apiKey?: string
  sessionName?: string
  useSelfHealing?: boolean
  tunnel?: boolean
  timeout?: number
  inactivityTimeout?: number
  requestDriverTimeout?: number
  selfHealingMaxRetryTime?: number
}
