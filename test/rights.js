'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('rights', function() {

  eq(typeof S.rights, 'function');
  eq(S.rights.length, 1);

  throws(function() { S.rights([1, 2, 3]); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'rights :: Array (Either a b) -> Array b\n' +
         '                ^^^^^^^^^^^^\n' +
         '                     1\n' +
         '\n' +
         '1)  1 :: Number, FiniteNumber, NonZeroFiniteNumber, Integer, ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Either a b’.\n');

  eq(S.rights([]), []);
  eq(S.rights([S.Left('a'), S.Left('b')]), []);
  eq(S.rights([S.Left('a'), S.Right(1)]), [1]);
  eq(S.rights([S.Right(2), S.Left('b')]), [2]);
  eq(S.rights([S.Right(2), S.Right(1)]), [2, 1]);

});
