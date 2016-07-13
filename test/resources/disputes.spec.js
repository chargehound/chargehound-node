/* eslint-env mocha */

const Chargehound = require('../../lib')
const clientVersion = require('../../package.json').version
const nock = require('nock')

const chargehound = new Chargehound('API_KEY')
const CHARGEHOUND_USERAGENT = 'Chargehound/v1 NodeBindings/' + clientVersion

const getHeaders = {
  'accept': 'application/json',
  'authorization': 'Basic QVBJX0tFWTo=',
  'host': 'api.chargehound.com',
  'user-agent': CHARGEHOUND_USERAGENT
}

const postHeaders = {
  'accept': 'application/json',
  'authorization': 'Basic QVBJX0tFWTo=',
  'content-type': 'application/json',
  'host': 'api.chargehound.com',
  'user-agent': CHARGEHOUND_USERAGENT
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

    it('Can include product information in the request', function () {
      const scope = nock('https://api.chargehound.com', { reqheaders: postHeaders })
          .post('/v1/disputes/dp_123/submit', {fields: {customer_name: 'Susie'}})
          .reply(201, {'id': 'dp_123'})

      chargehound.Disputes.submit('dp_123', {
        fields: {customer_name: 'Susie'},
        products: [{
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
        }]})
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

    it('Can include product information in the request', function () {
      const scope = nock('https://api.chargehound.com', { reqheaders: postHeaders })
          .post('/v1/disputes/dp_123/submit', {fields: {customer_name: 'Susie'}})
          .reply(201, {'id': 'dp_123'})

      chargehound.Disputes.update('dp_123', {
        fields: {customer_name: 'Susie'},
        products: [{
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
        }]})
          .then(function (body) {
            scope.done()
            done()
          })
    })
  })
})
