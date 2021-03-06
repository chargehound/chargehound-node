'use strict'

const ExtendableError = require('es6-error')

class ChargehoundError extends ExtendableError {
  constructor (errResponse) {
    super(errResponse.message)
    this.status = errResponse.status
    this.type = errResponse.type
  }
}

class ChargehoundNoAuthError extends ChargehoundError {}

class ChargehoundAuthenticationError extends ChargehoundError {}

class ChargehoundBadRequestError extends ChargehoundError {}

class ChargehoundTimeout extends ChargehoundError {}

function createChargehoundError (errResponse) {
  switch (errResponse.status) {
    case 401:
      return new ChargehoundAuthenticationError(errResponse)
    case 403:
      return new ChargehoundAuthenticationError(errResponse)
    case 400:
      return new ChargehoundBadRequestError(errResponse)
    default:
      return new ChargehoundError(errResponse)
  }
}

module.exports = {
  types: {
    ChargehoundError,
    ChargehoundNoAuthError,
    ChargehoundTimeout,
    ChargehoundAuthenticationError,
    ChargehoundBadRequestError
  },
  createChargehoundError
}
