import config from '../config'
import { debug, debugErr } from '../debug'
import app from '../app'


app.set('port', config.port)

// returns an instance of node-greenlock with additional helper methods
const lex = require('greenlock-express').create({
  // set to https://acme-v01.api.letsencrypt.org/directory in production
  version: 'draft-11'
  ,'server': 'https://acme-v02.api.letsencrypt.org/directory'

// If you wish to replace the default plugins, you may do so here
//
, challenges: { 'http-01': require('le-challenge-fs').create({ webrootPath: '/tmp/acme-challenges' }) }
, store: require('le-store-certbot').create({ webrootPath: '/tmp/acme-challenges' })

// You probably wouldn't need to replace the default sni handler
// See https://git.daplie.com/Daplie/le-sni-auto if you think you do
//, sni: require('le-sni-auto').create({})

  ,agreeTos: true
, email: 'mattias.ahlsen@gmail.com'
, approveDomains: ['urlexp.com', 'www.urlexp.com']
})

function approveDomains(opts, certs, cb) {
console.log('Approvingt domain')
  // This is where you check your database and associated
  // email addresses with domains and agreements and such


  // The domains being approved for the first time are listed in opts.domains
  // Certs being renewed are listed in certs.altnames
  if (certs) {
    console.log(certs)
    opts.domains = [certs.subject].concat(certs.altnames);
  }
  else {
    opts.email = 'mattias.ahlsen@gmail.com';
    opts.agreeTos = true;
  }

  // NOTE: you can also change other options such as `challengeType` and `challenge`
  // opts.challengeType = 'http-01';
  // opts.challenge = require('le-challenge-fs').create({});

  cb(null, { options: opts, certs: certs });
}
// handles acme-challenge and redirects to https
require('http').createServer(lex.middleware(require('redirect-https')())).listen(80, function () {
  console.log('Listening for ACME http-01 challenges on', this.address());
});


// handles your app
require('https').createServer(lex.httpsOptions, lex.middleware(app)).listen(443, function () {
  console.log('Listening for ACME tls-sni-01 challenges and serve app on', this.address());
});

/**
 * Event listener for HTTP server 'error' event.
 */

function onError(error) {
  debugErr(error)
  if (error.syscall !== 'listen') {
    throw error
  }

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES': throw new Error(config.port + ' requires elevated privileges')
    case 'EADDRINUSE': throw new Error(config.port + ' is already in use')
    default: throw error
  }
}

/**
 * Event listener for HTTP server 'listening' event.
 */
function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('HTTP server listening on ' + bind)
}
