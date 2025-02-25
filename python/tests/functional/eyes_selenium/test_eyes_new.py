import sys

import pytest as pytest
from selenium import webdriver
from selenium.webdriver.common.by import By

from applitools.common import DesktopBrowserInfo, NewTestError
from applitools.common.selenium import BrowserType
from applitools.core import VisualLocator
from applitools.selenium import (
    ClassicRunner,
    Eyes,
    Target,
    TargetPath,
    VisualGridRunner,
)
from tests.utils import get_session_results


def test_create_open_check_close_eyes(local_chrome_driver):
    local_chrome_driver.get(
        "https://applitools.github.io/demo/TestPages/SimpleTestPage"
    )
    eyes = Eyes()
    eyes.configure.set_hide_scrollbars(False)
    eyes.open(
        local_chrome_driver,
        "USDK Test",
        "Test create open eyes",
        {"width": 800, "height": 600},
    )
    check_result = eyes.check_window()
    eyes.close(False)

    assert check_result.as_expected


def test_create_open_check_close_vg_eyes(local_chrome_driver):
    local_chrome_driver.get(
        "https://applitools.github.io/demo/TestPages/SimpleTestPage"
    )
    runner = VisualGridRunner()
    eyes = Eyes(runner)
    eyes.open(
        local_chrome_driver,
        "USDK Test",
        "Test create open VG eyes",
        {"width": 800, "height": 600},
    )
    eyes.check_window()
    eyes.close_async()
    all_results = runner.get_all_test_results().all_results

    assert len(all_results) == 1
    assert all_results[0].test_results.is_passed


def test_open_abort_eyes(local_chrome_driver):
    eyes = Eyes()
    eyes.open(local_chrome_driver, "USDK Test", "Test create abort eyes")

    abort_result = eyes.abort()

    assert abort_result.is_failed
    assert abort_result.is_aborted


def test_open_close_abort_eyes(local_chrome_driver):
    eyes = Eyes()
    eyes.open(local_chrome_driver, "USDK Test", "Test create close abort eyes")

    eyes.close(False)
    abort_result = eyes.abort()

    assert abort_result is None


def test_run_test_delete_result(local_chrome_driver):
    eyes = Eyes()
    eyes.open(local_chrome_driver, "USDK Test", "Test run_test_delete_result")
    eyes.check_window()
    result = eyes.close(False)
    result.delete()


def test_get_all_test_results_delete_result(local_chrome_driver):
    runner = ClassicRunner()
    eyes = Eyes(runner)
    eyes.open(local_chrome_driver, "USDK Test", "Test runner_test_delete_result")
    eyes.check_window()
    eyes.close(False)
    all_results = runner.get_all_test_results()

    all_results[0].test_results.delete()


def test_get_all_test_results(local_chrome_driver):
    local_chrome_driver.get(
        "https://applitools.github.io/demo/TestPages/SimpleTestPage"
    )
    runner = ClassicRunner()
    eyes1 = Eyes(runner)
    eyes1.configure.set_hide_scrollbars(False)
    eyes1.open(local_chrome_driver, "USDK Test", "Test get all test results 1")
    eyes1.check_window()
    results = [eyes1.close()]
    eyes2 = Eyes(runner)
    eyes2.configure.set_hide_scrollbars(False)
    eyes2.open(local_chrome_driver, "USDK Test", "Test get all test results 2")
    eyes2.check_window()
    results.append(eyes2.close())

    all_results = runner.get_all_test_results()

    assert len(all_results) == 2
    assert results[0] == all_results[0].test_results
    assert results[1] == all_results[1].test_results


def test_get_all_vg_test_results(local_chrome_driver):
    local_chrome_driver.get(
        "https://applitools.github.io/demo/TestPages/SimpleTestPage"
    )
    runner = VisualGridRunner()
    eyes1 = Eyes(runner)
    eyes1.open(
        local_chrome_driver,
        "USDK Test",
        "Test get all vg test results 1",
        {"width": 800, "height": 600},
    )
    eyes1.check_window()
    results = [eyes1.close()]
    eyes2 = Eyes(runner)
    eyes2.open(
        local_chrome_driver,
        "USDK Test",
        "Test get all vg test results 2",
        {"width": 800, "height": 600},
    )
    eyes2.check_window()
    results.append(eyes2.close())

    all_results = runner.get_all_test_results()

    assert len(all_results) == 2
    assert results[0] == all_results[0].test_results
    assert results[1] == all_results[1].test_results


