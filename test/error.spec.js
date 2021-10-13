/* eslint-env mocha */
const Chargehound = require('../lib')
const expect = require('chai').expect
const nock = require('nock')

describe('errors', function () {
  afterEach(function () {
    nock.cleanAll()
  })

  it('should propagate request errors', function (done) {
    const chargehound = new Chargehound('API_KEY')
    const scope = nock('https://api.chargehound.com')
      .get('/v1/disputes')
      .reply(500, { error: { status: 500, message: 'Unexpected error' } })

    chargehound.Disputes.list()
      .catch(function (err) {
        expect(err.status).to.eql(500)
        scope.done()
        done()
      })
  })

  it('should return typed chargehound errors from the API', function (done) {
    const chargehound = new Chargehound('API_KEY')
    const scope = nock('https://api.chargehound.com')
      .get('/v1/disputes/dp_123')
      .reply(400, { error: { status: 400, message: 'Bad request', type: 'invalid_request' } })

    chargehound.Disputes.retrieve('dp_123')
      .catch(function (err) {
        expect(err.name).to.eql('ChargehoundBadRequestError')
        expect(err.status).to.eql(400)
        expect(err.message).to.eql('Bad request')
        expect(err.type).to.eql('invalid_request')
        scope.done()
        done()
      })
  })

  it('should throw a timeout error', function (done) {
    const chargehound = new Chargehound('API_KEY', { timeout: 1 })
    const scope = nock('https://api.chargehound.com')
      .get('/v1/disputes')
      .socketDelay(1000)
      .reply(400, { error: { status: 400, message: 'Bad request' } })

    chargehound.Disputes.list()
      .catch(function (err) {
        expect(err.name).to.eql('ChargehoundTimeout')
        scope.done()
        done()
      })
  })
})
