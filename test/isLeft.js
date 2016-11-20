'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('isLeft', function() {

  eq(typeof S.isLeft, 'function');
  eq(S.isLeft.length, 1);

  throws(function() { S.isLeft([1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'isLeft :: Either a b -> Boolean\n' +
         '          ^^^^^^^^^^\n' +
         '              1\n' +
         '\n' +
         '1)  [1, 2, 3] :: Array Number, Array FiniteNumber, Array NonZeroFiniteNumber, Array Integer, Array ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Either a b’.\n');

  eq(S.isLeft(S.Left(42)), true);
  eq(S.isLeft(S.Right(42)), false);

});
