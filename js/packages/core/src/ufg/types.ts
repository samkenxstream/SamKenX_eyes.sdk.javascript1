import type {MaybeArray} from '@applitools/utils'
import type * as BaseCore from '@applitools/core-base/types'
import type * as AutomationCore from '../automation/types'
import {type SpecType, type Driver} from '@applitools/driver'
import {type Logger} from '@applitools/logger'
import {type Proxy} from '@applitools/req'
import {
  type UFGClient,
  type Renderer,
  type DomSnapshot,
  type AndroidSnapshot,
  type IOSSnapshot,
} from '@applitools/ufg-client'
import {type NMLClient} from '@applitools/nml-client'

export * from '../automation/types'

export type SnapshotTarget = MaybeArray<DomSnapshot> | MaybeArray<AndroidSnapshot> | MaybeArray<IOSSnapshot>
export type Target<TSpec extends SpecType> = SnapshotTarget | AutomationCore.Target<TSpec>

export interface Core<
  TSpec extends SpecType,
  TTarget = AutomationCore.Target<TSpec>,
  TEyes extends Eyes<TSpec, TTarget | SnapshotTarget> = Eyes<TSpec, TTarget | SnapshotTarget>,
> extends AutomationCore.Core<TSpec, TTarget, TEyes> {
  readonly type: 'ufg'
  openEyes(options: {
    target?: AutomationCore.DriverTarget<TSpec>
    settings: OpenSettings
    eyes?: BaseCore.Eyes[]
    logger?: Logger
  }): Promise<TEyes>
}

export interface Eyes<TSpec extends SpecType, TTarget = Target<TSpec>> extends AutomationCore.Eyes<TSpec, TTarget> {
  readonly type: 'ufg'
  getUFGClient(options?: {logger?: Logger}): Promise<UFGClient>
  getNMLClient(options: {driver: Driver<TSpec>; logger?: Logger}): Promise<NMLClient | null>
  getBaseEyes(options?: {
    settings?: {type: 'web' | 'native'; renderer: Renderer}
    logger?: Logger
  }): Promise<BaseCore.Eyes[]>
  check(options?: {target?: TTarget; settings?: CheckSettings<TSpec>; logger?: Logger}): Promise<CheckResult[]>
  checkAndClose(options?: {
    target?: TTarget
    settings?: CheckSettings<TSpec> & AutomationCore.CloseSettings
    logger?: Logger
  }): Promise<TestResult[]>
  getResults(options?: {settings?: AutomationCore.GetResultsSettings; logger?: Logger}): Promise<TestResult[]>
}

export type OpenSettings = AutomationCore.OpenSettings & {
  renderConcurrency?: number
}

export type CheckSettings<TSpec extends SpecType> = AutomationCore.CheckSettings<TSpec> & {
  renderers?: Renderer[]
  hooks?: {beforeCaptureScreenshot: string}
  disableBrowserFetching?: boolean
  layoutBreakpoints?: boolean | number[]
  ufgOptions?: Record<string, any>
  nmgOptions?: Record<string, any>
  autProxy?: Proxy & {mode?: 'Allow' | 'Block'; domains?: string[]}
}

export type CheckResult = AutomationCore.CheckResult & {
  readonly renderer: Renderer
  readonly promise: Promise<Omit<CheckResult, 'promise'> & {eyes: BaseCore.Eyes}>
}

export type TestResult = AutomationCore.TestResult & {
  readonly renderer: Renderer
} & {eyes: BaseCore.Eyes}
