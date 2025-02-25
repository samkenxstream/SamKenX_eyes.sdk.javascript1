import type {MaybeArray} from '@applitools/utils'
import type * as AutomationCore from './automation/types'
import type * as ClassicCore from './classic/types'
import type * as UFGCore from './ufg/types'
import {type SpecType} from '@applitools/driver'
import {type Logger} from '@applitools/logger'
import {type Renderer} from '@applitools/ufg-client'
import {type ECClient, type ECClientSettings} from '@applitools/ec-client'

export {ECClient}
export * from './automation/types'

export type TypedCore<TSpec extends SpecType, TType extends 'classic' | 'ufg'> = TType extends 'ufg'
  ? UFGCore.Core<TSpec>
  : ClassicCore.Core<TSpec>

export type TypedEyes<TSpec extends SpecType, TType extends 'classic' | 'ufg'> = TType extends 'ufg'
  ? UFGCore.Eyes<TSpec>
  : ClassicCore.Eyes<TSpec>

export type Target<TSpec extends SpecType, TType extends 'classic' | 'ufg'> = TType extends 'ufg'
  ? UFGCore.Target<TSpec>
  : ClassicCore.Target<TSpec>

export interface Core<TSpec extends SpecType, TDefaultType extends 'classic' | 'ufg' = 'classic' | 'ufg'>
  extends AutomationCore.Core<TSpec> {
  getECClient(options?: {settings?: Partial<ECClientSettings>; logger?: Logger}): Promise<ECClient>
  makeManager<TType extends 'classic' | 'ufg' = TDefaultType>(options?: {
    type: TType
    concurrency?: TType extends 'ufg' ? number : never
    agentId?: string
    logger?: Logger
  }): Promise<EyesManager<TSpec, TType>>
  openEyes<TType extends 'classic' | 'ufg' = TDefaultType>(options: {
    type?: TType
    target?: AutomationCore.DriverTarget<TSpec>
    settings?: Partial<OpenSettings<TType>>
    config?: Config<TSpec, TType>
    logger?: Logger
  }): Promise<Eyes<TSpec, TType>>
  locate<TLocator extends string>(options: {
    target?: AutomationCore.Target<TSpec>
    settings?: Partial<AutomationCore.LocateSettings<TLocator, TSpec>>
    config?: Config<TSpec, TDefaultType>
    logger?: Logger
  }): Promise<AutomationCore.LocateResult<TLocator>>
  locateText<TPattern extends string>(options: {
    target?: AutomationCore.Target<TSpec>
    settings: Partial<AutomationCore.LocateTextSettings<TPattern, TSpec>>
    config?: Config<TSpec, TDefaultType>
    logger?: Logger
  }): Promise<AutomationCore.LocateTextResult<TPattern>>
  extractText(options: {
    target?: AutomationCore.Target<TSpec>
    settings: MaybeArray<Partial<AutomationCore.ExtractTextSettings<TSpec>>>
    config?: Config<TSpec, TDefaultType>
    logger?: Logger
  }): Promise<string[]>
}

export interface EyesManager<TSpec extends SpecType, TDefaultType extends 'classic' | 'ufg' = 'classic' | 'ufg'> {
  openEyes<TType extends 'classic' | 'ufg' = TDefaultType>(options: {
    type?: TType
    target?: AutomationCore.DriverTarget<TSpec>
    settings?: Partial<OpenSettings<TType>>
    config?: Config<TSpec, TType>
    logger?: Logger
  }): Promise<Eyes<TSpec, TType>>
  getResults: (options?: {
    settings?: GetResultsSettings<TDefaultType>
    logger?: Logger
  }) => Promise<TestResultSummary<'classic' | 'ufg'>>
}

