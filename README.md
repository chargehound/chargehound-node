# Chargehound node.js bindings [![Build Status](https://travis-ci.org/chargehound/chargehound-node.png?branch=master)](https://travis-ci.org/chargehound/chargehound-node)

<!-- ## Installation

`npm install chargehound` -->

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

<!-- ## Resources

[Disputes](https://www.chargehound.com/docs/?javascript#disputes) -->

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

