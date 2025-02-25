import type * as Core from '@applitools/core'
import {EyesSelector} from './EyesSelector'
import {Image} from './Image'
import {AccessibilityRegionType, AccessibilityRegionTypeEnum} from '../enums/AccessibilityRegionType'
import {MatchLevel, MatchLevelEnum} from '../enums/MatchLevel'
import {Region, LegacyRegion} from './Region'
import {Location} from './Location'
import {LazyLoadOptions} from './LazyLoadOptions'
import {DensityMetrics} from './DensityMetrics'
import * as utils from '@applitools/utils'

type RegionReference<TSpec extends Core.SpecType> = Region | ElementReference<TSpec>
type ElementReference<TSpec extends Core.SpecType> = TSpec['element'] | SelectorReference<TSpec>
type SelectorReference<TSpec extends Core.SpecType> = EyesSelector<TSpec['selector']>
type FrameReference<TSpec extends Core.SpecType> = ElementReference<TSpec> | string | number
type ContextReference<TSpec extends Core.SpecType> = {
  frame: FrameReference<TSpec>
  scrollRootElement?: ElementReference<TSpec>
}

type CodedRegion<TRegion = never> = {
  region: Region | TRegion
  padding?: number | {top: number; bottom: number; left: number; right: number}
  regionId?: string
}
type CodedFloatingRegion<TRegion = never> = CodedRegion<TRegion> & {
  offset?: {top?: number; bottom?: number; left?: number; right?: number}
}
/** @deprecated */
type LegacyCodedFloatingRegion<TRegion = never> = CodedRegion<TRegion> & {
  maxUpOffset?: number
  maxDownOffset?: number
  maxLeftOffset?: number
  maxRightOffset?: number
}
type CodedAccessibilityRegion<TRegion = never> = CodedRegion<TRegion> & {
  type?: AccessibilityRegionType
}

export type CheckSettingsBase<TRegion = never> = {
  name?: string
  region?: Region | TRegion
  matchLevel?: MatchLevel
  useDom?: boolean
  sendDom?: boolean
  enablePatterns?: boolean
  ignoreDisplacements?: boolean
  ignoreMismatch?: boolean
  ignoreCaret?: boolean
  ignoreRegions?: (CodedRegion<TRegion> | Region | TRegion)[]
  layoutRegions?: (CodedRegion<TRegion> | Region | TRegion)[]
  strictRegions?: (CodedRegion<TRegion> | Region | TRegion)[]
  contentRegions?: (CodedRegion<TRegion> | Region | TRegion)[]
  floatingRegions?: (CodedFloatingRegion<TRegion> | LegacyCodedFloatingRegion<TRegion> | Region | TRegion)[]
  accessibilityRegions?: (CodedAccessibilityRegion<TRegion> | Region | TRegion)[]
  pageId?: string
  variationGroupId?: string
  densityMetrics?: DensityMetrics
}

export type CheckSettingsImage = CheckSettingsBase

export type CheckSettingsAutomation<TSpec extends Core.SpecType> = CheckSettingsBase<RegionReference<TSpec>> & {
  frames?: (ContextReference<TSpec> | FrameReference<TSpec>)[]
  webview?: boolean | string
  scrollRootElement?: ElementReference<TSpec>
  fully?: boolean
  disableBrowserFetching?: boolean
  layoutBreakpoints?: boolean | number[]
  visualGridOptions?: {[key: string]: any}
  nmgOptions?: {[key: string]: any}
  hooks?: {beforeCaptureScreenshot: string}
  renderId?: string
  timeout?: number
  waitBeforeCapture?: number
  lazyLoad?: boolean | LazyLoadOptions
}

export class CheckSettingsBaseFluent<TRegion = never> {
  protected _settings: CheckSettingsBase<TRegion> = {}

  constructor(settings?: CheckSettingsBase<TRegion> | CheckSettingsBaseFluent<TRegion>) {
    this._settings = utils.types.instanceOf(settings, CheckSettingsBaseFluent) ? settings.toObject() : settings ?? {}
  }

