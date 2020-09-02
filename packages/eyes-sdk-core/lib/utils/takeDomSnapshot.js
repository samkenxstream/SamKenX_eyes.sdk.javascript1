'use strict'

const {
  getProcessPageAndSerializePoll,
  getProcessPageAndSerializePollForIE,
} = require('@applitools/dom-snapshot')
const GeneralUtils = require('./GeneralUtils')
const deserializeDomSnapshotResult = require('./deserializeDomSnapshotResult')

const PULL_TIMEOUT = 200 // ms
const CAPTURE_DOM_TIMEOUT_MS = 5 * 60 * 1000 // 5 min

let captureScript, captureScriptIE

async function getScript({disableBrowserFetching}) {
  if (!captureScript) {
    const scriptBody = await getProcessPageAndSerializePoll()
    captureScript = `${scriptBody} return __processPageAndSerializePoll(document, {dontFetchResources: ${disableBrowserFetching}});`
  }

  return captureScript
}

async function getScriptForIE({disableBrowserFetching}) {
  if (!captureScriptIE) {
    const scriptBody = await getProcessPageAndSerializePollForIE()
    captureScriptIE = `${scriptBody} return __processPageAndSerializePollForIE(document, {dontFetchResources: ${disableBrowserFetching}});`
  }

  return captureScriptIE
}

async function takeDomSnapshot({driver, startTime = Date.now(), browser, disableBrowserFetching}) {
  const processPageAndPollScript =
    browser === 'IE'
      ? await getScriptForIE({disableBrowserFetching})
      : await getScript({disableBrowserFetching})
  const resultAsString = await driver.execute(processPageAndPollScript)

  const scriptResponse = JSON.parse(resultAsString)

  if (scriptResponse.status === 'SUCCESS') {
    return deserializeDomSnapshotResult(scriptResponse.value)
  } else if (scriptResponse.status === 'ERROR') {
    throw new Error(`Unable to process: ${scriptResponse.error}`)
  } else if (Date.now() - startTime >= CAPTURE_DOM_TIMEOUT_MS) {
    throw new Error('Timeout is reached.')
  }

  await GeneralUtils.sleep(PULL_TIMEOUT)
  return takeDomSnapshot({driver, startTime})
}

module.exports = takeDomSnapshot
