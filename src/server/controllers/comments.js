import log, { debug, logErr } from '../debug'
import conf from '../../config'
import Vote from '../models/vote'
import { normalizeUrl, isValid } from '../../lib'

const Website = require('../models/website')
const Comment = require('../models/comment')

const express = require('express')
const router = express.Router()

// All these routes must belong to a url (Website)
router.use('/comments/:url/*', (req, res, next) => {
  Website.findOne({ url: req.params.url }, (err, website) => {
    if (err || !website) {
      if (err) {
        logErr(err)
        return res.status(500).end()
      }
      return res.status(404).end()
    }

    req.website = website
    next()
  })
})
router.use('/comment/:id/*', (req, res, next) => {
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

router.get(['/comments/:url/:sort/:parentId/:offset?'], (req, res) => {
  const website = req.website
  const offset = parseInt(req.params.offset) || 0

  const parentId = req.params.parentId === 'undefined' ? undefined : req.params.parentId
  let sort
  if (req.params.sort === 'new') sort = { createdAt: -1 }
  else sort = { score: -1 }

  Comment.find({
    websiteId: website._id,
    parentId,
  }, null, {
    limit: req.params.parentId ? conf.childrenLimit : conf.commentsLimit,
    skip: offset,
    sort
  }, (err, comments) => {
    if (err) {
      logErr(err)
      return res.status(500).end()
    }
    if (comments.length === 0) {
      if (offset === 0) log('Website without comments.')
      return res.json({ comments: [] })
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
    comment.toObj(req.user && req.user._id).then(commentObj => res.json(commentObj))
  ).catch(err => {
    logErr(err)
    res.status(500).end()
  })
})

router.post('/comment/:id/like', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).end()

  Vote.like(req.user._id, req.params.id, (err, vote) => {
    if (err) res.status(500).end()
    else {
      let scoreChange
      if (vote) {
        // if this user already had voted on this comment
        if (vote.like) scoreChange = 0
        else scoreChange = 2
      } else scoreChange = 1
      Comment.findOneAndUpdate({ _id: req.params.id },
        { $inc: { score: scoreChange } }, (err, comment) => {
          if (err) {
            logErr(err)
            return res.status(500).end()
          }
          res.json({ scoreChange })
        })
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

router.get('/websites', (req, res) => {
  Website.find({}, null, { limit: 20, sort: { createdAt: -1 } }, (err, docs) => {
    if (err) return res.status(500).end()
    return res.json({ websites: docs })
  })
})

router.post('/website/:url', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).end()
  if (!isValid(req.params.url)) return res.status(422).end()

  new Website({ url: normalizeUrl(req.params.url) }).save().then(website => {
    return res.json(website)
  }).catch(err => {
    console.log(err)
    if (err.code === 11000) res.status(409).end()
    else res.status(500).end()
  })
})

module.exports = router
