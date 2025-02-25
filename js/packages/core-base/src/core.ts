import type {Core} from './types'
import {makeLogger, type Logger} from '@applitools/logger'
import {makeCoreRequests} from './server/requests'
import {makeOpenEyes} from './open-eyes'
import {makeLocate} from './locate'
import {makeLocateText} from './locate-text'
import {makeExtractText} from './extract-text'
import {makeCloseBatch} from './close-batch'
import {makeDeleteTest} from './delete-test'

type Options = {
  agentId?: string
  cwd?: string
  logger?: Logger
}

export function makeCore({agentId = 'core-base', cwd = process.cwd(), logger: defaultLogger}: Options): Core {
  const logger = defaultLogger?.extend({label: 'core-base'}) ?? makeLogger({label: 'core-base'})
  logger.log(`Core is initialized in directory ${cwd} for agent ${agentId}`)
  const coreRequests = makeCoreRequests({agentId, logger})

  return {
    openEyes: makeOpenEyes({requests: coreRequests, logger, cwd}),
    locate: makeLocate({requests: coreRequests, logger}),
    locateText: makeLocateText({requests: coreRequests, logger}),
    extractText: makeExtractText({requests: coreRequests, logger}),
    closeBatch: makeCloseBatch({requests: coreRequests, logger}),
    deleteTest: makeDeleteTest({requests: coreRequests, logger}),
    getAccountInfo: coreRequests.getAccountInfo,
    logEvent: coreRequests.logEvent,
  }
}
