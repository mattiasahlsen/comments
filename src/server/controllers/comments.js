import urlencode from 'urlencode'
import logger, { debug, logErr } from '../debug'
const log = logger.log // logging function

const Website = require('../models/website')
const Comment = require('../models/comment')
const Account = require('../models/account')

const express = require('express')

const router = express.Router()

// All these routes must belong to a url (Website)
router.use('/comments/:url*', (req, res, next) => {
  Website.findOne({ url: urlencode.decode(req.params.url) }, (err, website) => {
    if (err || !website) {
      if (err) logErr(err)
      // TODO: create new website or redirect to domain-wide?
      return res.status(404).end()
    }

    req.website = website
    next()
  })
})

router.get('/comments/:url', (req, res) => {
  const website = req.website
  Comment.find({ websiteId: website._id }, (err, comments) => {
    if (err || comments.length === 0) {
      if (err) logErr(err)
      else logErr(new Error('Website without comments.'))
      return res.status(500).end()
    }

    const users = []
    let count = 0
    for (let i = 0; i < comments.length; i++) {
      comments[i] = comments[i].toObject()
      const user = users.find(el => el._id.equals(comments[i].userId))
      if (!user) {
        Account.findById(comments[i].userId, (err, user) => {
          if (err) {
            logErr(err)
            return res.status(500).end()
          }
          users.push(user)
          comments[i].displayName = user.displayName
          if (++count === comments.length) {
            return res.json({ comments })
          }
        })
      } else {
        comments[i].displayName = user.displayName
        if (++count === comments.length) {
          return res.json({ comments })
        }
      }
    }
  })
})

router.post('/comments/:url/submit', (req, res) => {
  if (!req.isAuthenticated()) return res.status(404).end()
  const website = req.website

  const comment = new Comment({
    userId: req.user._id,
    websiteId: website.id,
    parentId: req.body.comment.parentId,
    text: req.body.comment.text,
  })
  comment.save().then(comment => res.json(comment)).catch(err => {
    logErr(err)
    res.status(500).end()
  })
})

module.exports = router
