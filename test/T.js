'use strict';

var R = require('ramda');

var eq = require('./utils').eq;
var S = require('..');


describe('T', function() {

  it('is a binary function', function() {
    eq(typeof S.T, 'function');
    eq(S.T.length, 2);
  });

  it('T(x, f) is equivalent to f(x)', function() {
    eq(S.T(42, S.inc), 43);
    eq(R.map(S.T(100), [S.inc, Math.sqrt]), [101, 10]);
  });

  it('is curried', function() {
    eq(S.T(42).length, 1);
    eq(S.T(42)(S.inc), 43);
  });

});
