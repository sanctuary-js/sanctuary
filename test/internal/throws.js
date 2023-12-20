'use strict';

const assert = require ('assert');

const Z = require ('sanctuary-type-classes');

//    throws :: (() -> Undefined !) -> Error -> Undefined !
module.exports = function throws(thunk) {
  assert.strictEqual (arguments.length, throws.length);
  return function throws$1(expected) {
    assert.strictEqual (arguments.length, throws$1.length);
    assert.throws (thunk, actual => Z.equals (actual, expected));
  };
};
