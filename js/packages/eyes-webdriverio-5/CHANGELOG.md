# Change Log

## Unreleased









## 5.42.2 - 2023/3/7

### Features
- Added `Resize` value to `StitchMode` enum
### Bug fixes

## 5.42.1 - 2023/3/7

### Features
- Added support for scroll root elements in ufg (only for native apps)
### Bug fixes

## 5.42.0 - 2023/2/17

### Features
- Crop screenshot image base on account info
### Bug fixes

## 5.41.1 - 2023/2/6

### Features
### Bug fixes
- Fix instability when getting information to connect to the NML

## 5.41.0 - 2023/2/1

### Features
- Add NML support for Android
### Bug fixes

## 5.40.2 - 2023/1/27

### Features
- Added new android devices Sony Xperia 1 II, Sony Xperia Ace II, Huawei P30 Lite, Xiaomi Redmi Note 10 JE
### Bug fixes
- Fixed issue with sessionId on ufg

## 5.40.1 - 2023/1/23

### Features
### Bug fixes
- Fixed dependency issue on windows

## 5.40.0 - 2023/1/18

### Features
- No new features
### Bug fixes

## 5.39.1 - 2023/1/5

### Features
- Upgrade to wdio@8
### Bug fixes
- Additional internal event logs

## 5.39.0 - 2022/12/21

### Features
- Added `nmgOptions` to `CheckSettings`
### Bug fixes
- Handle fake shadowRoot with UFG
- Handed error during polling in long requests to eyes server

## 5.38.2 - 2022/12/1

### Features
### Bug fixes
- Fixed issue with element scroll position not being restored after screenshot is taken on native platforms

## 5.38.1 - 2022/11/29

### Features
- Added `ignoreColors` method to `CheckSettings` to set a match level
### Bug fixes

## 5.38.0 - 2022/11/17

### Features
- Added new selector extensions `child` and `fallback`
- Added new iOS device - 'iPad Pro (11-inch) (4th generation)'
- Mark target element with `data-applitools-scroll` attribute before capture dom
- Use user agent metadata to improve browser environment detection logic
- Use APPLITOOLS_CONCURRENCY env variable to specify concurrency
### Bug fixes
- Fixed bug that caused `extractText` to throw, due to fractional size of the target region
- Fixed issue when current context is not being preserved in ufg mode

## 5.37.0 - 2022/10/18

### Features
- Drop support for Android 9 and Android 10 specific devices
### Bug fixes
- Fixed error that was happening when test results were deleted

## 5.36.3 - 2022/10/13

### Features
- Changed default value of `sendDom` from `true` to dynamically calculated
- Added new android device `Sony Xperia 10 II`
### Bug fixes
- Fixed issue with ufg renders failing intermittently

## 5.36.2 - 2022/10/8

### Features
- Applied client's user-agent by default to resource requests in ufg mode
### Bug fixes
- Fixed bug when error was thrown when coded region wasn't found using selector
- Fixed wrong signature of `closeBatch` function
- Blank missed frames src in ufg
- Fix an issue when ufg related requests were not sent through the proxy
- Fixed issue with logs not being saved/written

## 5.36.1 - 2022/10/4

### Features
### Bug fixes
- Fixed the issue with screenshots being taken on chrome-emulated devices
- Fixed issue that prevented Target.webview() from being called

## 5.36.0 - 2022/9/29

### Features
- Don't fail `eyes.open` when there is a failure to set viewport size in `UFG`.
- Added support for lazy loading views in android native apps
- Using `lazyLoad.waitingTime` as a delay between stitches by default
- Added `Sony Xperia 10 II` emulation device
- Added `iPhone 14`  and `iPhone 14 Pro Max` ios devices
- Deprecated "Content" match level value in favor of "IgnoreColors"
- Added support for webview switching in classic execution
### Bug fixes
- Fixed incorrect calculation of the target element position.

## 5.35.8 - 2022/7/28

### Features
- Added new android devices
### Bug fixes
- Fixed various issues during taking screenshots in landscape orientation on some native devices
- Avoided unexpected touch actions during `check` on Android apps
- Better support in DOM slot element
- Fixed some issues with helper library usage

## 5.35.7 - 2022/7/4

### Features
### Bug fixes
- Implicitly convert tag to css selector due to removal of tag support from chromedriver

## 5.35.6 - 2022/6/27

### Features
- Add support for dynamic coded regions
### Bug fixes
- Improve the logic that detects the side of native Android navigation bar

