import config from './config'
import logger, { logErr, debug, debugErr } from './debug'

const log = logger.log
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const loggerMiddleware = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const authController = require('./controllers/auth')

const app = express()

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(loggerMiddleware('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(function(req, res, next) {
  if (req.get('origin').includes('localhost')) {
    res.header('Access-Control-Allow-Origin', req.get('origin'))
  } else res.header('Access-Control-Allow-Origin', config.serverUrl)
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})
app.use(require('express-session')({
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: config.sessionMaxAge,
  }
}))
debug(config.sessionMaxAge)
app.use(passport.initialize())
app.use(passport.session())

// passport config
const Account = require('./models/account')
const passportLocalMongoStrategy = Account.authenticate()
passport.use(new LocalStrategy((username, password, done) => {
  // prevent mongo injection
  if (typeof username !== 'string' || typeof password !== 'string') {
    return done(new Error('Username or password is not a string.'))
  }

  // need to modify passportLocalMongoStrategy to remove password hash and salt
  // from user object
  passportLocalMongoStrategy(username, password, (err, user) => {
    if (user) {
      user.hash = user.salt = undefined
    }
    done(err, user)
  })
}))
passport.serializeUser((user, done) => {
  done(null, user._id)
})
passport.deserializeUser((id, done) => {
  Account.findById(id, '-hash -salt', (err, user) => {
    if (err) {
      debugErr(err)
      done(err)
    } else done(null, user)
  })
})

// mongoose
mongoose.connect(config.db.uri, { useNewUrlParser: true })

// routes
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api', authController)
app.get('/api/ping', function(req, res) {
  res.status(200).send('pong!')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    logErr(err)
    res.status(err.status || 500).json(err)
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  logErr(err)
  res.status(err.status || 500).end()
})

export default app
