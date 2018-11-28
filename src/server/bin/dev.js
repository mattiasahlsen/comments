require('@babel/register')

/* eslint-disable */
import config from '../config'
import startDb from '../mongo-memory'
import Account from '../models/account'
import Comment from '../models/comment'
import debug from '../debug'

/* eslint-enable */

Account.register(new Account({ username: 'test@gmail.com' }), 'test',
  (err, account) => {
    if (err) debug(err)
  }
)

const comment = new Comment({
  id: 0,
  username: 'test@gmail.com',
  url: 'https://www.youtube.com/watch?v=m0psosrTuas',
  parent: null,
  test: 'This is a comment about this awesome youtube video!'
})
comment.save()

startDb().then(db => {
  config.db = db.config
  require('./www')

  process.on('exit', () => {
    db.mongod.stop()
  })
})
