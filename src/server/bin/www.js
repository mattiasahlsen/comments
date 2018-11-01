import config from '../config'
import { debug, debugErr } from '../debug'
import app from '../app'

const http = require('http')

app.set('port', config.port)
const server = http.createServer(app)

server.listen(config.port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + config.port
    : 'Port ' + config.port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      debugErr(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      debugErr(bind + ' is already in use')
      config.port++
      server.listen(config.port)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('HTTP server listening on ' + bind)
}
