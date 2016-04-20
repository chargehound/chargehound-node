/* eslint-env mocha */
const Chargehound = require('../lib')
const expect = require('chai').expect

describe('chargehound', function () {
  it('can be created from a function', function () {
    const chargehound = require('../lib')('API_KEY')
    expect(chargehound.options.apiKey).to.eql('API_KEY')
  })

  it('allows specifying an api key', function () {
    const chargehound = new Chargehound('API_KEY')
    expect(chargehound.options.apiKey).to.eql('API_KEY')
  })

  it('allows the use of promises and callbacks', function () {
    const chargehound = new Chargehound('API_KEY')
    expect(chargehound.Disputes.list().then).to.be.instanceof(Function)
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
