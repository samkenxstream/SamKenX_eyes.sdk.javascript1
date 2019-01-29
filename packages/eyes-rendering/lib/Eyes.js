'use strict';

const { makeVisualGridClient } = require('@applitools/visual-grid-client');
const { getProcessPageAndSerializeScript } = require('@applitools/dom-snapshot');
const { Logger, ArgumentGuard, Configuration, TypeUtils } = require('@applitools/eyes-common');
const { BatchInfo, RectangleSize, TestFailedError, TestResultsFormatter } = require('@applitools/eyes-sdk-core');
const { EyesSeleniumUtils, EyesWebDriver } = require('@applitools/eyes-selenium');
const { RenderingConfiguration } = require('./RenderingConfiguration');

class Eyes {
  constructor() {
    /** @type {Logger} */ this._logger = new Logger();
    /** @type {string} */ this._serverUrl = undefined;

    /** @type {EyesJsExecutor} */ this._jsExecutor = undefined;
    /** @type {ProxySettings} */ this._proxy = undefined;
    /** @type {BatchInfo} */ this._batchInfo = new BatchInfo();
    /** @type {Configuration} */ this._configuration = new Configuration();
    /** @type {boolean} */ this._sendDom = true;

    this._isOpen = false;
    this._processPageAndSerializeScript = undefined;

    this._checkWindowCommand = undefined;
    this._closeCommand = undefined;

    /** @type {boolean} */ this._isVisualGrid = true;
  }

  /**
   * Sets a handler of log messages generated by this API.
   *
   * @param {LogHandler} logHandler Handles log messages generated by this API.
   */
  setLogHandler(logHandler) {
    this._logger = new Logger();
    this._logger.setLogHandler(logHandler);
  }

  /**
   * @param {WebDriver} webDriver
   * @param appName
   * @param testName
   * @param viewportSize
   * @param {RenderingConfiguration} _renderingConfiguration
   */
  async open(webDriver, appName, testName, viewportSize, _renderingConfiguration) {
    this._logger.verbose('enter');

    ArgumentGuard.notNull(webDriver, 'webDriver');
    ArgumentGuard.notNull(_renderingConfiguration, 'renderingConfiguration');

    const renderingConfiguration = (_renderingConfiguration instanceof RenderingConfiguration) ? _renderingConfiguration :
      RenderingConfiguration.fromObject(_renderingConfiguration);
    const apiKey = this.getApiKey();
    const showLogs = process.env.APPLITOOLS_SHOW_LOGS;
    const saveDebugData = process.env.APPLITOOLS_SAVE_DEBUG_DATA;

    await this._initDriver(webDriver);

    if (!appName) {
      appName = renderingConfiguration.getAppName() ? renderingConfiguration.getAppName() : this.getAppName();
    } else {
      this.setAppName(appName);
    }
    if (!testName) {
      testName = renderingConfiguration.getTestName() ? renderingConfiguration.getTestName() : this.getTestName();
    } else {
      this.setTestName(testName);
    }

    const { openEyes } = makeVisualGridClient({
      showLogs,
      apiKey,
      saveDebugData,
      proxy: this._proxy,
      serverUrl: this._serverUrl,
      renderConcurrencyFactor: renderingConfiguration.getConcurrentSessions(),
    });

    this._processPageAndSerializeScript = await getProcessPageAndSerializeScript();

    this._logger.verbose('opening openEyes...');

    viewportSize = viewportSize ? viewportSize : this.getViewportSize();
    if (viewportSize) {
      await this.setViewportSize(viewportSize);
    }

    const { checkWindow, close } = await openEyes({
      appName: appName,
      testName: testName,
      browser: renderingConfiguration.getBrowsersInfo(),

      // properties,
      batchName: renderingConfiguration.getBatch() && renderingConfiguration.getBatch().getName() ? renderingConfiguration.getBatch().getName() : this.getBatch().getName(),
      batchId: renderingConfiguration.getBatch() && renderingConfiguration.getBatch().getId() ? renderingConfiguration.getBatch().getId() : this.getBatch().getId(),
      baselineBranchName: renderingConfiguration.getBaselineBranchName() ? renderingConfiguration.getBaselineBranchName() : this.getBaselineBranchName(),
      baselineEnvName: renderingConfiguration.getBaselineEnvName() ? renderingConfiguration.getBaselineEnvName() : this.getBaselineEnvName(),
      baselineName: renderingConfiguration.getBaselineEnvName() ? renderingConfiguration.getBaselineEnvName() : this.getBaselineEnvName(),
      envName: renderingConfiguration.getEnvironmentName() ? renderingConfiguration.getEnvironmentName() : this.getEnvironmentName(),
      ignoreCaret: this.getIgnoreCaret(),
      isDisabled: this.isDisabled(),
      matchLevel: this.getMatchLevel(),
      matchTimeout: this.getMatchTimeout(),
      parentBranchName: renderingConfiguration.getParentBranchName() ? renderingConfiguration.getParentBranchName() : this.getParentBranchName(),
      branchName: renderingConfiguration.getBranchName() ? renderingConfiguration.getBranchName() : this.getBranchName(),
      saveFailedTests: this.getSaveFailedTests(),
      saveNewTests: this.getSaveNewTests(),
      compareWithParentBranch: this.isCompareWithParentBranch(),
      ignoreBaseline: this.isIgnoreBaseline(),
      logger: this._logger,
      // renderBatch,
      // waitForRenderedStatus,
      // renderThroat,
      // getRenderInfoPromise,
      // getHandledRenderInfoPromise,
      // getRenderInfo,
      // createRGridDOMAndGetResourceMapping,
      // eyesTransactionThroat,
      agentId: renderingConfiguration.getAgentId() ? renderingConfiguration.getAgentId() : this.getAgentId()
    });

    this._checkWindowCommand = checkWindow;
    this._closeCommand = close;
    this._isOpen = true;
    this._logger.verbose('done');

    return this._driver;
  }