## 5.35.5 - 2022/6/22

### Features
- Support `addMobileDevice` in user API for NMG
### Bug fixes
- Improved handling of touch padding related issues in native apps
- Prevented navbar from appearing on Android 12 screenshots

## 5.35.4 - 2022/6/17

### Features
### Bug fixes
- Fixed scrolling on some android devices

## 5.35.3 - 2022/6/14

### Features
- Add special attribute for pseudo elements
- Add the ability for the SDK to lazy load the page prior to performing a check window
### Bug fixes
- Fix calling `waitBeforeCapture` when failed to set required viewport size
- Fix rendering issues with Salesforce Lightning design system
- Fix issue that prevented self-signed certificates from working when connecting through a proxy server
- Fixed native screenshots of the elements under large collapsing areas

## 5.35.2 - 2022/6/8

### Features
- Added support for taking full screenshots of elements that are scroll by pages only
- Allowed `` values in custom properties
### Bug fixes
- Fixed the "Maximum Call Stack Size Exceeded" error when taking screenshots on iOS Safari
- Fixed an issue with wrong cropped screenshots of elements out of viewport bounds on native devices
- Fixed broken links to enums implementation in the README.md
- Fixed `forceFullPageScreenshot` option behavior

## 5.35.1 - 2022/6/2

### Features
### Bug fixes
- Fix rounding error of image size when scaling introduces fractions

## 5.35.0 - 2022/6/1

### Features
- Dorp support for Node.js versions <=12
### Bug fixes
- Fixed incorrect calculation of coded regions in classic mode when using CSS stitching

## 5.34.16 - 2022/5/27

### Features
- Added support for drivers that return screenshots in jpeg format
### Bug fixes
- Improve error message when failed to set viewport size

## 5.34.15 - 2022/5/23

### Features
- Support iPhone SE `IosDeviceName.iPhone_SE` and iPhone 8 Plus `IosDeviceName.iPhone_8_Plus` iOS devices
- Support Galaxy S22 `DeviceName.Galaxy_S22` emulation device
### Bug fixes
- Fixed handling of navigation bar size on various devices
- Allow running with self-signed certificates
- Fixed bug in native apps when screenshot of the element was taken only for the small visible part of the element
- Fixed bug when navigation bar was presented in screenshot on Android 12

## 5.34.14 - 2022/5/5

### Features
- Support UFG for native mobile
### Bug fixes
- `extractText` now supports regions that don't use hints while using `x`/`y` coordinates
- accept ios and android lowercase as driver platformName capability when using custom grid
- Fixed check region fully in classic execution when using CSS stitching
- Support data urls in iframes
- Account for an Appium bug when calculating system bars height

## 5.34.13 - 2022/3/25

### Features
- `runner.getAllTestResults` returns the corresponding UFG browser/device configuration for each test. This is available as `runner.getAllTestResults()[i].browserInfo`.
### Bug fixes
- `runner.getAllTestResults` now aborts unclosed tests
- `runner.getAllTestResults` now returns all results, including aborted tests

## 5.34.12 - 2022/2/16

- fix image scaling on pages without viewport metatag
- fix safari's viewport detection on iOS devices
- updated to @applitools/eyes-api@1.1.8 (from 1.1.7)
- updated to @applitools/eyes-sdk-core@13.0.4 (from 13.0.2)
- updated to @applitools/visual-grid-client@15.8.65 (from 15.8.63)

## 5.34.11 - 2022/2/10

- allow setting ‘setImageCut’ also after eyes.open (change done in eyes-sdk-core)
- updated to @applitools/eyes-sdk-core@13.0.2 (from 13.0.0)
- updated to @applitools/spec-driver-webdriverio@1.2.7 (from 1.2.6)
- updated to @applitools/visual-grid-client@15.8.63 (from 15.8.62)

## 5.34.10 - 2022/1/24

- Fixed BatchInfo.addProperty bug
- updated to @applitools/eyes-api@1.1.7 (from 1.1.6)
- updated to @applitools/eyes-sdk-core@13.0.0 (from 12.24.13)
- updated to @applitools/visual-grid-client@15.8.62 (from 15.8.60)

## 5.34.9 - 2022/1/12

- updated to @applitools/eyes-sdk-core@12.24.13 (from 12.24.12)
- updated to @applitools/visual-grid-client@15.8.60 (from 15.8.59)

## 5.34.8 - 2022/1/11

- updated to @applitools/eyes-sdk-core@12.24.12 (from 12.24.9)
- updated to @applitools/visual-grid-client@15.8.59 (from 15.8.55)

