const {describe, it, _before, _after} = require('mocha');
const {expect} = require('chai');
const path = require('path');
const testServer = require('@applitools/sdk-shared/src/run-test-server');
const {delay: _psetTimeout, presult} = require('@applitools/functional-commons');
const {sh} = require('@applitools/sdk-shared/src/process-commons');

describe('eyes-storybook', () => {
  it('renders cross-origin iframes', async () => {
    let closeServerA, closeServerB;
    const staticPath = path.join(
      process.cwd(),
      'node_modules/@applitools/sdk-shared/coverage-tests/fixtures',
    );
    try {
      closeServerA = (
        await testServer({
          port: 7777,
          staticPath,
          allowCors: false,
          middlewareFile: path.resolve(
            process.cwd(),
            'node_modules/@applitools/sdk-shared/coverage-tests/util/handlebars-middleware.js',
          ),
          hbData: {
            src: 'http://localhost:7778/cors_frames/frame.html',
          },
        })
      ).close;
      closeServerB = (await testServer({port: 7778, staticPath})).close;
      await new Promise(res => setTimeout(res, 100));
      const [err, result] = await presult(
        sh(
          `node ${path.resolve(__dirname, '../../bin/eyes-storybook')} -f ${path.resolve(
            __dirname,
            'happy-config/cross-origin-iframe.config.js',
          )}`,
          {
            spawnOptions: {stdio: 'pipe'},
          },
        ),
      );
      const stdout = err ? err.stdout : result.stdout;
      //const stderr = err ? err.stderr : result.stderr;

      expect(stdout.replace(/\[Chrome \d+.\d+\]/g, '[Chrome]')).to.include(
        'Cross-origin iframe: Single story [Chrome] [640x480] - Passed',
      );
    } finally {
      await closeServerA();
      await closeServerB();
    }
  });
});
