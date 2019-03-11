// ugly but necessary appearently...
require('@babel/register')
require('@babel/polyfill')

const NodeEnvironment = require('jest-environment-node')

const createDb = require('../../src/server/mongo-memory').default

process.env.DEBUG = 'test'

module.exports = class MongoEnvironment extends NodeEnvironment {
  async setup() {
    console.log('Setting up MongoDB Test Environment')
    this.global.db = await createDb()

    await super.setup()
  }

  async teardown() {
    console.log('Tearing down MongoDB Test Environment')
    this.global.db.mongod.stop()

    await super.teardown()
  }

  runScript(script) {
    return super.runScript(script)
  }
}
