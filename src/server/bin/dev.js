require('@babel/register')

/* eslint-disable */
import config from '../config'
import startDb from '../mongo-memory'
import { debug } from '../debug'

import Account from '../models/account'
/* eslint-enable */

Account.register(new Account({ username: 'test@gmail.com' }), 'test',
  (err, account) => {
    if (err) debug(err)
  }
)

startDb().then(db => {
  config.db = db.config
  require('./www')

  process.on('exit', () => {
    db.mongod.stop()
  })
})
