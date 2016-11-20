'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('fromEither', function() {

  eq(typeof S.fromEither, 'function');
  eq(S.fromEither.length, 2);

  throws(function() { S.fromEither(0, [1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'fromEither :: b -> Either a b -> b\n' +
         '                   ^^^^^^^^^^\n' +
         '                       1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Either a b’.\n');

  eq(S.fromEither(0, S.Left(42)), 0);
  eq(S.fromEither(0, S.Right(42)), 42);

});
