'use strict';

var S = require('..');

var eq = require('./internal/eq');
var throws = require('./internal/throws');


test('dropLast', function() {

  eq(typeof S.dropLast, 'function');
  eq(S.dropLast.length, 2);

  throws(function() { S.dropLast(0.5); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'dropLast :: Integer -> List a -> Maybe (List a)\n' +
         '            ^^^^^^^\n' +
         '               1\n' +
         '\n' +
         '1)  0.5 :: Number, FiniteNumber, NonZeroFiniteNumber, ValidNumber\n' +
         '\n' +
         'The value at position 1 is not a member of ‘Integer’.\n');

  throws(function() { S.dropLast(0, null); },
         TypeError,
         'Invalid value\n' +
         '\n' +
         'dropLast :: Integer -> List a -> Maybe (List a)\n' +
         '                       ^^^^^^\n' +
         '                         1\n' +
         '\n' +
         '1)  null :: Null\n' +
         '\n' +
         'The value at position 1 is not a member of ‘List a’.\n');

  eq(S.dropLast(0, [1, 2, 3, 4, 5]), S.Just([1, 2, 3, 4, 5]));
  eq(S.dropLast(1, [1, 2, 3, 4, 5]), S.Just([1, 2, 3, 4]));
  eq(S.dropLast(2, [1, 2, 3, 4, 5]), S.Just([1, 2, 3]));
  eq(S.dropLast(3, [1, 2, 3, 4, 5]), S.Just([1, 2]));
  eq(S.dropLast(4, [1, 2, 3, 4, 5]), S.Just([1]));
  eq(S.dropLast(5, [1, 2, 3, 4, 5]), S.Just([]));
  eq(S.dropLast(6, [1, 2, 3, 4, 5]), S.Nothing);

  eq(S.dropLast(0, '12345'), S.Just('12345'));
  eq(S.dropLast(1, '12345'), S.Just('1234'));
  eq(S.dropLast(2, '12345'), S.Just('123'));
  eq(S.dropLast(3, '12345'), S.Just('12'));
  eq(S.dropLast(4, '12345'), S.Just('1'));
  eq(S.dropLast(5, '12345'), S.Just(''));
  eq(S.dropLast(6, '12345'), S.Nothing);

  eq(S.dropLast(-1, [1, 2, 3, 4, 5]), S.Nothing);
  eq(S.dropLast(-0, [1, 2, 3, 4, 5]), S.Nothing);
  eq(S.dropLast(new Number(-0), [1, 2, 3, 4, 5]), S.Nothing);

});
