# Change Log

## Unreleased









## 1.20.3 - 2022/7/28

### Features
- Added new android devices
### Bug fixes
- Fixed bug where a failure in a single UFG environment fails all other environments in the same configuration
- Fixed various issues during taking screenshots in landscape orientation on some native devices
- Avoided unexpected touch actions during `check` on Android apps
- Better support in DOM slot element
- Fixed some issues with helper library usage

## 1.20.2 - 2022/7/5

### Features
- Added support for taking full screenshots of elements that are scroll by pages only
- Allowed `` values in custom properties
- Add special attribute for pseudo elements
- Add the ability for the SDK to lazy load the page prior to performing a check window
- Support padding for regions in the following region types - ignoreRegions, layoutRegions, strictRegions, contentRegions
- Support `addMobileDevice` in user API for NMG
- Add support for dynamic coded regions
### Bug fixes
- Fixed the "Maximum Call Stack Size Exceeded" error when taking screenshots on iOS Safari
- Fixed an issue with wrong cropped screenshots of elements out of viewport bounds on native devices
- Fixed broken links to enums implementation in the README.md
- Fixed `forceFullPageScreenshot` option behavior
- Fix calling `waitBeforeCapture` when failed to set required viewport size
- Fix rendering issues with Salesforce Lightning design system
- Fix issue that prevented self-signed certificates from working when connecting through a proxy server
- Fixed native screenshots of the elements under large collapsing areas
- Fixed scrolling on some android devices
- Improved handling of touch padding related issues in native apps
- Prevented navbar from appearing on Android 12 screenshots

## 1.20.1 - 2022/6/2

### Features
### Bug fixes
- Fix rounding error of image size when scaling introduces fractions

## 1.20.0 - 2022/6/1

### Features
- Support UFG for native mobile
- `runner.getAllTestResults` returns the corresponding UFG browser/device configuration for each test. This is available as `runner.getAllTestResults()[i].browserInfo`.
- Support iPhone SE `IosDeviceName.iPhone_SE` and iPhone 8 Plus `IosDeviceName.iPhone_8_Plus` iOS devices
- Support Galaxy S22 `DeviceName.Galaxy_S22` emulation device
- Added support for drivers that return screenshots in jpeg format
- Dorp support for Node.js versions <=12
### Bug fixes
- `runner.getAllTestResults` now aborts unclosed tests
- `runner.getAllTestResults` now returns all results, including aborted tests
- `extractText` now supports regions that don't use hints while using `x`/`y` coordinates
- accept ios and android lowercase as driver platformName capability when using custom grid
- Fixed check region fully in classic execution when using CSS stitching
- Support data urls in iframes
- Fixed handling of navigation bar size on various devices
- Allow running with self-signed certificates
- Fixed bug in native apps when screenshot of the element was taken only for the small visible part of the element
- Fixed bug when navigation bar was presented in screenshot on Android 12
- Fixed `CheckSetting`'s `fully` being overridden by `Configuration`'s `forceFullPageScreenshot`
- Set EyesExceptions (such as new test, diffs exception and failed test exception) to exception property in TestResultsSummary
- Improve error message when failed to set viewport size
- Fixed incorrect calculation of coded regions in classic mode when using CSS stitching

## 1.19.2 - 2021/12/23

- updated to @applitools/eyes-sdk-core@12.24.9 (from 12.24.6)
- updated to @applitools/types@1.0.23 (from 1.0.22)
- updated to @applitools/utils@1.2.5 (from 1.2.4)
- updated to @applitools/visual-grid-client@15.8.55 (from 15.8.52)

## 1.19.1 - 2021/12/16

- implement `getCapabilities` instead of `getDriverInfo`
- updated to @applitools/eyes-sdk-core@12.24.5 (from 12.24.0)
- updated to @applitools/types@1.0.21 (from 1.0.19)
- updated to @applitools/visual-grid-client@15.8.49 (from 15.8.44)
- updated to @applitools/eyes-sdk-core@12.24.6 (from 12.24.5)
- updated to @applitools/types@1.0.22 (from 1.0.21)
- updated to @applitools/visual-grid-client@15.8.52 (from 15.8.49)

## 1.19.0 - 2021/11/10

- support cookies
- updated to @applitools/eyes-api@1.1.6 (from 1.1.5)
- updated to @applitools/eyes-sdk-core@12.24.0 (from 12.23.24)
- updated to @applitools/types@1.0.19 (from 1.0.18)
- updated to @applitools/visual-grid-client@15.8.44 (from 15.8.43)
- updated to @applitools/visual-grid-client@15.8.44 (from 15.8.43)
## 1.18.0 - 2021/11/6

