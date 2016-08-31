'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
import * as S from '../src'


describe('sum', function() {

  it('is a unary function', function() {
    eq(typeof S.sum, 'function');
    eq(S.sum.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.sum('xxx'); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'sum :: Foldable f => f -> FiniteNumber\n' +
                   '       ^^^^^^^^^^    ^\n' +
                   '                     1\n' +
                   '\n' +
                   '1)  "xxx" :: String\n' +
                   '\n' +
                   '‘sum’ requires ‘f’ to satisfy the Foldable type-class constraint; the value at position 1 does not.\n'));

    throws(function() { S.sum([1, 2, 'xxx']); },
           errorEq(TypeError,
                   'Type-variable constraint violation\n' +
                   '\n' +
                   'sum :: Foldable f => f -> FiniteNumber\n' +
                   '                     ^\n' +
                   '                     1\n' +
                   '\n' +
                   '1)  [1, 2, "xxx"] :: Array ???\n' +
                   '\n' +
                   'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n'));

    throws(function() { S.sum([1, Infinity]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'sum :: Foldable f => f -> FiniteNumber\n' +
                   '                          ^^^^^^^^^^^^\n' +
                   '                               1\n' +
                   '\n' +
                   '1)  Infinity :: Number, ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘FiniteNumber’.\n'));

    throws(function() { S.sum([1, -Infinity]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'sum :: Foldable f => f -> FiniteNumber\n' +
                   '                          ^^^^^^^^^^^^\n' +
                   '                               1\n' +
                   '\n' +
                   '1)  -Infinity :: Number, ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘FiniteNumber’.\n'));
  });

  it('sums an array of numbers together', function() {
    eq(S.sum([]), 0);
    eq(S.sum([0, 1, 2, 3]), 6);
    eq(S.sum([-0, 1, 2, 3]), 6);
    eq(S.sum([1, 2, 3, 4, 5]), 15);
    eq(S.sum([1, 2, 3, 4, -5]), 5);
  });

  it('can be applied to maybes', function() {
    eq(S.sum(S.Nothing), 0);
    eq(S.sum(S.Just(42)), 42);
  });

  it('can be applied to eithers', function() {
    eq(S.sum(S.Left('xxx')), 0);
    eq(S.sum(S.Right(42)), 42);
  });

});
