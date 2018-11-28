// for import/export to work in this file
process.env.VUE_CLI_BABEL_TARGET_NODE = true
process.env.VUE_CLI_BABEL_TRANSPILE_MODULES = true

require('@babel/register')

/* eslint-disable */
import debug from '../debug'
import config from '../config'
import startDb from '../mongo-memory'
import Account from '../models/account'
import Comment from '../models/comment'
/* eslint-enable */

Account.register(new Account({ username: 'test@gmail.com' }), 'test',
  (err, account) => {
    if (err) debug(err)
  }
)

Comment.register(new Comment({
  username: 'test@gmail.com',
  url: 'https://www.youtube.com/watch?v=m0psosrTuas',
  parent: null,
  test: 'This is a comment about this awesome youtube video!'
}))

startDb().then(db => {
  config.db = db.config
  require('./www')

  process.on('exit', () => {
    db.mongod.stop()
  })
})
