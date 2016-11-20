'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('lefts', function() {

  eq(typeof S.lefts, 'function');
  eq(S.lefts.length, 1);

  throws(function() { S.lefts([1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'lefts :: Array (Either a b) -> Array a\n' +
         '               ^^^^^^^^^^^^\n' +
         '                    1\n' +
         '\n' +
         '1)  1 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Either a b’.\n');

  eq(S.lefts([]), []);
  eq(S.lefts([S.Right(2), S.Right(1)]), []);
  eq(S.lefts([S.Right(2), S.Left('b')]), ['b']);
  eq(S.lefts([S.Left('a'), S.Right(1)]), ['a']);
  eq(S.lefts([S.Left('a'), S.Left('b')]), ['a', 'b']);

});
