export function extractCIProvider(): string | null {
  if (process.env.TF_BUILD) return 'Azure'
  if (process.env['bamboo.buildKey']) return 'Bamboo'
  if (process.env.BUILDKITE) return 'Buildkite'
  if (process.env.CIRCLECI) return 'Circle'
  if (process.env.CIRRUS_CI) return 'Cirrus'
  if (process.env.CODEBUILD_BUILD_ID) return 'CodeBuild'
  if (process.env.GITHUB_ACTIONS) return 'GitHub Actions'
  if (process.env.GITLAB_CI) return 'GitLab'
  if (process.env.HEROKU_TEST_RUN_ID) return 'Heroku'
  if (process.env.BUILD_ID) return 'Jenkins'
  if (process.env.TEAMCITY_VERSION) return 'TeamCity'
  if (process.env.TRAVIS) return 'Travis'
  return null
}
