import type * as Core from '@applitools/core'
import {EyesSelector} from './EyesSelector'
import {SessionType, SessionTypeEnum} from '../enums/SessionType'
import {StitchMode, StitchModeEnum} from '../enums/StitchMode'
import {MatchLevel, MatchLevelEnum} from '../enums/MatchLevel'
import {BrowserType, BrowserTypeEnum} from '../enums/BrowserType'
import {DeviceName} from '../enums/DeviceName'
import {AndroidDeviceName} from '../enums/AndroidDeviceName'
import {AndroidVersion} from '../enums/AndroidVersion'
import {IosDeviceName, IosDeviceNameEnum} from '../enums/IosDeviceName'
import {IosVersion} from '../enums/IosVersion'
import {ScreenOrientation, ScreenOrientationEnum} from '../enums/ScreenOrientation'
import {AccessibilitySettings} from './AccessibilitySettings'
import {
  DesktopBrowserInfo,
  ChromeEmulationInfo,
  IOSDeviceInfo,
  AndroidDeviceInfo,
  ChromeEmulationInfoLegacy,
} from './RenderInfo'
import {CutProvider} from './CutProvider'
import {DebugScreenshotProvider} from './DebugScreenshotProvider'
import {RectangleSize, RectangleSizeData} from './RectangleSize'
import {ImageRotation, ImageRotationData} from './ImageRotation'
import {ProxySettings, ProxySettingsData} from './ProxySettings'
import {AUTProxySettings} from './AUTProxySettings'
import {BatchInfo, BatchInfoData} from './BatchInfo'
import {PropertyData, PropertyDataData} from './PropertyData'
import {ImageMatchSettings, ImageMatchSettingsData} from './ImageMatchSettings'
import * as utils from '@applitools/utils'

type RenderInfo =
  | DesktopBrowserInfo
  | ChromeEmulationInfo
  | IOSDeviceInfo
  | AndroidDeviceInfo
  | ChromeEmulationInfoLegacy

export type Configuration<TSpec extends Core.SpecType = Core.SpecType> = {
  /** @undocumented */
  debugScreenshots?: DebugScreenshotProvider
  agentId?: string
  apiKey?: string
  serverUrl?: string
  proxy?: ProxySettings
  autProxy?: AUTProxySettings
  isDisabled?: boolean
  /** @undocumented */
  connectionTimeout?: number
  /** @undocumented */
  removeSession?: boolean

  appName?: string
  testName?: string
  displayName?: string
  viewportSize?: RectangleSize
  sessionType?: SessionType
  properties?: PropertyData[]
  batch?: BatchInfo
  defaultMatchSettings?: ImageMatchSettings
  hostApp?: string
  hostOS?: string
  hostAppInfo?: string
  hostOSInfo?: string
  deviceInfo?: string
  baselineEnvName?: string
  environmentName?: string
  branchName?: string
  parentBranchName?: string
  baselineBranchName?: string
  compareWithParentBranch?: boolean
  ignoreBaseline?: boolean
  ignoreGitMergeBase?: boolean
  saveFailedTests?: boolean
  saveNewTests?: boolean
  saveDiffs?: boolean
  /** @undocumented */
  dontCloseBatches?: boolean

  sendDom?: boolean
  matchTimeout?: number
  forceFullPageScreenshot?: boolean

  waitBeforeScreenshots?: number
  stitchMode?: StitchMode
  hideScrollbars?: boolean
  hideCaret?: boolean
  stitchOverlap?: number
  scrollRootElement?: TSpec['element'] | EyesSelector<TSpec['selector']>
  cut?: CutProvider
  rotation?: ImageRotation
  scaleRatio?: number

  /** @undocumented */
  concurrentSessions?: number
  browsersInfo?: (DesktopBrowserInfo | ChromeEmulationInfo | IOSDeviceInfo | AndroidDeviceInfo)[]
  visualGridOptions?: Record<string, any>
  layoutBreakpoints?: boolean | number[]
  disableBrowserFetching?: boolean

  waitBeforeCapture?: number
}

export class ConfigurationData<TSpec extends Core.SpecType = Core.SpecType> implements Required<Configuration<TSpec>> {
  protected static readonly _spec: Core.SpecDriver<Core.SpecType>
  private _spec: Core.SpecDriver<TSpec>

  private _config: Configuration<TSpec> = {}

  private _isElementReference(value: any): value is TSpec['element'] | EyesSelector<TSpec['selector']> {
    const spec = this._spec ?? ((this.constructor as typeof ConfigurationData)._spec as typeof this._spec)
    return !!spec.isElement?.(value) || this._isSelectorReference(value)
  }

  private _isSelectorReference(selector: any): selector is EyesSelector<TSpec['selector']> {
    const spec = this._spec ?? ((this.constructor as typeof ConfigurationData)._spec as typeof this._spec)
    return (
      !!spec.isSelector?.(selector) ||
      utils.types.isString(selector) ||
      (utils.types.isPlainObject(selector) &&
        utils.types.has(selector, 'selector') &&
        (utils.types.isString(selector.selector) || !!spec.isSelector?.(selector.selector)))
    )
  }

