'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var S = require('..');

describe('fromEither', function() {

  it('is a binary function', function() {
    eq(typeof S.fromEither, 'function');
    eq(S.fromEither.length, 2);
  });

  it('type checks its arguments', function() {
    throws(function() { S.fromEither(0, [1, 2, 3]); },
           'Invalid value\n' +
           '\n' +
           'fromEither :: b -> Either a b -> b\n' +
           '                   ^^^^^^^^^^n' +
           '                        1\n' +
           '\n' +
           '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
           '\n' +
           'The value at position 1 is not a member of ‘Either a b’.\n');
  });

  it('can be applied to a Right', function() {
    eq(S.fromEither(0, S.Right(42)), 42);
  });

  it('can be applied to a Left', function() {
    eq(S.fromEither(0, S.Left(42)), 0);
  });

});