  region(region: Region | LegacyRegion | TRegion): this {
    if (utils.types.has(region, ['left', 'top', 'width', 'height'])) {
      region = {x: region.left, y: region.top, width: region.width, height: region.height}
    }
    this._settings.region = region
    return this
  }

  name(name: string): this {
    this._settings.name = name
    return this
  }
  withName(name: string) {
    return this.name(name)
  }

  ignoreRegion(region: CodedRegion<TRegion> | Region | LegacyRegion | TRegion): this {
    if (!this._settings.ignoreRegions) this._settings.ignoreRegions = []
    if (utils.types.has(region, ['left', 'top', 'width', 'height'])) {
      region = {x: region.left, y: region.top, width: region.width, height: region.height}
    }
    this._settings.ignoreRegions.push(region)
    return this
  }
  ignoreRegions(...regions: (CodedRegion<TRegion> | Region | LegacyRegion | TRegion)[]): this {
    regions.forEach(region => this.ignoreRegion(region))
    return this
  }
  /** @deprecated */
  ignore(region: Region | LegacyRegion | TRegion) {
    return this.ignoreRegion(region)
  }
  /** @deprecated */
  ignores(...regions: (Region | LegacyRegion | TRegion)[]): this {
    return this.ignoreRegions(...regions)
  }

  layoutRegion(region: CodedRegion<TRegion> | Region | LegacyRegion | TRegion): this {
    if (!this._settings.layoutRegions) this._settings.layoutRegions = []
    if (utils.types.has(region, ['left', 'top', 'width', 'height'])) {
      region = {x: region.left, y: region.top, width: region.width, height: region.height}
    }
    this._settings.layoutRegions.push(region)
    return this
  }
  layoutRegions(...regions: (CodedRegion<TRegion> | Region | LegacyRegion | TRegion)[]): this {
    regions.forEach(region => this.layoutRegion(region))
    return this
  }

  strictRegion(region: CodedRegion<TRegion> | Region | LegacyRegion | TRegion): this {
    if (!this._settings.strictRegions) this._settings.strictRegions = []
    if (utils.types.has(region, ['left', 'top', 'width', 'height'])) {
      region = {x: region.left, y: region.top, width: region.width, height: region.height}
    }
    this._settings.strictRegions.push(region)
    return this
  }
  strictRegions(...regions: (CodedRegion<TRegion> | Region | LegacyRegion | TRegion)[]): this {
    regions.forEach(region => this.strictRegion(region))
    return this
  }

  contentRegion(region: CodedRegion<TRegion> | Region | LegacyRegion | TRegion): this {
    if (!this._settings.contentRegions) this._settings.contentRegions = []
    if (utils.types.has(region, ['left', 'top', 'width', 'height'])) {
      region = {x: region.left, y: region.top, width: region.width, height: region.height}
    }
    this._settings.contentRegions.push(region)
    return this
  }
  contentRegions(...regions: (CodedRegion<TRegion> | Region | LegacyRegion | TRegion)[]): this {
    regions.forEach(region => this.contentRegion(region))
    return this
  }