  constructor(config?: Configuration<TSpec>)
  /** @internal */
  constructor(config?: Configuration<TSpec>, spec?: Core.SpecDriver<TSpec>)
  constructor(config?: Configuration<TSpec>, spec?: Core.SpecDriver<TSpec>) {
    config = utils.types.instanceOf(config, ConfigurationData) ? config.toObject() : config ?? {}
    this._spec = spec!
    for (const [key, value] of Object.entries(config)) {
      ;(this as any)[key] = value
    }
  }

  /** @undocumented */
  get debugScreenshots(): DebugScreenshotProvider {
    return this._config.debugScreenshots!
  }
  /** @undocumented */
  set debugScreenshots(debugScreenshots: DebugScreenshotProvider) {
    this._config.debugScreenshots = debugScreenshots
  }
  /** @undocumented */
  getSaveDebugScreenshots(): boolean {
    return this.debugScreenshots?.save ?? false
  }
  /** @undocumented */
  setSaveDebugScreenshots(save: boolean): this {
    this.debugScreenshots = {...this.debugScreenshots, save}
    return this
  }
  /** @undocumented */
  getDebugScreenshotsPath(): string {
    return (this.debugScreenshots as NonNullable<typeof this.debugScreenshots>).path!
  }
  /** @undocumented */
  setDebugScreenshotsPath(path: string): this {
    this.debugScreenshots = {...this.debugScreenshots, path}
    return this
  }
  /** @undocumented */
  getDebugScreenshotsPrefix(): string {
    return (this.debugScreenshots as NonNullable<typeof this.debugScreenshots>).prefix!
  }
  /** @undocumented */
  setDebugScreenshotsPrefix(prefix: string): this {
    this.debugScreenshots = {...this.debugScreenshots, prefix}
    return this
  }

  get appName(): string {
    return this._config.appName!
  }
  set appName(appName: string) {
    utils.guard.isString(appName, {name: 'appName', strict: false})
    this._config.appName = appName
  }
  getAppName(): string {
    return this.appName
  }
  setAppName(appName: string): this {
    this.appName = appName
    return this
  }

  get testName(): string {
    return this._config.testName!
  }
  set testName(testName: string) {
    utils.guard.isString(testName, {name: 'testName', strict: false})
    this._config.testName = testName
  }
  getTestName(): string {
    return this.testName
  }
  setTestName(testName: string): this {
    this.testName = testName
    return this
  }

  get displayName(): string {
    return this._config.displayName!
  }
  set displayName(displayName: string) {
    utils.guard.isString(displayName, {name: 'displayName', strict: false})
    this._config.displayName = displayName
  }
  getDisplayName(): string {
    return this.displayName
  }
  setDisplayName(displayName: string): this {
    this.displayName = displayName
    return this
  }

  get isDisabled(): boolean {
    return this._config.isDisabled!
  }
  set isDisabled(isDisabled: boolean) {
    utils.guard.isBoolean(isDisabled, {name: 'isDisabled', strict: false})
    this._config.isDisabled = isDisabled
  }
  getIsDisabled(): boolean {
    return this.isDisabled
  }
  setIsDisabled(isDisabled: boolean): this {
    this.isDisabled = isDisabled
    return this
  }

  get matchTimeout(): number {
    return this._config.matchTimeout!
  }
  set matchTimeout(matchTimeout: number) {
    utils.guard.isInteger(matchTimeout, {name: 'matchTimeout'})
    this._config.matchTimeout = matchTimeout
  }
  getMatchTimeout(): number {
    return this.matchTimeout
  }
  setMatchTimeout(matchTimeout: number): this {
    this.matchTimeout = matchTimeout
    return this
  }

  get sessionType(): SessionType {
    return this._config.sessionType!
  }
  set sessionType(sessionType: SessionType) {
    this._config.sessionType = sessionType
  }
  getSessionType(): SessionTypeEnum {
    return this.sessionType as SessionTypeEnum
  }
  setSessionType(sessionType: SessionType): this {
    this.sessionType = sessionType
    return this
  }

  get viewportSize(): RectangleSize {
    return this._config.viewportSize!
  }
  set viewportSize(viewportSize: RectangleSize) {
    this._config.viewportSize = viewportSize
  }
  getViewportSize(): RectangleSizeData {
    return this.viewportSize && new RectangleSizeData(this.viewportSize)
  }
  setViewportSize(viewportSize: RectangleSize): this {
    this.viewportSize = viewportSize
    return this
  }

  get agentId(): string {
    return this._config.agentId!
  }
  set agentId(agentId: string) {
    utils.guard.isString(agentId, {name: 'agentId'})
    this._config.agentId = agentId
  }
  getAgentId(): string {
    return this.agentId
  }
  setAgentId(agentId: string): this {
    this.agentId = agentId
    return this
  }

  get apiKey(): string {
    return this._config.apiKey!
  }
  set apiKey(apiKey: string) {
    utils.guard.isString(apiKey, {name: 'apiKey', alpha: true, numeric: true})
    this._config.apiKey = apiKey
  }
  getApiKey(): string {
    return this.apiKey ?? utils.general.getEnvValue('API_KEY')
  }
  setApiKey(apiKey: string): this {
    this.apiKey = apiKey
    return this
  }

