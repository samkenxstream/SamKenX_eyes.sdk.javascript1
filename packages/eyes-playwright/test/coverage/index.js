const {makeEmitter, makeTemplate, supportedTests} = require('@applitools/sdk-coverage-tests/js')

module.exports = {
  name: 'eyes.playwright',
  out: './test/coverage/generic',
  ext: '.spec.js',
  initialize: makeEmitter,
  testFrameworkTemplate: makeTemplate,
  supportedTests,
}