  floatingRegion(region: CodedFloatingRegion<TRegion>): this
  floatingRegion(region: LegacyCodedFloatingRegion<TRegion>): this
  floatingRegion(
    region: Region | LegacyRegion | TRegion,
    maxUpOffset?: number,
    maxDownOffset?: number,
    maxLeftOffset?: number,
    maxRightOffset?: number,
  ): this
  floatingRegion(
    region: CodedFloatingRegion<TRegion> | Region | LegacyCodedFloatingRegion<TRegion> | LegacyRegion | TRegion,
    maxUpOffset?: number,
    maxDownOffset?: number,
    maxLeftOffset?: number,
    maxRightOffset?: number,
  ): this {
    if (utils.types.has(region, ['left', 'top', 'width', 'height'])) {
      region = {x: region.left, y: region.top, width: region.width, height: region.height}
    }

    let floatingRegion: CodedFloatingRegion<TRegion>
    if (utils.types.has(region, 'region')) {
      const {maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset, ...rest} = region as any
      floatingRegion = {
        offset: {top: maxUpOffset, bottom: maxDownOffset, left: maxLeftOffset, right: maxRightOffset},
        ...rest,
      }
    } else {
      floatingRegion = {
        region,
        offset: {top: maxUpOffset, bottom: maxDownOffset, left: maxLeftOffset, right: maxRightOffset},
      }
    }
    if (!this._settings.floatingRegions) this._settings.floatingRegions = []
    this._settings.floatingRegions.push(floatingRegion)
    return this
  }
  floatingRegions(...regions: (CodedFloatingRegion<TRegion> | Region | LegacyRegion | TRegion)[]): this
  floatingRegions(maxOffset: number, ...regions: (Region | LegacyRegion | TRegion)[]): this
  floatingRegions(
    regionOrMaxOffset: CodedFloatingRegion<TRegion> | Region | LegacyRegion | TRegion | number,
    ...regions: (CodedFloatingRegion<TRegion> | Region | LegacyRegion | TRegion)[]
  ): this {
    let maxOffset: number
    if (utils.types.isNumber(regionOrMaxOffset)) {
      maxOffset = regionOrMaxOffset
    } else {
      this.floatingRegion(regionOrMaxOffset as CodedFloatingRegion<TRegion>)
    }
    regions.forEach(region => {
      if (utils.types.has(region, 'region')) this.floatingRegion(region)
      else this.floatingRegion(region, maxOffset, maxOffset, maxOffset, maxOffset)
    })
    return this
  }
  /** @deprecated */
  floating(region: CodedFloatingRegion<TRegion>): this
  /** @deprecated */
  floating(region: Region | LegacyRegion | TRegion): this
  floating(
    region: CodedFloatingRegion<TRegion> | Region | LegacyRegion | TRegion,
    maxUpOffset?: number,
    maxDownOffset?: number,
    maxLeftOffset?: number,
    maxRightOffset?: number,
  ): this {
    if (utils.types.has(region, 'region')) return this.floatingRegion(region)
    else return this.floatingRegion(region, maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset)
  }
  /** @deprecated */
  floatings(...regions: (CodedFloatingRegion<TRegion> | Region | LegacyRegion | TRegion)[]): this
  /** @deprecated */
  floatings(maxOffset: number, ...regions: (Region | LegacyRegion | TRegion)[]): this
  floatings(
    regionOrMaxOffset: CodedFloatingRegion<TRegion> | Region | LegacyRegion | TRegion | number,
    ...regions: (CodedFloatingRegion<TRegion> | Region | LegacyRegion | TRegion)[]
  ): this {
    return this.floatingRegions(regionOrMaxOffset as number, ...(regions as TRegion[]))
  }

  accessibilityRegion(region: CodedAccessibilityRegion<TRegion>): this
  accessibilityRegion(region: Region | LegacyRegion | TRegion, type?: AccessibilityRegionType): this
  accessibilityRegion(
    region: CodedAccessibilityRegion<TRegion> | Region | LegacyRegion | TRegion,
    type?: AccessibilityRegionType,
  ): this {
    if (utils.types.has(region, ['left', 'top', 'width', 'height'])) {
      region = {x: region.left, y: region.top, width: region.width, height: region.height}
    }
    const accessibilityRegion = utils.types.has(region, 'region') ? region : {region, type}
    if (!this._settings.accessibilityRegions) this._settings.accessibilityRegions = []
    this._settings.accessibilityRegions.push(accessibilityRegion)
    return this
  }
  accessibilityRegions(...regions: (CodedAccessibilityRegion<TRegion> | Region | LegacyRegion | TRegion)[]): this
  accessibilityRegions(type: AccessibilityRegionType, ...regions: (Region | LegacyRegion | TRegion)[]): this
  accessibilityRegions(
    regionOrType: CodedAccessibilityRegion<TRegion> | Region | LegacyRegion | TRegion | AccessibilityRegionType,
    ...regions: (CodedAccessibilityRegion<TRegion> | Region | LegacyRegion | TRegion)[]
  ): this {
    let type: AccessibilityRegionType
    if (utils.types.isEnumValue(regionOrType, AccessibilityRegionTypeEnum)) {
      type = regionOrType
    } else {
      this.accessibilityRegion(regionOrType as CodedAccessibilityRegion<TRegion>)
    }
    regions.forEach(region => {
      if (utils.types.has(region, 'region')) this.accessibilityRegion(region)
      else this.accessibilityRegion(region, type)
    })
    return this
  }

