require('@babel/register')

/* eslint-disable */
import config from '../config'
import startDb from '../mongo-memory'
import Account from '../models/account'
import Website from '../models/website'
import Comment from '../models/comment'
import { debug } from '../debug'

const mongoose = require('mongoose')
// mongoose.set('debug', true)


/* eslint-enable */

// Initialize with mock data

const initDb = async () => {
  await Comment.createIndexes()
  await Account.createIndexes()
  await Website.createIndexes()

  const accounts = [
    { username: 'test@gmail.com', displayName: 'Test User', password: 'test' },
    { username: 'mattias.ahlsen@gmail.com', displayName: 'Mattias Ahlsén', password: 'mattias' },
    { username: 'gabriel.lindgren@gmail.com', displayName: 'Gabriel Lindgren', password: 'gabriel' }
  ]

  // Create accounts
  await new Promise((resolve, reject) => {
    let count = 0
    accounts.forEach((el, index) => {
      Account.register(new Account(el), el.password, (err, acc) => {
        if (err) throw err
        accounts[index] = acc
        if (++count === accounts.length) resolve()
      })
    })
  })

  // After all accounts are made, create websites

  const website = new Website({
    url: 'https://www.youtube.com/watch?v=m0psosrTuas',
    domainWide: false
  })
  await website.save()

  // Afer that, create all root comments

  const rootComments = [
    {
      userId: accounts[0]._id,
      websiteId: website._id,
      text: 'This is a test comment about this awesome youtube video!'
    },
    {
      userId: accounts[2]._id,
      websiteId: website._id,
      text: 'Cool video.'
    }
  ]

  const replyComments = [
    {
      userId: accounts[1]._id,
      websiteId: website._id,
      parentIndex: 1,
      text: 'Yeah, I like it.',
    }
  ]

  await new Promise((resolve, reject) => {
    let count = 0
    rootComments.forEach((el, index) => {
      new Comment(el).save((err, comment) => {
        if (err) throw err
        rootComments[index] = comment
        if (++count === rootComments.length) resolve()
      })
    })
  })

  await new Promise((resolve, reject) => {
    let count = 0
    replyComments.forEach((el, index) => {
      el.parentId = rootComments[el.parentIndex]._id
      new Comment(el).save((err, comment) => {
        if (err) throw err
        replyComments[index] = comment
        if (++count === rootComments.length) resolve()
      })
    })
  })
}
initDb()

startDb().then(db => {
  config.db = db.config
  require('./www')

  process.on('exit', () => {
    db.mongod.stop()
  })
})
