'use strict';

var R = require('ramda');
var throws = require('assert').throws;

var eq = require('./utils').eq;
var errorEq = require('./utils').errorEq;
import * as S from '../src'
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

  it('is curried', function() {
    var f = R.length;
    var g = square;
    var x = S.Left('abc');
    var _ = R.__;

    eq(S.either(f).length, 2);
    eq(S.either(f)(g).length, 1);

    eq(S.either(f)(g)(x), 3);
    eq(S.either(f)(g, x), 3);
    eq(S.either(f, g)(x), 3);
    eq(S.either(f, g, x), 3);

    eq(S.either(_, g, x)(f), 3);
    eq(S.either(f, _, x)(g), 3);
    eq(S.either(f, g, _)(x), 3);

    eq(S.either(f, _, _)(g)(x), 3);
    eq(S.either(_, g, _)(f)(x), 3);
    eq(S.either(_, _, x)(f)(g), 3);

    eq(S.either(f, _, _)(g, x), 3);
    eq(S.either(_, g, _)(f, x), 3);
    eq(S.either(_, _, x)(f, g), 3);

    eq(S.either(f, _, _)(_, x)(g), 3);
    eq(S.either(_, g, _)(_, x)(f), 3);
    eq(S.either(_, _, x)(_, g)(f), 3);

    eq(S.either(_, _, _)(_, _)(_)(f, g, x), 3);
    eq(S.either(_, _, _)(f, _, _)(_, _)(g, _)(_)(x), 3);
  });

});
