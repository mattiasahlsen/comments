import config from './config'
import logger, { logErr } from './debug'

const log = logger.log
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const loggerMiddleware = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const authControllers = require('./controllers/auth')

const app = express()

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(loggerMiddleware('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('express-session')({
  secret: config.secret,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', authControllers)

// passport config
const Account = require('./models/account')
passport.use(new LocalStrategy(Account.authenticate()))
passport.serializeUser(Account.serializeUser())
passport.deserializeUser(Account.deserializeUser())

// mongoose
mongoose.connect(config.db.uri, { useNewUrlParser: true })

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