  get serverUrl(): string {
    return this._config.serverUrl!
  }
  set serverUrl(serverUrl: string) {
    utils.guard.isString(serverUrl, {name: 'serverUrl', strict: false})
    this._config.serverUrl = serverUrl
  }
  getServerUrl(): string {
    return this.serverUrl ?? utils.general.getEnvValue('SERVER_URL')
  }
  setServerUrl(serverUrl: string): this {
    this.serverUrl = serverUrl
    return this
  }

  get proxy(): ProxySettings {
    return this._config.proxy!
  }
  set proxy(proxy: ProxySettings) {
    this._config.proxy = proxy
  }
  getProxy(): ProxySettingsData {
    return new ProxySettingsData(this.proxy)
  }
  setProxy(proxy: ProxySettings): this
  setProxy(url: string, username?: string, password?: string, deprecatedIsHttpOnly?: boolean): this
  setProxy(isEnabled: false): this
  setProxy(proxyOrUrlOrIsEnabled: ProxySettings | string | false, username?: string, password?: string): this {
    if (proxyOrUrlOrIsEnabled === false) {
      this.proxy = undefined as never
    } else if (utils.types.isString(proxyOrUrlOrIsEnabled)) {
      this.proxy = {url: proxyOrUrlOrIsEnabled, username, password}
    } else {
      this.proxy = proxyOrUrlOrIsEnabled
    }
    return this
  }
  get autProxy(): AUTProxySettings {
    return this._config.autProxy!
  }
  set autProxy(autProxy: AUTProxySettings) {
    this._config.autProxy = autProxy
  }
  getAutProxy(): AUTProxySettings {
    return this.autProxy
  }
  setAutProxy(autProxy: AUTProxySettings) {
    this.autProxy = autProxy
    return this
  }
  /** @undocumented */
  get connectionTimeout(): number {
    return this._config.connectionTimeout!
  }
  /** @undocumented */
  set connectionTimeout(connectionTimeout: number) {
    utils.guard.isInteger(connectionTimeout, {name: 'connectionTimeout', gte: 0})
    this._config.connectionTimeout = connectionTimeout
  }
  /** @undocumented */
  getConnectionTimeout(): number {
    return this.connectionTimeout
  }
  /** @undocumented */
  setConnectionTimeout(connectionTimeout: number): this {
    this.connectionTimeout = connectionTimeout
    return this
  }

  /** @undocumented */
  get removeSession(): boolean {
    return this._config.removeSession!
  }
  /** @undocumented */
  set removeSession(removeSession: boolean) {
    utils.guard.isBoolean(removeSession, {name: 'removeSession'})
    this._config.removeSession = removeSession
  }
  /** @undocumented */
  getRemoveSession(): boolean {
    return this.removeSession
  }
  /** @undocumented */
  setRemoveSession(removeSession: boolean): this {
    this.removeSession = removeSession
    return this
  }

  get batch(): BatchInfo {
    return this._config.batch!
  }
  set batch(batch: BatchInfo) {
    this._config.batch = batch
  }
  getBatch(): BatchInfoData {
    return new BatchInfoData(this.batch)
  }
  setBatch(batch: BatchInfo): this {
    this.batch = batch
    return this
  }

  get properties(): PropertyData[] {
    return this._config.properties!
  }
  set properties(properties: PropertyData[]) {
    utils.guard.isArray(properties, {name: 'properties'})
    this._config.properties = properties
  }
  getProperties(): PropertyDataData[] {
    return this.properties?.map(property => new PropertyDataData(property)) ?? []
  }
  setProperties(properties: PropertyData[]): this {
    this.properties = properties
    return this
  }
  addProperty(name: string, value: string): this
  addProperty(prop: PropertyData): this
  addProperty(propOrName: PropertyData | string, value?: string): this {
    const property = utils.types.isString(propOrName) ? {name: propOrName, value: value!} : propOrName
    if (!this.properties) this.properties = []
    this.properties.push(property)
    return this
  }
  clearProperties(): this {
    this.properties = []
    return this
  }

  get baselineEnvName(): string {
    return this._config.baselineEnvName!
  }
  set baselineEnvName(baselineEnvName: string) {
    utils.guard.isString(baselineEnvName, {name: 'baselineEnvName', strict: false})
    this._config.baselineEnvName = baselineEnvName ? baselineEnvName.trim() : undefined
  }
  getBaselineEnvName(): string {
    return this.baselineEnvName
  }
  setBaselineEnvName(baselineEnvName: string): this {
    this.baselineEnvName = baselineEnvName
    return this
  }

  get environmentName(): string {
    return this._config.environmentName!
  }
  set environmentName(environmentName: string) {
    utils.guard.isString(environmentName, {name: 'environmentName', strict: false})
    this._config.environmentName = environmentName ? environmentName.trim() : undefined
  }
  getEnvironmentName(): string {
    return this.environmentName
  }
  setEnvironmentName(environmentName: string): this {
    this.environmentName = environmentName
    return this
  }

  get branchName(): string {
    return this._config.branchName!
  }
  set branchName(branchName: string) {
    utils.guard.isString(branchName, {name: 'branchName'})
    this._config.branchName = branchName
  }
  getBranchName(): string {
    return this.branchName ?? utils.general.getEnvValue('BRANCH')
  }
  setBranchName(branchName: string): this {
    this.branchName = branchName
    return this
  }

