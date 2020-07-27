const assert = require('assert')
const {Logger} = require('../../index')
const MockDriver = require('../utils/MockDriver')
const {Driver, Context} = require('../utils/FakeSDK')

describe('EyesContext', () => {
  describe('attached', () => {
    let logger = new Logger(false)
    let mock, driver, context

    beforeEach(() => {
      mock = new MockDriver()
      mock.mockElements([
        {
          selector: 'frame1',
          frame: true,
          children: [
            {
              selector: 'frame1-1',
              frame: true,
              children: [{selector: 'frame1-1--element1'}],
            },
          ],
        },
        {
          selector: 'frame2',
          frame: true,
          children: [{selector: 'frame2--element1'}],
        },
      ])
      driver = new Driver(logger, mock)
      context = driver.currentContext
    })

    it('constructor(logger, context, {driver})', async () => {
      assert.ok(context.isMain)
      assert.ok(context.unwrapped)
    })

    it('attach(detached-context)', async () => {
      const detachedContext = new Context()
      const detachedContext1 = await detachedContext.context('frame1')
      const detachedContext11 = await detachedContext1.context('frame1-1')
      assert.ok(detachedContext11.isDetached)

      const attachedContext = context.attach(detachedContext11)
      assert.ok(!attachedContext.isDetached)

      const element = await attachedContext.element('frame1-1--element1')
      assert.strictEqual(element.context, attachedContext)
      assert.strictEqual(element.selector, 'frame1-1--element1')
      assert.strictEqual(driver.currentContext, attachedContext)
    })

    it('context(element)', async () => {
      const element = await mock.findElement('frame1')
      const childContext = await context.context(element)

      assert.strictEqual(childContext.parent, context)
      assert.strictEqual(childContext.main, context)
    })

    it('init()', async () => {
      const childContext1 = await context.context('frame1')
      const childContext11 = await childContext1.context('frame1-1')
      await childContext11.init()

      assert.strictEqual(childContext1._element.unwrapped.selector, 'frame1')
      assert.strictEqual(childContext11._element.unwrapped.selector, 'frame1-1')
      assert.strictEqual(driver.currentContext, childContext1)
    })

    it('focus()', async () => {
      const childContext1 = await context.context('frame1')
      const childContext11 = await childContext1.context('frame1-1')
      await childContext11.focus()

      assert.strictEqual(driver.currentContext, childContext11)
    })

    it('element(selector)', async () => {
      const childContext1 = await context.context('frame1')
      const childContext11 = await childContext1.context('frame1-1')
      const element = await childContext11.element('frame1-1--element1')

      assert.strictEqual(driver.currentContext, childContext11)
      assert.strictEqual(element.unwrapped.selector, 'frame1-1--element1')
    })

    it('element(selector + another-context)', async () => {
      const childContext1 = await context.context('frame1')
      const childContext11 = await childContext1.context('frame1-1')
      const childContext2 = await context.context('frame2')
      await childContext11.focus(driver)
      const element = await childContext2.element('frame2--element1')

      assert.strictEqual(driver.currentContext, childContext2)
      assert.strictEqual(element.unwrapped.selector, 'frame2--element1')
    })
  })

  describe('detached', () => {
    let context

    beforeEach(() => {
      context = new Context()
    })

    it('constructor()', async () => {
      assert.ok(context.isMain)
      assert.ok(context.isDetached)
    })

    it('context(selector)', async () => {
      const childContext = await context.context('frame')
      assert.ok(context.isRef)
      assert.ok(context.isDetached)
      assert.strictEqual(childContext.parent, context)
      assert.strictEqual(childContext.main, context)
    })

    it('element(selector)', async () => {
      const element = await context.element('element')
      assert.ok(element.isRef)
      assert.strictEqual(element.context, context)
    })

    it('element(element)', async () => {
      const element = await context.element({id: 'elementId'})
      assert.ok(element.isRef)
      assert.strictEqual(element.context, context)
    })
  })
})