## 5.34.7 - 2022/1/5

- updated to @applitools/spec-driver-webdriverio@1.2.6 (from 1.2.5)

## 5.34.6 - 2021/12/23

- updated to @applitools/eyes-sdk-core@12.24.9 (from 12.24.7)
- updated to @applitools/visual-grid-client@15.8.55 (from 15.8.53)

## 5.34.5 - 2021/12/20

- updated to @applitools/eyes-sdk-core@12.24.7 (from 12.24.6)
- updated to @applitools/spec-driver-webdriverio@1.2.3 (from 1.2.2)
- updated to @applitools/visual-grid-client@15.8.53 (from 15.8.52)
- updated to @applitools/spec-driver-webdriverio@1.2.5 (from 1.2.3)

## 5.34.4 - 2021/12/17

- updated to @applitools/eyes-sdk-core@12.24.6 (from 12.24.5)
- updated to @applitools/visual-grid-client@15.8.52 (from 15.8.49)

## 5.34.3 - 2021/12/7

- updated to @applitools/eyes-sdk-core@12.24.5 (from 12.24.2)
- updated to @applitools/visual-grid-client@15.8.49 (from 15.8.47)
- updated to @applitools/spec-driver-webdriverio@1.2.2 (from 1.2.1)

## 5.34.2 - 2021/11/18

- updated to @applitools/eyes-sdk-core@12.24.2 (from 12.24.1)
- updated to @applitools/spec-driver-webdriverio@1.2.1 (from 1.2.0)
- updated to @applitools/visual-grid-client@15.8.47 (from 15.8.45)

## 5.34.1 - 2021/11/14

- updated to @applitools/eyes-sdk-core@12.24.1 (from 12.24.0)
- updated to @applitools/spec-driver-webdriverio@1.2.0 (from 1.1.0)
- updated to @applitools/visual-grid-client@15.8.45 (from 15.8.44)

## 5.34.0 - 2021/11/10

- support cookies
- updated to @applitools/eyes-api@1.1.6 (from 1.1.4)
- updated to @applitools/eyes-sdk-core@12.24.0 (from 12.23.16)
- updated to @applitools/visual-grid-client@15.8.44 (from 15.8.35)

## 5.33.0 - 2021/11/5

- updated to @applitools/eyes-api@1.1.5 (from 1.1.4)
- updated to @applitools/eyes-sdk-core@12.23.24 (from 12.23.18)
- updated to @applitools/utils@1.2.4 (from 1.2.3)
- updated to @applitools/visual-grid-client@15.8.43 (from 15.8.37)

## 5.32.12 - 2021/10/20

- updated to @applitools/dom-snapshot@4.5.10 (from 4.5.9)
- updated to @applitools/eyes-sdk-core@12.23.18 (from 12.23.17)
- updated to @applitools/visual-grid-client@15.8.37 (from 15.8.36)

## 5.32.11 - 2021/10/20

- updated to @applitools/dom-snapshot@4.5.9 (from 4.5.8)
- updated to @applitools/eyes-sdk-core@12.23.17 (from 12.23.16)
- updated to @applitools/visual-grid-client@15.8.36 (from 15.8.35)

## 5.32.10 - 2021/10/13

- updated to @applitools/eyes-sdk-core@12.23.16 (from 12.23.15)
- updated to @applitools/visual-grid-client@15.8.35 (from 15.8.34)

## 5.32.9 - 2021/10/12

- updated to @applitools/eyes-api@1.1.4 (from 1.1.3)
- updated to @applitools/eyes-sdk-core@12.23.15 (from 12.23.14)
- updated to @applitools/visual-grid-client@15.8.34 (from 15.8.33)

## 5.32.8 - 2021/10/7

- updated to @applitools/eyes-api@1.1.3 (from 1.1.2)
- updated to @applitools/eyes-sdk-core@12.23.14 (from 12.23.12)
- updated to @applitools/visual-grid-client@15.8.33 (from 15.8.31)

## 5.32.7 - 2021/9/24

- updated to @applitools/eyes-sdk-core@12.23.12 (from 12.23.11)
- updated to @applitools/visual-grid-client@15.8.31 (from 15.8.30)

## 5.32.6 - 2021/9/24

- updated to @applitools/eyes-sdk-core@12.23.11 (from 12.23.10)
- updated to @applitools/visual-grid-client@15.8.30 (from 15.8.29)

## 5.32.5 - 2021/9/24

