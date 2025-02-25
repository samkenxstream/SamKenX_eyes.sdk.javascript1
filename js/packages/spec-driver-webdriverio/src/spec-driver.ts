import type {Size, Region} from '@applitools/utils'
import type {SpecType as BaseSpecType, CommonSelector, Cookie, DriverInfo, ScreenOrientation} from '@applitools/driver'
import * as utils from '@applitools/utils'

type ApplitoolsBrand = {__applitoolsBrand?: never}

export type Driver = Applitools.WebdriverIO.Browser & ApplitoolsBrand
export type Element = (
  | Applitools.WebdriverIO.Element
  | {ELEMENT: string}
  | {'element-6066-11e4-a52e-4f735466cecf': string}
) &
  ApplitoolsBrand
export type ShadowRoot = {'shadow-6066-11e4-a52e-4f735466cecf': string}
export type Selector = (Applitools.WebdriverIO.Selector | {using: string; value: string}) & ApplitoolsBrand
export type SpecType = BaseSpecType<Driver, Driver, Element, Selector>

// #region HELPERS

const LEGACY_ELEMENT_ID = 'ELEMENT'
const ELEMENT_ID = 'element-6066-11e4-a52e-4f735466cecf'
const DIRECT_SELECTOR_REGEXP =
  /^(id|css selector|xpath|link text|partial link text|name|tag name|class name|-android uiautomator|-android datamatcher|-android viewmatcher|-android viewtag|-ios uiautomation|-ios predicate string|-ios class chain|accessibility id):(.+)/

function extractElementId(element: Element): string {
  return (
    (element as Applitools.WebdriverIO.Element).elementId ??
    (element as {'element-6066-11e4-a52e-4f735466cecf': string})[ELEMENT_ID] ??
    (element as {ELEMENT: string})[LEGACY_ELEMENT_ID]
  )
}
function transformShadowRoot(shadowRoot: ShadowRoot | Element): Element {
  return isElement(shadowRoot) ? shadowRoot : {[ELEMENT_ID]: shadowRoot['shadow-6066-11e4-a52e-4f735466cecf']}
}
function transformArgument(arg: any): [any?, ...Element[]] {
  if (!arg) return []
  const elements: Element[] = []
  const argWithElementMarkers = transform(arg)

  return [argWithElementMarkers, ...elements]

  function transform(arg: any): any {
    if (isElement(arg)) {
      elements.push(arg)
      return {isElement: true}
    } else if (utils.types.isArray(arg)) {
      return arg.map(transform)
    } else if (utils.types.isObject(arg)) {
      return Object.entries(arg).reduce((object, [key, value]) => {
        return Object.assign(object, {[key]: transform(value)})
      }, {})
    } else {
      return arg
    }
  }
}
// NOTE:
// A few things to note:
//  - this function runs inside of the browser process
//  - evaluations in Puppeteer accept multiple arguments (not just one like in Playwright)
//  - an element reference (a.k.a. an ElementHandle) can only be sent as its
//    own argument. To account for this, we use a wrapper function to receive all
//    of the arguments in a serialized structure, deserialize them, and call the script,
//    and pass the arguments as originally intended
function scriptRunner(script: string, arg: any, ...elements: Element[]) {
  const func = new Function(script.startsWith('function') ? `return (${script}).apply(null, arguments)` : script)
  return func(transform(arg))

  function transform(arg: any): any {
    if (!arg) {
      return arg
    } else if (arg.isElement) {
      return elements.shift()
    } else if (Array.isArray(arg)) {
      return arg.map(transform)
    } else if (typeof arg === 'object') {
      return Object.entries(arg).reduce((object, [key, value]) => {
        return Object.assign(object, {[key]: transform(value)})
      }, {})
    } else {
      return arg
    }
  }
}
function loadCommand() {
  return Number(process.env.APPLITOOLS_WEBDRIVERIO_MAJOR_VERSION) < 8
    ? require('webdriver/build/command').default
    : (method: string, url: string, body: any) => {
        const webdriver = import('webdriver') as any
        return async function (this: any, ...args: any[]) {
          return (await webdriver).command(method, url, body).apply(this, args)
        }
      }
}

// #endregion

// #region UTILITY

