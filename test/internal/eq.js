'use strict';

var assert = require ('assert');

var show = require ('sanctuary-show');

var equals = require ('./equals');

//  eq :: a -> b -> Undefined !
module.exports = function eq(actual) {
  assert.strictEqual (arguments.length, eq.length);
  return function eq$1(expected) {
    assert.strictEqual (arguments.length, eq$1.length);
    assert.strictEqual (show (actual), show (expected));
    assert.strictEqual (equals (actual) (expected), true);
  };
};
