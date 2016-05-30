'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('product', function() {

  it('is a unary function', function() {
    eq(typeof S.product, 'function');
    eq(S.product.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.product('xxx'); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'product :: Foldable f => f -> FiniteNumber\n' +
                   '           ^^^^^^^^^^    ^\n' +
                   '                         1\n' +
                   '\n' +
                   '1)  "xxx" :: String\n' +
                   '\n' +
                   '‘product’ requires ‘f’ to satisfy the Foldable type-class constraint; the value at position 1 does not.\n'));

    throws(function() { S.product([1, 2, 'xxx']); },
           errorEq(TypeError,
                   'Type-variable constraint violation\n' +
                   '\n' +
                   'product :: Foldable f => f -> FiniteNumber\n' +
                   '                         ^\n' +
                   '                         1\n' +
                   '\n' +
                   '1)  [1, 2, "xxx"] :: Array ???\n' +
                   '\n' +
                   'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n'));

    throws(function() { S.product([1, Infinity]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'product :: Foldable f => f -> FiniteNumber\n' +
                   '                              ^^^^^^^^^^^^\n' +
                   '                                   1\n' +
                   '\n' +
                   '1)  Infinity :: Number, ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘FiniteNumber’.\n'));

    throws(function() { S.product([1, -Infinity]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'product :: Foldable f => f -> FiniteNumber\n' +
                   '                              ^^^^^^^^^^^^\n' +
                   '                                   1\n' +
                   '\n' +
                   '1)  -Infinity :: Number, ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘FiniteNumber’.\n'));
  });

  it('returns the product of an array of numbers', function() {
    eq(S.product([]), 1);
    eq(S.product([0, 1, 2, 3]), 0);
    eq(S.product([-0, 1, 2, 3]), -0);
    eq(S.product([1, 2, 3, 4, 5]), 120);
    eq(S.product([1, 2, 3, 4, -5]), -120);
  });

  it('can be applied to maybes', function() {
    eq(S.product(S.Nothing), 1);
    eq(S.product(S.Just(42)), 42);
  });

  it('can be applied to eithers', function() {
    eq(S.product(S.Left('xxx')), 1);
    eq(S.product(S.Right(42)), 42);
  });

});
