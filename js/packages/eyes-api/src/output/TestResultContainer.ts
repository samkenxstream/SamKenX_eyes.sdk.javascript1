import type * as Core from '@applitools/core'
import {TestResults, TestResultsData} from './TestResults'
import {
  AndroidDeviceInfo,
  ChromeEmulationInfo,
  ChromeEmulationInfoLegacy,
  DesktopBrowserInfo,
  IOSDeviceInfo,
} from '../input/RenderInfo'

type RenderInfo =
  | DesktopBrowserInfo
  | ChromeEmulationInfo
  | IOSDeviceInfo
  | AndroidDeviceInfo
  | ChromeEmulationInfoLegacy

export type TestResultContainer = {
  readonly exception?: Error
  readonly testResults?: TestResults
  readonly browserInfo?: RenderInfo
}

export class TestResultContainerData implements Required<TestResultContainer> {
  private _container: Core.TestResultContainer<'classic' | 'ufg'>
  private _deleteTest?: Core.Core<Core.SpecType, 'classic' | 'ufg'>['deleteTest']

  /** @internal */
  constructor(options: {
    container: Core.TestResultContainer<'classic' | 'ufg'>
    deleteTest?: Core.Core<Core.SpecType, 'classic' | 'ufg'>['deleteTest']
  }) {
    this._container = options.container
    this._deleteTest = options.deleteTest
  }

  get testResults(): TestResults {
    return this._container.result!
  }
  getTestResults(): TestResultsData {
    return this.testResults && new TestResultsData({result: this.testResults, deleteTest: this._deleteTest})
  }

  get exception(): Error {
    return this._container.error!
  }
  getException(): Error {
    return this.exception
  }

  get browserInfo(): RenderInfo {
    return this._container.renderer!
  }
  getBrowserInfo(): RenderInfo {
    return this.browserInfo
  }

  /** @internal */
  toObject(): TestResultContainer {
    return {
      testResults: this._container.result,
      exception: this._container.error,
      browserInfo: this._container.renderer,
    }
  }

  /** @internal */
  toJSON(): Core.TestResultContainer<'classic' | 'ufg'> {
    return this._container
  }

  /** @internal */
  toString() {
    return `${this.testResults ? this.testResults : ''} - ${this.exception ? this.exception : ''}`
  }
}
