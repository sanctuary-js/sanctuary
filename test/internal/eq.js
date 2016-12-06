'use strict';

var assert = require('assert');

var R = require('ramda');

//  eq :: (a, b) -> Undefined !
module.exports = function eq(actual, expected) {
  assert.strictEqual(arguments.length, eq.length);
  assert.strictEqual(R.toString(actual), R.toString(expected));
};
