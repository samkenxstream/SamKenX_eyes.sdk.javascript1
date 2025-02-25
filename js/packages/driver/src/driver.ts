import type {Size, Region} from '@applitools/utils'
import type {ScreenOrientation, Cookie} from './types'
import {type Selector} from './selector'
import {type SpecType, type SpecDriver, type DriverInfo, type WaitOptions} from './spec-driver'
import {type Element} from './element'
import {Context, type ContextReference} from './context'
import {makeLogger, type Logger} from '@applitools/logger'
import {HelperIOS} from './helper-ios'
import {HelperAndroid} from './helper-android'
import {parseUserAgent} from './user-agent'
import {parseUserAgentData} from './user-agent-data'
import {parseCapabilities} from './capabilities'
import * as specUtils from './spec-utils'
import * as utils from '@applitools/utils'

const snippets = require('@applitools/snippets')

type DriverState<T extends SpecType> = {
  world?: string
  nmlElement?: Element<T> | null
}

type DriverOptions<T extends SpecType> = {
  spec: SpecDriver<T>
  driver: T['driver']
  logger?: Logger
  customConfig?: {useCeilForViewportSize?: boolean}
}

// eslint-disable-next-line
export class Driver<T extends SpecType> {
  private _target: T['driver']

  private _mainContext: Context<T>
  private _currentContext: Context<T>
  private _driverInfo: DriverInfo = {}
  private _helper?: HelperAndroid<T> | HelperIOS<T> | null
  private _state: DriverState<T> = {}
  private _logger: Logger

  private _customConfig: {useCeilForViewportSize?: boolean} = {}

  protected readonly _spec: SpecDriver<T>

  constructor(options: DriverOptions<T>) {
    this._customConfig = options.customConfig ?? {}
    this._spec = options.spec
    this._logger = options.logger?.extend({label: 'driver'}) ?? makeLogger({label: 'driver'})
    this._target = this._spec.transformDriver?.(options.driver) ?? options.driver

    if (!this._spec.isDriver(this._target)) {
      throw new TypeError('Driver constructor called with argument of unknown type!')
    }

    this._mainContext = new Context({
      spec: this._spec,
      context: this._spec.extractContext?.(this._target) ?? (this._target as T['context']),
      driver: this,
      logger: this._logger,
    })
    this._currentContext = this._mainContext
  }

  get target(): T['driver'] {
    return this._target
  }
  get currentContext(): Context<T> {
    return this._currentContext
  }
  get mainContext(): Context<T> {
    return this._mainContext
  }
  get features() {
    return this._driverInfo?.features
  }
  get deviceName(): string | undefined {
    return this._driverInfo?.deviceName
  }
  get platformName(): string | undefined {
    return this._driverInfo?.platformName
  }
  get platformVersion(): string | number | undefined {
    return this._driverInfo?.platformVersion
  }
  get browserName(): string | undefined {
    return this._driverInfo?.browserName
  }
  get browserVersion(): string | number | undefined {
    return this._driverInfo?.browserVersion
  }
  get userAgent(): string | undefined {
    return this._driverInfo?.userAgent
  }
  get orientation(): ScreenOrientation | undefined {
    return this._driverInfo.orientation
  }
  get pixelRatio(): number {
    return this._driverInfo.pixelRatio ?? 1
  }
  get viewportScale(): number {
    return this._driverInfo.viewportScale ?? 1
  }
  get statusBarSize(): number | undefined {
    return this._driverInfo.statusBarSize ?? (this.isNative ? 0 : undefined)
  }
  get navigationBarSize(): number | undefined {
    return this._driverInfo.navigationBarSize ?? (this.isNative ? 0 : undefined)
  }
  get isNative(): boolean {
    return (!this.isWebView && this._driverInfo?.isNative) ?? false
  }
  get isWebView(): boolean {
    return (this._driverInfo?.isNative && this._driverInfo?.isWebView) ?? false
  }
  get isWeb(): boolean {
    return this.isWebView || !this.isNative
  }
  get isEmulation(): boolean {
    return this._driverInfo?.isEmulation ?? false
  }
  get isMobile(): boolean {
    return this._driverInfo?.isMobile ?? false
  }
  get isIOS(): boolean {
    return this._driverInfo?.isIOS ?? (!!this.platformName && /iOS/i.test(this.platformName))
  }
  get isAndroid(): boolean {
    return this._driverInfo?.isAndroid ?? (!!this.platformName && /Android/i.test(this.platformName))
  }
  get isMac(): boolean {
    return this._driverInfo?.isMac ?? (!!this.platformName && /mac\s?OS/i.test(this.platformName))
  }
  get isWindows(): boolean {
    return this._driverInfo?.isWindows ?? (!!this.platformName && /Windows/i.test(this.platformName))
  }
  get isChromium(): boolean {
    return (
      this._driverInfo?.isChromium ??
      (!!this.browserName &&
        (/(chrome)/i.test(this.browserName) || (/edge/i.test(this.browserName) && Number(this.browserVersion) > 44)))
    )
  }
  get isIE(): boolean {
    return !!this.browserName && /(internet explorer|ie)/i.test(this.browserName)
  }
  get isEdgeLegacy(): boolean {
    return !!this.browserName && /edge/i.test(this.browserName) && Number(this.browserVersion) <= 44
  }
  get isECClient(): boolean {
    return !!this._driverInfo?.isECClient
  }
  get isEC(): boolean {
    return this.isECClient || (!!this.remoteHostname && /exec-wus.applitools.com/.test(this.remoteHostname))
  }
  get sessionId(): string | undefined {
    return this._driverInfo?.sessionId
  }
  get remoteHostname(): string | undefined {
    return this._driverInfo?.remoteHostname
  }

