'use strict';

var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');


describe('isLeft', function() {

  it('is a unary function', function() {
    eq(typeof S.isLeft, 'function');
    eq(S.isLeft.length, 1);
  });

  it('type checks its arguments', function() {
    throws(function() { S.isLeft([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'isLeft :: Either a b -> Boolean\n' +
                   '          ^^^^^^^^^^\n' +
                   '              1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Either a b’.\n'));
  });

  it('returns true when applied to a Left', function() {
    eq(S.isLeft(S.Left(42)), true);
  });

  it('returns false when applied to a Right', function() {
    eq(S.isLeft(S.Right(42)), false);
  });

});
