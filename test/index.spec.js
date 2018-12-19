/* eslint-env mocha */
const Chargehound = require('../lib')
const chai = require('chai')
const nock = require('nock')

const expect = chai.expect
const should = chai.should()

describe('chargehound', function () {
  it('can be created from a function', function () {
    const chargehound = require('../lib')('API_KEY')
    expect(chargehound.options.apiKey).to.eql('API_KEY')
  })

  it('exposes the Chargehound error types', function () {
    should.exist(Chargehound.error.ChargehoundError)
    should.exist(Chargehound.error.ChargehoundNoAuthError)
    should.exist(Chargehound.error.ChargehoundAuthenticationError)
    should.exist(Chargehound.error.ChargehoundBadRequestError)
  })

  it('allows specifying an api key', function () {
    const chargehound = new Chargehound('API_KEY')
    expect(chargehound.options.apiKey).to.eql('API_KEY')
  })

  it('throws an error if no API is specified', function () {
    expect(Chargehound).to.throw(Chargehound.error.ChargehoundNoAuthError)
  })

  it('allows the use of promises', function () {
    const scope = nock('https://api.chargehound.com')
      .get('/v1/disputes')
      .reply(200, {'data': [{'id': 'dp_123'}]})

    const chargehound = new Chargehound('API_KEY')
    return chargehound.Disputes.list().then((res) => {
      expect(res).to.eql({'data': [{'id': 'dp_123'}], 'response': { 'status': 200 }})
      scope.done()
    })
  })

  it('allows the use of callbacks', function (done) {
    const scope = nock('https://api.chargehound.com')
      .get('/v1/disputes')
      .reply(200, {'data': [{'id': 'dp_123'}]})

    const chargehound = new Chargehound('API_KEY')
    chargehound.Disputes.list((err, res) => {
      if (err) {
        done(err)
        return
      }
      expect(res).to.eql({'data': [{'id': 'dp_123'}], 'response': { 'status': 200 }})
      scope.done()
      done()
    })
  })

  it('allows overriding version', function (done) {
    const version = '1999-01-01'
    const scope = nock('https://api.chargehound.com',
      { reqheaders: { 'chargehound-version': version } })
      .get('/v1/disputes')
      .reply(200, {'data': [{'id': 'dp_123'}]})

    const options = { version: version }
    const chargehound = new Chargehound('API_KEY', options)
    chargehound.Disputes.list((err, res) => {
      if (err) {
        done(err)
        return
      }
      expect(res).to.eql({'data': [{'id': 'dp_123'}], 'response': { 'status': 200 }})
      scope.done()
      done()
    })
  })

  it('allows overriding host', function () {
    const options = { host: 'test' }
    const chargehound = new Chargehound('API_KEY', options)

    expect(chargehound.options.baseUrl).to.eql('https://test/v1/')
  })

  it('allows options object as first argument', function () {
    const options = { apiKey: 'API_KEY', host: 'test' }
    const chargehound = new Chargehound(options)

    expect(chargehound.options.apiKey).to.eql('API_KEY')
    expect(chargehound.options.baseUrl).to.eql('https://test/v1/')
  })
})
