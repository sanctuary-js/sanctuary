'use strict';

var R = require('ramda');
var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('and', function() {

  it('is a binary function', function() {
    eq(typeof S.and, 'function');
    eq(S.and.length, 2);
  });

  it('can be applied to Booleans', function() {
    eq(S.and(false, false), false);
    eq(S.and(false, true), false);
    eq(S.and(true, false), false);
    eq(S.and(true, true), true);
  });

  it('can be applied to arrays', function() {
    eq(S.and([], []), []);
    eq(S.and([], [42]), []);
    eq(S.and([42], []), []);
    eq(S.and([42], [43]), [43]);
  });

  it('can be applied to maybes', function() {
    eq(S.and(S.Nothing, S.Nothing), S.Nothing);
    eq(S.and(S.Nothing, S.Just(42)), S.Nothing);
    eq(S.and(S.Just(42), S.Nothing), S.Nothing);
    eq(S.and(S.Just(42), S.Just(43)), S.Just(43));
  });

  it('can be applied to eithers', function() {
    eq(S.and(S.Left('foo'), S.Left('bar')), S.Left('foo'));
    eq(S.and(S.Left('foo'), S.Right(42)), S.Left('foo'));
    eq(S.and(S.Right(42), S.Left('foo')), S.Left('foo'));
    eq(S.and(S.Right(42), S.Right(43)), S.Right(43));
  });

  it('throws if applied to values of different types', function() {
    throws(function() { S.and([], false); },
           errorEq(TypeError,
                   'Type-variable constraint violation\n' +
                   '\n' +
                   'and :: Alternative a => a -> a -> a\n' +
                   '                        ^    ^\n' +
                   '                        1    2\n' +
                   '\n' +
                   '1)  [] :: Array ???\n' +
                   '\n' +
                   '2)  false :: Boolean\n' +
                   '\n' +
                   'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n'));

    throws(function() { S.and(R.__, false)([]); },
           errorEq(TypeError,
                   'Type-variable constraint violation\n' +
                   '\n' +
                   'and :: Alternative a => a -> a -> a\n' +
                   '                        ^    ^\n' +
                   '                        1    2\n' +
                   '\n' +
                   '1)  [] :: Array ???\n' +
                   '\n' +
                   '2)  false :: Boolean\n' +
                   '\n' +
                   'Since there is no type of which all the above values are members, the type-variable constraint has been violated.\n'));
  });

  it('throws if applied to values without a "toBoolean" method', function() {
    throws(function() { S.and(0, 1); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'and :: Alternative a => a -> a -> a\n' +
                   '       ^^^^^^^^^^^^^    ^\n' +
                   '                        1\n' +
                   '\n' +
                   '1)  0 :: Number, FiniteNumber, Integer, ValidNumber\n' +
                   '\n' +
                   '‘and’ requires ‘a’ to satisfy the Alternative type-class constraint; the value at position 1 does not.\n'));
  });

});
