'use strict'

const errorTypes = require('./error').types
const merge = require('lodash.merge')
const resources = require('./resources')

const CHARGEHOUND_PROTOCOL = 'https://'
const CHARGEHOUND_HOST = 'api.chargehound.com'
const CHARGEHOUND_BASE_PATH = '/v1/'
const CHARGEHOUND_TIMEOUT = 60 * 1000

function Chargehound (apiKey, options) {
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
    basePath: CHARGEHOUND_BASE_PATH,
    timeout: CHARGEHOUND_TIMEOUT
  }

  if (options && typeof options === 'object') {
    this.options = merge({}, this.options, options)
  }

  if (!this.options.apiKey) {
    throw new errorTypes.ChargehoundNoAuthError('Please set an API key')
  }

  // create host
  this.options.baseUrl = CHARGEHOUND_PROTOCOL + this.options.host + this.options.basePath

  // initialize resources
  for (const name in resources) {
    this[name] = new resources[name](this)
  }
}

// make error types public
Chargehound.error = errorTypes

module.exports = Chargehound
