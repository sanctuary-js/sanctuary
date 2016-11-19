'use strict';

var throws = require('assert').throws;

var S = require('..');

var eq = require('./internal/eq');
var errorEq = require('./internal/errorEq');


test('drop', function() {

  eq(typeof S.drop, 'function');
  eq(S.drop.length, 2);

  throws(function() { S.drop(0.5); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'drop :: Integer -> List a -> Maybe (List a)\n' +
                 '        ^^^^^^^\n' +
                 '           1\n' +
                 '\n' +
                 '1)  0.5 :: Number, FiniteNumber, NonZeroFiniteNumber, ValidNumber\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘Integer’.\n'));

  throws(function() { S.drop(0, null); },
         errorEq(TypeError,
                 'Invalid value\n' +
                 '\n' +
                 'drop :: Integer -> List a -> Maybe (List a)\n' +
                 '                   ^^^^^^\n' +
                 '                     1\n' +
                 '\n' +
                 '1)  null :: Null\n' +
                 '\n' +
                 'The value at position 1 is not a member of ‘List a’.\n'));

  eq(S.drop(0, [1, 2, 3, 4, 5]), S.Just([1, 2, 3, 4, 5]));
  eq(S.drop(1, [1, 2, 3, 4, 5]), S.Just([2, 3, 4, 5]));
  eq(S.drop(2, [1, 2, 3, 4, 5]), S.Just([3, 4, 5]));
  eq(S.drop(3, [1, 2, 3, 4, 5]), S.Just([4, 5]));
  eq(S.drop(4, [1, 2, 3, 4, 5]), S.Just([5]));
  eq(S.drop(5, [1, 2, 3, 4, 5]), S.Just([]));
  eq(S.drop(6, [1, 2, 3, 4, 5]), S.Nothing);

  eq(S.drop(0, '12345'), S.Just('12345'));
  eq(S.drop(1, '12345'), S.Just('2345'));
  eq(S.drop(2, '12345'), S.Just('345'));
  eq(S.drop(3, '12345'), S.Just('45'));
  eq(S.drop(4, '12345'), S.Just('5'));
  eq(S.drop(5, '12345'), S.Just(''));
  eq(S.drop(6, '12345'), S.Nothing);

  eq(S.drop(-1, [1, 2, 3, 4, 5]), S.Nothing);
  eq(S.drop(-0, [1, 2, 3, 4, 5]), S.Nothing);
  eq(S.drop(new Number(-0), [1, 2, 3, 4, 5]), S.Nothing);

});