  get parentBranchName(): string {
    return this._config.parentBranchName!
  }
  set parentBranchName(parentBranchName: string) {
    utils.guard.isString(parentBranchName, {name: 'parentBranchName'})
    this._config.parentBranchName = parentBranchName
  }
  getParentBranchName(): string {
    return this.parentBranchName ?? utils.general.getEnvValue('PARENT_BRANCH')
  }
  setParentBranchName(parentBranchName: string): this {
    this.parentBranchName = parentBranchName
    return this
  }

  get baselineBranchName(): string {
    return this._config.baselineBranchName!
  }
  set baselineBranchName(baselineBranchName: string) {
    utils.guard.isString(baselineBranchName, {name: 'baselineBranchName'})
    this._config.baselineBranchName = baselineBranchName
  }
  getBaselineBranchName(): string {
    return this.baselineBranchName ?? utils.general.getEnvValue('BASELINE_BRANCH_NAME')
  }
  setBaselineBranchName(baselineBranchName: string): this {
    this.baselineBranchName = baselineBranchName
    return this
  }

  get compareWithParentBranch(): boolean {
    return this._config.compareWithParentBranch!
  }
  set compareWithParentBranch(compareWithParentBranch: boolean) {
    utils.guard.isBoolean(compareWithParentBranch, {name: 'compareWithParentBranch'})
    this._config.compareWithParentBranch = compareWithParentBranch
  }
  getCompareWithParentBranch(): boolean {
    return this.compareWithParentBranch
  }
  setCompareWithParentBranch(compareWithParentBranch: boolean): this {
    this.compareWithParentBranch = compareWithParentBranch
    return this
  }

  get ignoreGitMergeBase(): boolean {
    return this._config.ignoreGitMergeBase!
  }
  set ignoreGitMergeBase(ignoreGitMergeBase: boolean) {
    utils.guard.isBoolean(ignoreGitMergeBase, {name: 'ignoreGitMergeBase'})
    this._config.ignoreGitMergeBase = ignoreGitMergeBase
  }
  getIgnoreGitMergeBase(): boolean {
    return this.ignoreGitMergeBase
  }
  setIgnoreGitMergeBase(ignoreGitMergeBase: boolean): this {
    this.ignoreGitMergeBase = ignoreGitMergeBase
    return this
  }

  get ignoreBaseline(): boolean {
    return this._config.ignoreBaseline!
  }
  set ignoreBaseline(ignoreBaseline: boolean) {
    utils.guard.isBoolean(ignoreBaseline, {name: 'ignoreBaseline'})
    this._config.ignoreBaseline = ignoreBaseline
  }
  getIgnoreBaseline(): boolean {
    return this.ignoreBaseline
  }
  setIgnoreBaseline(ignoreBaseline: boolean): this {
    this.ignoreBaseline = ignoreBaseline
    return this
  }

  get saveFailedTests(): boolean {
    return this._config.saveFailedTests!
  }
  set saveFailedTests(saveFailedTests: boolean) {
    utils.guard.isBoolean(saveFailedTests, {name: 'saveFailedTests'})
    this._config.saveFailedTests = saveFailedTests
  }
  getSaveFailedTests(): boolean {
    return this.saveFailedTests
  }
  setSaveFailedTests(saveFailedTests: boolean): this {
    this.saveFailedTests = saveFailedTests
    return this
  }

  get saveNewTests(): boolean {
    return this._config.saveNewTests!
  }
  set saveNewTests(saveNewTests: boolean) {
    utils.guard.isBoolean(saveNewTests, {name: 'saveNewTests'})
    this._config.saveNewTests = saveNewTests
  }
  getSaveNewTests(): boolean {
    return this.saveNewTests
  }
  setSaveNewTests(saveNewTests: boolean): this {
    this.saveNewTests = saveNewTests
    return this
  }

  get saveDiffs(): boolean {
    return this._config.saveDiffs!
  }
  set saveDiffs(saveDiffs: boolean) {
    utils.guard.isBoolean(saveDiffs, {name: 'saveDiffs'})
    this._config.saveDiffs = saveDiffs
  }
  getSaveDiffs(): boolean {
    return this.saveDiffs
  }
  setSaveDiffs(saveDiffs: boolean): this {
    this.saveDiffs = saveDiffs
    return this
  }

  get sendDom(): boolean {
    return this._config.sendDom!
  }
  set sendDom(sendDom: boolean) {
    utils.guard.isBoolean(sendDom, {name: 'sendDom'})
    this._config.sendDom = sendDom
  }
  getSendDom(): boolean {
    return this.sendDom
  }
  setSendDom(sendDom: boolean): this {
    this.sendDom = sendDom
    return this
  }

  get hostApp(): string {
    return this._config.hostApp!
  }
  set hostApp(hostApp: string) {
    this._config.hostApp = hostApp ? hostApp.trim() : undefined
  }
  getHostApp(): string {
    return this.hostApp
  }
  setHostApp(hostApp: string): this {
    this.hostApp = hostApp
    return this
  }

