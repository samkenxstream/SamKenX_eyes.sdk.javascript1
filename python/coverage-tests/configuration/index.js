let ref = "universal-sdk";
let dir = `https://raw.githubusercontent.com/applitools/sdk.coverage.tests/${ref}`
let report_package_name = {
    "eyes_robotframework": "eyes_robotframework",
    "eyes_selenium": "eyes_selenium_python",
}
module.exports = {
    name: report_package_name[process.env.RELEASING_PACKAGE] || "eyes_selenium_python",
    emitter: `${dir}/python/emitter.js`,
    overrides: [`${dir}/js/overrides.js`, `${dir}/python/overrides.js`],
    template: `${dir}/python/template.hbs`,
    tests: `${dir}/coverage-tests.js`,
    ext: ".py",
    outPath: "./test/coverage/generic",
}
