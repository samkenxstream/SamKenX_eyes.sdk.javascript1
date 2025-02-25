'use strict'
const fs = require('fs')
const path = require('path')
const pickby = require('lodash.pickby')
const utils = require('@applitools/utils')
const chalk = require('chalk')

async function yarnInstall() {
  await utils.process.sh(`yarn install`)
}

async function yarnUpgrade({folder, upgradeAll}) {
  const pkgJson = JSON.parse(fs.readFileSync(path.resolve(folder, 'package.json')))
  const {dependencies, devDependencies} = pkgJson
  const applitoolsDeps = pickby(dependencies, (_, pkg) => pkg.startsWith('@applitools/'))
  const applitoolsDevDeps = pickby(devDependencies, (_, pkg) => pkg.startsWith('@applitools/'))
  const depsToUpgrade = upgradeAll
    ? Object.assign(dependencies, devDependencies)
    : Object.assign(applitoolsDeps, applitoolsDevDeps)
  if (Object.keys(depsToUpgrade).length) {
    const depsStr = Object.keys(depsToUpgrade).join(' ')
    const cmd = `yarn upgrade --latest ${depsStr}`
    console.log(chalk.cyan(cmd))
    await utils.process.sh(cmd)
  }
}

function findUpgradedDeps(oldDeps, newDeps) {
  return Object.keys(oldDeps).reduce((upgradedDeps, dep) => {
    return !oldDeps[dep] || !newDeps[dep] || oldDeps[dep] === newDeps[dep]
      ? upgradedDeps
      : [...upgradedDeps, [dep, oldDeps[dep], newDeps[dep]]]
  }, [])
}

function findUnfixedDeps(dependencies) {
  return Object.keys(dependencies).reduce((warnings, pkg) => {
    return isNaN(Number(dependencies[pkg][0])) ? {...warnings, [pkg]: dependencies[pkg]} : warnings
  }, {})
}

function verifyUnfixedDeps(folder) {
  const pkgJson = require(path.resolve(folder, 'package.json'))
  const {dependencies} = pkgJson
  const unfixedDeps = findUnfixedDeps(dependencies)
  const messages = []
  Object.entries(unfixedDeps).forEach(([key, value]) => {
    messages.push(chalk.red(`depenency is not fixed: ${key}@${value}`))
  })
  if (messages.length) {
    throw new Error(messages.join('\n'))
  }
}

module.exports = {
  yarnInstall,
  yarnUpgrade,
  findUnfixedDeps,
  findUpgradedDeps,
  verifyUnfixedDeps,
}
