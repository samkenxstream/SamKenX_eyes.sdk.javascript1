import type {Location, Size, Region} from '@applitools/utils'
import {type Logger} from '@applitools/logger'
import {type HashedResource} from './resources/resource'
import {type AbortSignal} from 'abort-controller'
import {type ProcessResourcesSettings} from './resources/process-resources'

export type DomSnapshot = {
  cdt: any[]
  url: string
  resourceUrls: string[]
  resourceContents: Record<string, {type: string; value: Buffer; dependencies?: string[]} | {errorStatusCode: number}>
  frames: DomSnapshot[]
  cookies?: Cookie[]
}
export type AndroidSnapshot = {
  platformName: 'android'
  vhsType: string
  vhsHash: {hashFormat: string; hash: string; contentType: string}
}
export type IOSSnapshot = {
  platformName: 'ios'
  vhsCompatibilityParams: Record<string, any>
} & (
  | {
      resourceContents: Record<
        string,
        {type: string; value: Buffer; dependencies?: string[]} | {errorStatusCode: number}
      >
    }
  | {vhsHash: {hashFormat: string; hash: string; contentType: string}}
)
export type Snapshot = DomSnapshot | AndroidSnapshot | IOSSnapshot

export type Selector = string | {selector: string; type?: string; shadow?: Selector; frame?: Selector}

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

export type DesktopBrowser =
  | 'chrome'
  | 'chrome-one-version-back'
  | 'chrome-two-versions-back'
  | 'firefox'
  | 'firefox-one-version-back'
  | 'firefox-two-versions-back'
  | 'ie'
  | 'ie10'
  | 'edge'
  | 'edgechromium'
  | 'edgelegacy'
  | 'edgechromium-one-version-back'
  | 'edgechromium-two-versions-back'
  | 'safari'
  | 'safari-earlyaccess'
  | 'safari-one-version-back'
  | 'safari-two-versions-back'
export type DesktopBrowserRenderer = {
  name?: DesktopBrowser
  width: number
  height: number
}

export type ScreenOrientation = 'portrait' | 'landscape'

export type ChromeEmulationDevice =
  | 'Blackberry PlayBook'
  | 'BlackBerry Z30'
  | 'Galaxy A5'
  | 'Galaxy Note 10'
  | 'Galaxy Note 10 Plus'
  | 'Galaxy Note 2'
  | 'Galaxy Note 3'
  | 'Galaxy Note 4'
  | 'Galaxy Note 8'
  | 'Galaxy Note 9'
  | 'Galaxy S3'
  | 'Galaxy S5'
  | 'Galaxy S8'
  | 'Galaxy S8 Plus'
  | 'Galaxy S9'
  | 'Galaxy S9 Plus'
  | 'Galaxy S10'
  | 'Galaxy S10 Plus'
  | 'Galaxy S20'
  | 'Galaxy S22'
  | 'Galaxy Tab S7'
  | 'iPad'
  | 'iPad 6th Gen'
  | 'iPad 7th Gen'
  | 'iPad Air 2'
  | 'iPad Mini'
  | 'iPad Pro'
  | 'iPhone 11'
  | 'iPhone 11 Pro'
  | 'iPhone 11 Pro Max'
  | 'iPhone 4'
  | 'iPhone 5/SE'
  | 'iPhone 6/7/8'
  | 'iPhone 6/7/8 Plus'
  | 'iPhone X'
  | 'iPhone XR'
  | 'iPhone XS'
  | 'iPhone XS Max'
  | 'Kindle Fire HDX'
  | 'Laptop with HiDPI screen'
  | 'Laptop with MDPI screen'
  | 'Laptop with touch'
  | 'LG G6'
  | 'LG Optimus L70'
  | 'Microsoft Lumia 550'
  | 'Microsoft Lumia 950'
  | 'Nexus 10'
  | 'Nexus 4'
  | 'Nexus 5'
  | 'Nexus 5X'
  | 'Nexus 6'
  | 'Nexus 6P'
  | 'Nexus 7'
  | 'Nokia Lumia 520'
  | 'Nokia N9'
  | 'OnePlus 7T'
  | 'OnePlus 7T Pro'
  // | 'OnePlus 8'
  // | 'OnePlus 8 Pro'
  | 'Pixel 2'
  | 'Pixel 2 XL'
  | 'Pixel 3'
  | 'Pixel 3 XL'
  | 'Pixel 4'
  | 'Pixel 4 XL'
  | 'Pixel 5'
  | 'Sony Xperia 10 II'
  | 'Huawei Mate 50 Pro'
  | 'Huawei Matepad 11'
export type ChromeEmulationDeviceRenderer = {
  chromeEmulationInfo: {
    deviceName: ChromeEmulationDevice
    screenOrientation?: ScreenOrientation
  }
}