  updateCurrentContext(context: Context<T>): void {
    this._currentContext = context
  }

  async init(): Promise<this> {
    // NOTE: this is here because saucelabs does not provide right capabilities for the first call
    await this._spec.getCapabilities?.(this.target)
    const capabilities = await this._spec.getCapabilities?.(this.target)
    this._logger.log('Driver capabilities', capabilities)

    const capabilitiesInfo = capabilities && parseCapabilities(capabilities)
    const driverInfo = await this._spec.getDriverInfo?.(this.target)

    this._driverInfo = {...capabilitiesInfo, ...driverInfo}
    this._driverInfo.remoteHostname ??= this._spec.extractHostName?.(this.target) ?? undefined

    if (this.isMobile) {
      this._driverInfo.orientation =
        (await this.getOrientation().catch(() => undefined)) ?? this._driverInfo.orientation
      const world = await this.getCurrentWorld()
      if (world) {
        const [home] = (await this.getWorlds())!
        this._driverInfo.isWebView = world !== home
      }
    }

    if (this.isWeb) {
      const browserInfo = await this.currentContext.executePoll(snippets.getBrowserInfo)
      this._driverInfo.userAgent ??= browserInfo.userAgent
      this._driverInfo.pixelRatio ??= browserInfo.pixelRatio
      this._driverInfo.viewportScale ??= browserInfo.viewportScale

      if (browserInfo.userAgentData && this.isChromium) {
        if (this.isWindows && Number.parseInt(this.browserVersion as string) >= 107) {
          this._driverInfo.platformVersion = browserInfo.platformVersion ?? this._driverInfo.platformVersion
        } else if (this.isMac && Number.parseInt(this.browserVersion as string) >= 90) {
          this._driverInfo.platformVersion = browserInfo.platformVersion ?? this._driverInfo.platformVersion
        }
      }

      if (this._driverInfo.userAgent) {
        const userAgentInfo = parseUserAgent(this._driverInfo.userAgent)
        const userAgentDataInfo = browserInfo.userAgentData && parseUserAgentData(browserInfo.userAgentData)
        this._driverInfo.browserName =
          userAgentInfo.browserName ?? userAgentDataInfo?.browserName ?? this._driverInfo.browserName
        this._driverInfo.browserVersion =
          userAgentInfo.browserVersion ?? userAgentDataInfo?.browserVersion ?? this._driverInfo.browserVersion
        this._driverInfo.isMobile ??= userAgentDataInfo?.isMobile
        this._driverInfo.isChromium ??= userAgentDataInfo?.isChromium
        if (this._driverInfo.isMobile) {
          this._driverInfo.platformName ??= userAgentDataInfo?.platformName ?? userAgentInfo.platformName
          this._driverInfo.platformVersion ??= userAgentDataInfo?.platformVersion ?? userAgentInfo.platformVersion
        } else {
          this._driverInfo.platformName =
            userAgentDataInfo?.platformName ?? userAgentInfo.platformName ?? this._driverInfo.platformName
          this._driverInfo.platformVersion =
            userAgentDataInfo?.platformVersion ?? userAgentInfo.platformVersion ?? this._driverInfo.platformVersion
        }
      }

      if (!this.isMobile && (this.isAndroid || this.isIOS)) {
        this._driverInfo.isMobile = true
        this._driverInfo.isEmulation = this._driverInfo.isChrome
      }

      this._driverInfo.features ??= {}
      this._driverInfo.features.allCookies ??=
        this._driverInfo.isChrome ||
        (!!this._driverInfo.browserName && /chrome/i.test(this._driverInfo.browserName) && !this._driverInfo.isMobile)
    } else {
      // this value always excludes the height of the navigation bar, and sometimes it also excludes the height of the status bar
      let windowSize = await this._spec.getWindowSize!(this.target)
      this._driverInfo.displaySize ??= windowSize

      if (
        this.orientation?.startsWith('landscape') &&
        this._driverInfo.displaySize.height > this._driverInfo.displaySize.width
      ) {
        this._driverInfo.displaySize = {
          width: this._driverInfo.displaySize.height,
          height: this._driverInfo.displaySize.width,
        }
      }

      if (this.isAndroid) {
        // bar sizes could be extracted only on android
        const systemBars = await this._spec.getSystemBars?.(this.target).catch(() => null as never)
        const {statusBar, navigationBar} = systemBars ?? {}

        if (statusBar?.visible) {
          this._logger.log('Driver status bar', statusBar)

          const statusBarSize = statusBar.height

          // when status bar is overlapping content on android it returns status bar height equal to display height
          if (statusBarSize < this._driverInfo.displaySize.height) {
            this._driverInfo.statusBarSize = Math.max(this._driverInfo.statusBarSize ?? 0, statusBarSize)
          }
        }
        if (navigationBar?.visible) {
          this._logger.log('Driver navigation size', navigationBar)

          // if navigation bar is placed on the right side is screen the the orientation is landscape-secondary
          if (navigationBar.x > 0) this._driverInfo.orientation = 'landscape-secondary'

          // navigation bar size could be its height or width depending on screen orientation
          const navigationBarSize = navigationBar[this.orientation?.startsWith('landscape') ? 'width' : 'height']

          // when navigation bar is invisible on android it returns navigation bar size equal to display size
          if (
            navigationBarSize <
            this._driverInfo.displaySize[this.orientation?.startsWith('landscape') ? 'width' : 'height']
          ) {
            this._driverInfo.navigationBarSize = Math.max(this._driverInfo.navigationBarSize ?? 0, navigationBarSize)
          } else {
            this._driverInfo.navigationBarSize = 0
          }
        }

        // bar sizes have to be scaled on android
        this._driverInfo.statusBarSize &&= this._driverInfo.statusBarSize / this.pixelRatio
        this._driverInfo.navigationBarSize &&= this._driverInfo.navigationBarSize / this.pixelRatio

        windowSize = utils.geometry.scale(windowSize, 1 / this.pixelRatio)
        this._driverInfo.displaySize &&= utils.geometry.scale(this._driverInfo.displaySize, 1 / this.pixelRatio)
      }

      if (this.isIOS) {
        if (this.orientation?.startsWith('landscape')) this._driverInfo.statusBarSize = 0
      }

      // calculate viewport location
      this._driverInfo.viewportLocation ??= {
        x: this.orientation === 'landscape' ? this.navigationBarSize! : 0,
        y: this.statusBarSize!,
      }

      // calculate viewport size
      if (!this._driverInfo.viewportSize) {
        this._driverInfo.viewportSize = {...this._driverInfo.displaySize}
        this._driverInfo.viewportSize.height -= this.statusBarSize!
        if (this.isAndroid) {
          this._driverInfo.viewportSize[this.orientation?.startsWith('landscape') ? 'width' : 'height'] -=
            this.navigationBarSize!
        }
      }

      // calculate safe area
      if (this.isIOS && !this._driverInfo.safeArea) {
        this._driverInfo.safeArea = {x: 0, y: 0, ...this._driverInfo.displaySize}
        const topElement = await this.element({
          type: '-ios class chain',
          selector: '**/XCUIElementTypeNavigationBar',
        })
        if (topElement) {
          const topRegion = await this._spec.getElementRegion!(this.target, topElement.target)
          const topOffset = topRegion.y + topRegion.height
          this._driverInfo.safeArea.y = topOffset
          this._driverInfo.safeArea.height -= topOffset
        }
        const bottomElement = await this.element({
          type: '-ios class chain',
          selector: '**/XCUIElementTypeTabBar',
        })
        if (bottomElement) {
          const bottomRegion = await this._spec.getElementRegion!(this.target, bottomElement.target)
          const bottomOffset = bottomRegion.height
          this._driverInfo.safeArea.height -= bottomOffset
        }
      }
    }

    this._logger.log('Combined driver info', this._driverInfo)

    return this
  }

