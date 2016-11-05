'use strict';

var R = require('ramda');

var eq = require('./utils').eq;
var S = require('..');


describe('A', function() {

  it('is a binary function', function() {
    eq(typeof S.A, 'function');
    eq(S.A.length, 2);
  });

  it('A(f, x) is equivalent to f(x)', function() {
    eq(S.A(S.inc, 1), 2);
    eq(R.map(S.A(R.__, 100), [S.inc, Math.sqrt]), [101, 10]);
  });

});