export type IOSDevice =
  | 'iPhone 14 Pro Max'
  | 'iPhone 14'
  | 'iPhone 13 Pro Max'
  | 'iPhone 13 Pro'
  | 'iPhone 13'
  | 'iPhone 12 Pro Max'
  | 'iPhone 12 Pro'
  | 'iPhone 12'
  | 'iPhone 12 mini'
  | 'iPhone 11 Pro'
  | 'iPhone 11 Pro Max'
  | 'iPhone 11'
  | 'iPhone XR'
  | 'iPhone Xs'
  | 'iPhone X'
  | 'iPhone 8'
  | 'iPhone 8 Plus'
  | 'iPhone 7'
  | 'iPhone SE (1st generation)'
  | 'iPad Pro (12.9-inch) (3rd generation)'
  | 'iPad Pro (11-inch) (4th generation)'
  | 'iPad (7th generation)'
  | 'iPad (9th generation)'
  | 'iPad Air (2nd generation)'
  | 'iPad Air (4th generation)'
export type IOSVersion = 'latest' | 'latest-1'
export type IOSDeviceRenderer = {
  iosDeviceInfo: {
    deviceName: IOSDevice
    version?: IOSVersion
    screenOrientation?: ScreenOrientation
  }
}

export type AndroidDevice =
  | 'Pixel 3 XL'
  | 'Pixel 4'
  | 'Pixel 4 XL'
  | 'Pixel 5'
  | 'Pixel 6'
  | 'Galaxy S10'
  | 'Galaxy S10 Plus'
  | 'Galaxy Note 10'
  | 'Galaxy Note 10 Plus'
  | 'Galaxy S20'
  | 'Galaxy S20 Plus'
  | 'Galaxy S21'
  | 'Galaxy S21 Plus'
  | 'Galaxy S21 Ultra'
  | 'Galaxy S22'
  | 'Galaxy S22 Plus'
  | 'Galaxy Tab S7'
  | 'Galaxy Tab S8'
  | 'Xiaomi Redmi Note 10 JE'
  | 'Xiaomi Redmi Note 11'
  | 'Xiaomi Redmi Note 11 Pro'
  | 'Sony Xperia 1 II'
  | 'Sony Xperia 10 II'
  | 'Sony Xperia Ace II'
  | 'Huawei P30 Lite'
export type AndroidVersion = 'latest' | 'latest-1'
export type AndroidDeviceRenderer = {
  androidDeviceInfo: {
    deviceName: AndroidDevice
    version?: AndroidVersion
    screenOrientation?: ScreenOrientation
  }
}

export type Renderer = (
  | DesktopBrowserRenderer
  | ChromeEmulationDeviceRenderer
  | IOSDeviceRenderer
  | AndroidDeviceRenderer
) & {
  /**
   * The id of the renderer
   * Used to identify the renderer if the same renderer is used multiple times
   * @internal
   **/
  id?: string
}

export interface UFGClient {
  createRenderTarget(options: {snapshot: Snapshot; settings?: ProcessResourcesSettings}): Promise<RenderTarget>
  bookRenderer(options: {settings: RendererSettings}): Promise<RendererEnvironment>
  render(options: {target: RenderTarget; settings: RenderSettings; signal?: AbortSignal}): Promise<RenderResult>
  getChromeEmulationDevices(options?: {logger?: Logger}): Promise<Record<ChromeEmulationDevice, any>>
  getIOSDevices(options?: {logger?: Logger}): Promise<Record<IOSDevice, any>>
  getAndroidDevices(options?: {logger?: Logger}): Promise<Record<AndroidDevice, any>>
  getCachedResourceUrls(): string[]
}

export type RendererEnvironment = {
  rendererId: string
  rendererInfo: {type: 'native' | 'web'; renderer: Renderer}
  rawEnvironment: Record<string, any>
}

export type RenderTarget = {
  snapshot: HashedResource
  resources: Record<string, HashedResource | {errorStatusCode: number}>
  source?: string
  vhsType?: string
  vhsCompatibilityParams?: Record<string, any>
}

export type RendererSettings = {
  type: 'web' | 'native'
  renderer: Renderer
}

export type RenderSettings = RendererSettings & {
  rendererId: string
  region?: Region | Selector
  fully?: boolean
  scrollRootElement?: Selector
  stitchMode?: 'Scroll' | 'CSS' | 'Resize'
  selectorsToCalculate?: Selector[]
  includeFullPageSize?: boolean
  ufgOptions?: Record<string, any>
  hooks?: {
    beforeCaptureScreenshot: string
  }
  sendDom?: boolean
}

export type RenderResult = {
  renderId: string
  status: 'rendering' | 'rendered' | 'error'
  error?: any

  image: Buffer | string
  size?: Size
  name?: string
  source?: string
  dom?: string
  locationInViewport?: Location // location in the viewport
  locationInView?: Location // location in view/page
  fullViewSize?: Size // full size of the view/page
  selectorRegions?: Region[][]
}