- updated to @applitools/dom-snapshot@4.5.8 (from 4.5.7)
- updated to @applitools/eyes-api@1.1.2 (from 1.1.1)
- updated to @applitools/eyes-sdk-core@12.23.10 (from 12.23.5)
- updated to @applitools/visual-grid-client@15.8.29 (from 15.8.25)

## 5.32.4 - 2021/9/9

- updated to @applitools/eyes-api@1.1.1 (from 1.1.0)
- updated to @applitools/eyes-sdk-core@12.23.5 (from 12.23.3)
- updated to @applitools/utils@1.2.3 (from 1.2.2)
- updated to @applitools/visual-grid-client@15.8.25 (from 15.8.24)

## 5.32.3 - 2021/9/6

- add functionality to find element within another element to the spec driver
- updated to @applitools/eyes-api@1.1.0 (from 1.0.12)
- updated to @applitools/eyes-sdk-core@12.23.3 (from 12.22.6)
- updated to @applitools/visual-grid-client@15.8.24 (from 15.8.20)

## 5.32.2 - 2021/8/13

- updated to @applitools/dom-snapshot@4.5.7 (from 4.5.6)
- updated to @applitools/eyes-api@1.0.12 (from 1.0.11)
- updated to @applitools/eyes-sdk-core@12.22.6 (from 12.22.4)
- updated to @applitools/visual-grid-client@15.8.20 (from 15.8.18)
## 5.32.1 - 2021/8/9

- updated to @applitools/eyes-sdk-core@12.22.4 (from 12.22.2)
- updated to @applitools/visual-grid-client@15.8.18 (from 15.8.16)

## 5.32.0 - 2021/8/7

- updated to @applitools/dom-snapshot@4.5.6 (from 4.5.3)
- updated to @applitools/eyes-api@1.0.11 (from 1.0.7)
- updated to @applitools/eyes-sdk-core@12.22.2 (from 12.21.3)
- updated to @applitools/utils@1.2.2 (from 1.2.0)
- updated to @applitools/visual-grid-client@15.8.16 (from 15.8.12)

## 5.31.9 - 2021/6/30

- updated to @applitools/eyes-api@1.0.7 (from 1.0.5)
- updated to @applitools/eyes-sdk-core@12.21.3 (from 12.21.1)
- updated to @applitools/visual-grid-client@15.8.12 (from 15.8.11)
## 5.31.8 - 2021/6/15

- added full typescript support
- introduced @applitools/eyes-api package with new api
- updated to @applitools/eyes-api@1.0.5 (from 1.0.3)
- updated to @applitools/eyes-sdk-core@12.21.1 (from 12.20.3)
- updated to @applitools/visual-grid-client@15.8.11 (from 15.8.9)

## 5.31.7 - 2021/6/8

- updated to @applitools/eyes-sdk-core@12.20.3 (from 12.20.2)
- updated to @applitools/visual-grid-client@15.8.9 (from 15.8.8)

## 5.31.6 - 2021/6/1

- add `getEyes` to the service
- fix bug when configuration was not propagated in service
- 
- updated to @applitools/eyes-sdk-core@12.20.2 (from 12.20.1)
- updated to @applitools/visual-grid-client@15.8.8 (from 15.8.7)

## 5.31.5 - 2021/5/31

- updated to @applitools/dom-snapshot@4.5.3 (from 4.5.2)
- updated to @applitools/eyes-sdk-core@12.20.1 (from 12.20.0)

## 5.31.4 - 2021/5/27

- update domsnapshot

## 5.31.3 - 2021/5/25

- added support for wdio7
- added full typescript support
- introduced @applitools/eyes-api package with new api
- updated to @applitools/eyes-api@1.0.3 (from 1.0.1)
- updated to @applitools/eyes-sdk-core@12.20.0 (from 12.19.3)
- updated to @applitools/utils@1.2.0 (from 1.1.3)
- updated to @applitools/visual-grid-client@15.8.7 (from 15.8.6)

## 5.31.2 - 2021/5/13

- updated to @applitools/eyes-sdk-core@12.19.3 (from 12.19.2)
- updated to @applitools/visual-grid-client@15.8.6 (from 15.8.5)

## 5.31.1 - 2021/5/12

- updated to @applitools/eyes-api@1.0.1 (from 1.0.0)
- updated to @applitools/eyes-sdk-core@12.19.2 (from 12.19.1)
- updated to @applitools/visual-grid-client@15.8.5 (from 15.8.4)

