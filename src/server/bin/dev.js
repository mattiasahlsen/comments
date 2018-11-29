require('@babel/register')

/* eslint-disable */
import config from '../config'
import startDb from '../mongo-memory'
import Account from '../models/account'
import Website from '../models/website'
import Comment from '../models/comment'
import debug from '../debug'

/* eslint-enable */

// Mock data

const accounts = [
  { username: 'test@gmail.com', displayName: 'Test User', password: 'test' }
]
accounts.forEach(el => Account.register(new Account(el), el.password))

const website = new Website({
  url: 'https://www.youtube.com/watch?v=m0psosrTuas',
  domainWide: false
})
website.save()

const comments = [
  {
    username: 'test@gmail.com',
    websiteId: website._id,
    text: 'This is a comment about this awesome youtube video!'
  },
]
comments.forEach(el => new Comment(el).save())

startDb().then(db => {
  config.db = db.config
  require('./www')

  process.on('exit', () => {
    db.mongod.stop()
  })
})
