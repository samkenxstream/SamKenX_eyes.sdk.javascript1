// @ts-nocheck

declare namespace Applitools {
  namespace WebdriverIO {
    interface Browser extends globalThis.WebdriverIO.BrowserObject {
      isDevTools: boolean
      getSession(): Record<string, any>
      getPuppeteer(): any
      getUrl(): string
      getTitle(): string
      getOrientation(): string
      getSystemBars(): object[]
      getContext(): string
      getElementAttribute(elementId: string, attr: string): string
      getWindowRect(): {x: number; y: number; width: number; height: number}
      getWindowPosition(): {x: number; y: number}
      setWindowRect(x: number, y: number, width: number, height: number): void
      setWindowPosition(x: number, y: number): void
      switchToFrame(frameId?: any): void
      switchToParentFrame(): void
      takeScreenshot(): string
      sendCommandAndGetResult(command: string, params: Record<string, any>): Record<string, any>
    }
    interface Element extends globalThis.WebdriverIO.Element {}
    type Selector = string | ((element: HTMLElement) => HTMLElement) | ((element: HTMLElement) => HTMLElement[])
  }
}