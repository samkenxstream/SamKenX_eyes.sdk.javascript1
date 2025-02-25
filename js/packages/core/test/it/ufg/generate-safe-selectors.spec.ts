import {MockDriver, spec} from '@applitools/driver/fake'
import {makeDriver} from '@applitools/driver'
import {generateSafeSelectors} from '../../../src/ufg/utils/generate-safe-selectors'
import assert from 'assert'

const {addElementIds} = require('@applitools/snippets')

describe('generate-safe-selectors', () => {
  it('handles selectors', async () => {
    const mockDriver = new MockDriver()
    mockDriver.mockElements([
      {selector: 'element0', rect: {x: 1, y: 2, width: 500, height: 501}},
      {selector: 'element1', rect: {x: 10, y: 11, width: 101, height: 102}},
      {selector: 'element1', rect: {x: 12, y: 13, width: 103, height: 104}},
      {selector: 'element2', rect: {x: 20, y: 21, width: 201, height: 202}},
      {selector: 'element3', rect: {x: 40, y: 41, width: 401, height: 402}},
      {selector: 'element3', rect: {x: 42, y: 43, width: 403, height: 404}},
    ])
    const driver = await makeDriver({spec, driver: mockDriver})

    const {selectors} = await generateSafeSelectors({
      context: driver.mainContext,
      elementReferences: [
        'element0',
        'element1',
        {type: 'css', selector: 'element2'},
        ...(await mockDriver.findElements('element3')),
      ],
    })

    assert.strictEqual(selectors.length, 5)
    assert.deepStrictEqual(
      selectors.map(selector => selector.originalSelector),
      [
        {type: 'css', selector: 'element0'},
        {type: 'css', selector: 'element1'},
        {type: 'css', selector: 'element2'},
        {type: 'css', selector: 'element3'},
        {type: 'css', selector: 'element3'},
      ],
    )
  })

  it('handles nested selectors', async () => {
    const mockDriver = new MockDriver()
    mockDriver.mockElements([{selector: 'element0', rect: {x: 1, y: 2, width: 500, height: 501}}])
    mockDriver.mockScript(addElementIds, () => {
      return [['shadow-host-1', 'shadow-host-2', 'element']]
    })
    const driver = await makeDriver({spec, driver: mockDriver})

    const {selectors} = await generateSafeSelectors({
      context: driver.mainContext,
      elementReferences: ['element0'],
    })

    assert.strictEqual(selectors.length, 1)
    assert.deepStrictEqual(selectors[0].safeSelector, {
      type: 'css',
      selector: 'shadow-host-1',
      shadow: {
        type: 'css',
        selector: 'shadow-host-2',
        shadow: {type: 'css', selector: 'element'},
      },
    })
    // assert.deepStrictEqual(
    //   selectors.map(selector => selector.originalSelector),
    //   [
    //     {type: 'css', selector: 'element0'},
    //     {type: 'css', selector: 'element1'},
    //     {type: 'css', selector: 'element2'},
    //     {type: 'css', selector: 'element3'},
    //     {type: 'css', selector: 'element3'},
    //   ],
    // )
  })
})
