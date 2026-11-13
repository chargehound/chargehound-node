/* eslint-env mocha */
const Chargehound = require('../lib')
const chai = require('chai')
const https = require('https')
const selfsigned = require('selfsigned')

const expect = chai.expect

// Exercises real TLS sockets (no nock) so socket connect and keep-alive reuse behave as in production.
describe('transport', function () {
  const pems = selfsigned.generate([{ name: 'commonName', value: 'localhost' }], {
    days: 1,
    keySize: 2048,
    algorithm: 'sha256',
    extensions: [{ name: 'subjectAltName', altNames: [{ type: 2, value: 'localhost' }] }]
  })
  const savedCa = https.globalAgent.options.ca
  const savedKeepAlive = https.globalAgent.keepAlive
  let server
  let chargehound
  let connections
  let requests

  before(function (done) {
    https.globalAgent.options.ca = pems.cert
    https.globalAgent.keepAlive = true
    server = https.createServer({ key: pems.private, cert: pems.cert }, (req, res) => {
      let body = ''
      req.on('data', (chunk) => { body += chunk })
      req.on('end', () => {
        requests.push({ method: req.method, url: req.url, body })
        res.setHeader('content-type', 'application/json')
        res.end(JSON.stringify({ id: 'dp_123' }))
      })
    })
    server.keepAliveTimeout = 30000
    server.on('connection', () => { connections++ })
    server.listen(0, 'localhost', () => {
      chargehound = new Chargehound('API_KEY', { host: 'localhost', port: server.address().port, timeout: 1000 })
      done()
    })
  })

  beforeEach(function () {
    https.globalAgent.destroy()
    connections = 0
    requests = []
  })

  after(function (done) {
    https.globalAgent.destroy()
    https.globalAgent.options.ca = savedCa
    https.globalAgent.keepAlive = savedKeepAlive
    server.close(done)
  })

  it('sends a POST body exactly once on a new connection', function () {
    return chargehound.Disputes.submit('dp_123', { fields: { a: 1 } }).then((res) => {
      expect(res.id).to.eql('dp_123')
      expect(connections).to.eql(1)
      expect(requests).to.eql([{ method: 'POST', url: '/v1/disputes/dp_123/submit', body: '{"fields":{"a":1}}' }])
    })
  })

  it('sends a POST on a reused keep-alive connection', function () {
    return chargehound.Disputes.retrieve('dp_123')
      .then(() => chargehound.Disputes.submit('dp_123', { fields: { a: 1 } }))
      .then((res) => {
        expect(res.id).to.eql('dp_123')
        expect(connections).to.eql(1)
        expect(requests.map((r) => r.method + ' ' + r.url + ' ' + r.body)).to.eql([
          'GET /v1/disputes/dp_123 ',
          'POST /v1/disputes/dp_123/submit {"fields":{"a":1}}'
        ])
      })
  })
})
