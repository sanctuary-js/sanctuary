'use strict';

var eq = require('./utils').eq;
import * as S from '../src'


describe('toEither', function() {

  it('is a binary function', function() {
    eq(typeof S.toEither, 'function');
    eq(S.toEither.length, 2);
  });

  it('returns Left of the first argument when second argument is `null`-y', function() {
    eq(S.toEither('a', null), S.Left('a'));
    eq(S.toEither('a', undefined), S.Left('a'));
  });

  it('returns a Right of the second argument when it is not `null`-y', function() {
    eq(S.toEither('a', 42), S.Right(42));
  });

});