- updated to @applitools/eyes-api@1.1.5 (from 1.1.3)
- updated to @applitools/eyes-sdk-core@12.23.24 (from 12.23.14)
- updated to @applitools/utils@1.2.4 (from 1.2.3)
- updated to @applitools/visual-grid-client@15.8.43 (from 15.8.33)

## 1.17.3 - 2021/10/7

- updated to @applitools/eyes-api@1.1.3 (from 1.1.1)
- updated to @applitools/eyes-sdk-core@12.23.14 (from 12.23.5)
- updated to @applitools/visual-grid-client@15.8.33 (from 15.8.25)

## 1.17.2 - 2021/9/10

- updated to @applitools/eyes-api@1.1.1 (from 1.1.0)
- updated to @applitools/eyes-sdk-core@12.23.5 (from 12.23.3)
- updated to @applitools/utils@1.2.3 (from 1.2.2)
- updated to @applitools/visual-grid-client@15.8.25 (from 15.8.20)

## 1.17.1 - 2021/8/13

- updated to @applitools/eyes-api@1.0.12 (from 1.0.11)
- updated to @applitools/eyes-sdk-core@12.22.6 (from 12.22.4)
- updated to @applitools/visual-grid-client@15.8.20 (from 15.8.18)

## 1.17.0 - 2021/8/10

- updated to @applitools/eyes-api@1.0.11 (from 1.0.7)
- updated to @applitools/eyes-sdk-core@12.22.4 (from 12.21.5)
- updated to @applitools/utils@1.2.2 (from 1.2.0)
- updated to @applitools/visual-grid-client@15.8.18 (from 15.8.13)

## 1.16.3 - 2021/7/14

- updated to @applitools/eyes-api@1.0.7 (from 1.0.3)
- updated to @applitools/eyes-sdk-core@12.21.5 (from 12.20.0)
- updated to @applitools/visual-grid-client@15.8.13 (from 15.8.7)

## 1.16.2 - 2021/5/25

- added full typescript support
- introduced @applitools/eyes-api package with new api
- updated to @applitools/eyes-api@1.0.3 (from 1.0.1)
- updated to @applitools/eyes-sdk-core@12.20.0 (from 12.19.2)
- updated to @applitools/utils@1.2.0 (from 1.1.3)
- updated to @applitools/visual-grid-client@15.8.7 (from 15.8.5)

## 1.16.1 - 2021/5/12

- updated to @applitools/eyes-api@1.0.1 (from 1.0.0)
- updated to @applitools/eyes-sdk-core@12.19.2 (from 12.19.1)
- updated to @applitools/visual-grid-client@15.8.5 (from 15.8.4)

## 1.16.0 - 2021/5/11

- added full typescript support
- introduced @applitools/eyes-api package with new api
- updated to @applitools/visual-grid-client@15.8.2 (from 15.7.1)
- updated to @applitools/eyes-api@1.0.0 (from 0.1.0)
- updated to @applitools/eyes-sdk-core@12.19.1 (from 12.18.1)
- updated to @applitools/visual-grid-client@15.8.4 (from 15.8.2)

## 1.15.0 - 2021/4/27

- updated to @applitools/eyes-sdk-core@12.17.4 (from 12.16.2)
- updated to @applitools/visual-grid-client@15.8.2 (from 15.6.3)

## 1.13.3 - 2021/3/17

- updated to @applitools/eyes-sdk-core@12.16.2 (from 12.14.2)
- updated to @applitools/visual-grid-client@15.6.3 (from 15.5.14)

## 1.13.2 - 2021/1/29

- chore: add husky
- updated to @applitools/eyes-sdk-core@12.14.2 (from 12.12.2)
- updated to @applitools/visual-grid-client@15.5.14 (from 15.5.5)

## 1.13.1 - 2021/1/12

- updated to @applitools/eyes-sdk-core@12.12.2 (from 12.10.0)
- updated to @applitools/visual-grid-client@15.5.5 (from 15.4.0)

## 1.13.0 - 2020/12/18

- updated to @applitools/eyes-sdk-core@12.10.0 (from 12.9.3)
- updated to @applitools/visual-grid-client@15.4.0 (from 15.3.2)

## 1.12.2 - 2020/12/15

- updated to @applitools/eyes-sdk-core@12.9.3 (from 12.9.2)
- updated to @applitools/visual-grid-client@15.3.2 (from 15.3.1)

## 1.12.1 - 2020/12/14

- updated to @applitools/eyes-sdk-core@12.9.2 (from 12.9.1)
- updated to @applitools/visual-grid-client@15.3.1 (from 15.3.0)

## 1.12.0 - 2020/12/11

- updated to @applitools/eyes-sdk-core@12.9.1 (from 12.5.7)
- updated to @applitools/visual-grid-client@15.3.0 (from 15.2.1)

