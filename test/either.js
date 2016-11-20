'use strict';

var R = require('ramda');

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('either', function() {

  eq(typeof S.either, 'function');
  eq(S.either.length, 3);

  throws(function() { S.either([1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'either :: Function -> Function -> Either a b -> c\n' +
         '          ^^^^^^^^\n' +
         '             1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Function’.\n');

  throws(function() { S.either(R.__, Math.sqrt)([1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'either :: Function -> Function -> Either a b -> c\n' +
         '          ^^^^^^^^\n' +
         '             1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Function’.\n');

  throws(function() { S.either(R.length, [1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'either :: Function -> Function -> Either a b -> c\n' +
         '                      ^^^^^^^^\n' +
         '                         1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Function’.\n');

  throws(function() { S.either(R.length)([1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'either :: Function -> Function -> Either a b -> c\n' +
         '                      ^^^^^^^^\n' +
         '                         1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Function’.\n');

  throws(function() { S.either(R.length, Math.sqrt, [1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'either :: Function -> Function -> Either a b -> c\n' +
         '                                  ^^^^^^^^^^\n' +
         '                                      1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Either a b’.\n');

  throws(function() { S.either(R.length)(Math.sqrt)([1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'either :: Function -> Function -> Either a b -> c\n' +
         '                                  ^^^^^^^^^^\n' +
         '                                      1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Either a b’.\n');

  eq(S.either(R.length, Math.sqrt, S.Left('abc')), 3);
  eq(S.either(R.length, Math.sqrt, S.Right(256)), 16);

});
