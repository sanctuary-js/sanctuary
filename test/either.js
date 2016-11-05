'use strict';

var R = require('ramda');
var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
var S = require('..');
var square = require('./utils').square;


describe('either', function() {

  it('is a ternary function', function() {
    eq(typeof S.either, 'function');
    eq(S.either.length, 3);
  });

  it('type checks its arguments', function() {
    throws(function() { S.either([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'either :: Function -> Function -> Either a b -> c\n' +
                   '          ^^^^^^^^\n' +
                   '             1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));

    throws(function() { S.either(R.__, square)([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'either :: Function -> Function -> Either a b -> c\n' +
                   '          ^^^^^^^^\n' +
                   '             1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));

    throws(function() { S.either(R.length, [1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'either :: Function -> Function -> Either a b -> c\n' +
                   '                      ^^^^^^^^\n' +
                   '                         1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));

    throws(function() { S.either(R.length)([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'either :: Function -> Function -> Either a b -> c\n' +
                   '                      ^^^^^^^^\n' +
                   '                         1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Function’.\n'));

    throws(function() { S.either(R.length, square, [1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'either :: Function -> Function -> Either a b -> c\n' +
                   '                                  ^^^^^^^^^^\n' +
                   '                                      1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Either a b’.\n'));

    throws(function() { S.either(R.length)(square)([1, 2, 3]); },
           errorEq(TypeError,
                   'Invalid value\n' +
                   '\n' +
                   'either :: Function -> Function -> Either a b -> c\n' +
                   '                                  ^^^^^^^^^^\n' +
                   '                                      1\n' +
                   '\n' +
                   '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
                   '\n' +
                   'The value at position 1 is not a member of ‘Either a b’.\n'));
  });

  it('can be applied to a Left', function() {
    eq(S.either(R.length, square, S.Left('abc')), 3);
  });

  it('can be applied to a Right', function() {
    eq(S.either(R.length, square, S.Right(42)), 1764);
  });

});