  get hostOS(): string {
    return this._config.hostOS!
  }
  set hostOS(hostOS: string) {
    this._config.hostOS = hostOS ? hostOS.trim() : undefined
  }
  getHostOS(): string {
    return this.hostOS
  }
  setHostOS(hostOS: string): this {
    this.hostOS = hostOS
    return this
  }

  get hostAppInfo(): string {
    return this._config.hostAppInfo!
  }
  set hostAppInfo(hostAppInfo: string) {
    this._config.hostAppInfo = hostAppInfo ? hostAppInfo.trim() : undefined
  }
  getHostAppInfo(): string {
    return this.hostAppInfo
  }
  setHostAppInfo(hostAppInfo: string): this {
    this.hostAppInfo = hostAppInfo
    return this
  }

  get hostOSInfo(): string {
    return this._config.hostOSInfo!
  }
  set hostOSInfo(hostOSInfo: string) {
    this._config.hostOSInfo = hostOSInfo ? hostOSInfo.trim() : undefined
  }
  getHostOSInfo(): string {
    return this.hostOSInfo
  }
  setHostOSInfo(hostOSInfo: string): this {
    this.hostOSInfo = hostOSInfo
    return this
  }

  get deviceInfo(): string {
    return this._config.deviceInfo!
  }
  set deviceInfo(deviceInfo: string) {
    this._config.deviceInfo = deviceInfo ? deviceInfo.trim() : undefined
  }
  getDeviceInfo(): string {
    return this.deviceInfo
  }
  setDeviceInfo(deviceInfo: string): this {
    this.deviceInfo = deviceInfo
    return this
  }

  get defaultMatchSettings(): ImageMatchSettings {
    return this._config.defaultMatchSettings!
  }
  set defaultMatchSettings(defaultMatchSettings: ImageMatchSettings) {
    utils.guard.notNull(defaultMatchSettings, {name: 'defaultMatchSettings'})
    this._config.defaultMatchSettings = defaultMatchSettings
  }
  getDefaultMatchSettings(): ImageMatchSettings {
    return new ImageMatchSettingsData(this.defaultMatchSettings)
  }
  setDefaultMatchSettings(defaultMatchSettings: ImageMatchSettings): this {
    this.defaultMatchSettings = defaultMatchSettings
    return this
  }
  getMatchLevel(): MatchLevelEnum {
    return this.defaultMatchSettings?.matchLevel as MatchLevelEnum
  }
  setMatchLevel(matchLevel: MatchLevel): this {
    if (!this.defaultMatchSettings) this.defaultMatchSettings = {}
    this.defaultMatchSettings.matchLevel = matchLevel
    return this
  }
  getAccessibilityValidation(): AccessibilitySettings {
    return (this.defaultMatchSettings as NonNullable<typeof this.defaultMatchSettings>).accessibilitySettings!
  }
  setAccessibilityValidation(accessibilityValidation: AccessibilitySettings): this {
    if (!this.defaultMatchSettings) this.defaultMatchSettings = {}
    this.defaultMatchSettings.accessibilitySettings = accessibilityValidation
    return this
  }
  getUseDom(): boolean {
    return (this.defaultMatchSettings as NonNullable<typeof this.defaultMatchSettings>).useDom!
  }
  setUseDom(useDom: boolean): this {
    if (!this.defaultMatchSettings) this.defaultMatchSettings = {}
    this.defaultMatchSettings.useDom = useDom
    return this
  }
  getEnablePatterns(): boolean {
    return (this.defaultMatchSettings as NonNullable<typeof this.defaultMatchSettings>).enablePatterns!
  }
  setEnablePatterns(enablePatterns: boolean): this {
    if (!this.defaultMatchSettings) this.defaultMatchSettings = {}
    this.defaultMatchSettings.enablePatterns = enablePatterns
    return this
  }
  getIgnoreDisplacements(): boolean {
    return (this.defaultMatchSettings as NonNullable<typeof this.defaultMatchSettings>).ignoreDisplacements!
  }
  setIgnoreDisplacements(ignoreDisplacements: boolean): this {
    if (!this.defaultMatchSettings) this.defaultMatchSettings = {}
    this.defaultMatchSettings.ignoreDisplacements = ignoreDisplacements
    return this
  }
  getIgnoreCaret(): boolean {
    return (this.defaultMatchSettings as NonNullable<typeof this.defaultMatchSettings>).ignoreCaret!
  }
  setIgnoreCaret(ignoreCaret: boolean): this {
    if (!this.defaultMatchSettings) this.defaultMatchSettings = {}
    this.defaultMatchSettings.ignoreCaret = ignoreCaret
    return this
  }

  get forceFullPageScreenshot(): boolean {
    return this._config.forceFullPageScreenshot!
  }
  set forceFullPageScreenshot(forceFullPageScreenshot: boolean) {
    this._config.forceFullPageScreenshot = forceFullPageScreenshot
  }
  getForceFullPageScreenshot(): boolean {
    return this.forceFullPageScreenshot
  }
  setForceFullPageScreenshot(forceFullPageScreenshot: boolean): this {
    this.forceFullPageScreenshot = forceFullPageScreenshot
    return this
  }

