'use strict'

const BBPromise = require('bluebird')
const clientVersion = require('../package.json').version
const createChargehoundError = require('./error').createChargehoundError
const request = require('request')

const CHARGEHOUND_USERAGENT = 'Chargehound/v1 NodeBindings/' + clientVersion

module.exports = class ApiRequestor {
  constructor (chargehound) {
    this._chargehound = chargehound
  }

  getCallback (args) {
    const argsArr = [].slice.call(args)
    return typeof argsArr[argsArr.length - 1] === 'function' && argsArr.pop()
  }

  getUrl (path) {
    return this._chargehound.options.baseUrl + path
  }

  getApiKey () {
    return this._chargehound.options.apiKey
  }

  getHeaders () {
    return { 'user-agent': CHARGEHOUND_USERAGENT }
  }

  request (spec, callback) {
    return new BBPromise((resolve, reject) => {
      const options = {
        auth: {
          user: this.getApiKey()
        },
        method: spec.method,
        url: this.getUrl(spec.path),
        headers: this.getHeaders(),
        json: true,
        timeout: 5000
      }

      if (spec.data) {
        options.body = spec.data
      }

      if (spec.query) {
        options.qs = spec.query
      }

      request(options, function (err, response, body) {
        let chargehoundError = err
        if (body && body.error) {
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
  }
}
