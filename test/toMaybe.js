'use strict';

var eq = require('./utils').eq;
import * as S from '../src'


describe('toMaybe', function() {

  it('is a unary function', function() {
    eq(typeof S.toMaybe, 'function');
    eq(S.toMaybe.length, 1);
  });

  it('returns Nothing when applied to null/undefined', function() {
    eq(S.toMaybe(null), S.Nothing);
    eq(S.toMaybe(undefined), S.Nothing);
  });

  it('returns a Just when applied to any other value', function() {
    eq(S.toMaybe(0), S.Just(0));
    eq(S.toMaybe(false), S.Just(false));
  });

});
