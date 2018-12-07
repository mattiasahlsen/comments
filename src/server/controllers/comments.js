import logger, { debug, logErr } from '../debug'

import Vote from '../models/vote'

const log = logger.log // logging function

const Website = require('../models/website')
const Comment = require('../models/comment')
const Account = require('../models/account')

const express = require('express')

const router = express.Router()

// All these routes must belong to a url (Website)
router.use('/comments/:url*', (req, res, next) => {
  Website.findOne({ url: req.params.url }, (err, website) => {
    if (err || !website) {
      if (err) {
        logErr(err)
        return res.status(500).end()
      }
      // TODO: create new website or redirect to domain-wide?
      return res.status(404).end()
    }

    req.website = website
    next()
  })
})
router.use('/comment/:id*', (req, res, next) => {
  Comment.findById(req.params.id, (err, comment) => {
    if (err || !comment) {
      if (err) {
        logErr(err)
        return res.status(500).end()
      }
      debug('Didn\'t find comment.')
      return res.status(404).end()
    }
    req.comment = comment
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

    let count = 0
    for (let i = 0; i < comments.length; i++) {
      comments[i].toObj(req.user && req.user._id).then(comment => {
        comments[i] = comment

        if (++count === comments.length) {
          return res.json({ comments })
        }
      }).catch(err => {
        logErr(err)
        return res.status(500).end()
      })
    }
  })
})

router.post('/comments/:url/submit', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).end()
  const website = req.website

  const comment = new Comment({
    userId: req.user._id,
    websiteId: website.id,
    parentId: req.body.comment.parentId,
    text: req.body.comment.text,
  })
  comment.save().then(comment =>
    comment.toObj(req.user && req.user._id).then(commentObj => res.json(commentObj))).catch(err => {
    logErr(err)
    res.status(500).end()
  })
})

router.post('/comment/:id/like', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).end()

  Vote.like(req.user._id, req.params.id, (err, vote) => {
    if (err) res.status(500).end()
    else {
      if (vote) {
        if (vote.like) res.json({ scoreChange: 0 })
        else res.json({ scoreChange: 2 })
      } else res.json({ scoreChange: 1 })
    }
  })
})
router.post('/comment/:id/dislike', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).end()

  Vote.dislike(req.user._id, req.params.id, (err, vote) => {
    if (err) res.status(500).end()
    else {
      res.end()
    }
  })
})
router.post('/comment/:id/undovote', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).end()
  Vote.deleteOne({ userId: req.user._id, commentId: req.params.id }, err => {
    if (err) res.status(500).end()
    else res.end()
  })
})

module.exports = router
