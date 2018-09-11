'use strict'

const ChargehoundTimeout = require('./error').types.ChargehoundTimeout
const clientVersion = require('../package.json').version
const createChargehoundError = require('./error').createChargehoundError
const http = require('http')
const https = require('https')
const querystring = require('querystring')
const url = require('url')

const CHARGEHOUND_USERAGENT = 'Chargehound/v1 NodeBindings/' + clientVersion

module.exports = class ApiRequestor {
  constructor (chargehound) {
    this._chargehound = chargehound
  }

  getCallback (args) {
    const argsArr = [].slice.call(args)
    return typeof argsArr[argsArr.length - 1] === 'function' && argsArr.pop()
  }

  getUrl (path, query) {
    let _query = querystring.stringify(query)
    if (_query) {
      _query = '?' + _query
    }
    return this._chargehound.options.baseUrl + path + _query
  }

  getApiKey () {
    return this._chargehound.options.apiKey
  }

  getHeaders (hasBody) {
    const headers = {
      'user-agent': CHARGEHOUND_USERAGENT,
      'accept': 'application/json'
    }
    if (this._chargehound.options.version) {
      headers['chargehound-version'] = this._chargehound.options.version
    }
    if (hasBody) {
      headers['content-type'] = 'application/json'
    }
    return headers
  }

  getTimeout () {
    return this._chargehound.options.timeout
  }

  request (spec, callback) {
    return new Promise((resolve, reject) => {
      const requestUrl = url.parse(this.getUrl(spec.path, spec.query))

      let req
      let connectEv
      const reqOpts = {
        hostname: requestUrl.hostname,
        path: requestUrl.path,
        method: spec.method.toUpperCase(),
        headers: this.getHeaders(!!spec.data),
        auth: `${this.getApiKey()}:`
      }

      if (this._chargehound.options.port) {
        reqOpts.port = this._chargehound.options.port
      }

      if (this._chargehound.options.protocol === 'https://') {
        req = https.request(reqOpts)
        connectEv = 'secureConnect'
      } else {
        req = http.request(reqOpts)
        connectEv = 'connect'
      }

      req.setTimeout(this.getTimeout(), function () {
        if (callback) {
          callback(new ChargehoundTimeout('Request timed out'))
        }
        reject(new ChargehoundTimeout('Request timed out'))
      })

      req.on('socket', function (socket) {
        socket.on(connectEv, function () {
          if (spec.data) {
            req.write(JSON.stringify(spec.data))
          }
          req.end()
        })
      })

      req.on('response', function (res) {
        let response = ''

        res.setEncoding('utf8')
        res.on('data', function (chunk) {
          response += chunk
        })
        res.on('end', function () {
          const body = JSON.parse(response)
          // Set the status code for readng it later
          body.response = {
            status: res.statusCode
          }

          let chargehoundError = null
          if (body.error) {
            chargehoundError = createChargehoundError(body.error)
          }
          if (callback) {
            callback(chargehoundError, body)
          }
          if (chargehoundError) {
            reject(chargehoundError)
          } else {
            resolve(body)
          }
        })
      })

      req.on('error', function (err) {
        if (callback) {
          callback(err)
        }
        reject(err)
      })
    })
  }
}
