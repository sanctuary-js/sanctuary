'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
import * as S from '../src'


describe('mean', function() {

  it('is a unary function', function() {
    eq(typeof S.mean, 'function');
    eq(S.mean.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.mean('xxx'); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'mean :: Foldable f => f -> Maybe FiniteNumber\n' +
                   '        ^^^^^^^^^^    ^\n' +
                   '                      1\n' +
                   '\n' +
                   '1)  "xxx" :: String\n' +
                   '\n' +
                   '‘mean’ requires ‘f’ to satisfy the Foldable type-class constraint; the value at position 1 does not.\n'));

    throws(function() { S.mean([1, 2, 'xxx']); },
           errorEq(TypeError,
                   'Type-variable constraint violation\n' +
                   '\n' +
                   'mean :: Foldable f => f -> Maybe FiniteNumber\n' +
                   '                      ^\n' +
                   '                      1\n' +
                   '\n' +
                   '1)  [1, 2, "xxx"] :: Array ???\n' +
                   '\n' +
                   'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n'));

    throws(function() { S.mean([1, Infinity]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'mean :: Foldable f => f -> Maybe FiniteNumber\n' +
                   '                                 ^^^^^^^^^^^^\n' +
                   '                                      1\n' +
                   '\n' +
                   '1)  Infinity :: Number, ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘FiniteNumber’.\n'));
  });

  it('returns the mean of a non-empty array of numbers', function() {
    eq(S.mean([1, 2, 3]), S.Just(2));
    eq(S.mean([0.1, 0.3]), S.Just(0.2));
    eq(S.mean([-0]), S.Just(0));
    eq(S.mean([-0, 0]), S.Just(0));
  });

  it('returns Nothing when applied to an empty array', function() {
    eq(S.mean([]), S.Nothing);
  });

  it('can be applied to maybes', function() {
    eq(S.mean(S.Nothing), S.Nothing);
    eq(S.mean(S.Just(42)), S.Just(42));
  });

  it('can be applied to eithers', function() {
    eq(S.mean(S.Left('xxx')), S.Nothing);
    eq(S.mean(S.Right(42)), S.Just(42));
  });

});