def test_get_all_vg_test_results_all_desktop_browsers(local_chrome_driver):
    local_chrome_driver.get(
        "https://applitools.github.io/demo/TestPages/SimpleTestPage"
    )
    runner = VisualGridRunner(5)
    eyes = Eyes(runner)
    for browser_type in BrowserType:
        eyes.configure.add_browser(DesktopBrowserInfo(800, 600, browser_type))

    eyes.open(
        local_chrome_driver,
        "USDK Test",
        "Test get all vg test results all browsers",
    )
    eyes.check_window()
    eyes.close_async()
    all_results = runner.get_all_test_results()

    assert len(all_results) == 16


def test_check_element_in_shadow(local_chrome_driver):
    local_chrome_driver.get(
        "https://applitools.github.io/demo/TestPages/ShadowDOM/index.html"
    )
    with Eyes() as eyes:
        eyes.open(
            local_chrome_driver,
            "USDK Test",
            "Test check element in shadow dom",
            {"width": 800, "height": 600},
        )
        eyes.check(Target.region(TargetPath.shadow("#has-shadow-root").region("h1")))


def test_check_element_by_id(local_chrome_driver):
    local_chrome_driver.get(
        "https://applitools.github.io/demo/TestPages/FramesTestPage/"
    )
    with Eyes() as eyes:
        eyes.open(
            local_chrome_driver,
            "USDK Test",
            "Test check element by id",
            {"width": 800, "height": 600},
        )
        eyes.check(Target.region([By.ID, "overflowing-div"]))


def test_get_all_test_results_raises_new_test_error(local_chrome_driver):
    local_chrome_driver.get("https://demo.applitools.com")
    runner = ClassicRunner()
    eyes = Eyes(runner)
    eyes.configure.save_new_tests = False
    eyes.open(local_chrome_driver, "USDK Test", "Test non saved test raises")
    eyes.check_window(fully=False)
    eyes.close(False)
    with pytest.raises(NewTestError):
        runner.get_all_test_results()


def test_locate_with_missing_locator_returns_empty_result(local_chrome_driver):
    local_chrome_driver.get(
        "https://applitools.github.io/demo/TestPages/SimpleTestPage"
    )
    eyes = Eyes()
    eyes.open(
        local_chrome_driver,
        "USDK Test",
        "Test missing locator",
        {"width": 800, "height": 600},
    )
    try:
        located = eyes.locate(VisualLocator.name("non-existing-locator"))
        assert located == {"non-existing-locator": []}
        eyes.close(False)
    finally:
        eyes.abort()


@pytest.mark.parametrize("runner_type", [ClassicRunner, VisualGridRunner])
@pytest.mark.skip("Currently get_all_test_results does not abort eyes")
def test_get_all_test_results_aborts_eyes(runner_type):
    runner = runner_type()
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")
    with webdriver.Chrome(options=options) as driver:
        driver.get("https://applitools.github.io/demo/TestPages/SimpleTestPage/")
        eyes = Eyes(runner)
        eyes.configure.set_hide_scrollbars(False)
        eyes.open(
            driver,
            "USDK Tests",
            "Auto aborted eyes get all test results {}".format(type(runner).__name__),
            {"width": 1024, "height": 768},
        )
        eyes.check_window()

    results = runner.get_all_test_results()
    assert len(results) == 1


@pytest.mark.skipif(sys.platform == "win32", reason="known to fail on windows")
def test_should_wait_before_capture_in_config_with_lb(local_chrome_driver):
    eyes = Eyes(VisualGridRunner())
    eyes.configure.add_browser(DesktopBrowserInfo(1200, 800, BrowserType.CHROME))
    eyes.configure.set_layout_breakpoints(True).set_wait_before_capture(2000)
    eyes.open(
        local_chrome_driver,
        "USDK Tests",
        "Wait before capture in config with layout breakpoints",
        {"width": 600, "height": 600},
    )
    local_chrome_driver.get(
        "https://applitools.github.io/demo/TestPages/waitBeforeCapture"
    )
    eyes.check("", Target.window())
    eyes.close()