## 5.31.0 - 2021/5/12

- added support for wdio7
- added full typescript support
- introduced @applitools/eyes-api package with new api
- updated to @applitools/eyes-api@1.0.0 (from 0.0.2)
- updated to @applitools/eyes-sdk-core@12.19.1 (from 12.14.2)
- updated to @applitools/utils@1.1.3 (from 1.1.0)
- updated to @applitools/visual-grid-client@15.8.4 (from 15.5.14)

## 5.30.0 - 2021/4/26

- updated to @applitools/eyes-sdk-core@12.17.4 (from 12.16.3)
- updated to @applitools/visual-grid-client@15.8.2 (from 15.6.4)

## 5.29.8 - 2021/3/22

- updated to @applitools/eyes-sdk-core@12.16.3 (from 12.16.2)
- updated to @applitools/visual-grid-client@15.6.4 (from 15.6.3)

## 5.29.7 - 2021/3/17

- Ability to pass `throwEx` to `browser.eyesGetAllTestResults` in Eyes service
- updated to @applitools/eyes-sdk-core@12.16.2 (from 12.14.8)
- updated to @applitools/visual-grid-client@15.6.3 (from 15.5.21)

## 5.29.6 - 2021/2/4

- fix for WDIO 5 service that prevented grid runs without a testConcurrency specified from running ([Trello](https://trello.com/c/ijY0syDH))
- updated to @applitools/eyes-sdk-core@12.14.8 (from 12.14.7)
- updated to @applitools/visual-grid-client@15.5.21 (from 15.5.20)

## 5.29.5 - 2021/2/1

- updated to @applitools/eyes-sdk-core@12.14.6 (from 12.14.2)
- updated to @applitools/visual-grid-client@15.5.19 (from 15.5.14)
- updated to @applitools/eyes-sdk-core@12.14.7 (from 12.14.6)
- updated to @applitools/visual-grid-client@15.5.20 (from 15.5.19)

## 5.29.4 - 2021/1/29

- chore: add husky
- updated to @applitools/eyes-sdk-core@12.14.2 (from 12.13.5)
- updated to @applitools/visual-grid-client@15.5.14 (from 15.5.11)

## 5.29.3 - 2021/1/18

- updated to @applitools/eyes-sdk-core@12.13.5 (from 12.13.4)
- updated to @applitools/visual-grid-client@15.5.11 (from 15.5.10)

## 5.29.2 - 2021/1/15

- updated to @applitools/eyes-sdk-core@12.13.4 (from 12.12.2)
- updated to @applitools/visual-grid-client@15.5.10 (from 15.5.5)

## 5.29.1 - 2021/1/12

- updated to @applitools/visual-grid-client@15.5.4 (from 15.4.0)
- updated to @applitools/eyes-sdk-core@12.12.2 (from 12.12.1)
- updated to @applitools/visual-grid-client@15.5.5 (from 15.5.4)

## 5.29.0 - 2020/12/18

- updated to @applitools/eyes-sdk-core@12.10.0 (from 12.9.3)
- updated to @applitools/visual-grid-client@15.4.0 (from 15.3.2)

## 5.28.3 - 2020/12/15

- updated to @applitools/eyes-sdk-core@12.9.3 (from 12.9.2)
- updated to @applitools/visual-grid-client@15.3.2 (from 15.3.1)

## 5.28.2 - 2020/12/14

- updated to @applitools/eyes-sdk-core@12.9.2 (from 12.9.1)
- updated to @applitools/visual-grid-client@15.3.1 (from 15.3.0)

## 5.28.1 - 2020/12/11

- update eyes-service to use new concurrency configuration

## 5.28.0 - 2020/12/11

- updated to @applitools/eyes-sdk-core@12.9.1 (from 12.6.1)
- updated to @applitools/visual-grid-client@15.3.0 (from 15.2.1)

## 5.27.2 - 2020/11/30

- export `RunnerOptions`

## 5.27.1 - 2020/11/29

- updated to @applitools/visual-grid-client@15.2.1 (from 15.2.0)

## 5.27.0 - 2020/11/25

- updated to @applitools/eyes-sdk-core@12.6.0 (from 12.5.7)
- updated to @applitools/visual-grid-client@15.2.0 (from 15.1.1)

## 5.26.0 - 2020/11/10

-- fix firefox region compensation issue
- add 2020 ios devices
- fix coded region calculation when running in target region ([Trello 538](https://trello.com/c/FQ8iJZdi))
- fix issue with element markers cleanup ([Trello](https://trello.com/c/H7I1Ofke)) ([commit](https://github.com/applitools/eyes.sdk.javascript1/commit/b643d01608512c3b30303149b0af7d1b03657225))
- deprecate `saveDebugData`
- updated to @applitools/eyes-sdk-core@12.5.7 (from 12.4.2)
- updated to @applitools/visual-grid-client@15.1.0 (from 15.0.10)
- updated to @applitools/visual-grid-client@15.1.1 (from 15.1.0)

## 5.25.1 - 2020/10/15

- add iosVersion to readme

## 5.25.0 - 2020/10/14

- updated to @applitools/eyes-sdk-core@12.4.2 (from 12.3.1)
- updated to @applitools/visual-grid-client@15.0.10 (from 15.0.9)

## 5.24.1 - 2020/10/7

- updated to @applitools/eyes-sdk-core@12.3.1 (from 12.3.0)

## 5.24.0 - 2020/10/6

- updated to @applitools/eyes-sdk-core@12.3.0 (from 12.2.6)
- updated to @applitools/visual-grid-client@15.0.9 (from 15.0.6)

## 5.23.1 - 2020/9/23

- republish due to missing coverage tests

## 5.23.0 - 2020/9/23

- removed yarn workspaces
- updated to @applitools/eyes-sdk-core@12.2.6 (from 12.2.5)
- updated to @applitools/visual-grid-client@15.0.6 (from 15.0.5)

## 5.22.2 - 2020/9/17

- updated to @applitools/eyes-sdk-core@12.2.5 (from 12.2.4)
- updated to @applitools/visual-grid-client@15.0.5 (from 15.0.4)

## 5.22.1 - 2020/9/15

- updated to @applitools/eyes-sdk-core@12.2.3 (from 12.2.0)
- updated to @applitools/visual-grid-client@15.0.3 (from 15.0.0)
- updated to @applitools/eyes-sdk-core@12.2.4 (from 12.2.3)

## 5.22.0 - 2020/8/30

- updated to @applitools/eyes-sdk-core@12.2.0 (from 12.1.3)
- updated to @applitools/visual-grid-client@15.0.0 (from 14.7.4)

## 5.21.1 - 2020/8/12

- added spec for extracting device name ([Trello](https://trello.com/c/qyf1baqT/464-wdio5-mobile-web-device-name-not-reported-on-dashboard))
- updated to @applitools/eyes-sdk-core@12.1.3 (from 12.1.2)
- updated to @applitools/visual-grid-client@14.7.4 (from 14.7.3)

## 5.21.0 - 2020/8/10

- added support of devtools protocol
- updated to @applitools/eyes-sdk-core@12.1.0 (from 11.5.1)
- updated to @applitools/visual-grid-client@14.7.1 (from 14.6.1)
- updated to @applitools/eyes-sdk-core@12.1.2 (from 12.1.0)
- updated to @applitools/visual-grid-client@14.7.3 (from 14.7.1)

## 5.19.3 - 2020/7/29

- updated to @applitools/eyes-sdk-core@11.5.1 (from 11.5.0)
- updated to @applitools/visual-grid-client@14.6.1 (from 14.6.0)

## 5.19.2 - 2020/7/26

- updated to @applitools/eyes-sdk-core@11.5.0 (from 11.4.1)
- updated to @applitools/visual-grid-client@14.6.0 (from 14.5.15)

## 5.19.1 - 2020/7/24

- updated to @applitools/eyes-sdk-core@11.4.1 (from 11.4.0)
- updated to @applitools/visual-grid-client@14.5.15 (from 14.5.14)

## 5.19.0 - 2020/7/24

- remove type definitions
- updated to @applitools/eyes-sdk-core@11.4.0 (from 11.3.8)
- updated to @applitools/visual-grid-client@14.5.14 (from 14.5.12)

## 5.18.4 - 2020/7/18

- prevented from using wdio external types during types generation
- updated to @applitools/visual-grid-client@14.5.11 (from 14.5.10)

## 5.18.3 - 2020/7/16

- add sync and async interfaces of wdio driver
- add verification step after types generation
- updated to @applitools/eyes-sdk-core@11.3.7 (from 11.3.6)
- updated to @applitools/visual-grid-client@14.5.10 (from 14.5.9)

## 5.18.2 - 2020/7/14

- add default generic type to Eyes
- updated to @applitools/eyes-sdk-core@11.3.6 (from 11.3.5)
- updated to @applitools/visual-grid-client@14.5.9 (from 14.5.8)

## 5.18.1 - 2020/7/14

- use own types to describe wdio api instead of importing wdio types
- updated to @applitools/eyes-sdk-core@11.3.5 (from 11.3.4)

## 5.18.0 - 2020/7/7

- updated to @applitools/eyes-sdk-core@11.3.4 (from 11.2.2)
- updated to @applitools/visual-grid-client@14.5.7 (from 14.5.2)

## 5.17.0 - 2020/7/5

- updated to @applitools/eyes-sdk-core@11.2.2 (from 11.2.1)
- updated to @applitools/visual-grid-client@14.5.2 (from 14.5.1)

## 5.16.0 - 2020/6/30

- updated to @applitools/eyes-sdk-core@11.2.0 (from 11.1.0)
- updated to @applitools/eyes-sdk-core@11.2.1 (from 11.2.0)
- updated to @applitools/visual-grid-client@14.5.1 (from 14.5.0)

## 5.15.1 - 2020/6/29

- updated to @applitools/visual-grid-client@14.5.0 (from 14.4.10)

## 5.15.0 - 2020/6/29

- remove IosScreenOrientation ([Trello](https://trello.com/c/abSJ68Rl/409-ufg-safari-on-ios-orientations-changes))
- updated to @applitools/eyes-sdk-core@11.1.0 (from 11.0.10)
- updated to @applitools/visual-grid-client@14.4.10 (from 14.4.9)

## 5.14.2 - 2020/6/18

- fix readme

## 5.14.1 - 2020/6/17

- updated to @applitools/eyes-sdk-core@11.0.10 (from 11.0.9)
- updated to @applitools/visual-grid-client@14.4.9 (from 14.4.8)

## 5.14.0 - 2020/6/15

- expose the service from the SDK package
- add detailed readme
- updated to @applitools/eyes-sdk-core@11.0.9 (from 11.0.8)
- updated to @applitools/visual-grid-client@14.4.8 (from 14.4.7)

## 5.13.3 - 2020/6/14

- updated to @applitools/eyes-sdk-core@11.0.8 (from 11.0.7)
- updated to @applitools/visual-grid-client@14.4.7 (from 14.4.6)

## 5.13.2 - 2020/6/13

- updated to @applitools/eyes-sdk-core@11.0.7 (from 11.0.6)
- updated to @applitools/visual-grid-client@14.4.6 (from 14.4.5)

## 5.13.1 - 2020/6/11

- Fix for setting the viewport size in older browser drivers ([Trello 382](https://trello.com/c/UBr0w3UF))
- updated to @applitools/eyes-sdk-core@11.0.6 (from 11.0.5)
- updated to @applitools/visual-grid-client@14.4.5 (from 14.4.4)

## 5.13.0 - 2020/6/9

- added mobile web API support for VG 
- updated to @applitools/eyes-sdk-core@11.0.5 (from 11.0.2)
- updated to @applitools/visual-grid-client@14.4.4 (from 14.4.1)

## 5.12.0 - 2020/6/2

- Unified core
- updated to @applitools/eyes-sdk-core@11.0.2 (from v10.3.1)
- updated to @applitools/visual-grid-client@14.4.1 (from v14.2.1)

## 5.11.2 - 2020/5/26

- updated to @applitools/eyes-sdk-core@10.3.1 (from v10.3.0)
- updated to @applitools/visual-grid-client@14.2.1 (from v14.2.0)

## 5.11.1 - 2020/5/25

- updated to @applitools/eyes-sdk-core@10.3.0
- updated to @applitools/visual-grid-client@14.2.0

## 5.11.0 - 2020/5/19

- Support accessibility validation
- removed "source" attribute from VG checkWindow
- fetching resources with "referer" header.
- added retry for requests failing with a 503 response status
- added more devices for device emulation
- updated to @applitools/dom-utils@4.7.17
- updated to @applitools/eyes-sdk-core@10.2.0
- updated to @applitools/visual-grid-client@14.1.0

## 5.10.1 - 2020/4/27

- support edgelegacy, edgechromium, and edgechromium-one-version-back
- added emulation devices
- fix returned value from `close` method ([Trello](https://trello.com/c/m6K2Ftd5/277-wdio5-difficulty-getting-test-results-object))
- updated to @applitools/dom-utils@4.7.14
- updated to @applitools/eyes-sdk-core@9.2.1
- updated to @applitools/visual-grid-client@13.7.2

## 5.9.23 - 2020/4/1

- removed eyes-common dependency
- update @applitools/visual-grid-client@13.6.11
- handle switchToFrame on MS Edge <= 18 ([Trello](https://trello.com/c/SLUduLu8/68-can-take-baseline-screenshot-but-checkpoint-screenshots-not-showing-up.))

## 5.9.22

- fixed bug when target region wasn't cleared after check ([Trello](https://trello.com/c/gMwZw0C0/268-wdio5-cannot-read-property-offset-of-null-when-taking-window-screenshot-after-region))
- fix exception when restoring scrollbars

## 5.9.21

- Fix bug when calculating if a captured image fits within the viewport on Chrome on Android [Trello 275](https://trello.com/c/PrGEKzhJ)

## 5.9.20

- Updated internal packages

## 5.9.19

- Fix Target regions for Visual Grid
- Fix WebElement regions for Visual Grid

## 5.9.18

- update @applitools/visual-grid-client@13.6.7 to support xpath selectors for regions ([Trello](https://trello.com/c/QGpZcMKS/249-strict-region-shows-up-on-classic-runner-test-but-not-on-ug-runner-test))

## 5.9.17

- update @applitools/dom-snapshot@3.4.0 to get correct css in DOM snapshots ([Trello](https://trello.com/c/3BFtM4hx/188-hidden-spinners-in-text-field-are-visible-in-firefox), [Trello](https://trello.com/c/S4XT7ONp/192-vg-dom-snapshot-deletes-duplicate-keys-from-css-rules), [Trello](https://trello.com/c/mz8CKKB7/173-selector-not-seen-as-it-should-be-issue-with-css-variable), [Trello](https://trello.com/c/KZ25vktg/245-edge-screenshot-different-from-chrome-and-ff))

## 5.9.16

- Support both new and old server versions for identifying new running sessions. ([Trello](https://trello.com/c/mtSiheZ9/267-support-startsession-as-long-running-task))
- Fix exception in older Node.js versions ([Trello](https://trello.com/c/QGpZcMKS/249-strict-region-shows-up-on-classic-runner-test-but-not-on-ug-runner-test))

## 5.9.15

- fix trying to fetch branch info from server on non github integration runs

## 5.20.0

- same as 5.9.14

## 5.10.0

- same as 5.9.14

## 5.9.14

- regions fixes for VG
- upload domsnapshot directly to Azure [Trello](https://trello.com/c/ZCLJo8Fy/241-upload-dom-directly-to-azure)
- support future long running tasks [Trello](https://trello.com/c/60Rm4xXG/240-support-future-long-running-tasks)
- fix regression in css stitching [Trello](https://trello.com/c/dp5IIoFw/235-css-stitching-regression-in-41533)

## 5.9.13
- branching base commit support
- make functions in runners 

## 5.9.12
- Send stitching service URL to visual grid [Trello 212](https://trello.com/c/Sqh6k2VV)

## 5.9.9 - 2020-02-09
- removed unnecessary dev dependencies

## [5.9.6]
- fixed image cropping on mobile Safari so it doesn't capture the browser nav [Trello 178](https://trello.com/c/yiPcT5Ks)

## [5.9.1] - 2019-12-16
### Fixed
- Checkpoint screenshots not captured when frame errors exist. [Trello 1197](https://trello.com/c/SLUduLu8)

## [5.9.0] - 2019-12-12
### Fixed
- Crop safari url bar and status bar on mobile devices (IOS). [Trello 939](https://trello.com/c/SM80YzdM)
- Fix appium support. [Trello 1199](https://trello.com/c/Ls2aOycy)
- Don't scroll to the top of the page when eyes.check() is running. [Trello 1337](https://trello.com/c/6puZ79sd)

## [5.8.4] - 2019-11-28 
### Fixed
- Updated VGC to 13.3.6: supporting http only proxy. [Trello 976](https://trello.com/c/cOquuvWo/976-axios-adding-support-to-proxy-of-http-over-https)

## [5.8.3] - 2019-11-09 
### Fixed
- Fix css stitching for new chrome 78 (bug in chrome). [Trello 1206](https://trello.com/c/euVqe1Sv)

## [5.8.2] - 2019-11-01
### Fixed
- Default viewportSize `null` value was overriding configuration. [Trello 1168](https://trello.com/c/yPqI3erm)

## [5.8.1] - 2019-10-21
### Added
- This changelog file.
### Fixed
- Imports from SDK-core.
- Automatic dependency update for patch versions only. 