  async getHelper(): Promise<HelperAndroid<T> | HelperIOS<T> | null> {
    if (this._helper === undefined) {
      this._logger.log(`Extracting helper for ${this.isIOS ? 'ios' : 'android'}`)
      this._helper = this.isIOS
        ? await HelperIOS.make({spec: this._spec, driver: this, logger: this._logger})
        : await HelperAndroid.make({spec: this._spec, driver: this, logger: this._logger})
      this._logger.log(`Extracted helper of type ${this._helper?.name}`)
    }
    this._logger.log(`Returning helper for of type ${this._helper?.name ?? null}`)
    return this._helper
  }

  async extractBrokerUrl(): Promise<string | null> {
    if (!this.isNative) return null
    this._logger.log('Broker url extraction is started')
    this._state.nmlElement ??= await this.element({type: 'accessibility id', selector: 'Applitools_View'})
    if (!this._state.nmlElement) return null
    try {
      let result: {error: string; nextPath: string | null}
      do {
        result = JSON.parse(await this._state.nmlElement.getText())
        if (result.nextPath) {
          this._logger.log('Broker url was extraction finished successfully with value', result.nextPath)
          return result.nextPath
        }
        await utils.general.sleep(1000)
      } while (!result.error)
      this._logger.error('Broker url extraction has failed with error', result.error)
      return null
    } catch (error) {
      this._logger.error('Broker url extraction has failed with error and will be retried', error)
      this._state.nmlElement = null
      return this.extractBrokerUrl()
    }
  }