  matchLevel(matchLevel: MatchLevel): this {
    this._settings.matchLevel = matchLevel
    return this
  }
  layout(): this {
    this._settings.matchLevel = MatchLevelEnum.Layout
    return this
  }
  exact(): this {
    this._settings.matchLevel = MatchLevelEnum.Exact
    return this
  }
  strict(): this {
    this._settings.matchLevel = MatchLevelEnum.Strict
    return this
  }
  ignoreColors(): this {
    this._settings.matchLevel = MatchLevelEnum.IgnoreColors
    return this
  }
  /** @deprecated */
  content(): this {
    this._settings.matchLevel = MatchLevelEnum.Content
    return this
  }

  enablePatterns(enablePatterns = true): this {
    this._settings.enablePatterns = enablePatterns
    return this
  }

  ignoreDisplacements(ignoreDisplacements = true): this {
    this._settings.ignoreDisplacements = ignoreDisplacements
    return this
  }

  ignoreCaret(ignoreCaret = true): this {
    this._settings.ignoreCaret = ignoreCaret
    return this
  }

  useDom(useDom = true): this {
    this._settings.useDom = useDom
    return this
  }

  sendDom(sendDom = true): this {
    this._settings.sendDom = sendDom
    return this
  }

  pageId(pageId: string): this {
    this._settings.pageId = pageId
    return this
  }

  variationGroupId(variationGroupId: string): this {
    this._settings.variationGroupId = variationGroupId
    return this
  }

  /** @internal */
  toObject(): CheckSettingsBase<TRegion> {
    return this._settings
  }

  /** @internal */
  toString(): string {
    return utils.general.toString(this)
  }
}

export class CheckSettingsImageFluent extends CheckSettingsBaseFluent {
  protected _target: Image

  constructor(settings?: CheckSettingsImage | CheckSettingsImageFluent, target?: Image) {
    super(settings)
    this._target = target ?? (settings as CheckSettingsImageFluent)?._target
  }

  image(image: Buffer | URL | string): this {
    this._target ??= {} as Image
    this._target.image = image
    return this
  }
  buffer(imageBuffer: Buffer): this {
    return this.image(imageBuffer)
  }
  base64(imageBase64: Buffer): this {
    return this.image(imageBase64)
  }
  path(imagePath: string): this {
    return this.image(imagePath)
  }
  url(imageUrl: URL | string): this {
    return this.image(imageUrl)
  }

  name(name: string): this {
    this._target.name = name
    return super.name(name)
  }

  withDom(dom: string): this {
    this._settings.sendDom = true
    this._target.dom = dom
    return this
  }

  withLocation(locationInViewport: Location): this {
    this._target.locationInViewport = locationInViewport
    return this
  }

  /** @internal */
  toJSON(): {target: Image; settings: Core.CheckSettings<never, 'classic'>} {
    return {
      target: this._target,
      settings: utils.general.removeUndefinedProps({
        name: this._settings.name,
        region: this._settings.region,
        matchLevel: this._settings.matchLevel,
        useDom: this._settings.useDom,
        sendDom: this._settings.sendDom,
        enablePatterns: this._settings.enablePatterns,
        ignoreDisplacements: this._settings.ignoreDisplacements,
        ignoreCaret: this._settings.ignoreCaret,
        ignoreRegions: this._settings.ignoreRegions,
        layoutRegions: this._settings.layoutRegions,
        strictRegions: this._settings.strictRegions,
        contentRegions: this._settings.contentRegions,
        floatingRegions: this._settings.floatingRegions,
        accessibilityRegions: this._settings.accessibilityRegions,
        pageId: this._settings.pageId,
        userCommandId: this._settings.variationGroupId,
      }),
    }
  }
}

