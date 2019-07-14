require('@babel/register')

/* eslint-disable */
import config from '../config'
import startDb from '../mongo-memory'
import { debug } from '../debug'

import Account from '../models/account'
import Website from '../models/website'
import Comment from '../models/comment'
import Vote from '../models/vote'

const mongoose = require('mongoose')
// mongoose.set('debug', true)

import { ADMIN } from '../../constants'

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
  for (let i = 0; i < 5; i++) {
    accounts.push({
      username: 'test' + i + '@gmail.com',
      displayName: 'Test user ' + i,
      password: 'test'
    })
  }

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
    url: 'youtube.com',
  })
  const websites = []
  for (let i = 0; i < 40; i++) {
    websites.push(new Website({ url: 'test' + i + '.com' }))
    await websites[websites.length - 1].save()
  }
  await website.save()

  // Afer that, create all root comments

  let longText = 'Random line of text\n'
  for (let i = 0; i < 5; i++) {
    longText = longText.concat(longText)
  }

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
    },
    {
      userId: accounts[2]._id,
      websiteId: website._id,
      text: longText
    }
  ]
  for (let i = 0; i < 45; i++) {
    rootComments.push({
      userId: accounts[0]._id,
      websiteId: website._id,
      text: 'Random text ' + i,
      createdAt: Date.now() - Math.floor(i / 45 * 3600 * 20 * 1000),
    })
  }

  const replyComments = [
    {
      userId: accounts[1]._id,
      websiteId: website._id,
      parentIndex: 1,
      text: 'Yeah, I like it.',
    }
  ]
  replyComments.push({
    userId: accounts[1]._id,
    websiteId: website._id,
    parentIndex: 2,
    text: longText
  })
  for (let i = 0; i < 20; i++) {
    replyComments.push({
      userId: accounts[1]._id,
      websiteId: website._id,
      parentIndex: 2,
      text: 'Test reply ' + i,
    })
  }

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


  for (let i = 0; i < accounts.length; i++) {
    for (let j = 0; j < 10; j++) {
      new Vote({
        userId: accounts[i]._id,
        objectId: rootComments[j]._id,
        like: i / 10 < 0.7
      }).save()
    }
  }

  await new Promise((resolve, reject) => {
    let count = 0
    replyComments.forEach((el, index) => {
      el.parentId = rootComments[el.parentIndex]._id
      new Comment(el).save((err, comment) => {
        if (err) throw err
        replyComments[index] = comment
        if (++count === replyComments.length) resolve()
      })
    })
  })

  const text = 'Test comment blah blah blah blah blah blah blahs\n blah blah blah blah blah '
  let comment = {
    userId: accounts[1]._id,
    websiteId: website._id,
    parentId: replyComments[0]._id,
  }
  for (let i = 0; i < 10; i++) {
    comment.text = text + i
    comment.parentId = await new Promise((resolve, reject) => new Comment(comment).save((err, comm) => {
      if (err) throw err
      resolve(comm._id)
    }))
  }
  comment.parentId = replyComments[1]._id
  for (let i = 0; i < 10; i++) {
    comment.text = (text + 1) + i
    comment.parentId = await new Promise((resolve, reject) => new Comment(comment).save((err, comm) => {
      if (err) throw err
      resolve(comm._id)
    }))
  }
}
initDb()

startDb().then(db => {
  config.db = db.config
  require('./www')

  process.on('exit', () => {
    db.mongod.stop()
  })
})
