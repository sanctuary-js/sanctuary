'use strict';

var throws = require('assert').throws;

var R = require('ramda');

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


describe('or', function() {

  it('is a binary function', function() {
    eq(typeof S.or, 'function');
    eq(S.or.length, 2);
  });

  it('can be applied to Booleans', function() {
    eq(S.or(false, false), false);
    eq(S.or(false, true), true);
    eq(S.or(true, false), true);
    eq(S.or(true, true), true);
  });

  it('can be applied to arrays', function() {
    eq(S.or([], []), []);
    eq(S.or([], [42]), [42]);
    eq(S.or([42], []), [42]);
    eq(S.or([42], [43]), [42]);
  });

  it('can be applied to maybes', function() {
    eq(S.or(S.Nothing, S.Nothing), S.Nothing);
    eq(S.or(S.Nothing, S.Just(42)), S.Just(42));
    eq(S.or(S.Just(42), S.Nothing), S.Just(42));
    eq(S.or(S.Just(42), S.Just(43)), S.Just(42));
  });

  it('can be applied to eithers', function() {
    eq(S.or(S.Left('foo'), S.Left('bar')), S.Left('bar'));
    eq(S.or(S.Left('foo'), S.Right(42)), S.Right(42));
    eq(S.or(S.Right(42), S.Left('foo')), S.Right(42));
    eq(S.or(S.Right(42), S.Right(43)), S.Right(42));
  });

  it('throws if applied to values of different types', function() {
    throws(function() { S.or([], false); },
           errorEq(TypeError,
                   'Type-variable constraint violation\n' +
                   '\n' +
                   'or :: Alternative a => a -> a -> a\n' +
                   '                       ^    ^\n' +
                   '                       1    2\n' +
                   '\n' +
                   '1)  [] :: Array ???\n' +
                   '\n' +
                   '2)  false :: Boolean\n' +
                   '\n' +
                   'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n'));

    throws(function() { S.or(R.__, false)([]); },
           errorEq(TypeError,
                   'Type-variable constraint violation\n' +
                   '\n' +
                   'or :: Alternative a => a -> a -> a\n' +
                   '                       ^    ^\n' +
                   '                       1    2\n' +
                   '\n' +
                   '1)  [] :: Array ???\n' +
                   '\n' +
                   '2)  false :: Boolean\n' +
                   '\n' +
                   'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n'));
  });

  it('throws if applied to values without a "toBoolean" method', function() {
    throws(function() { S.or(0, 1); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'or :: Alternative a => a -> a -> a\n' +
                   '      ^^^^^^^^^^^^^    ^\n' +
                   '                       1\n' +
                   '\n' +
                   '1)  0 :: Number, FiniteNumber, Integer, ValidNumber\n' +
                   '\n' +
                   '‘or’ requires ‘a’ to satisfy the Alternative type-class constraint; the value at position 1 does not.\n'));
  });

});
