import config from './config'
import log, { logErr, debug, debugErr } from './debug'

const fs = require('fs')
const express = require('express')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const authController = require('./controllers/auth')
const commentsController = require('./controllers/comments')

const app = express()

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'))

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
else {
  // create a write stream (in append mode)
  var accessLogStream = fs.createWriteStream(
    path.join(__dirname, '../../logs/combined.log'), { flags: 'a' }
  )
  // setup the logger
  app.use(morgan('combined', { stream: accessLogStream }))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(function(req, res, next) {
  const origin = req.get('origin')
  if (origin && origin.includes('localhost')) {
    res.header('Access-Control-Allow-Origin', req.get('origin'))
  } else {
    res.header('Access-Control-Allow-Origin', config.serverUrl)
  }
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

// mongoose
mongoose.connect(config.db.uri, config.dbOptions)
app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: config.sessionMaxAge, // expiration time
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))
debug('Max session age: ' + config.sessionMaxAge + 'ms')
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

// routes
app.use(express.static(path.join(__dirname, '../../dist')))
app.use('/api', authController)
app.use('/api', commentsController)

app.get('/api/ping', function(req, res) {
  res.status(200).send('pong!')
})

// treat 404 as index.html
app.use(function(req, res, next) {
  res.redirect('/')
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
