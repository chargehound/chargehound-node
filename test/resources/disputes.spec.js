/* eslint-env mocha */

const Chargehound = require('../../lib')
const clientVersion = require('../../package.json').version
const expect = require('chai').expect
const nock = require('nock')

const chargehound = new Chargehound('API_KEY')
const CHARGEHOUND_USERAGENT = 'Chargehound/v1 NodeBindings/' + clientVersion

const getHeaders = {
  'user-agent': CHARGEHOUND_USERAGENT,
  accept: 'application/json',
  host: 'api.chargehound.com'
}

const postHeaders = {
  'user-agent': CHARGEHOUND_USERAGENT,
  'content-type': 'application/json',
  accept: 'application/json',
  host: 'api.chargehound.com'
}

const productInformation = [{
  name: 'Saxophone',
  description: 'Alto saxophone, with carrying case',
  image: 'http://s3.amazonaws.com/chargehound/saxophone.png',
  sku: '17283001272',
  quantity: 1,
  amount: 20000,
  url: 'http://www.example.com'
}, {
  name: 'Milk',
  description: 'Semi-skimmed Organic',
  image: 'http://s3.amazonaws.com/chargehound/milk.png',
  sku: '26377382910',
  quantity: '64oz',
  amount: 400,
  url: 'http://www.example.com'
}]

const correspondenceInformation = [{
  'to': 'customer@example.com',
  'from': 'noreply@example.com',
  'subject': 'Your Order',
  'body': 'Your order was received.',
  'caption': 'Order confirmation email.'
}, {
  'to': 'customer@example.com',
  'from': 'noreply@example.com',
  'subject': 'Your Order',
  'body': 'Your order was delivered.',
  'caption': 'Delivery confirmation email.'
}]

