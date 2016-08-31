'use strict';

var eq = require('./utils').eq;
import * as S from '../src'


describe('K', function() {

  it('is a binary function', function() {
    eq(typeof S.K, 'function');
    eq(S.K.length, 2);
  });

  it('returns its first argument', function() {
    eq(S.K(21, []), 21);
    eq(S.K(42, null), 42);
    eq(S.K(84, undefined), 84);
  });

  it('is curried', function() {
    eq(S.K(42).length, 1);
    eq(S.K(42)(null), 42);
  });

});
