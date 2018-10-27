require('@babel/register')
process.env.NODE_ENV = 'development'

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