  // About the concept of a  "World":
  //
  // Since "context" is an overloaded term from frames, we have decided to use
  // the concept of a "world" when switching between mobile app contexts (e.g., native and webview(s))
  //
  // Notes:
  // - two new functions need to be added to a spec driver for this to work (`getCurrentWorld` and `switchWorld`)
  // - you can see a reference implementation of this in spec-driver-webdriverio
  // - if a world id is provided it will be used for switching
  // - if a world id is not provided, the first non-native world will be used
  //    (regardless of which world the driver is currently switched into)
  // - before switching, the current world context is stored so it can switched back to later
  //    (with the `restoreState` option)
  // - the native app world can be switched to (with the `goHome` option)
  async switchWorld(options?: {id?: string; restoreState?: boolean; goHome?: boolean}) {
    if (options?.restoreState && !this._state.world) return
    if (!this._spec.getCurrentWorld || !this._spec.switchWorld) {
      this._logger.warn('world switching not implemented in the spec driver, skipping')
      return
    }
    this._logger.log('switchWorld called with', options ? options : 'no options')
    const current = (await this.getCurrentWorld())!
    if (!this._state.world) {
      this._logger.log('storing current world id for future restoration', current)
      this._state.world = current
    }
    let world: string
    if (options?.id) world = options.id
    else if (options?.restoreState) world = this._state.world
    else {
      const [home, next] = (await this.getWorlds())!
      if (options?.goHome) world = home
      else world = next
    }
    this._logger.log('switching world with', world)
    try {
      await this._spec.switchWorld?.(this.target, world)
      await this.init()
    } catch (error: any) {
      throw new Error(`Unable to switch worlds, the original error was: ${error.message}`)
    }
  }

