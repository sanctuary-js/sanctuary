'use strict';

var assert = require('assert');

var Z = require('sanctuary-type-classes');

//  eq :: (a, b) -> Undefined !
module.exports = function eq(actual, expected) {
  assert.strictEqual(arguments.length, eq.length);
  assert.strictEqual(Z.toString(actual), Z.toString(expected));
  assert.strictEqual(Z.equals(actual, expected), true);
};