export class CheckSettingsAutomationFluent<TSpec extends Core.SpecType = Core.SpecType> extends CheckSettingsBaseFluent<
  RegionReference<TSpec>
> {
  protected _settings: CheckSettingsAutomation<TSpec>
  protected static readonly _spec: Core.SpecDriver<Core.SpecType>
  protected _spec: Core.SpecDriver<TSpec>

  protected _isElementReference(value: any): value is ElementReference<TSpec> {
    const spec = this._spec ?? ((this.constructor as typeof CheckSettingsAutomationFluent)._spec as typeof this._spec)
    return !!spec.isElement?.(value) || this._isSelectorReference(value)
  }
  protected _isSelectorReference(selector: any): selector is SelectorReference<TSpec> {
    const spec = this._spec ?? ((this.constructor as typeof CheckSettingsAutomationFluent)._spec as typeof this._spec)
    return (
      !!spec.isSelector?.(selector) ||
      utils.types.isString(selector) ||
      (utils.types.isPlainObject(selector) &&
        utils.types.has(selector, 'selector') &&
        (utils.types.isString(selector.selector) || !!spec.isSelector?.(selector.selector)))
    )
  }
  protected _isFrameReference(value: any): value is FrameReference<TSpec> {
    return utils.types.isNumber(value) || utils.types.isString(value) || this._isElementReference(value)
  }

  constructor(settings?: CheckSettingsAutomation<TSpec> | CheckSettingsAutomationFluent<TSpec>)
  /** @internal */
  constructor(
    settings?: CheckSettingsAutomation<TSpec> | CheckSettingsAutomationFluent<TSpec>,
    spec?: Core.SpecDriver<TSpec>,
  )
  constructor(
    settings?: CheckSettingsAutomation<TSpec> | CheckSettingsAutomationFluent<TSpec>,
    spec?: Core.SpecDriver<TSpec>,
  ) {
    super(settings)
    this._spec = spec!
    this._settings ??= {}
  }

  region(region: RegionReference<TSpec>) {
    if (
      this._isSelectorReference(region) &&
      this._isSelectorReference(this._settings.region) &&
      utils.types.has(this._settings.region, 'selector')
    ) {
      let lastSelector: any = this._settings.region
      while (lastSelector.shadow) lastSelector = lastSelector.shadow
      lastSelector.shadow = region
      return this
    }
    return super.region(region)
  }

  shadow(selector: SelectorReference<TSpec>): this {
    selector = utils.types.has(selector, 'selector') ? selector : {selector}

    if (!this._settings.region) {
      this._settings.region = selector
    } else if (this._isSelectorReference(this._settings.region)) {
      let lastSelector: any
      if (utils.types.has(this._settings.region, 'selector')) {
        lastSelector = this._settings.region
        while (lastSelector.shadow) lastSelector = lastSelector.shadow
      } else {
        lastSelector = {selector: this._settings.region}
      }
      lastSelector.shadow = selector
    }

    return this
  }

  frame(context: ContextReference<TSpec>): this
  frame(frame: FrameReference<TSpec>, scrollRootElement?: ElementReference<TSpec>): this
  frame(
    contextOrFrame: ContextReference<TSpec> | FrameReference<TSpec>,
    scrollRootElement?: ElementReference<TSpec>,
  ): this {
    const context: ContextReference<TSpec> =
      this._isFrameReference(contextOrFrame) || this._isSelectorReference(contextOrFrame)
        ? {frame: contextOrFrame, scrollRootElement}
        : contextOrFrame
    if (!this._settings.frames) this._settings.frames = []
    this._settings.frames.push(context)
    return this
  }

  webview(webview?: string | boolean): this {
    this._settings.webview = webview ?? true
    return this
  }

  scrollRootElement(scrollRootElement: ElementReference<TSpec>): this {
    if (this._settings.frames && this._settings.frames.length > 0) {
      const context = this._settings.frames[this._settings.frames.length - 1] as ContextReference<TSpec>
      context.scrollRootElement = scrollRootElement
    }
    this._settings.scrollRootElement = scrollRootElement
    return this
  }

  fully(fully = true): this {
    this._settings.fully = fully
    return this
  }
  /** @deprecated */
  stitchContent(stitchContent = true) {
    return this.fully(stitchContent)
  }

  disableBrowserFetching(disableBrowserFetching: boolean): this {
    this._settings.disableBrowserFetching = disableBrowserFetching
    return this
  }

  layoutBreakpoints(layoutBreakpoints: boolean | number[] = true): this {
    if (!utils.types.isArray(layoutBreakpoints)) {
      this._settings.layoutBreakpoints = layoutBreakpoints
    } else if (layoutBreakpoints.length === 0) {
      this._settings.layoutBreakpoints = false
    } else {
      this._settings.layoutBreakpoints = Array.from(new Set(layoutBreakpoints)).sort((a, b) => (a < b ? 1 : -1))
    }
    return this
  }

  hook(name: string, script: string): this {
    this._settings.hooks = {...this._settings.hooks!, [name]: script}
    return this
  }
  beforeRenderScreenshotHook(script: string): this {
    return this.hook('beforeCaptureScreenshot', script)
  }
  /** @deprecated */
  webHook(script: string): this {
    return this.beforeRenderScreenshotHook(script)
  }

  ufgOption(key: string, value: any) {
    this._settings.visualGridOptions = {...this._settings.visualGridOptions, [key]: value}
    return this
  }
  ufgOptions(options: {[key: string]: any}) {
    this._settings.visualGridOptions = options
    return this
  }
  /** @deprecated */
  visualGridOption(key: string, value: any) {
    return this.ufgOption(key, value)
  }
  /** @deprecated */
  visualGridOptions(options: {[key: string]: any}) {
    return this.ufgOptions(options)
  }

  nmgOption(key: string, value: any) {
    this._settings.nmgOptions = {...this._settings.nmgOptions, [key]: value}
    return this
  }
  nmgOptions(options: {[key: string]: any}) {
    this._settings.nmgOptions = options
    return this
  }

  renderId(renderId: string): this {
    this._settings.renderId = renderId
    return this
  }

  timeout(timeout: number): this {
    this._settings.timeout = timeout
    return this
  }

  waitBeforeCapture(waitBeforeCapture: number): this {
    this._settings.waitBeforeCapture = waitBeforeCapture
    return this
  }

  lazyLoad(options?: LazyLoadOptions | boolean): this {
    this._settings.lazyLoad = options ?? true
    return this
  }

  densityMetrics(options: DensityMetrics): this {
    this._settings.densityMetrics = options
    return this
  }

  /** @internal */
  toJSON(): {target: undefined; settings: Core.CheckSettings<TSpec, 'classic'> & Core.CheckSettings<TSpec, 'ufg'>} {
    return {
      target: undefined,
      settings: utils.general.removeUndefinedProps({
        name: this._settings.name,
        region: this._settings.region,
        frames: this._settings.frames,
        webview: this._settings.webview,
        scrollRootElement: this._settings.scrollRootElement,
        fully: this._settings.fully,
        matchLevel: this._settings.matchLevel,
        useDom: this._settings.useDom,
        sendDom: this._settings.sendDom,
        enablePatterns: this._settings.enablePatterns,
        ignoreDisplacements: this._settings.ignoreDisplacements,
        ignoreCaret: this._settings.ignoreCaret,
        ignoreRegions: this._settings.ignoreRegions,
        layoutRegions: this._settings.layoutRegions,
        strictRegions: this._settings.strictRegions,
        contentRegions: this._settings.contentRegions,
        floatingRegions:
          this._settings.floatingRegions &&
          this._settings.floatingRegions.map(floatingRegion => {
            if (utils.types.has(floatingRegion, 'region')) {
              const {maxUpOffset, maxDownOffset, maxLeftOffset, maxRightOffset, ...rest} =
                floatingRegion as LegacyCodedFloatingRegion
              return {
                offset: {top: maxUpOffset, bottom: maxDownOffset, left: maxLeftOffset, right: maxRightOffset},
                ...rest,
              }
            }
            return floatingRegion
          }),
        accessibilityRegions: this._settings.accessibilityRegions,
        disableBrowserFetching: this._settings.disableBrowserFetching,
        layoutBreakpoints: this._settings.layoutBreakpoints,
        ufgOptions: this._settings.visualGridOptions,
        nmgOptions: this._settings.nmgOptions,
        hooks: this._settings.hooks,
        pageId: this._settings.pageId,
        lazyLoad: this._settings.lazyLoad,
        waitBeforeCapture: this._settings.waitBeforeCapture,
        retryTimeout: this._settings.timeout,
        userCommandId: this._settings.variationGroupId,
        densityMetrics: this._settings.densityMetrics,
      }),
    }
  }
}