  get waitBeforeScreenshots(): number {
    return this._config.waitBeforeScreenshots!
  }
  set waitBeforeScreenshots(waitBeforeScreenshots: number) {
    utils.guard.isInteger(waitBeforeScreenshots, {name: 'waitBeforeScreenshots', gt: 0})
    this._config.waitBeforeScreenshots = waitBeforeScreenshots
  }
  getWaitBeforeScreenshots(): number {
    return this.waitBeforeScreenshots
  }
  setWaitBeforeScreenshots(waitBeforeScreenshots: number): this {
    this.waitBeforeScreenshots = waitBeforeScreenshots
    return this
  }

  get waitBeforeCapture(): number {
    return this._config.waitBeforeCapture!
  }

  set waitBeforeCapture(waitBeforeCapture: number) {
    utils.guard.isInteger(waitBeforeCapture, {name: 'waitBeforeCapture', gt: 0})
    this._config.waitBeforeCapture = waitBeforeCapture
  }

  getWaitBeforeCapture(): number {
    return this.waitBeforeCapture
  }

  setWaitBeforeCapture(waitBeforeCapture: number): this {
    this.waitBeforeCapture = waitBeforeCapture
    return this
  }

  get stitchMode(): StitchMode {
    return this._config.stitchMode!
  }
  set stitchMode(stitchMode: StitchMode) {
    utils.guard.isEnumValue(stitchMode, StitchModeEnum, {name: 'stitchMode'})
    this._config.stitchMode = stitchMode
  }
  getStitchMode(): StitchModeEnum {
    return this.stitchMode as StitchModeEnum
  }
  setStitchMode(stitchMode: StitchMode): this {
    this.stitchMode = stitchMode
    return this
  }

  get hideScrollbars(): boolean {
    return this._config.hideScrollbars!
  }
  set hideScrollbars(hideScrollbars: boolean) {
    this._config.hideScrollbars = hideScrollbars
  }
  getHideScrollbars(): boolean {
    return this.hideScrollbars
  }
  setHideScrollbars(hideScrollbars: boolean): this {
    this.hideScrollbars = hideScrollbars
    return this
  }

  get hideCaret(): boolean {
    return this._config.hideCaret!
  }
  set hideCaret(hideCaret: boolean) {
    this._config.hideCaret = hideCaret
  }
  getHideCaret(): boolean {
    return this.hideCaret
  }
  setHideCaret(hideCaret: boolean): this {
    this.hideCaret = hideCaret
    return this
  }

  get stitchOverlap(): number {
    return this._config.stitchOverlap!
  }
  set stitchOverlap(stitchOverlap: number) {
    utils.guard.isInteger(stitchOverlap, {name: 'stitchOverlap', strict: false})
    this._config.stitchOverlap = stitchOverlap
  }
  getStitchOverlap(): number {
    return this.stitchOverlap
  }
  setStitchOverlap(stitchOverlap: number): this {
    this.stitchOverlap = stitchOverlap
    return this
  }

  get scrollRootElement(): TSpec['element'] | EyesSelector<TSpec['selector']> {
    return this._config.scrollRootElement!
  }
  set scrollRootElement(scrollRootElement: TSpec['element'] | EyesSelector<TSpec['selector']>) {
    utils.guard.custom(scrollRootElement, value => this._isElementReference(value), {
      name: 'scrollRootElement',
      message: 'must be element or selector',
      strict: false,
    })
    this._config.scrollRootElement = scrollRootElement
  }
  getScrollRootElement(): TSpec['element'] | EyesSelector<TSpec['selector']> {
    return this.scrollRootElement
  }
  setScrollRootElement(scrollRootElement: TSpec['element'] | EyesSelector<TSpec['selector']>): this {
    this.scrollRootElement = scrollRootElement
    return this
  }

  get cut(): CutProvider {
    return this._config.cut!
  }
  set cut(cut: CutProvider) {
    this._config.cut = cut
  }
  getCut(): CutProvider {
    return this._config.cut!
  }
  setCut(cut: CutProvider): this {
    this.cut = cut
    return this
  }

  get rotation(): ImageRotation {
    return this._config.rotation!
  }
  set rotation(rotation: ImageRotation) {
    this._config.rotation = rotation
  }
  getRotation(): ImageRotationData {
    return new ImageRotationData(this.rotation)
  }
  setRotation(rotation: ImageRotation | ImageRotationData): this {
    this.rotation = utils.types.isNumber(rotation) ? rotation : rotation.rotation
    return this
  }

  get scaleRatio(): number {
    return this._config.scaleRatio!
  }
  set scaleRatio(scaleRatio: number) {
    utils.guard.isNumber(scaleRatio, {name: 'scaleRatio', strict: false})
    this._config.scaleRatio = scaleRatio
  }
  getScaleRatio(): number {
    return this.scaleRatio
  }
  setScaleRatio(scaleRatio: number): this {
    this.scaleRatio = scaleRatio
    return this
  }

  /** @undocumented */
  get concurrentSessions(): number {
    return this._config.concurrentSessions!
  }
  /** @undocumented */
  set concurrentSessions(concurrentSessions: number) {
    this._config.concurrentSessions = concurrentSessions
  }
  /** @undocumented */
  getConcurrentSessions(): number {
    return this.concurrentSessions
  }
  /** @undocumented */
  setConcurrentSessions(concurrentSessions: number): this {
    this.concurrentSessions = concurrentSessions
    return this
  }

