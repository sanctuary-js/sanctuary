'use strict';

var assert = require ('assert');

var equals = require ('./equals');
var toString = require ('./toString');

//  eq :: a -> b -> Undefined !
module.exports = function eq(actual) {
  assert.strictEqual (arguments.length, eq.length);
  return function eq$1(expected) {
    assert.strictEqual (arguments.length, eq$1.length);
    assert.strictEqual (toString (actual), toString (expected));
    assert.strictEqual (equals (actual) (expected), true);
  };
};
