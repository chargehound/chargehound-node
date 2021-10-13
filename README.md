# Chargehound node.js bindings 

[![Build Status](https://github.com/chargehound/chargehound-node/actions/workflows/test-js.yml/badge.svg)](https://github.com/chargehound/chargehound-node/actions/workflows/test-js.yaml) [![npm version](https://badge.fury.io/js/chargehound.svg)](https://badge.fury.io/js/chargehound)

## Installation

`npm install chargehound`

## Usage

Every resource is accessed via the `chargehound` instance:

```js
var chargehound = require('chargehound')('{ YOUR_API_KEY }');
```

### Requests

Every resource method accepts an optional callback as the last argument:

```js
chargehound.Disputes.submit('dp_123', {fields: {customer_name: 'Susie'}},
  function (err, dispute) {
    err; // null if no error occurred
    dispute; // the submitted dispute object
  }
);
```

Additionally, every resource method returns a promise, so you don't have to use the regular callback. E.g.

```js
chargehound.Disputes.submit('dp_123', {fields: {customer_name: 'Susie'}})
  .then(function (dispute) {
    // Success
  .catch(function (err) {
    // Deal with an error
  });
```

### Responses

Responses from the API are automatically parsed from JSON and returned as JavaScript objects. 

Responses also include the HTTP status code on the `response` object as the `status` field.

```js
chargehound.Disputes.retrieve('dp_123').then(dispute => {
  console.log(dispute.state)
  // 'needs_response'
  console.log(dispute.response.status)
  // 200
});
```

## Documentation

[Disputes](https://www.chargehound.com/docs/api/index.html?javascript#disputes)

[Errors](https://www.chargehound.com/docs/api/index.html?javascript#errors)

## Development

To build and install from the latest source:

```bash
$ git clone git@github.com:chargehound/chargehound-node.git
$ npm install
```

The source code is written in ES6. For development you will need Node.js >= v8.

Run the tests using [`npm`](https://www.npmjs.com/):

```bash
$ npm test
```

## Deployment

To deploy a new version of the SDK, perform the following steps:

 1. Update the CHANGELOG to describe what feature have been added.
 2. Bump the version number in `package.json`
 3. Rebuild and deploy the package with:
   ```npm publish```
 4. Confirm the new package version is available at [https://www.npmjs.com/package/chargehound](https://www.npmjs.com/package/chargehound)  
