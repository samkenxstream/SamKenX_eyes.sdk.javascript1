import type {Region} from '@applitools/utils'
import type {DriverTarget, Target, Eyes, CheckSettings, CheckResult} from './types'
import {type DomSnapshot, type AndroidSnapshot, type IOSSnapshot} from '@applitools/ufg-client'
import {type AbortSignal} from 'abort-controller'
import {type Logger} from '@applitools/logger'
import {type UFGClient} from '@applitools/ufg-client'
import {makeDriver, isDriver, type SpecType, type SpecDriver, type Selector, type Cookie} from '@applitools/driver'
import {takeSnapshots} from './utils/take-snapshots'
import {waitForLazyLoad} from '../automation/utils/wait-for-lazy-load'
import {toBaseCheckSettings} from '../automation/utils/to-base-check-settings'
import {generateSafeSelectors} from './utils/generate-safe-selectors'
import {uniquifyRenderers} from './utils/uniquify-renderers'
import {AbortError} from '../errors/abort-error'
import * as utils from '@applitools/utils'
import chalk from 'chalk'

type Options<TSpec extends SpecType> = {
  eyes: Eyes<TSpec>
  client: UFGClient
  target?: DriverTarget<TSpec>
  spec?: SpecDriver<TSpec>
  signal?: AbortSignal
  logger: Logger
}