  async getWorlds(): Promise<string[] | null> {
    if (!this._spec.getWorlds) return null
    this._logger.log('Extracting worlds')
    try {
      let worlds = [] as string[]
      for (let attempt = 0; worlds.length <= 1 && attempt < 5; ++attempt) {
        if (attempt > 0) await utils.general.sleep(500)
        worlds = await this._spec.getWorlds(this.target)
      }
      this._logger.log('Worlds were extracted', worlds)
      return worlds
    } catch (error) {
      this._logger.warn('Worlds were not extracted due to the error', error)
      return null
    }
  }

  async getCurrentWorld(): Promise<string | null> {
    if (!this._spec.getCurrentWorld) return null
    try {
      this._logger.log('Extracting current world')
      const current = await this._spec.getCurrentWorld?.(this.target)
      this._logger.log('Current world was extracted', current)
      return current
    } catch (error) {
      this._logger.warn('Current world was not extracted due to the error', error)
      return null
    }
  }

  async getSessionMetadata(): Promise<any> {
    if (this.isECClient) return await this._spec.getSessionMetadata?.(this.target)
  }

  async refreshContexts(): Promise<Context<T>> {
    if (this.isNative) return this.currentContext

    const spec = this._spec

    let currentContext = this.currentContext.target
    let contextInfo = await getContextInfo(currentContext)

    const path = []
    if (spec.parentContext) {
      while (!contextInfo.isRoot) {
        currentContext = await spec.parentContext(currentContext)
        const contextReference = await findContextReference(currentContext, contextInfo)
        if (!contextReference) throw new Error('Unable to find out the chain of frames')
        path.unshift(contextReference)
        contextInfo = await getContextInfo(currentContext)
      }
    } else {
      currentContext = await spec.mainContext(currentContext)
      path.push(...(await findContextPath(currentContext, contextInfo))!)
    }
    this._currentContext = this._mainContext
    return this.switchToChildContext(...path)

    function transformSelector(selector: Selector<T>) {
      return specUtils.transformSelector(spec, selector, {isWeb: true})
    }

    async function getContextInfo(context: T['context']): Promise<any> {
      const [documentElement, selector, isRoot, isCORS] = await spec.executeScript(context, snippets.getContextInfo)
      return {documentElement, selector, isRoot, isCORS}
    }

    async function getChildContextsInfo(context: T['context']): Promise<any[]> {
      const framesInfo = await spec.executeScript(context, snippets.getChildFramesInfo)
      return framesInfo.map(([contextElement, isCORS]: [T['element'], boolean]) => ({
        contextElement,
        isCORS,
      }))
    }

    async function isEqualElements(
      context: T['context'],
      element1: T['element'],
      element2: T['element'],
    ): Promise<boolean> {
      return spec.executeScript(context, snippets.isEqualElements, [element1, element2]).catch(() => false)
    }

    async function findContextReference(context: T['context'], contextInfo: any): Promise<T['element'] | null> {
      if (contextInfo.selector) {
        const contextElement = await spec.findElement(
          context,
          transformSelector({type: 'xpath', selector: contextInfo.selector}),
        )
        if (contextElement) return contextElement
      }
      for (const childContextInfo of await getChildContextsInfo(context)) {
        if (childContextInfo.isCORS !== contextInfo.isCORS) continue
        const childContext = await spec.childContext(context, childContextInfo.contextElement)
        const contentDocument = await spec.findElement(childContext, transformSelector('html'))
        const isWantedContext = await isEqualElements(childContext, contentDocument!, contextInfo.documentElement)
        await spec.parentContext!(childContext)
        if (isWantedContext) return childContextInfo.contextElement
      }
      return null
    }

    async function findContextPath(
      context: T['context'],
      contextInfo: any,
      contextPath: T['element'][] = [],
    ): Promise<T['element'][] | undefined> {
      const contentDocument = await spec.findElement(context, transformSelector('html'))
      if (await isEqualElements(context, contentDocument!, contextInfo.documentElement)) {
        return contextPath
      }
      for (const childContextInfo of await getChildContextsInfo(context)) {
        const childContext = await spec.childContext(context, childContextInfo.contextElement)
        const possibleContextPath = [...contextPath, childContextInfo.contextElement]
        const wantedContextPath = await findContextPath(childContext, contextInfo, possibleContextPath)
        await spec.mainContext(context)

        if (wantedContextPath) return wantedContextPath

        for (const contextElement of contextPath) {
          await spec.childContext(context, contextElement)
        }
      }
    }
  }

