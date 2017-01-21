'use strict';

var assert = require('assert');

var equals = require('./equals');
var toString = require('./toString');

//  eq :: (a, b) -> Undefined !
module.exports = function eq(actual, expected) {
  assert.strictEqual(arguments.length, eq.length);
  assert.strictEqual(toString(actual), toString(expected));
  assert.strictEqual(equals(actual)(expected), true);
};