export function makeCheck<TSpec extends SpecType>({
  eyes,
  client,
  target: defaultTarget,
  spec,
  signal,
  logger: defaultLogger,
}: Options<TSpec>) {
  return async function check({
    target = defaultTarget,
    settings = {},
    logger = defaultLogger,
  }: {
    settings?: CheckSettings<TSpec>
    target?: Target<TSpec>
    logger?: Logger
  }): Promise<CheckResult[]> {
    logger.log('Command "check" is called with settings', settings)

    if (signal?.aborted) {
      logger.warn('Command "check" was called after test was already aborted')
      throw new AbortError('Command "check" was called after test was already aborted')
    }

    const {elementReferencesToCalculate, elementReferenceToTarget, getBaseCheckSettings} = toBaseCheckSettings({
      settings,
    })

    let snapshots: DomSnapshot[] | AndroidSnapshot[] | IOSSnapshot[]
    let snapshotUrl: string | undefined
    let snapshotTitle: string | undefined
    let userAgent: string | undefined
    let regionToTarget: Selector | Region
    let selectorsToCalculate: {originalSelector: Selector | null; safeSelector: Selector | null}[]
    const uniqueRenderers = uniquifyRenderers(settings.renderers ?? [])
    const driver = spec && isDriver(target, spec) ? await makeDriver({spec, driver: target, logger}) : null
    if (driver) {
      await driver.currentContext.setScrollingElement(settings.scrollRootElement ?? null)
      if (uniqueRenderers.length === 0) {
        if (driver.isWeb) {
          const viewportSize = await driver.getViewportSize()
          uniqueRenderers.push({name: 'chrome', ...viewportSize})
        } else {
          // TODO add default nmg renderers
        }
      }
      let cleanupGeneratedSelectors
      if (driver.isWeb) {
        userAgent = driver.userAgent
        const generated = await generateSafeSelectors({
          context: driver.currentContext,
          elementReferences: [
            ...(elementReferenceToTarget ? [elementReferenceToTarget] : []),
            ...elementReferencesToCalculate,
          ],
        })
        cleanupGeneratedSelectors = generated.cleanupGeneratedSelectors
        if (elementReferenceToTarget) {
          if (!generated.selectors[0]?.safeSelector) throw new Error('Target element not found')
          regionToTarget = generated.selectors[0]?.safeSelector as Selector<never>
          selectorsToCalculate = generated.selectors.slice(1)
        } else {
          selectorsToCalculate = generated.selectors
        }
      }

      const currentContext = driver.currentContext
      snapshots = await takeSnapshots({
        driver,
        settings: {
          ...eyes.test.server,
          waitBeforeCapture: settings.waitBeforeCapture,
          disableBrowserFetching: settings.disableBrowserFetching,
          layoutBreakpoints: settings.layoutBreakpoints,
          renderers: uniqueRenderers,
          skipResources: client.getCachedResourceUrls(),
        },
        hooks: {
          async beforeSnapshots() {
            if (settings.lazyLoad && driver.isWeb) {
              await waitForLazyLoad({
                context: driver.currentContext,
                settings: settings.lazyLoad !== true ? settings.lazyLoad : {},
                logger,
              })
            }
          },
        },
        provides: {
          getChromeEmulationDevices: client.getChromeEmulationDevices,
          getIOSDevices: client.getIOSDevices,
        },
        logger,
      })
      await currentContext.focus()
      snapshotUrl = await driver.getUrl()
      snapshotTitle = await driver.getTitle()

      await cleanupGeneratedSelectors?.()
    } else {
      snapshots = !utils.types.isArray(target) ? Array(uniqueRenderers.length).fill(target) : target
      snapshotUrl = utils.types.has(snapshots[0], 'url') ? snapshots[0].url : undefined
    }
    regionToTarget ??= (elementReferenceToTarget as Selector) ?? (settings.region as Region)
    selectorsToCalculate ??= elementReferencesToCalculate.map(selector => ({
      originalSelector: selector as Selector,
      safeSelector: selector as Selector,
    }))

    const promises = uniqueRenderers.map(async (renderer, index) => {
      if (utils.types.has(renderer, 'name') && renderer.name === 'edge') {
        const message = chalk.yellow(
          `The 'edge' option that is being used in your browsers' configuration will soon be deprecated. Please change it to either 'edgelegacy' for the legacy version or to 'edgechromium' for the new Chromium-based version. Please note, when using the built-in BrowserType enum, then the values are BrowserType.EDGE_LEGACY and BrowserType.EDGE_CHROMIUM, respectively.`,
        )
        logger.console.log(message)
      }

      try {
        if (signal?.aborted) {
          logger.warn('Command "check" was aborted before rendering')
          throw new AbortError('Command "check" was aborted before rendering')
        }

        const {cookies, ...snapshot} = snapshots[index] as (typeof snapshots)[number] & {cookies: Cookie[]}
        const snapshotType = utils.types.has(snapshot, 'cdt') ? 'web' : 'native'
        const renderTargetPromise = client.createRenderTarget({
          snapshot,
          settings: {
            renderer,
            referer: snapshotUrl,
            cookies,
            proxy: eyes.test.server.proxy,
            autProxy: settings.autProxy,
            userAgent,
          },
        })

        const [baseEyes] = await eyes.getBaseEyes({settings: {renderer, type: snapshotType}, logger})

        try {
          if (signal?.aborted) {
            logger.warn('Command "check" was aborted before rendering')
            throw new AbortError('Command "check" was aborted before rendering')
          } else if (!baseEyes.running) {
            logger.warn(`Renderer with id ${baseEyes.test.rendererId} was aborted during one of the previous steps`)
            throw new AbortError(
              `Renderer with id "${baseEyes.test.rendererId}" was aborted during one of the previous steps`,
            )
          }

          const renderTarget = await renderTargetPromise

          if (signal?.aborted) {
            logger.warn('Command "check" was aborted before rendering')
            throw new AbortError('Command "check" was aborted before rendering')
          } else if (!baseEyes.running) {
            logger.warn(`Renderer with id ${baseEyes.test.rendererId} was aborted during one of the previous steps`)
            throw new AbortError(
              `Renderer with id "${baseEyes.test.rendererId}" was aborted during one of the previous steps`,
            )
          }

          const {renderId, selectorRegions, ...baseTarget} = await client.render({
            target: renderTarget,
            settings: {
              ...settings,
              region: regionToTarget,
              selectorsToCalculate: selectorsToCalculate.flatMap(({safeSelector}) => safeSelector ?? []),
              includeFullPageSize: Boolean(settings.pageId),
              type: snapshotType,
              renderer,
              rendererId: baseEyes.test.rendererId!,
            },
            signal,
          })
          let offset = 0
          const baseSettings = getBaseCheckSettings({
            calculatedRegions: selectorsToCalculate.map(({originalSelector, safeSelector}) => ({
              selector: originalSelector ?? undefined,
              regions: safeSelector ? selectorRegions![offset++] : [],
            })),
          })
          baseSettings.renderId = renderId
          baseTarget.source = snapshotUrl
          baseTarget.name = snapshotTitle

          if (signal?.aborted) {
            logger.warn('Command "check" was aborted after rendering')
            throw new AbortError('Command "check" was aborted after rendering')
          } else if (!baseEyes.running) {
            logger.warn(`Renderer with id ${baseEyes.test.rendererId} was aborted during one of the previous steps`)
            throw new AbortError(
              `Renderer with id "${baseEyes.test.rendererId}" was aborted during one of the previous steps`,
            )
          }

          const [result] = await baseEyes.check({
            target: {...baseTarget, isTransformed: true},
            settings: baseSettings,
            logger,
          })

          if (!baseEyes.running) {
            logger.warn(`Renderer with id ${baseEyes.test.rendererId} was aborted during one of the previous steps`)
            throw new AbortError(
              `Renderer with id "${baseEyes.test.rendererId}" was aborted during one of the previous steps`,
            )
          }

          return {...result, eyes: baseEyes, renderer}
        } catch (error: any) {
          await baseEyes.abort({settings: {testMetadata: await driver?.getSessionMetadata()}})
          error.info = {eyes: baseEyes}
          throw error
        }
      } catch (error: any) {
        error.info = {...error.info, userTestId: eyes.test.userTestId, renderer}
        throw error
      }
    })

    return uniqueRenderers.map((renderer, index) => ({
      asExpected: true,
      userTestId: eyes.test.userTestId,
      renderer,
      promise: promises[index],
    }))
  }
}
