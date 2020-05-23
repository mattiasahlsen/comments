import log, { debug, logErr } from './debug'

const express = require('express')
const passport = require('passport')
const Account = require('./models/account')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')

for (let i = 0; i < 20; i++) {
    Account.register(new Account({
      username: 'simulated.user' + i + '@gmail.com',
      displayName: 'Simulated User ' + i
    }), 'password', function(err, account) {
      if (err) logErr(err)
    })
}
