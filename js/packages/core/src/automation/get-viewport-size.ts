import type {DriverTarget} from './types'
import {type Logger} from '@applitools/logger'
import {makeDriver, type SpecType, type SpecDriver} from '@applitools/driver'

type Options<TSpec extends SpecType> = {
  spec: SpecDriver<TSpec>
  logger: Logger
}

export function makeGetViewportSize<TSpec extends SpecType>({spec, logger: defaultLogger}: Options<TSpec>) {
  return async function getViewportSize({
    target,
    logger = defaultLogger,
  }: {
    target: DriverTarget<TSpec>
    logger?: Logger
  }) {
    logger.log(`Command "getViewportSize" is called`)
    const driver = await makeDriver({driver: target, spec, logger})
    return driver.getViewportSize()
  }
}
