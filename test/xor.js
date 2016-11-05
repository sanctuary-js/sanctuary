'use strict';

var R = require('ramda');
var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('xor', function() {

  it('is a binary function', function() {
    eq(typeof S.xor, 'function');
    eq(S.xor.length, 2);
  });

  it('can be applied to Booleans', function() {
    eq(S.xor(false, false), false);
    eq(S.xor(false, true), true);
    eq(S.xor(true, false), true);
    eq(S.xor(true, true), false);
  });

  it('can be applied to arrays', function() {
    eq(S.xor([], []), []);
    eq(S.xor([], [42]), [42]);
    eq(S.xor([42], []), [42]);
    eq(S.xor([42], [43]), []);
  });

  it('can be applied to maybes', function() {
    eq(S.xor(S.Nothing, S.Nothing), S.Nothing);
    eq(S.xor(S.Nothing, S.Just(42)), S.Just(42));
    eq(S.xor(S.Just(42), S.Nothing), S.Just(42));
    eq(S.xor(S.Just(42), S.Just(43)), S.Nothing);
  });

  it('cannot be applied to eithers', function() {
    throws(function() { S.xor(S.Left('foo'), S.Left('bar')); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'xor :: (Alternative a, Monoid a) => a -> a -> a\n' +
                   '                       ^^^^^^^^     ^\n' +
                   '                                    1\n' +
                   '\n' +
                   '1)  Left("foo") :: Either String ???\n' +
                   '\n' +
                   '‘xor’ requires ‘a’ to satisfy the Monoid type-class constraint; the value at position 1 does not.\n'));

    throws(function() { S.xor(S.Left('foo'), S.Right(42)); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'xor :: (Alternative a, Monoid a) => a -> a -> a\n' +
                   '                       ^^^^^^^^     ^\n' +
                   '                                    1\n' +
                   '\n' +
                   '1)  Left("foo") :: Either String ???\n' +
                   '\n' +
                   '‘xor’ requires ‘a’ to satisfy the Monoid type-class constraint; the value at position 1 does not.\n'));

    throws(function() { S.xor(S.Right(42), S.Left('foo')); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'xor :: (Alternative a, Monoid a) => a -> a -> a\n' +
                   '                       ^^^^^^^^     ^\n' +
                   '                                    1\n' +
                   '\n' +
                   '1)  Right(42) :: Either ??? Number, Either ??? FiniteNumber, Either ??? NonZeroFiniteNumber, Either ??? Integer, Either ??? ValidNumber\n' +
                   '\n' +
                   '‘xor’ requires ‘a’ to satisfy the Monoid type-class constraint; the value at position 1 does not.\n'));

    throws(function() { S.xor(S.Right(42), S.Right(43)); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'xor :: (Alternative a, Monoid a) => a -> a -> a\n' +
                   '                       ^^^^^^^^     ^\n' +
                   '                                    1\n' +
                   '\n' +
                   '1)  Right(42) :: Either ??? Number, Either ??? FiniteNumber, Either ??? NonZeroFiniteNumber, Either ??? Integer, Either ??? ValidNumber\n' +
                   '\n' +
                   '‘xor’ requires ‘a’ to satisfy the Monoid type-class constraint; the value at position 1 does not.\n'));
  });

  it('throws if applied to values of different types', function() {
    throws(function() { S.xor([], false); },
           errorEq(TypeError,
                   'Type-variable constraint violation\n' +
                   '\n' +
                   'xor :: (Alternative a, Monoid a) => a -> a -> a\n' +
                   '                                    ^    ^\n' +
                   '                                    1    2\n' +
                   '\n' +
                   '1)  [] :: Array ???\n' +
                   '\n' +
                   '2)  false :: Boolean\n' +
                   '\n' +
                   'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n'));

    throws(function() { S.xor(R.__, false)([]); },
           errorEq(TypeError,
                   'Type-variable constraint violation\n' +
                   '\n' +
                   'xor :: (Alternative a, Monoid a) => a -> a -> a\n' +
                   '                                    ^    ^\n' +
                   '                                    1    2\n' +
                   '\n' +
                   '1)  [] :: Array ???\n' +
                   '\n' +
                   '2)  false :: Boolean\n' +
                   '\n' +
                   'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n'));
  });

  it('throws if applied to values without a "toBoolean" method', function() {
    throws(function() { S.xor(0, 1); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'xor :: (Alternative a, Monoid a) => a -> a -> a\n' +
                   '        ^^^^^^^^^^^^^               ^\n' +
                   '                                    1\n' +
                   '\n' +
                   '1)  0 :: Number, FiniteNumber, Integer, ValidNumber\n' +
                   '\n' +
                   '‘xor’ requires ‘a’ to satisfy the Alternative type-class constraint; the value at position 1 does not.\n'));
  });

});
