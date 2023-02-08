import type * as BaseCore from '@applitools/core-base/types'
import type * as AutomationCore from '../automation/types'
import {type SpecType} from '@applitools/driver'
import {type Logger} from '@applitools/logger'

export * from '../automation/types'

export interface Core<
  TSpec extends SpecType,
  TTarget = AutomationCore.Target<TSpec>,
  TEyes extends Eyes<TSpec, TTarget> = Eyes<TSpec, TTarget>,
> extends AutomationCore.Core<TSpec, TTarget, TEyes> {
  readonly type: 'classic'
  openEyes(options: {
    target?: AutomationCore.DriverTarget<TSpec>
    settings: OpenSettings
    eyes?: BaseCore.Eyes[]
    logger?: Logger
  }): Promise<TEyes>
}

export interface Eyes<TSpec extends SpecType, TTarget = AutomationCore.Target<TSpec>>
  extends AutomationCore.Eyes<TSpec, TTarget> {
  readonly type: 'classic'
  check(options?: {
    target?: TTarget
    settings?: CheckSettings<TSpec>
    logger?: Logger
  }): Promise<AutomationCore.CheckResult[]>
  checkAndClose(options?: {
    target?: TTarget
    settings?: CheckSettings<TSpec> & AutomationCore.CloseSettings
    logger?: Logger
  }): Promise<AutomationCore.TestResult[]>
}

export type OpenSettings = AutomationCore.OpenSettings & {
  keepPlatformNameAsIs?: boolean
  useCeilForViewportSize?: boolean
}

export type CheckSettings<TSpec extends SpecType> = AutomationCore.CheckSettings<TSpec> & {
  retryTimeout?: number
}
