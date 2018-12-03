import logger, { debug, logErr } from '../debug'
const log = logger.log // logging function

const express = require('express')
const passport = require('passport')
const Account = require('../models/account')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')

router.post('/register', [
  check('username').isEmail(),
], function(req, res) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // we want to share these errors to the client
    debug(errors.array())
    return res.status(422).json({ errors: errors.array() })
  }

  Account.register(new Account({ username: req.body.username }), req.body.password, function(err, account) {
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
