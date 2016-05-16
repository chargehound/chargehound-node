# Chargehound node.js bindings 

[![Build Status](https://travis-ci.org/chargehound/chargehound-node.svg?branch=master)](https://travis-ci.org/chargehound/chargehound-node) [![npm version](https://badge.fury.io/js/chargehound.svg)](https://badge.fury.io/js/chargehound)

## Installation

`npm install chargehound`

## Usage

Every resource is accessed via the `chargehound` instance:

```js
var chargehound = require('chargehound')('{ YOUR_API_KEY }');
```

Every resource method accepts an optional callback as the last argument:

```js
chargehound.Disputes.submit('dp_xxx', {fields: {customer_name: 'Susie'}},
  function (err, dispute) {
    err; // null if no error occurred
    dispute; // the submitted dispute object
  }
);
```

Additionally, every resource method returns a promise, so you don't have to use the regular callback. E.g.

```js
chargehound.Disputes.submit('dp_xxx', {fields: {customer_name: 'Susie'}})
  .then(function (dispute) {
    // Success
  .catch(function (err) {
    // Deal with an error
  });
```

## Documentation

[Disputes](https://www.chargehound.com/docs/api/index.html?javascript#disputes)
[Errors](https://test.chargehound.com/docs/api/index.html?javascript#errors)

## Development

To build and install from the latest source:

```bash
$ git clone git@github.com:chargehound/chargehound-node.git
$ npm install
```

The source code is written in ES6. For development you will need Node.js >= v4.4.3.

Run the tests using [`npm`](https://www.npmjs.com/):

```bash
$ npm test
```