  /**
   * @private
   * @param {WebDriver} webDriver
   */
  async _initDriver(webDriver) {
    if (TypeUtils.hasMethod(webDriver, ['executeScript', 'executeAsyncScript'])) {
      this._jsExecutor = webDriver;
    }

    if (webDriver instanceof EyesWebDriver) {
      this._driver = webDriver;
    } else {
      this._driver = new EyesWebDriver(this._logger, this, webDriver);
    }
  }

  /**
   * Warning! You will get an array of TestResults.
   *
   * @param {boolean} [throwEx]
   * @return {Promise<TestResults[]>}
   */
  async close(throwEx) {
     const results = await this.closeAndReturnResults(throwEx);
     return results && results.length > 0 ? results[0] : null;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @return {TestResults}
   */
  abortIfNotClosed() {
    return null; // TODO - implement?
  }

  /**
   * @return {boolean}
   */
  getIsOpen() {
    return this._isOpen;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * @return {boolean}
   */
  getIsDisabled() {
    return false;
  }

  /**
   * Sets the API key of your applitools Eyes account.
   *
   * @param apiKey {string} The api key to be used.
   */
  setApiKey(apiKey) {
    ArgumentGuard.notNull(apiKey, 'apiKey');
    ArgumentGuard.alphanumeric(apiKey, 'apiKey');
    this._configuration.setApiKey(apiKey);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} The currently set API key or {@code null} if no key is set.
   */
  getApiKey() {
    return this._configuration.getApiKey();
  }

  /**
   * @param {boolean} [throwEx]
   * @return {Promise<TestResults[]>}
   */
  async closeAndReturnResults(throwEx = true) {
    try {
      return await this._closeCommand(throwEx);
    } finally {
      this._isOpen = false;
    }
  }

  /**
   * @param {boolean} [throwEx]
   * @return {Promise<*>}
   */
  async closeAndPrintResults(throwEx = true) {
    const results = await this.closeAndReturnResults(throwEx);

    const testResultsFormatter = new TestResultsFormatter(results);
    // eslint-disable-next-line no-console
    console.log(testResultsFormatter.asFormatterString());
  }

  /**
   * @param {BatchInfo} batchInfo
   */
  setBatch(batchInfo) {
    this._batchInfo = batchInfo;
  }

  /**
   * @return {BatchInfo} The currently set batch info.
   */
  getBatch() {
    return this._batchInfo;
  }

  /**
   * @param {string} serverUrl
   */
  setServerUrl(serverUrl) {
    this._serverUrl = serverUrl;
  }

  /**
   * @return {boolean}
   */
  isEyesClosed() {
    return this._isOpen;
  }

  /**
   * Sets the proxy settings to be used by the rest client.
   * @param {ProxySettings} proxySettings The proxy settings to be used by the rest client. If {@code null} then no
   *   proxy is set.
   */
  setProxy(proxySettings) {
    this._proxy = proxySettings;
  }

  /**
   * @return {Logger}
   */
  getLogger() {
    return this._logger;
  }

  /**
   * @param {string} name
   * @param {CheckRGSettings} checkSettings
   */
  async check(name, checkSettings) {
    ArgumentGuard.notNull(checkSettings, 'checkSettings');

    if (TypeUtils.isNotNull(name)) {
      checkSettings.withName(name);
    }

    this._logger.verbose(`Dom extraction starting   (${checkSettings.toString()})   $$$$$$$$$$$$`);

    let targetSelector = await checkSettings.getTargetProvider();
    if (targetSelector) {
      targetSelector = await targetSelector.getSelector(this);
    }

    const domCaptureScript = `var callback = arguments[arguments.length - 1]; return (${this._processPageAndSerializeScript})().then(JSON.stringify).then(callback, function(err) {callback(err.stack || err.toString())})`;
    const results = await this._jsExecutor.executeAsyncScript(domCaptureScript);
    const { cdt, url: pageUrl, blobs, resourceUrls } = JSON.parse(results);

    const resourceContents = blobs.map(({ url, type, value }) => ({
      url,
      type,
      value: Buffer.from(value, 'base64'),
    }));

    this._logger.verbose(`Dom extracted  (${checkSettings.toString()})   $$$$$$$$$$$$`);

    await this._checkWindowCommand({
      resourceUrls,
      resourceContents,
      // frames
      url: pageUrl,
      cdt,
      tag: checkSettings.getName(),
      sizeMode: checkSettings.getSizeMode(),
      selector: targetSelector,
      region: checkSettings.getTargetRegion(),
      scriptHooks: checkSettings.getScriptHooks(),
      ignore: checkSettings.getIgnoreRegions(),
      floating: checkSettings.getFloatingRegions(),
      sendDom: checkSettings.getSendDom() ? checkSettings.getSendDom() : this.getSendDom(),
      matchLevel: checkSettings.getMatchLevel() ? checkSettings.getMatchLevel() : this.getMatchLevel()
    });
  }

  /**
   * @return {string}
   */
  getTestName() {
    return this._configuration.getTestName();
  }

  /**
   * @param {string} testName
   */
  setTestName(testName) {
    this._configuration.setTestName(testName);
  }

  /**
   * @param appName {string} The name of the application under test.
   */
  setAppName(appName) {
    this._configuration.setAppName(appName);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {string} The name of the application under test.
   */
  getAppName() {
    return this._configuration.getAppName();
  }

  /**
   * @return {string}
   */
  getBaselineBranchName() {
    return this._configuration.getBaselineBranchName();
  }

  /**
   * @param {string} baselineBranchName
   */
  setBaselineBranchName(baselineBranchName) {
    this._configuration.setBaselineBranchName(baselineBranchName);
  }

  /**
   * @return {string}
   */
  getBaselineEnvName() {
    return this._configuration.getBaselineEnvName();
  }

  /**
   * @param {string} baselineEnvName
   */
  setBaselineEnvName(baselineEnvName) {
    this._configuration.setBaselineEnvName(baselineEnvName);
  }

  /**
   * @return {string}
   */
  getEnvironmentName() {
    return this._configuration.getEnvironmentName();
  }

  /**
   * @param {string} environmentName
   */
  setEnvironmentName(environmentName) {
    this._configuration.setEnvironmentName(environmentName);
  }

  /**
   * @param agentId
   */
  setAgentId(agentId) {
    this._configuration.setAgentId(agentId);
  }

  /**
   * @return {string}
   */
  getAgentId() {
    return this._configuration.getAgentId();
  }

  /**
   * @param parentBranchName
   */
  setParentBranchName(parentBranchName) {
    this._configuration.setParentBranchName(parentBranchName);
  }

  /**
   * @return {string}
   */
  getParentBranchName() {
    return this._configuration.getParentBranchName();
  }

  /**
   * @param branchName
   */
  setBranchName(branchName) {
    this._configuration.setBranchName(branchName);
  }

  /**
   * @return {string}
   */
  getBranchName() {
    return this._configuration.getBranchName();
  }

  /**
   * @param {boolean} compareWithParentBranch New compareWithParentBranch value, default is false
   */
  setCompareWithParentBranch(compareWithParentBranch) {
    this._configuration.setCompareWithParentBranch(compareWithParentBranch);
  }

  /**
   * @return {boolean} The currently compareWithParentBranch value
   */
  isCompareWithParentBranch() {
    return this._configuration.isCompareWithParentBranch();
  }

  /**
   * @param {boolean} ignoreBaseline New ignoreBaseline value, default is false
   */
  setIgnoreBaseline(ignoreBaseline) {
    this._configuration.setIgnoreBaseline(ignoreBaseline);
  }

  /**
   * @return {boolean} The currently ignoreBaseline value
   */
  isIgnoreBaseline() {
    return this._configuration.isIgnoreBaseline();
  }

  /**
   * Set whether or not new tests are saved by default.
   *
   * @param {boolean} saveNewTests True if new tests should be saved by default. False otherwise.
   */
  setSaveNewTests(saveNewTests) {
    this._configuration.setSaveNewTests(saveNewTests);
  }

  /**
   * @return {boolean} True if new tests are saved by default.
   */
  getSaveNewTests() {
    return this._configuration.getSaveNewTests();
  }

  /**
   * Set whether or not failed tests are saved by default.
   *
   * @param {boolean} saveFailedTests True if failed tests should be saved by default, false otherwise.
   */
  setSaveFailedTests(saveFailedTests) {
    this._configuration.setSaveFailedTests(saveFailedTests);
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean} True if failed tests are saved by default.
   */
  getSaveFailedTests() {
    return this._configuration.getSaveFailedTests();
  }

  /**
   * Sets the maximum time (in ms) a match operation tries to perform a match.
   * @param {number} ms Total number of ms to wait for a match.
   */
  setMatchTimeout(ms) {
    this._configuration.setMatchTimeout(ms);
  }

  /**
   * @return {number} The maximum time in ms {@link #checkWindowBase(RegionProvider, string, boolean, number)} waits
   *   for a match.
   */
  getMatchTimeout() {
    return this._configuration.getMatchTimeout();
  }

  /**
   * The test-wide match level to use when checking application screenshot with the expected output.
   *
   * @param {MatchLevel} matchLevel The test-wide match level to use when checking application screenshot with the
   *   expected output.
   */
  setMatchLevel(matchLevel) {
    this._configuration.setMatchLevel(matchLevel);
  }

  /**
   * @return {MatchLevel} The test-wide match level.
   */
  getMatchLevel() {
    return this._configuration.getMatchLevel();
  }

  /**
   * Sets the ignore blinking caret value.
   *
   * @param {boolean} value The ignore value.
   */
  setIgnoreCaret(value) {
    this._configuration.setIgnoreCaret(value);
  }

  /**
   * @return {boolean} Whether to ignore or the blinking caret or not when comparing images.
   */
  getIgnoreCaret() {
    return this._configuration.getIgnoreCaret();
  }

  /**
   * @param isDisabled {boolean} If true, all interactions with this API will be silently ignored.
   */
  setIsDisabled(isDisabled) {
    this._configuration.setIsDisabled(isDisabled);
  }

  /**
   * @return {boolean} Whether eyes is disabled.
   */
  isDisabled() {
    return this._configuration.getIsDisabled();
  }

  /**
   * @param {boolean} sendDom
   */
  setSendDom(sendDom) {
    this._sendDom = sendDom;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  getSendDom() {
    return this._sendDom;
  }

  /**
   * @return {RectangleSize}
   */
  getViewportSize() {
    return this._configuration.getViewportSize();
  }

  /**
   * @param {RectangleSize} viewportSize
   */
  async setViewportSize(viewportSize) {
    ArgumentGuard.notNull(viewportSize, 'viewportSize');
    viewportSize = new RectangleSize(viewportSize);
    this._configuration.setViewportSize(viewportSize);

    if (this._driver) {
      const originalFrame = this._driver.getFrameChain();
      await this._driver.switchTo().defaultContent();

      try {
        await EyesSeleniumUtils.setViewportSize(this._logger, this._driver, viewportSize);
      } catch (err) {
        await this._driver.switchTo().frames(originalFrame); // Just in case the user catches that error
        throw new TestFailedError('Failed to set the viewport size', err);
      }

      await this._driver.switchTo().frames(originalFrame);
    }
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * @return {boolean}
   */
  isVisualGrid() {
    return this._isVisualGrid;
  }


  getEyesRunner() {
    const runner = {};
    runner.getAllResults = () => {
      return this.closeAndReturnResults();
    };
    return runner;
  }
}

exports.Eyes = Eyes;
