'use strict';

var assert = require ('assert');

var equals = require ('./equals');

//  throws :: (() -> Undefined !) -> Error -> Undefined !
module.exports = function throws(thunk) {
  assert.strictEqual (arguments.length, throws.length);
  return function throws$1(expected) {
    assert.strictEqual (arguments.length, throws$1.length);
    assert.throws (thunk, equals (expected));
  };
};