@pytest.mark.skipif(sys.platform == "win32", reason="known to fail on windows")
def test_should_wait_before_capture_in_check_with_lb(local_chrome_driver):
    eyes = Eyes(VisualGridRunner())
    eyes.configure.add_browser(DesktopBrowserInfo(1200, 800, BrowserType.CHROME))
    eyes.open(
        local_chrome_driver,
        "USDK Tests",
        "Wait before capture in check with layout breakpoints",
        {"width": 600, "height": 600},
    )
    local_chrome_driver.get(
        "https://applitools.github.io/demo/TestPages/waitBeforeCapture"
    )
    eyes.check("", Target.window().layout_breakpoints(True).wait_before_capture(2000))
    eyes.close()


def test_sholuld_wait_before_capture_in_check(local_chrome_driver):
    eyes = Eyes(VisualGridRunner())
    eyes.open(
        local_chrome_driver,
        "USDK Tests",
        "Wait before capture in open",
        {"width": 700, "height": 460},
    )
    local_chrome_driver.get(
        "https://applitools.github.io/demo/TestPages/waitBeforeCapture/"
        "dynamicDelay.html?delay=1000"
    )
    eyes.check("", Target.window().wait_before_capture(2000))
    eyes.close(raise_ex=True)


def test_should_wait_before_capture_in_config(local_chrome_driver):
    eyes = Eyes(VisualGridRunner())
    eyes.configure.set_wait_before_capture(2000)
    eyes.open(
        local_chrome_driver,
        "USDK Tests",
        "Wait before capture in check",
        {"width": 700, "height": 460},
    )
    local_chrome_driver.get(
        "https://applitools.github.io/demo/TestPages/waitBeforeCapture/"
        "dynamicDelay.html?delay=1000"
    )
    eyes.check("", Target.window())
    eyes.close()


def test_user_test_id_is_in_test_results(local_chrome_driver):
    runner = ClassicRunner()
    eyes = Eyes(runner)
    user_test_id = "SUPER TEST ID"
    eyes.configure.user_test_id = user_test_id
    eyes.open(
        local_chrome_driver,
        "USDK Tests",
        "Test user test id",
        {"width": 800, "height": 600},
    )
    local_chrome_driver.get(
        "https://applitools.github.io/demo/TestPages/SimpleTestPage"
    )
    eyes.check_window()
    eyes.close_async()
    results = runner.get_all_test_results(False)
    test_results_container = results.results[0]
    assert test_results_container.user_test_id == user_test_id
    assert test_results_container.test_results.user_test_id == user_test_id


def test_ec_client_driver():
    eyes = Eyes()
    ec_url = Eyes.get_execution_cloud_url()
    driver = webdriver.Remote(ec_url)
    driver.get("https://applitools.github.io/demo/TestPages/SimpleTestPage")
    eyes.open(driver, "USDK Tests", "Execution cloud driver creation test")
    eyes.check_window()
    eyes.close()


def test_runner_call_get_results_two_times(local_chrome_driver):
    local_chrome_driver.get(
        "https://applitools.github.io/demo/TestPages/SimpleTestPage"
    )
    runner = VisualGridRunner()
    eyes1 = Eyes(runner)
    eyes1.open(
        local_chrome_driver,
        "USDK Test",
        "Test get all vg test results 1",
        {"width": 800, "height": 600},
    )
    eyes1.check_window()
    eyes1.close()
    all_results1 = runner.get_all_test_results()
    eyes2 = Eyes(runner)
    eyes2.open(
        local_chrome_driver,
        "USDK Test",
        "Test get all vg test results 2",
        {"width": 800, "height": 600},
    )
    eyes2.check_window()
    eyes2.close()

    all_results2 = runner.get_all_test_results()

    assert len(all_results1) == 1
    assert len(all_results2) == 2