  async switchTo(context: Context<T>): Promise<Context<T>> {
    if (await this.currentContext.equals(context)) {
      return (this._currentContext = context)
    }
    const currentPath = this.currentContext.path
    const requiredPath = context.path

    let diffIndex = -1
    for (const [index, context] of requiredPath.entries()) {
      if (currentPath[index] && !(await currentPath[index].equals(context))) {
        diffIndex = index
        break
      }
    }

    if (diffIndex === 0) {
      throw new Error('Cannot switch to the context, because it has different main context')
    } else if (diffIndex === -1) {
      if (currentPath.length === requiredPath.length) {
        // required and current paths are the same
        return this.currentContext
      } else if (requiredPath.length > currentPath.length) {
        // current path is a sub-path of required path
        return this.switchToChildContext(...requiredPath.slice(currentPath.length))
      } else if (currentPath.length - requiredPath.length <= requiredPath.length) {
        // required path is a sub-path of current path
        return this.switchToParentContext(currentPath.length - requiredPath.length)
      } else {
        // required path is a sub-path of current path
        await this.switchToMainContext()
        return this.switchToChildContext(...requiredPath)
      }
    } else if (currentPath.length - diffIndex <= diffIndex) {
      // required path is different from current or they are partially intersected
      // chose an optimal way to traverse from current context to target context
      await this.switchToParentContext(currentPath.length - diffIndex)
      return this.switchToChildContext(...requiredPath.slice(diffIndex))
    } else {
      await this.switchToMainContext()
      return this.switchToChildContext(...requiredPath)
    }
  }

  async switchToMainContext(): Promise<Context<T>> {
    if (this.isNative) throw new Error('Contexts are supported only for web drivers')

    this._logger.log('Switching to the main context')
    await this._spec.mainContext(this.currentContext.target)
    return (this._currentContext = this._mainContext)
  }

  async switchToParentContext(elevation = 1): Promise<Context<T>> {
    if (this.isNative) throw new Error('Contexts are supported only for web drivers')

    this._logger.log('Switching to a parent context with elevation:', elevation)
    if (this.currentContext.path.length <= elevation) {
      return this.switchToMainContext()
    }

    try {
      while (elevation > 0) {
        await this._spec.parentContext!(this.currentContext.target)
        this._currentContext = this._currentContext.parent!
        elevation -= 1
      }
    } catch (err) {
      this._logger.warn('Unable to switch to a parent context due to error', err)
      this._logger.log('Applying workaround to switch to the parent frame')
      const path = this.currentContext.path.slice(1, -elevation)
      await this.switchToMainContext()
      await this.switchToChildContext(...path)
      elevation = 0
    }
    return this.currentContext
  }

  async switchToChildContext(...references: ContextReference<T>[]): Promise<Context<T>> {
    if (this.isNative) throw new Error('Contexts are supported only for web drivers')
    this._logger.log('Switching to a child context with depth:', references.length)
    for (const reference of references) {
      if (reference === this.mainContext) continue
      const context = await this.currentContext.context(reference)
      await context.focus()
    }
    return this.currentContext
  }