export interface Eyes<TSpec extends SpecType, TDefaultType extends 'classic' | 'ufg' = 'classic' | 'ufg'>
  extends AutomationCore.Eyes<TSpec> {
  readonly core: Core<TSpec, TDefaultType>
  getTypedEyes<TType extends 'classic' | 'ufg' = TDefaultType>(options?: {
    type?: TType
    settings?: any
    logger?: Logger
  }): Promise<TypedEyes<TSpec, TType>>
  check<TType extends 'classic' | 'ufg' = TDefaultType>(options?: {
    type?: TType
    target?: Target<TSpec, TType>
    settings?: Partial<CheckSettings<TSpec, TDefaultType> & CheckSettings<TSpec, TType>>
    config?: Config<TSpec, TDefaultType> & Config<TSpec, TType>
    logger?: Logger
  }): Promise<CheckResult<TType>[]>
  checkAndClose<TType extends 'classic' | 'ufg' = TDefaultType>(options?: {
    type?: TType
    target?: Target<TSpec, TType>
    settings?: Partial<
      CheckSettings<TSpec, TDefaultType> &
        CloseSettings<TDefaultType> &
        CheckSettings<TSpec, TType> &
        CloseSettings<TType>
    >
    config?: Config<TSpec, TDefaultType> & Config<TSpec, TType>
    logger?: Logger
  }): Promise<TestResult<TType>[]>
  close(options?: {
    settings?: Partial<CloseSettings<TDefaultType>>
    config?: Config<TSpec, TDefaultType>
    logger?: Logger
  }): Promise<void>
  abort(options?: {
    settings?: Partial<AbortSettings<TDefaultType>>
    config?: Config<TSpec, TDefaultType>
    logger?: Logger
  }): Promise<void>
  getResults(options?: {
    settings?: Partial<GetResultsSettings<TDefaultType>>
    config?: Config<TSpec, TDefaultType>
    logger?: Logger
  }): Promise<TestResult<TDefaultType>[]>
}

export type Config<TSpec extends SpecType, TType extends 'classic' | 'ufg'> = {
  open: Partial<Omit<OpenSettings<TType>, 'userCommandId'>>
  screenshot: Partial<Omit<ClassicCore.ScreenshotSettings<TSpec>, 'userCommandId'>>
  check: Partial<Omit<CheckSettings<TSpec, TType>, keyof ClassicCore.ScreenshotSettings<TSpec> | 'userCommandId'>>
  close: Partial<Omit<CloseSettings<TType>, 'userCommandId'>>
}

export type OpenSettings<TType extends 'classic' | 'ufg'> = TType extends 'ufg'
  ? UFGCore.OpenSettings
  : ClassicCore.OpenSettings

export type CheckSettings<TSpec extends SpecType, TType extends 'classic' | 'ufg'> = TType extends 'ufg'
  ? UFGCore.CheckSettings<TSpec>
  : ClassicCore.CheckSettings<TSpec>

export type CloseSettings<TType extends 'classic' | 'ufg'> = TType extends 'ufg'
  ? UFGCore.CloseSettings
  : ClassicCore.CloseSettings

export type AbortSettings<TType extends 'classic' | 'ufg'> = TType extends 'ufg'
  ? UFGCore.AbortSettings
  : ClassicCore.AbortSettings

export type GetResultsSettings<TType extends 'classic' | 'ufg'> = (TType extends 'ufg'
  ? UFGCore.GetResultsSettings
  : ClassicCore.GetResultsSettings) & {throwErr?: boolean}

export type CheckResult<TType extends 'classic' | 'ufg'> = TType extends 'ufg'
  ? UFGCore.CheckResult
  : ClassicCore.CheckResult

export type TestResult<TType extends 'classic' | 'ufg'> = TType extends 'ufg'
  ? UFGCore.TestResult
  : ClassicCore.TestResult

export interface TestResultContainer<TType extends 'classic' | 'ufg'> {
  readonly error?: Error
  readonly result?: TestResult<TType>
  readonly renderer?: TType extends 'ufg' ? Renderer : never
  readonly userTestId?: string
}

export interface TestResultSummary<TType extends 'classic' | 'ufg'> {
  readonly results: TestResultContainer<TType>[]
  readonly passed: number
  readonly unresolved: number
  readonly failed: number
  readonly exceptions: number
  readonly mismatches: number
  readonly missing: number
  readonly matches: number
}