  get browsersInfo(): (DesktopBrowserInfo | ChromeEmulationInfo | IOSDeviceInfo | AndroidDeviceInfo)[] {
    return this._config.browsersInfo!
  }
  set browsersInfo(browsersInfo: (DesktopBrowserInfo | ChromeEmulationInfo | IOSDeviceInfo | AndroidDeviceInfo)[]) {
    utils.guard.isArray(browsersInfo, {name: 'browsersInfo'})
    this._config.browsersInfo = browsersInfo
  }
  getBrowsersInfo(): RenderInfo[] {
    return this.browsersInfo
  }
  setBrowsersInfo(browsersInfo: RenderInfo[]): this {
    this.browsersInfo = browsersInfo.map(browserInfo =>
      utils.types.has(browserInfo, 'deviceName') ? {chromeEmulationInfo: browserInfo} : browserInfo,
    )
    return this
  }
  addBrowsers(...browsersInfo: RenderInfo[]) {
    for (const [index, browserInfo] of browsersInfo.entries()) {
      utils.guard.isObject(browserInfo, {name: `addBrowsers( arg${index} )`})
    }
    if (!this.browsersInfo) this.browsersInfo = []
    this.browsersInfo.push(
      ...browsersInfo.map(browserInfo =>
        utils.types.has(browserInfo, 'deviceName') ? {chromeEmulationInfo: browserInfo} : browserInfo,
      ),
    )
    return this
  }
  addBrowser(browserInfo: RenderInfo): this
  addBrowser(width: number, height: number, name?: BrowserType): this
  addBrowser(browserInfoOrWidth: RenderInfo | number, height?: number, name: BrowserType = BrowserTypeEnum.CHROME) {
    if (utils.types.isObject(browserInfoOrWidth)) return this.addBrowsers(browserInfoOrWidth)
    else return this.addBrowsers({width: browserInfoOrWidth, height: height!, name})
  }
  addDeviceEmulation(deviceName: DeviceName, screenOrientation: ScreenOrientation = ScreenOrientationEnum.PORTRAIT) {
    if (!this.browsersInfo) this.browsersInfo = []
    this.browsersInfo.push({chromeEmulationInfo: {deviceName, screenOrientation}})
    return this
  }
  addMobileDevice(deviceName: AndroidDeviceName, screenOrientation: ScreenOrientation, version?: AndroidVersion): this
  addMobileDevice(deviceName: IosDeviceName, screenOrientation: ScreenOrientation, version?: IosVersion): this
  addMobileDevice(
    deviceName: IosDeviceName | AndroidDeviceName,
    screenOrientation?: ScreenOrientation,
    version?: AndroidVersion | IosVersion,
  ) {
    if (!this.browsersInfo) this.browsersInfo = []

    if (utils.types.isEnumValue(deviceName, IosDeviceNameEnum)) {
      this.browsersInfo.push({
        iosDeviceInfo: {
          deviceName: deviceName as IosDeviceName,
          screenOrientation,
          iosVersion: version as IosVersion,
        },
      })
    } else {
      this.browsersInfo.push({
        androidDeviceInfo: {
          deviceName: deviceName as AndroidDeviceName,
          screenOrientation,
          version: version as AndroidVersion,
        },
      })
    }
    return this
  }

  get visualGridOptions(): {[key: string]: any} {
    return this._config.visualGridOptions!
  }
  set visualGridOptions(visualGridOptions: {[key: string]: any}) {
    this._config.visualGridOptions = visualGridOptions
  }
  getVisualGridOptions(): {[key: string]: any} {
    return this.visualGridOptions
  }
  setVisualGridOptions(visualGridOptions: {[key: string]: any}): this {
    this.visualGridOptions = visualGridOptions
    return this
  }
  setVisualGridOption(key: string, value: any): this {
    if (!this.visualGridOptions) this.visualGridOptions = {}
    this.visualGridOptions[key] = value
    return this
  }

  get layoutBreakpoints(): boolean | number[] {
    return this._config.layoutBreakpoints!
  }
  set layoutBreakpoints(layoutBreakpoints: boolean | number[]) {
    utils.guard.notNull(layoutBreakpoints, {name: 'layoutBreakpoints'})
    if (utils.types.isArray(layoutBreakpoints)) {
      this._config.layoutBreakpoints = layoutBreakpoints.length > 0 ? layoutBreakpoints : false
    } else {
      this._config.layoutBreakpoints = layoutBreakpoints
    }
  }
  getLayoutBreakpoints(): boolean | number[] {
    return this.layoutBreakpoints
  }
  setLayoutBreakpoints(layoutBreakpoints: boolean | number[]): this {
    this.layoutBreakpoints = layoutBreakpoints
    return this
  }

  get disableBrowserFetching(): boolean {
    return this._config.disableBrowserFetching!
  }
  set disableBrowserFetching(disableBrowserFetching: boolean) {
    this._config.disableBrowserFetching = disableBrowserFetching
  }
  getDisableBrowserFetching(): boolean {
    return this.disableBrowserFetching
  }
  setDisableBrowserFetching(disableBrowserFetching: boolean): this {
    this.disableBrowserFetching = disableBrowserFetching
    return this
  }

