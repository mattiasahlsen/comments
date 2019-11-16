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
router.get('/comment/:id', (req, res, next) => {
  Comment.findById(req.params.id).then(comment => {
    if (!comment) return res.status(404).end()
    comment.toObj(req.user && req.user._id).then(comment => res.json(comment))
      .catch(err => {
        logErr(err)
        res.status(500).end()
      })
  }).catch(err => {
    logErr(err)
    return res.status(500).end()
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
    limit: parentId ? conf.childrenLimit : conf.commentsLimit,
    skip: offset,
    sort
  })
    .then(comments => Promise.all(comments.map(comment => comment.toObj(req.user && req.user._id)))
      .then(comments => res.json({ comments })))
    .catch(err => {
      logErr(err)
      res.status(500).end()
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
    if (err) {
      logErr(err)
      res.status(500).end()
    }
    else {
      res.end()
    }
  })
})
router.post('/comment/:id/dislike', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).end()

  Vote.dislike(req.user._id, req.params.id, (err, vote) => {
    if (err) {
      logErr(err)
      res.status(500).end()
    } else {
      res.end()
    }
  })
})
router.post('/comment/:id/undovote', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).end()
  Vote.deleteOne({ userId: req.user._id, objectId: req.params.id }, err => {
    if (err) res.status(500).end()
    else res.end()
  })
})

module.exports = router
