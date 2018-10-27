// for import/export to work in this file
process.env.VUE_CLI_BABEL_TARGET_NODE = true
process.env.VUE_CLI_BABEL_TRANSPILE_MODULES = true

require('@babel/register')

/* eslint-disable */
import config from '../config'
import startDb from '../mongo-memory'
/* eslint-enable */

startDb().then(db => {
  config.db = db.config
  require('./www')

  process.on('exit', () => {
    db.mongod.stop()
  })
})
