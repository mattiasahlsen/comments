import Vote from '../models/vote'

import log, { debug, logErr } from '../debug'
import conf from '../../config'
import { normalizeUrl, isValid } from '../../lib'

const Website = require('../models/website')

const express = require('express')
const router = express.Router()

router.get('/websites/:offset', (req, res) => {
  Website.find({}, null, {
    limit: conf.websitesLimit,
    sort: { createdAt: -1 },
    skip: parseInt(req.params.offset) || 0,
  })
    .then(websites => Promise.all(websites.map(website => website.toObj(req.user && req.user._id)))
      .then(websites => res.json({ websites })))
    .catch(err => {
      logErr(err)
      res.status(500).end()
    })
})

router.post('/website/:url', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).end()
  if (!isValid(req.params.url)) return res.status(422).end()

  new Website({ url: normalizeUrl(req.params.url) }).save().then(website => {
    return res.json(website)
  }).catch(err => {
    logErr(err)
    if (err.code === 11000) res.status(409).end()
    else res.status(500).end()
  })
})
router.post('/website/:id/like', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).end()

  Vote.like(req.user._id, req.params.id, (err, vote) => {
    if (err) res.status(500).end()
    else {
      res.end()
    }
  })
})
router.post('/website/:id/dislike', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).end()

  Vote.dislike(req.user._id, req.params.id, (err, vote) => {
    if (err) res.status(500).end()
    else {
      res.end()
    }
  })
})
router.post('/website/:id/undovote', (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).end()
  Vote.deleteOne({ userId: req.user._id, objectId: req.params.id }, err => {
    if (err) res.status(500).end()
    else res.end()
  })
})

module.exports = router
