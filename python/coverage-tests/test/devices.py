import os
import warnings

import pytest

from . import sauce


@pytest.fixture(scope="function")
def orientation():
    return "portrait"


@pytest.fixture(scope="function")
def app():
    return ""


@pytest.fixture(scope="function")
def browser_name():
    return ""


@sauce.vm
@pytest.fixture(scope="function")
def pixel_3_xl(app, sauce_url, browser_name, orientation, name_of_test):
    capabilities = {
        "appium:automationName": "UIAutomator2",
        "appium:clearSystemFiles": True,
        "appium:deviceName": "Google Pixel 3 XL GoogleAPI Emulator",
        "appium:platformVersion": "10.0",
        "platformName": "Android",
        "sauce:options": {
            "appiumVersion": "1.20.2",
            "deviceOrientation": orientation.upper(),
            "name": name_of_test,
            "noReset": True,
        },
    }
    return appium(capabilities, sauce_url, app=app, browser_name=browser_name)


@sauce.vm
@pytest.fixture(scope="function")
def pixel_3a_xl(app, sauce_url, browser_name, orientation, name_of_test):
    capabilities = {
        "appium:automationName": "UIAutomator2",
        "appium:clearSystemFiles": True,
        "appium:deviceName": "Google Pixel 3a XL GoogleAPI Emulator",
        "appium:platformVersion": "10.0",
        "platformName": "Android",
        "sauce:options": {
            "appiumVersion": "1.20.2",
            "deviceOrientation": orientation.upper(),
            "name": name_of_test,
            "noReset": True,
        },
    }
    return appium(capabilities, sauce_url, app=app, browser_name=browser_name)


@sauce.vm
@pytest.fixture(scope="function")
def samsung_galaxy_s8(app, sauce_url, browser_name, orientation, name_of_test):
    capabilities = {
        "appium:automationName": "UIAutomator2",
        "appium:clearSystemFiles": True,
        "appium:deviceName": "Samsung Galaxy S8 FHD GoogleAPI Emulator",
        "appium:platformVersion": "7.0",
        "platformName": "Android",
        "sauce:options": {
            "appiumVersion": "1.19.2",
            "deviceOrientation": orientation.upper(),
            "name": name_of_test,
            "noReset": True,
        },
    }
    return appium(capabilities, sauce_url, app=app, browser_name=browser_name)


@sauce.mac_vm
@pytest.fixture(scope="function")
def iphone_xs(app, sauce_url, browser_name, orientation, name_of_test):
    capabilities = {
        "appium:automationName": "XCUITest",
        "appium:clearSystemFiles": True,
        "appium:deviceName": "iPhone XS Simulator",
        "appium:platformVersion": "13.0",
        "platformName": "iOS",
        "sauce:options": {
            "appiumVersion": "1.19.2",
            "deviceOrientation": orientation.upper(),
            "name": name_of_test,
            "noReset": True,
        },
    }
    return appium(capabilities, sauce_url, app=app, browser_name=browser_name)


@sauce.mac_vm
@pytest.fixture(scope="function")
def iphone_12(app, sauce_url, browser_name, orientation, name_of_test):
    capabilities = {
        "deviceName": "iPhone 12 Pro Simulator",
        "platformVersion": "15.2",
        "platformName": "iOS",
        "deviceOrientation": orientation.upper(),
        "sauce:options": {
            "name": name_of_test,
        },
    }
    return appium(capabilities, sauce_url, app=app, browser_name=browser_name)


def appium(desired_caps, sauce_url, app="", browser_name=""):
    from appium.webdriver import Remote

    if app and browser_name:
        raise Exception("Appium drivers shouldn't contain both app and browserName")
    if not app and not browser_name:
        raise Exception("Appium drivers should have app or browserName")
    if app:
        desired_caps["appium:app"] = app
        desired_caps["appium:NATIVE_APP"] = True
    if browser_name:
        desired_caps["browserName"] = browser_name

    selenium_url = os.getenv("SELENIUM_SERVER_URL", sauce_url)
    with warnings.catch_warnings():
        # There is still no way to configure Appium 2 driver
        # other than using desired_capabilities dict so ignore the warning
        warnings.filterwarnings(
            "ignore",
            "desired_capabilities has been deprecated",
            category=DeprecationWarning,
        )
        return Remote(command_executor=selenium_url, desired_capabilities=desired_caps)