describe('dispute', function () {
  describe('response', function () {
    it('exposes the response status code', function (done) {
      const scope = nock('https://api.chargehound.com', { reqheaders: getHeaders })
        .get('/v1/disputes')
        .reply(777, {'data': [{'id': 'dp_123'}]})

      const chargehound = new Chargehound('API_KEY')
      chargehound.Disputes.list((err, res) => {
        if (err) {
          done(err)
          return
        }
        expect(res).to.eql({'data': [{'id': 'dp_123'}], 'response': { 'status': 777 }})
        scope.done()
        done()
      })
    })
  })

  describe('create', function () {
    it('Sends the correct request', function () {
      const scope = nock('https://api.chargehound.com', { reqheaders: postHeaders })
        .post('/v1/disputes', {'id': 'dp_123'})
        .basicAuth({
          user: 'API_KEY',
          pass: ''
        })
        .reply(201, {'id': 'dp_123'})
      return chargehound.Disputes.create({'id': 'dp_123'})
        .then(function (body) {
          scope.done()
        })
    })
  })

  describe('retrieve', function () {
    it('Sends the correct request', function () {
      const scope = nock('https://api.chargehound.com', { reqheaders: getHeaders })
        .get('/v1/disputes/dp_123')
        .basicAuth({
          user: 'API_KEY',
          pass: ''
        })
        .reply(200, {'id': 'dp_123'})
      return chargehound.Disputes.retrieve('dp_123').then(function (body) {
        scope.done()
      })
    })
  })

  describe('response', function () {
    it('Sends the correct request', function () {
      const scope = nock('https://api.chargehound.com', { reqheaders: getHeaders })
        .get('/v1/disputes/dp_123/response')
        .basicAuth({
          user: 'API_KEY',
          pass: ''
        })
        .reply(200, {'id': 'dp_123'})
      return chargehound.Disputes.response('dp_123').then(function (body) {
        scope.done()
      })
    })
  })

  describe('list', function () {
    it('Sends the correct request', function () {
      const scope = nock('https://api.chargehound.com', { reqheaders: getHeaders })
        .get('/v1/disputes')
        .basicAuth({
          user: 'API_KEY',
          pass: ''
        })
        .reply(200, {'data': [{'id': 'dp_123'}]})
      return chargehound.Disputes.list().then(function (body) {
        scope.done()
      })
    })

    it('Can list by state', function () {
      const scope = nock('https://api.chargehound.com', { reqheaders: getHeaders })
        .get('/v1/disputes?state=needs_response')
        .basicAuth({
          user: 'API_KEY',
          pass: ''
        })
        .reply(200, {'data': [{'id': 'dp_123'}]})
      return chargehound.Disputes.list({state: 'needs_response'}).then(function (body) {
        scope.done()
      })
    })

    it('Can list by multiple states', function () {
      const scope = nock('https://api.chargehound.com', { reqheaders: getHeaders })
        .get('/v1/disputes?state=needs_response&state=warning_needs_response')
        .basicAuth({
          user: 'API_KEY',
          pass: ''
        })
        .reply(200, {'data': [{'id': 'dp_123'}]})
      return chargehound.Disputes.list({state: ['needs_response', 'warning_needs_response']})
        .then(function (body) {
          scope.done()
        })
    })
  })

  describe('submit', function () {
    it('Sends the correct request', function () {
      const scope = nock('https://api.chargehound.com', { reqheaders: postHeaders })
        .post('/v1/disputes/dp_123/submit', {fields: {customer_name: 'Susie'}})
        .basicAuth({
          user: 'API_KEY',
          pass: ''
        })
        .reply(201, {'id': 'dp_123'})
      return chargehound.Disputes.submit('dp_123', {fields: {customer_name: 'Susie'}})
        .then(function (body) {
          scope.done()
        })
    })

    it('Can include product information in the request', function () {
      const scope = nock('https://api.chargehound.com', { reqheaders: postHeaders })
        .post('/v1/disputes/dp_123/submit', {fields: {customer_name: 'Susie'}, products: productInformation})
        .basicAuth({
          user: 'API_KEY',
          pass: ''
        })
        .reply(201, {'id': 'dp_123'})

      return chargehound.Disputes.submit('dp_123', {
        fields: {customer_name: 'Susie'},
        products: productInformation
      })
      .then(function (body) {
        scope.done()
      })
    })

    it('Can include product information in the request', function () {
      const scope = nock('https://api.chargehound.com', { reqheaders: postHeaders })
        .post('/v1/disputes/dp_123/submit', {fields: {customer_name: 'Susie'}, correspondence: correspondenceInformation})
        .basicAuth({
          user: 'API_KEY',
          pass: ''
        })
        .reply(201, {'id': 'dp_123'})

      return chargehound.Disputes.submit('dp_123', {
        fields: {customer_name: 'Susie'},
        correspondence: correspondenceInformation
      })
      .then(function (body) {
        scope.done()
      })
    })
  })

  describe('update', function () {
    it('Sends the correct request', function () {
      const scope = nock('https://api.chargehound.com', { reqheaders: postHeaders })
        .put('/v1/disputes/dp_123', {fields: {customer_name: 'Susie'}})
        .basicAuth({
          user: 'API_KEY',
          pass: ''
        })
        .reply(200, {'id': 'dp_123'})
      return chargehound.Disputes.update('dp_123', {fields: {customer_name: 'Susie'}})
        .then(function (body) {
          scope.done()
        })
    })

    it('Can include product information in the request', function () {
      const scope = nock('https://api.chargehound.com', { reqheaders: postHeaders })
        .put('/v1/disputes/dp_123', {fields: {customer_name: 'Susie'}, products: productInformation})
        .basicAuth({
          user: 'API_KEY',
          pass: ''
        })
        .reply(201, {'id': 'dp_123'})

      return chargehound.Disputes.update('dp_123', {
        fields: {customer_name: 'Susie'},
        products: productInformation
      })
      .then(function (body) {
        scope.done()
      })
    })

    it('Can include product information in the request', function () {
      const scope = nock('https://api.chargehound.com', { reqheaders: postHeaders })
        .put('/v1/disputes/dp_123', {fields: {customer_name: 'Susie'}, correspondence: correspondenceInformation})
        .basicAuth({
          user: 'API_KEY',
          pass: ''
        })
        .reply(201, {'id': 'dp_123'})

      return chargehound.Disputes.update('dp_123', {
        fields: {customer_name: 'Susie'},
        correspondence: correspondenceInformation
      })
      .then(function (body) {
        scope.done()
      })
    })
  })

  describe('accept', function () {
    it('Sends the correct request', function () {
      // Does not set content type b/c there is no body
      const reqheaders = getHeaders
      const scope = nock('https://api.chargehound.com', { reqheaders })
        .post('/v1/disputes/dp_123/accept')
        .basicAuth({
          user: 'API_KEY',
          pass: ''
        })
        .reply(200, {'id': 'dp_123'})
      return chargehound.Disputes.accept('dp_123')
        .then(function (body) {
          scope.done()
        })
    })
  })
})
