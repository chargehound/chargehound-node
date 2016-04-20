'use strict'

const merge = require('lodash.merge')
const resources = require('./resources')
const ChargehoundNoAuthError = require('./error').ChargehoundNoAuthError

const CHARGEHOUND_PROTOCOL = 'https://'
const CHARGEHOUND_HOST = 'api.chargehound.com'
const CHARGEHOUND_BASE_PATH = '/v1/'

module.exports = function Chargehound (apiKey, options) {
  if (!(this instanceof Chargehound)) {
    return new Chargehound(apiKey, options)
  }

  if (apiKey && typeof apiKey === 'object') {
    options = apiKey
    apiKey = null
  }

  this.options = {
    apiKey,
    host: CHARGEHOUND_HOST,
    basePath: CHARGEHOUND_BASE_PATH
  }

  if (options && typeof options === 'object') {
    this.options = merge({}, this.options, options)
  }

  if (!this.options.apiKey) {
    throw new ChargehoundNoAuthError('Please set an API key')
  }

  // create host
  this.options.baseUrl = CHARGEHOUND_PROTOCOL + this.options.host + this.options.basePath

  // initialize resources
  for (const name in resources) {
    this[name] = new resources[name](this)
  }
}
