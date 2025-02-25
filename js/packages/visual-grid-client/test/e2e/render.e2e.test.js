const uaParser = require('ua-parser-js')
const fetch = require('node-fetch')
const {expect} = require('chai')
const makeRenderer = require('../../src/sdk/renderer')
const {createRenderRequest} = require('../../src/sdk/render/createRenderRequest')
const {RenderingInfo} = require('@applitools/eyes-sdk-core')

describe('render e2e', () => {
  let renderingInfo
  const apiKey = process.env.APPLITOOLS_API_KEY
  before(async () => {
    renderingInfo = await fetch(
      `https://eyesapi.applitools.com/api/sessions/renderInfo?apiKey=${apiKey}`,
    )
      .then(r => r.json())
      .then(json => new RenderingInfo(json))
  })

  it('renders older browser versions', async () => {
    const browsers = [
      {width: 640, height: 480, name: 'chrome'},
      {width: 640, height: 480, name: 'chrome-1'},
      {width: 640, height: 480, name: 'chrome-2'},
      {width: 640, height: 480, name: 'firefox'},
      {width: 640, height: 480, name: 'firefox-1'},
      {width: 640, height: 480, name: 'firefox-2'},
      {width: 640, height: 480, name: 'safari'},
      {width: 640, height: 480, name: 'safari-1'},
      {width: 640, height: 480, name: 'safari-2'},
      {width: 640, height: 480, name: 'edgechromium'},
      {width: 640, height: 480, name: 'edgechromium-1'},
      // {width: 640, height: 480, name: 'edgechromium-2'},
    ]

    const {createResourceMapping, render, waitForRenderedStatus} = makeRenderer({
      apiKey,
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
      renderingInfo,
    })

    const {dom, resources} = await createResourceMapping({
      snapshot: {
        cdt: [{nodeType: 3, nodeValue: 'renders older browser versions - works!'}],
        frames: [],
        resourceUrls: [],
        resourceContents: [],
      },
    })

    const renderRequests = browsers.map(browser =>
      createRenderRequest({
        url: 'http://something',
        snapshot: dom,
        resources,
        browser,
        renderInfo: renderingInfo,
        target: 'full-page',
      }),
    )

    const renderIds = await Promise.all(renderRequests.map(render))

    const renderStatusResults = await Promise.all(
      renderIds.map(renderId => waitForRenderedStatus(renderId)),
    )

    const majorVersions = renderStatusResults.map(({userAgent}) =>
      Number(uaParser(userAgent).browser.major),
    )

    const [
      chrome,
      chrome1,
      chrome2,
      firefox,
      firefox1,
      firefox2,
      safari,
      safari1,
      safari2,
      edgechromium,
      edgechromium1,
      // edgechromium2,
    ] = majorVersions

    expect(chrome1).to.equal(chrome - 1)
    expect(chrome2).to.equal(chrome - 2)
    expect(firefox1).to.equal(firefox - 1)
    expect(firefox2).to.equal(firefox - 2)
    expect(safari1).to.equal(safari - 1)
    expect(safari2).to.equal(safari - 2)
    expect(edgechromium1).to.equal(edgechromium - 1)
    // expect(edgechromium2).to.equal(edgechromium - 2)
  })
})
