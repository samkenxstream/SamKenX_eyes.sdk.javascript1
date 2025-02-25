export type ScreenOrientation = 'portrait' | 'landscape' | 'portrait-secondary' | 'landscape-secondary'

export type Cookie = {
  name: string
  value: string
  domain?: string
  path?: string
  expiry?: number
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
}
