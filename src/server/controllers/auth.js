import logger, { debug, logErr } from '../debug'
const log = logger.log // logging function

const express = require('express')
const passport = require('passport')
const Account = require('../models/account')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')

// Dev env
if (process.env.NODE_ENV === 'development') {
  router.get('/user', (req, res, next) => {
    if (req.isAuthenticated()) return next()
    req.body.username = 'test@gmail.com'
    req.body.password = 'test'
    passport.authenticate('local')(req, res, next)
  })
}

router.post('/register', [
  check('username').isEmail(),
], function(req, res) {
  if (!req.body.username || !req.body.displayName || !req.body.password) {
    debug('Missing field in register request.')
    return res.status(400).end()
  }

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // we want to share these errors to the client
    debug(errors.array())
    return res.status(422).json({ errors: errors.array() })
  }

  if (typeof req.body.username !== 'string' || typeof req.body.password !== 'string') {
    return res.status(422).end()
  }

  Account.register(new Account({
    username: req.body.username,
    displayName: req.body.displayName
  }), req.body.password, function(err, account) {
    if (err) {
      // we don't want to share these errors to the client,
      // we just want to prevent them in the first place
      logErr(err)
      return res.status(500).end()
    }

    passport.authenticate('local')(req, res, () => {
      res.status(200).json({ user: req.user })
    })
  })
})

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.status(200).json({ user: req.user })
})

router.post('/logout', function(req, res) {
  req.logout()
  res.status(200).end()
})

router.get('/authed', (req, res) => {
  if (req.isAuthenticated()) res.status(200).end()
  else res.status(401).end()
})

router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user)
  } else {
    passport.authenticate('local')(req, res, () => {
      res.status(200).json(req.user)
    })
  }
})

module.exports = router
