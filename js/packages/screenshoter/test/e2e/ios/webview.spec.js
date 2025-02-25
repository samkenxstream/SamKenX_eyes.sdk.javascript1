const {makeDriver, test, logger} = require('../e2e')

describe('screenshoter ios app', () => {
  let driver, destroyDriver

  beforeEach(async () => {
    ;[driver, destroyDriver] = await makeDriver({type: 'ios', logger})
  })

  afterEach(async () => {
    await destroyDriver()
  })

  it('take webview screenshot', async () => {
    const button = await driver.element({type: 'accessibility id', selector: 'Web view'})
    await button.click()

    await test({
      type: 'ios',
      tag: 'webview',
      wait: 1500,
      driver,
      logger,
      webview: true,
    })
  })
})