  async normalizeRegion(region: Region): Promise<Region> {
    if (this.isWeb) return region

    let normalizedRegion = region
    if (this.isAndroid) {
      normalizedRegion = utils.geometry.scale(normalizedRegion, 1 / this.pixelRatio)
    }
    if (
      this.isIOS &&
      this._driverInfo.safeArea &&
      utils.geometry.isIntersected(normalizedRegion, this._driverInfo.safeArea)
    ) {
      normalizedRegion = utils.geometry.intersect(normalizedRegion, this._driverInfo.safeArea)
    }
    if (this._driverInfo.viewportLocation) {
      normalizedRegion = utils.geometry.offsetNegative(normalizedRegion, this._driverInfo.viewportLocation)
    }
    if (normalizedRegion.y < 0) {
      normalizedRegion.height += normalizedRegion.y
      normalizedRegion.y = 0
    }
    return normalizedRegion
  }

  async getRegionInViewport(context: Context<T>, region: Region): Promise<Region> {
    await context.focus()
    return context.getRegionInViewport(region)
  }

  async element(selector: Selector<T>): Promise<Element<T> | null> {
    return this.currentContext.element(selector)
  }

  async elements(selector: Selector<T>): Promise<Element<T>[]> {
    return this.currentContext.elements(selector)
  }

  async waitFor(selector: Selector<T>, options?: WaitOptions): Promise<Element<T> | null> {
    return this.currentContext.waitFor(selector, options)
  }

  async execute(script: ((arg: any) => any) | string, arg?: any): Promise<any> {
    return this.currentContext.execute(script, arg)
  }

  async takeScreenshot(): Promise<Buffer> {
    const image = await this._spec.takeScreenshot(this.target)
    if (utils.types.isString(image)) {
      return Buffer.from(image.replace(/[\r\n]+/g, ''), 'base64')
    }
    return image
  }

  async getViewportRegion(): Promise<Region> {
    return {
      ...(this._driverInfo?.viewportLocation ?? {x: 0, y: 0}),
      ...(await this.getViewportSize()),
    }
  }

  async getViewportSize(): Promise<Size> {
    let size
    if (this.isNative) {
      if (this._driverInfo?.viewportSize) {
        this._logger.log('Extracting viewport size from native driver using cached value')
        size = this._driverInfo.viewportSize
      } else {
        this._logger.log('Extracting viewport size from native driver')
        size = await this.getDisplaySize()
        size.height -= this.statusBarSize!
      }
      this._logger.log(`Rounding viewport size using`, this._customConfig.useCeilForViewportSize ? 'ceil' : 'round')
      if (this._customConfig.useCeilForViewportSize) {
        size = utils.geometry.ceil(size)
      } else {
        size = utils.geometry.round(size)
      }
    } else if (this._spec.getViewportSize) {
      this._logger.log('Extracting viewport size from web driver using spec method')
      size = await this._spec.getViewportSize(this.target)
    } else {
      this._logger.log('Extracting viewport size from web driver using js snippet')
      size = await this.mainContext.execute(snippets.getViewportSize)
    }

    this._logger.log('Extracted viewport size', size)

    return size
  }

  async setViewportSize(size: Size): Promise<void> {
    if (this.isMobile) return
    if (this._spec.setViewportSize) {
      this._logger.log('Setting viewport size to', size, 'using spec method')
      await this._spec.setViewportSize(this.target, size)
      return
    }

    this._logger.log('Setting viewport size to', size, 'using workaround')

    const requiredViewportSize = size
    let currentViewportSize = await this.getViewportSize()
    if (utils.geometry.equals(currentViewportSize, requiredViewportSize)) return

    let currentWindowSize = await this._spec.getWindowSize!(this.target)
    this._logger.log('Extracted window size', currentWindowSize)

    let attempt = 0
    while (attempt++ < 3) {
      const requiredWindowSize = {
        width: currentWindowSize.width + (requiredViewportSize.width - currentViewportSize.width),
        height: currentWindowSize.height + (requiredViewportSize.height - currentViewportSize.height),
      }
      this._logger.log(`Attempt #${attempt} to set viewport size by setting window size to`, requiredWindowSize)
      await this._spec.setWindowSize!(this.target, requiredWindowSize)

      const prevViewportSize = currentViewportSize
      currentViewportSize = await this.getViewportSize()
      if (utils.geometry.equals(currentViewportSize, prevViewportSize)) {
        currentViewportSize = await this.getViewportSize()
      }
      currentWindowSize = requiredWindowSize
      if (utils.geometry.equals(currentViewportSize, requiredViewportSize)) return
      this._logger.log(`Attempt #${attempt} to set viewport size failed. Current viewport:`, currentViewportSize)
    }

    throw new Error('Failed to set viewport size!')
  }