## 1.11.2 - 2020/12/1

- export `RunnerOptions`

## 1.11.1 - 2020/11/29

- updated to @applitools/visual-grid-client@15.2.1 (from 15.2.0)

## 1.11.0 - 2020/11/25

- updated to @applitools/visual-grid-client@15.2.0 (from 15.1.1)

## 1.10.0 - 2020/11/13

- deprecate `saveDebugData`
- updated to @applitools/eyes-sdk-core@12.4.4 (from 12.4.2)
- updated to @applitools/visual-grid-client@15.0.12 (from 15.0.10)
- updated to @applitools/eyes-sdk-core@12.5.7 (from 12.4.4)
- updated to @applitools/visual-grid-client@15.1.1 (from 15.0.12)

## 1.9.1 - 2020/10/15

- add iosVersion to readme
- updated to @applitools/eyes-sdk-core@12.4.2 (from 12.3.0)
- updated to @applitools/visual-grid-client@15.0.10 (from 15.0.9)

## 1.9.0 - 2020/10/6

- updated to @applitools/eyes-sdk-core@12.2.5 (from 12.2.4)
- updated to @applitools/visual-grid-client@15.0.5 (from 15.0.4)
- updated to @applitools/eyes-sdk-core@12.2.6 (from 12.2.5)
- updated to @applitools/visual-grid-client@15.0.6 (from 15.0.5)
- updated to @applitools/eyes-sdk-core@12.3.0 (from 12.2.6)
- updated to @applitools/visual-grid-client@15.0.9 (from 15.0.6)

## 1.8.1 - 2020/9/15

- updated to @applitools/eyes-sdk-core@12.2.4 (from 12.2.3)
- updated to @applitools/visual-grid-client@15.0.4 (from 15.0.3)

## 1.8.0 - 2020/9/3

- updated to @applitools/eyes-sdk-core@12.2.3 (from 12.2.0)
- updated to @applitools/visual-grid-client@15.0.3 (from 15.0.0)

## 1.7.0 - 2020/8/30

- added spec for extracting device name ([Trello](https://trello.com/c/qyf1baqT/464-wdio5-mobile-web-device-name-not-reported-on-dashboard))
- updated to @applitools/eyes-sdk-core@12.2.0 (from 12.1.2)
- updated to @applitools/visual-grid-client@15.0.0 (from 14.7.3)

## 1.6.0 - 2020/8/10

- updated to @applitools/eyes-sdk-core@12.1.1 (from 11.5.0)
- updated to @applitools/visual-grid-client@14.7.2 (from 14.6.0)
- updated to @applitools/eyes-sdk-core@12.1.2 (from 12.1.1)
- updated to @applitools/visual-grid-client@14.7.3 (from 14.7.2)

## 1.5.1 - 2020/7/26

- updated to @applitools/eyes-sdk-core@11.5.0 (from 11.4.1)
- updated to @applitools/visual-grid-client@14.6.0 (from 14.5.15)

## 1.5.0 - 2020/7/24

- remove type definitions
- updated to @applitools/eyes-sdk-core@11.4.1 (from 11.3.4)
- updated to @applitools/visual-grid-client@14.5.15 (from 14.5.7)

## 1.4.0 - 2020/7/8

- updated to @applitools/eyes-sdk-core@11.3.4 (from 11.2.2)
- updated to @applitools/visual-grid-client@14.5.7 (from 14.5.2)

## 1.3.0 - 2020/7/5

- updated to @applitools/eyes-sdk-core@11.2.2 (from 11.1.0)
- updated to @applitools/visual-grid-client@14.5.2 (from 14.5.0)

## 1.2.0 - 2020/6/29

- remove IosScreenOrientation ([Trello](https://trello.com/c/abSJ68Rl/409-ufg-safari-on-ios-orientations-changes))
- updated to @applitools/eyes-sdk-core@11.1.0 (from 11.0.10)
- updated to @applitools/visual-grid-client@14.5.0 (from 14.4.9)

## 1.1.1 - 2020/6/17

- updated to @applitools/eyes-sdk-core@11.0.10 (from 11.0.5)
- updated to @applitools/visual-grid-client@14.4.9 (from 14.4.4)

## 1.1.0 - 2020/6/9

- support nested node_modules project structure ([Trello](https://trello.com/c/I1mh1VwH))
- updated to @applitools/eyes-sdk-core@11.0.5 (from 11.0.4)
- updated to @applitools/visual-grid-client@14.4.4 (from 14.4.3)

## 1.0.2 - 2020/6/4

- add readme

## 1.0.1 - 2020/6/4

- updated to @applitools/eyes-sdk-core@11.0.4 (from v11.0.0)
- updated to @applitools/visual-grid-client@14.4.3 (from v14.3.1)
