const assert = require('assert')
const {cleanupElementIds, addElementIds} = require('../dist/index')

describe('cleanupElementIds', () => {
  const url = 'https://applitools.github.io/demo/TestPages/SnippetsTestPage/'

  describe('chrome', () => {
    let page

    before(async function() {
      page = await global.getDriver('chrome')
      if (!page) {
        this.skip()
      }
    })

    it('standard dom', async () => {
      await page.goto(url)
      const elements = await page.$$('#scrollable,#static,#fixed')
      const elementMapping = {1: elements[0], 2: elements[1], 3: elements[2]}
      const selectorMapping = await page.evaluate(addElementIds, [
        Object.values(elementMapping),
        Object.keys(elementMapping),
      ])
      const selector = Object.values(selectorMapping)
        .map(([selector]) => selector)
        .join(', ')
      const markedElements = await page.$$(selector)
      assert.strictEqual(markedElements.length, 3)
      await page.evaluate(cleanupElementIds, [elements])
      const markedElementsAfterCleanup = await page.$$(selector)
      assert.strictEqual(markedElementsAfterCleanup.length, 0)
    })

    it('fake shadow dom', async () => {
      await page.goto(url)
      const elements = await page.$$('#fake-shadow-dom')
      const ids = ['1']
      const selectors = await page.evaluate(addElementIds, [elements, ids])
      const markedElements = await page.$$(selectors[0][0])
      assert.strictEqual(markedElements.length, 1)
      await page.evaluate(cleanupElementIds, [elements])
      const markedElementsAfterCleanup = await page.$$(selectors[0][0])
      assert.strictEqual(markedElementsAfterCleanup.length, 0)
    })
  })

  for (const name of ['internet explorer', 'ios safari']) {
    describe(name, () => {
      let driver

      before(async function() {
        driver = await global.getDriver(name)
        if (!driver) {
          this.skip()
        }
      })

      it('standard dom', async () => {
        await driver.url(url)
        const elements = await driver.$$('#scrollable,#static,#fixed')
        const elementMapping = {1: elements[0], 2: elements[1], 3: elements[2]}

        const selectorMapping = await driver.execute(addElementIds, [
          Object.values(elementMapping),
          Object.keys(elementMapping),
        ])
        const selector = Object.values(selectorMapping)
          .map(([selector]) => selector)
          .join(', ')
        const markedElements = await driver.$$(selector)
        assert.strictEqual(markedElements.length, 3)
        await driver.execute(cleanupElementIds, [elements])
        const markedElementsAfterCleanup = await driver.$$(selector)
        assert.strictEqual(markedElementsAfterCleanup.length, 0)
      })
    })
  }
})