export function isDriver(browser: any): browser is Driver {
  if (!browser) return false
  return browser.constructor.name === 'Browser'
}
export function isElement(element: any): element is Element {
  if (!element) return false
  return Boolean(element.elementId || element[ELEMENT_ID] || element[LEGACY_ELEMENT_ID])
}
export function isSelector(selector: any): selector is Selector {
  return (
    utils.types.isString(selector) || utils.types.isFunction(selector) || utils.types.has(selector, ['using', 'value'])
  )
}
export function transformDriver(driver: Driver): Driver {
  const command = loadCommand()
  const additionalCommands = {
    _getWindowSize: command('GET', '/session/:sessionId/window/current/size', {
      command: '_getWindowSize',
      parameters: [],
    }),
    _setWindowSize: command('POST', '/session/:sessionId/window/current/size', {
      command: '_setWindowSize',
      parameters: [
        {name: 'width', type: 'number', required: true},
        {name: 'height', type: 'number', required: true},
      ],
    }),
    setWindowPosition: command('POST', '/session/:sessionId/window/current/position', {
      command: 'setWindowPosition',
      parameters: [
        {name: 'x', type: 'number', required: true},
        {name: 'y', type: 'number', required: true},
      ],
    }),
  }
  Object.entries(additionalCommands).forEach(([name, cmd]) => driver.addCommand(name, cmd))
  return driver
}
export function transformElement(element: Element): Element {
  const elementId = extractElementId(element)
  return {[ELEMENT_ID]: elementId, [LEGACY_ELEMENT_ID]: elementId}
}
export function transformSelector(selector: CommonSelector<Selector>): Selector {
  if (utils.types.has(selector, 'selector')) {
    if (!utils.types.has(selector, 'type')) return selector.selector
    if (selector.type === 'css') return `css selector:${selector.selector}`
    else return `${selector.type}:${selector.selector}`
  }
  return selector
}
export function untransformSelector(selector: Selector): CommonSelector | null {
  if (utils.types.isFunction(selector)) return null
  else if (utils.types.isString(selector)) {
    const match = selector.match(DIRECT_SELECTOR_REGEXP)
    if (!match) return {selector}
    const [, using, value] = match
    selector = {using, value}
  }
  if (utils.types.has(selector, ['using', 'value'])) {
    return {type: selector.using === 'css selector' ? 'css' : selector.using, selector: selector.value}
  }
  return selector
}
export function extractSelector(element: Element): Selector {
  return (element as any).selector
}
export function isStaleElementError(error: any): boolean {
  if (!error) return false
  const errOrResult = error.originalError || error
  return errOrResult instanceof Error && errOrResult.name === 'stale element reference'
}
export async function isEqualElements(_browser: Driver, element1: Element, element2: Element): Promise<boolean> {
  if (!element1 || !element2) return false
  const elementId1 = extractElementId(element1)
  const elementId2 = extractElementId(element2)
  return elementId1 === elementId2
}
export function extractHostName(driver: Driver): string | null {
  return driver.options?.hostname ?? null
}

// #endregion

// #region COMMANDS

