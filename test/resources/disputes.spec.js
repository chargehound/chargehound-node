/* eslint-env mocha */

const Chargehound = require('../../lib')
const nock = require('nock')

const chargehound = new Chargehound('API_KEY')

const getHeaders = {
  'accept': 'application/json',
  'authorization': 'Basic QVBJX0tFWTo=',
  'host': 'api.chargehound.com',
  'user-agent': 'Chargehound/v1 NodeBindings/1.0.0'
}

const postHeaders = {
  'accept': 'application/json',
  'authorization': 'Basic QVBJX0tFWTo=',
  'content-type': 'application/json',
  'host': 'api.chargehound.com',
  'user-agent': 'Chargehound/v1 NodeBindings/1.0.0'
}

describe('dispute', function () {
  afterEach(function () {
    nock.restore()
  })

  describe('retrieve', function () {
    it('Sends the correct request', function (done) {
      const scope = nock('https://api.chargehound.com', { reqheaders: getHeaders })
        .get('/v1/disputes/dp_123')
        .reply(200, {'id': 'dp_123'})
      chargehound.Disputes.retrieve('dp_123').then(function (body) {
        scope.done()
        done()
      })
    })
  })

  describe('list', function (done) {
    it('Sends the correct request', function () {
      const scope = nock('https://api.chargehound.com', { reqheaders: getHeaders })
        .get('/v1/disputes')
        .reply(200, {'data': [{'id': 'dp_123'}]})
      chargehound.Disputes.list().then(function (body) {
        scope.done()
        done()
      })
    })
  })

  describe('submit', function (done) {
    it('Sends the correct request', function () {
      const scope = nock('https://api.chargehound.com', { reqheaders: postHeaders })
        .post('/v1/disputes/dp_123/submit', {fields: {customer_name: 'Susie'}})
        .reply(201, {'id': 'dp_123'})
      chargehound.Disputes.submit('dp_123', {fields: {customer_name: 'Susie'}})
        .then(function (body) {
          scope.done()
          done()
        })
    })
  })

  describe('update', function (done) {
    it('Sends the correct request', function () {
      const scope = nock('https://api.chargehound.com', { reqheaders: postHeaders })
        .post('/v1/disputes/dp_123', {fields: {customer_name: 'Susie'}})
        .reply(200, {'id': 'dp_123'})
      chargehound.Disputes.update('dp_123', {fields: {customer_name: 'Susie'}})
        .then(function (body) {
          scope.done()
          done()
        })
    })
  })
})