  async getDisplaySize(): Promise<Size> {
    if (this.isWeb && !this.isMobile) return undefined as never
    if (this._driverInfo?.displaySize) {
      this._logger.log('Extracting display size from native driver using cached value')
      return this._driverInfo.displaySize
    }
    let size = await this._spec.getWindowSize!(this.target)
    if ((await this.getOrientation())?.startsWith('landscape') && size.height > size.width) {
      size = {width: size.height, height: size.width}
    }
    const normalizedSize = this.isAndroid ? utils.geometry.scale(size, 1 / this.pixelRatio) : size
    this._logger.log('Extracted and normalized display size:', normalizedSize)
    return normalizedSize
  }

  async getOrientation(): Promise<ScreenOrientation> {
    if (this.isWeb && !this.isMobile) return undefined as never
    if (this.isAndroid) {
      this._logger.log('Extracting device orientation using adb command on android')

      const rotation = await this.execute('mobile:shell', {
        command: "dumpsys window | grep 'mCurrentRotation' | cut -d = -f2",
      })
        .then(r => r?.trim?.())
        .catch(() => null as never)

      if (rotation) {
        let orientation: ScreenOrientation = undefined as never
        if (rotation === 'ROTATION_0' || rotation === '0') orientation = 'portrait'
        else if (rotation === 'ROTATION_90' || rotation === '3') orientation = 'landscape-secondary'
        else if (rotation === 'ROTATION_180' || rotation === '2') orientation = 'portrait-secondary'
        else if (rotation === 'ROTATION_270' || rotation === '1') orientation = 'landscape'
        this._logger.log('Extracted device orientation:', orientation)
        return orientation
      }
    }

    this._logger.log('Extracting device orientation')
    const orientation = await this._spec.getOrientation!(this.target)
    this._logger.log('Extracted device orientation:', orientation)
    return orientation
  }

  async setOrientation(orientation: 'portrait' | 'landscape'): Promise<void> {
    if (this.isWeb && !this.isMobile) return undefined as never
    this._logger.log('Set device orientation:', orientation)
    await this._spec.setOrientation!(this.target, orientation)
  }

  async getCookies(): Promise<Cookie[]> {
    if (this.isNative || !this.features?.allCookies) return []
    try {
      return (await this._spec.getCookies?.(this.target)) ?? []
    } catch (error) {
      this._driverInfo.features ??= {}
      this._driverInfo.features.allCookies = false
      throw error
    }
  }

  async getTitle(): Promise<string> {
    if (this.isNative) return undefined as never
    const title = await this._spec.getTitle(this.target)
    this._logger.log('Extracted title:', title)
    return title
  }

  async getUrl(): Promise<string> {
    if (this.isNative) return undefined as never
    const url = await this._spec.getUrl(this.target)
    this._logger.log('Extracted url:', url)
    return url
  }

  async visit(url: string): Promise<void> {
    await this._spec.visit?.(this.target, url)
  }
}

export function isDriver<T extends SpecType>(driver: any, spec?: SpecDriver<T>): driver is Driver<T> | T['driver'] {
  return driver instanceof Driver || !!spec?.isDriver(driver)
}

export async function makeDriver<T extends SpecType>(options: {
  driver: Driver<T> | T['driver']
  spec?: SpecDriver<T>
  logger?: Logger
  customConfig?: {useCeilForViewportSize?: boolean}
}): Promise<Driver<T>> {
  const driver = options.driver instanceof Driver ? options.driver : new Driver(options as DriverOptions<T>)
  await driver.init()
  await driver.refreshContexts()
  return driver
}