export async function executeScript(browser: Driver, script: ((arg: any) => any) | string, arg?: any): Promise<any> {
  if (browser.isDevTools) {
    script = utils.types.isString(script) ? script : script.toString()
    return browser.execute(scriptRunner, script, ...transformArgument(arg))
  } else {
    return browser.execute(script, arg)
  }
}
export async function mainContext(browser: Driver): Promise<Driver> {
  await browser.switchToFrame(null)
  return browser
}
export async function parentContext(browser: Driver): Promise<Driver> {
  await browser.switchToParentFrame()
  return browser
}
export async function childContext(browser: Driver, element: Element): Promise<Driver> {
  await browser.switchToFrame(element)
  return browser
}
export async function findElement(
  browser: Driver,
  selector: Selector,
  parent?: Element,
): Promise<Applitools.WebdriverIO.Element | null> {
  selector = utils.types.has(selector, ['using', 'value']) ? `${selector.using}:${selector.value}` : selector
  const root = parent ? await browser.$(transformShadowRoot(parent) as any) : browser
  try {
    const element = await root.$(selector)
    return !utils.types.has(element, 'error') ? element : null
  } catch (error: any) {
    if (
      /element could not be located/i.test(error.message) ||
      /cannot locate an element/i.test(error.message) ||
      /wasn\'t found/i.test(error.message)
    ) {
      return null
    }
    throw error
  }
}
export async function findElements(
  browser: Driver,
  selector: Selector,
  parent?: Element,
): Promise<Applitools.WebdriverIO.Element[]> {
  selector = utils.types.has(selector, ['using', 'value']) ? `${selector.using}:${selector.value}` : selector
  const root = parent ? await browser.$(transformShadowRoot(parent) as any) : browser
  const elements = await root.$$(selector)
  return Array.from(elements)
}
export async function getWindowSize(browser: Driver): Promise<Size> {
  try {
    const rect = await browser.getWindowRect()
    return {width: rect.width, height: rect.height}
  } catch {
    return browser._getWindowSize() as Promise<Size>
  }
}
export async function setWindowSize(browser: Driver, size: Size): Promise<void> {
  try {
    await browser.setWindowRect(0, 0, size.width, size.height)
  } catch {
    await browser.setWindowPosition(0, 0)
    await browser._setWindowSize(size.width, size.height)
  }
}
export async function getSessionMetadata(driver: Driver): Promise<any[] | null> {
  // NOTE: this command is meant to be called when running with the eg-client
  // otherwise it will not be implemented on the driver and throw
  const command = loadCommand()
  const cmd = command('GET', '/session/:sessionId/applitools/metadata', {
    command: 'getSessionMetadata',
    description: '',
    ref: '',
    parameters: [],
  })
  const result = await cmd.call(driver)
  return result
}
export async function getCookies(browser: Driver, context?: boolean): Promise<Cookie[]> {
  if (context) return browser.getCookies()
  let cookies
  if (browser.isDevTools) {
    const puppeteer = await browser.getPuppeteer()
    const [page] = await puppeteer.pages!()
    const cdpSession = await page.target().createCDPSession()
    const response: any = await cdpSession.send('Network.getAllCookies')
    cookies = response.cookies
  } else {
    const response: any = await browser.sendCommandAndGetResult('Network.getAllCookies', {})
    cookies = response.cookies
  }

  return cookies.map((cookie: any) => {
    const copy = {...cookie, expiry: cookie.expires}
    delete copy.expires
    delete copy.size
    delete copy.priority
    delete copy.session
    delete copy.sameParty
    delete copy.sourceScheme
    delete copy.sourcePort
    return copy
  })
}
export async function getDriverInfo(driver: Driver): Promise<DriverInfo> {
  return {sessionId: driver.sessionId}
}
export async function getCapabilities(browser: Driver): Promise<Record<string, any>> {
  try {
    return (await browser.getSession?.()) ?? browser.capabilities
  } catch (error: any) {
    if (/cannot call non W3C standard command/i.test(error.message)) return browser.capabilities
    throw error
  }
}
export async function getTitle(browser: Driver): Promise<string> {
  return browser.getTitle()
}
export async function getUrl(browser: Driver): Promise<string> {
  return browser.getUrl()
}
export async function visit(browser: Driver, url: string): Promise<void> {
  await browser.url(url)
}
export async function takeScreenshot(browser: Driver): Promise<string | Buffer> {
  if (browser.isDevTools) {
    const puppeteer = await browser.getPuppeteer()
    const [page] = await puppeteer.pages!()
    const result = await page.screenshot({captureBeyondViewport: false})
    return result
  }
  return browser.takeScreenshot()
}
export async function click(browser: Driver, element: Element | Selector): Promise<void> {
  const resolvedElement = isSelector(element) ? await findElement(browser, element) : element
  const extendedElement = await browser.$(resolvedElement as any)
  await extendedElement.click()
}
export async function hover(browser: Driver, element: Element | Selector): Promise<any> {
  const resolvedElement = isSelector(element) ? await findElement(browser, element) : element
  if (browser.isDevTools) {
    const {x, y, width, height} = await browser.execute((element: any) => {
      const rect = element.getBoundingClientRect()
      return {x: rect.x, y: rect.y, width: rect.width, height: rect.height}
    }, resolvedElement)
    const puppeteer = await browser.getPuppeteer()
    const [page] = await puppeteer.pages!()
    await page.mouse.move(x + width / 2, y + height / 2)
  } else {
    const extendedElement = await browser.$(resolvedElement as any)
    await extendedElement.moveTo()
  }
}
export async function scrollIntoView(browser: Driver, element: Element | Selector, align = false): Promise<void> {
  const resolvedElement = isSelector(element) ? await findElement(browser, element) : element
  const extendedElement = await browser.$(resolvedElement as any)
  await extendedElement.scrollIntoView(align)
}
export async function waitUntilDisplayed(browser: Driver, selector: Selector, timeout: number): Promise<void> {
  const element = await findElement(browser, selector)
  if (process.env.APPLITOOLS_WEBDRIVERIO_MAJOR_VERSION === '5') {
    // @ts-ignore
    await element.waitForDisplayed(timeout)
  } else {
    // @ts-ignore
    await element.waitForDisplayed({timeout})
  }
}

// #endregion

// #region MOBILE COMMANDS