export type TargetImage = {
  image(image: Buffer | URL | string): CheckSettingsImageFluent
  buffer(imageBuffer: Buffer): CheckSettingsImageFluent
  base64(imageBase64: string): CheckSettingsImageFluent
  path(imagePath: string): CheckSettingsImageFluent
  url(imageUrl: URL | string): CheckSettingsImageFluent
}

export const TargetImage: TargetImage = {
  image(image: Buffer | URL | string): CheckSettingsImageFluent {
    return new CheckSettingsImageFluent().image(image)
  },
  buffer(imageBuffer: Buffer): CheckSettingsImageFluent {
    return new CheckSettingsImageFluent().image(imageBuffer)
  },
  base64(imageBase64: string): CheckSettingsImageFluent {
    return new CheckSettingsImageFluent().image(imageBase64)
  },
  path(imagePath: string): CheckSettingsImageFluent {
    return new CheckSettingsImageFluent().image(imagePath)
  },
  url(imageUrl: URL | string): CheckSettingsImageFluent {
    return new CheckSettingsImageFluent().image(imageUrl)
  },
}

export type TargetAutomation<TSpec extends Core.SpecType = Core.SpecType> = {
  /** @internal */
  spec: Core.SpecDriver<TSpec>

  window(): CheckSettingsAutomationFluent<TSpec>
  region(region: RegionReference<TSpec> | LegacyRegion): CheckSettingsAutomationFluent<TSpec>
  frame(context: ContextReference<TSpec>): CheckSettingsAutomationFluent<TSpec>
  frame(frame: FrameReference<TSpec>, scrollRootElement?: ElementReference<TSpec>): CheckSettingsAutomationFluent<TSpec>
  shadow(selector: SelectorReference<TSpec>): CheckSettingsAutomationFluent<TSpec>
  webview(webview?: string | boolean): CheckSettingsAutomationFluent<TSpec>
}

export const TargetAutomation: TargetAutomation<Core.SpecType> = {
  spec: null as never,

  window(): CheckSettingsAutomationFluent {
    return new CheckSettingsAutomationFluent({}, this.spec)
  },
  region(region: unknown): CheckSettingsAutomationFluent {
    return new CheckSettingsAutomationFluent({}, this.spec).region(region)
  },
  frame(contextOrFrame: unknown, scrollRootElement?: unknown): CheckSettingsAutomationFluent {
    return new CheckSettingsAutomationFluent({}, this.spec).frame(contextOrFrame, scrollRootElement)
  },
  shadow(selector: unknown): CheckSettingsAutomationFluent {
    return new CheckSettingsAutomationFluent({}, this.spec).shadow(selector)
  },
  webview(webview?: string | boolean): CheckSettingsAutomationFluent {
    return new CheckSettingsAutomationFluent({}, this.spec).webview(webview)
  },
}

export type Target<TSpec extends Core.SpecType = Core.SpecType> = TargetImage & TargetAutomation<TSpec>

export const Target: Target<Core.SpecType> = {...TargetImage, ...TargetAutomation}
