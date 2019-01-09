const path = require('path')
const newDebug = require('debug')
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, simple } = format

const logdir = path.join(__dirname, '../../logs')

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    simple()
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({ filename: path.join(logdir, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logdir, 'combined.log') })
  ]
})

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple()
  }))
}

logger.log = logger.log.bind(logger, 'info')
export default logger

const logErr = (err) => {
  logger.log({
    level: 'error',
    message: err.message,
    error: err
  })
}
const debug = newDebug('app:log')
debug.log = console.log.bind(console)
const debugErr = newDebug('app:error')
const debugTest = newDebug('test')

export { logErr, debug, debugErr, debugTest }
