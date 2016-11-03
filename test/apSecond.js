'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('apSecond', function() {

  it('is a binary function', function() {
    eq(typeof S.apSecond, 'function');
    eq(S.apSecond.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.apSecond(S.Just(1), 2); },
           errorEq(TypeError,
                   'Type-class constraint violation\n' +
                   '\n' +
                   'apSecond :: (Apply a, Apply b) => a -> b -> b\n' +
                   '                      ^^^^^^^          ^\n' +
                   '                                       1\n' +
                   '\n' +
                   '1)  2 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
                   '\n' +
                   '‘apSecond’ requires ‘b’ to satisfy the Apply type-class constraint; the value at position 1 does not.\n'));
  });

  it('can be applied to maybes', function() {
    eq(S.apSecond(S.Nothing, S.Nothing), S.Nothing);
    eq(S.apSecond(S.Nothing, S.Just(1)), S.Nothing);
    eq(S.apSecond(S.Just(1), S.Just('2')), S.Just('2'));
  });

  it('can be applied to eithers', function() {
    eq(S.apSecond(S.Left('foo'), S.Left('bar')), S.Left('foo'));
    eq(S.apSecond(S.Left('foo'), S.Right('bar')), S.Left('foo'));
    eq(S.apSecond(S.Right('foo'), S.Left('bar')), S.Left('bar'));
    eq(S.apSecond(S.Right('foo'), S.Right(2)), S.Right(2));
  });

  it('throws if applied to different types', function() {
    throws(function() { S.apSecond(S.Just(1), S.Left('foo')); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'Maybe#ap :: Maybe Function -> Maybe a -> Maybe b\n' +
                   '                              ^^^^^^^\n' +
                   '                                 1\n' +
                   '\n' +
                   '1)  Left("foo") :: Either String ???\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Maybe a’.\n'));
  });

  it('is curried', function() {
    eq(S.apSecond(S.Just(1)).length, 1);
    eq(S.apSecond(S.Just(1))(S.Just('2')), S.Just('2'));
  });

});