  /** @undocumented */
  get dontCloseBatches(): boolean {
    return this._config.dontCloseBatches!
  }
  /** @undocumented */
  set dontCloseBatches(dontCloseBatches: boolean) {
    this._config.dontCloseBatches = dontCloseBatches
  }
  /** @undocumented */
  getDontCloseBatches(): boolean {
    return this.dontCloseBatches ?? utils.general.getEnvValue('DONT_CLOSE_BATCHES', 'boolean')
  }
  /** @undocumented */
  setDontCloseBatches(dontCloseBatches: boolean): this {
    this.dontCloseBatches = dontCloseBatches
    return this
  }

  /** @internal */
  toObject(): Configuration<TSpec> {
    return this._config
  }

  /** @internal */
  toJSON(): Core.Config<TSpec, 'classic'> & Core.Config<TSpec, 'ufg'> {
    return utils.general.toJSON({
      open: utils.general.removeUndefinedProps({
        serverUrl: this.serverUrl,
        apiKey: this.apiKey,
        agentId: this.agentId,
        proxy: this.proxy,
        connectionTimeout: this.connectionTimeout,
        removeSession: this.removeSession,
        appName: this.appName,
        testName: this.testName,
        displayName: this.displayName,
        sessionType: this.sessionType,
        properties: this.properties,
        batch: this.batch,
        baselineEnvName: this.baselineEnvName,
        environmentName: this.environmentName,
        environment: utils.general.removeUndefinedProps({
          hostingApp: this.hostApp,
          hostingAppInfo: this.hostAppInfo,
          os: this.hostOS,
          osInfo: this.hostOSInfo,
          deviceName: this.deviceInfo,
          viewportSize: this.viewportSize,
        }),
        branchName: this.branchName,
        parentBranchName: this.parentBranchName,
        baselineBranchName: this.baselineBranchName,
        compareWithParentBranch: this.compareWithParentBranch,
        ignoreBaseline: this.ignoreBaseline,
        ignoreGitBranching: this.ignoreGitMergeBase,
        saveDiffs: this.saveDiffs,
        keepBatchOpen: this.dontCloseBatches,
      }),
      screenshot: utils.general.removeUndefinedProps({
        fully: this.forceFullPageScreenshot,
        scrollRootElement: this.scrollRootElement,
        stitchMode: this.stitchMode,
        hideScrollbars: this.hideScrollbars,
        hideCaret: this.hideCaret,
        overlap: !utils.types.isNull(this.stitchOverlap) ? {bottom: this.stitchOverlap} : undefined,
        waitBetweenStitches: this.waitBeforeScreenshots,
        waitBeforeCapture: this.waitBeforeCapture,
        normalization: utils.general.removeUndefinedProps({
          cut: this.cut,
          rotation: this.rotation,
          scaleRatio: this.scaleRatio,
        }),
        debugImages:
          this.debugScreenshots?.save && utils.types.has(this.debugScreenshots, 'path')
            ? this.debugScreenshots
            : (undefined as any),
      }),
      check: utils.general.removeUndefinedProps({
        renderers: this.browsersInfo?.map(browserInfo => {
          if (utils.types.has(browserInfo, 'iosDeviceInfo')) {
            const {iosVersion, ...iosDeviceInfo} = browserInfo.iosDeviceInfo
            return {iosDeviceInfo: {...iosDeviceInfo, version: iosVersion}}
          }
          return browserInfo
        }),
        ufgOptions: this.visualGridOptions,
        layoutBreakpoints: this.layoutBreakpoints,
        disableBrowserFetching: this.disableBrowserFetching,
        autProxy: this.autProxy,
        sendDom: this.sendDom,
        retryTimeout: this.matchTimeout,
        matchLevel: this.defaultMatchSettings?.matchLevel,
        ignoreCaret: this.defaultMatchSettings?.ignoreCaret,
        ignoreDisplacements: this.defaultMatchSettings?.ignoreDisplacements,
        enablePatterns: this.defaultMatchSettings?.enablePatterns,
        accessibilitySettings: this.defaultMatchSettings?.accessibilitySettings && {
          level: this.defaultMatchSettings.accessibilitySettings.level,
          version: this.defaultMatchSettings.accessibilitySettings.guidelinesVersion,
        },
        useDom: this.defaultMatchSettings?.useDom,
        ignoreRegions: this.defaultMatchSettings?.ignoreRegions,
        contentRegions: this.defaultMatchSettings?.contentRegions,
        layoutRegions: this.defaultMatchSettings?.layoutRegions,
        strictRegions: this.defaultMatchSettings?.strictRegions,
        floatingRegions: this.defaultMatchSettings?.floatingRegions,
        accessibilityRegions: this.defaultMatchSettings?.accessibilityRegions,
      }),
      close: utils.general.removeUndefinedProps({
        updateBaselineIfDifferent: this.saveFailedTests,
        updateBaselineIfNew: this.saveNewTests,
      }),
    })
  }

  /** @internal */
  toString() {
    return utils.general.toString(this)
  }
}
