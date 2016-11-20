'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('range', function() {

  eq(typeof S.range, 'function');
  eq(S.range.length, 2);

  throws(function() { S.range(0.5); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'range :: Integer -> Integer -> Array Integer\n' +
         '         ^^^^^^^\n' +
         '            1\n' +
         '\n' +
         '1)  0.5 :: Number, FiniteNumber, NonZeroFiniteNumber, ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Integer’.\n');

  throws(function() { S.range(0, 0.5); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'range :: Integer -> Integer -> Array Integer\n' +
         '                    ^^^^^^^\n' +
         '                       1\n' +
         '\n' +
         '1)  0.5 :: Number, FiniteNumber, NonZeroFiniteNumber, ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Integer’.\n');

  eq(S.range(0, 0), []);
  eq(S.range(0, 10), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  eq(S.range(0, -10), []);
  eq(S.range(-2, -1), [-2]);
  eq(S.range(-2, 3), [-2, -1, 0, 1, 2]);

});