export async function getSystemBars(browser: Driver): Promise<{
  statusBar: {visible: boolean; x: number; y: number; height: number; width: number}
  navigationBar: {visible: boolean; x: number; y: number; height: number; width: number}
}> {
  return browser.getSystemBars() as any
}
export async function getOrientation(browser: Driver): Promise<ScreenOrientation> {
  const orientation = await browser.getOrientation()
  return orientation.toLowerCase() as ScreenOrientation
}
export async function setOrientation(browser: Driver, orientation: ScreenOrientation) {
  return await browser.setOrientation(orientation)
}
export async function getElementRegion(browser: Driver, element: Element): Promise<Region> {
  const extendedElement = await browser.$(element as any)
  if (utils.types.isFunction(extendedElement, 'getRect')) {
    return extendedElement.getRect()
  } else {
    const region = {x: 0, y: 0, width: 0, height: 0}
    if (utils.types.isFunction(extendedElement.getLocation)) {
      const location = await extendedElement.getLocation()
      region.x = location.x
      region.y = location.y
    }
    if (utils.types.isFunction(extendedElement.getSize)) {
      const size = await extendedElement.getSize()
      region.width = size.width
      region.height = size.height
    }
    return region
  }
}
export async function getElementAttribute(browser: Driver, element: Element, attr: string): Promise<string> {
  return (await browser.getElementAttribute(extractElementId(element), attr)) as string
}
export async function getElementText(browser: Driver, element: Element): Promise<string> {
  const extendedElement = await browser.$(element as any)
  return extendedElement.getText()
}
export async function setElementText(browser: Driver, element: Element | Selector, text: string): Promise<void> {
  const resolvedElement = isSelector(element) ? await findElement(browser, element) : element
  const extendedElement = await browser.$(resolvedElement as any)
  await extendedElement.setValue(text)
}
export async function performAction(browser: Driver, steps: any[]): Promise<void> {
  return browser.touchAction(steps as any)
}
export async function getCurrentWorld(driver: Driver): Promise<string> {
  const context = await driver.getContext()
  return utils.types.isString(context) ? context : (context as any).id
}
export async function getWorlds(driver: Driver): Promise<string[]> {
  const contexts = await driver.getContexts()
  return contexts.map(context => (utils.types.isString(context) ? context : (context as any).id))
}
export async function switchWorld(driver: Driver, name: string): Promise<void> {
  return driver.switchContext(name)
}
// #endregion

// #region TESTING

const browserOptionsNames: Record<string, string> = {
  chrome: 'goog:chromeOptions',
  firefox: 'moz:firefoxOptions',
}
/*
 * Spawn a browser with a given configuration (INTERNAL USE ONLY)
 *
 * NOTE:
 * This function is intended for internal use only. As a result it relies on some dev dependencies.
 * When wiring the spec-driver up to an SDK and calling this function, if you don't have the same dev deps
 * installed in the SDK, then this function will error.
 */
export async function build(env: any): Promise<[Driver, () => Promise<void>]> {
  const webdriverio = require('webdriverio')
  const chromedriver = require('chromedriver')
  const parseEnv = require('@applitools/test-utils/src/parse-env')
  const {
    protocol,
    browser = '',
    capabilities,
    url,
    attach,
    proxy,
    configurable = true,
    args = [],
    headless,
    logLevel = 'silent',
  } = parseEnv(env, process.env.APPLITOOLS_WEBDRIVERIO_PROTOCOL)

  const options: any = {
    capabilities: {browserName: browser, ...capabilities},
    logLevel,
    connectionRetryCount: 5,
    connectionRetryTimeout: 180000,
  }
  if (browser === 'chrome' && protocol === 'cdp') {
    options.automationProtocol = 'devtools'
    options.capabilities[browserOptionsNames.chrome] = {args}
    options.capabilities['wdio:devtoolsOptions'] = {
      headless,
      ignoreDefaultArgs: ['--hide-scrollbars'],
    }
  } else if (protocol === 'wd') {
    options.automationProtocol = 'webdriver'
    options.protocol = url.protocol ? url.protocol.replace(/:$/, '') : undefined
    options.hostname = url.hostname
    if (url.port) options.port = Number(url.port)
    else if (options.protocol === 'http') options.port = 80
    else if (options.protocol === 'https') options.port = 443
    options.path = url.pathname
    if (configurable) {
      if (browser === 'chrome' && attach) {
        await chromedriver.start(['--port=9515'], true)
        options.protocol = 'http'
        options.hostname = 'localhost'
        options.port = 9515
        options.path = '/'
      }
      const browserOptionsName = browserOptionsNames[browser || options.capabilities.browserName]
      if (browserOptionsName) {
        const browserOptions = options.capabilities[browserOptionsName] || {}
        browserOptions.args = [...(browserOptions.args || []), ...args]
        if (headless) browserOptions.args.push('headless')
        if (attach) {
          browserOptions.debuggerAddress = attach === true ? 'localhost:9222' : attach
          if (browser !== 'firefox') browserOptions.w3c = false
        }
        options.capabilities[browserOptionsName] = browserOptions
      }
    }
  }
  if (proxy) {
    options.capabilities.proxy = {
      proxyType: 'manual',
      httpProxy: proxy.http || proxy.server,
      sslProxy: proxy.https || proxy.server,
      ftpProxy: proxy.ftp,
      noProxy: proxy.bypass.join(','),
    }
  }
  const driver = await webdriverio.remote(options)
  return [driver, () => driver.deleteSession().then(() => chromedriver.stop())]
}

// #endregion
